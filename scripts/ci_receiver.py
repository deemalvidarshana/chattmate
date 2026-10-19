#!/usr/bin/env python3
"""Root-owned, forced-command receiver for this existing ChatterMate stack.

Install outside the checkout. CI may check the enrolled stack or submit a
commit archive; it cannot run arbitrary SSH commands or replace live config.
"""
import datetime
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile

APP = Path('/opt/chattermate')
STATE = Path('/var/lib/chattmate-ci')
COMPOSE = APP / 'docker-compose.growmiq.yml'
CONFIGS = [COMPOSE, APP / '.env.growmiq', APP / 'backend/.env', APP / 'frontend/.env']
SERVICES = ('backend', 'knowledge_processor', 'frontend')
DATA = ('chattermate-db-1', 'chattermate-redis-1')


def run(*args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)


def output(*args):
    return run(*args, stdout=subprocess.PIPE, text=True).stdout.strip()


def inspect(name):
    return json.loads(output('docker', 'inspect', name))[0]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def infrastructure():
    result = {}
    for name in DATA:
        item = inspect(name)
        if not item['State']['Running']:
            raise RuntimeError(f'{name} is not running')
        if item['Config']['Labels'].get('com.docker.compose.project') != 'chattermate':
            raise RuntimeError('Unexpected Compose project')
        result[name] = {'id': item['Id'], 'started': item['State']['StartedAt'],
                        'mounts': item['Mounts']}
    return result


def others():
    result = {}
    ids = output('docker', 'ps', '-q').split()
    for cid in ids:
        item = inspect(cid)
        labels = item['Config'].get('Labels') or {}
        if labels.get('com.docker.compose.project') != 'chattermate':
            result[item['Name']] = (item['Id'], item['State']['StartedAt'])
    for service in ('checkfunnel-daphne', 'nginx'):
        result[service] = output('systemctl', 'show', service, '-p', 'MainPID',
                                 '-p', 'ActiveState', '-p', 'ActiveEnterTimestamp')
    return result


def counts():
    sql = ('SELECT json_build_object(\'organizations\', (SELECT count(*) FROM organizations), '
           '\'users\', (SELECT count(*) FROM users), '
           '\'customers\', (SELECT count(*) FROM customers), '
           '\'chat_history\', (SELECT count(*) FROM chat_history))')
    return json.loads(output('docker', 'exec', DATA[0], 'psql', '-U', 'postgres',
                             '-d', 'chattermate', '-Atc', sql))


def current():
    return {'config': {str(p): digest(p) for p in CONFIGS},
            'infrastructure': infrastructure()}


def verify():
    expected = json.loads((STATE / 'expected.json').read_text())
    if current() != expected:
        raise RuntimeError('Live config, data container identity or mounts changed; re-enroll after review')
    return {'status': 'ready', 'project': 'chattermate', 'counts': counts(),
            'infrastructure_preserved': True}


def dc(override, *args):
    run('docker', 'compose', '-p', 'chattermate', '--project-directory', str(APP),
        '-f', str(COMPOSE), '-f', str(override), '--env-file', str(APP / '.env.growmiq'),
        *args)


def backup(sha):
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d-%H%M%S')
    dest = Path('/var/backups/chattermate') / f'ci-{stamp}-{sha[:12]}'
    dest.mkdir(mode=0o700)
    dump = dest / 'database.dump'
    with dump.open('wb') as handle:
        run('docker', 'exec', DATA[0], 'pg_dump', '-U', 'postgres', '-Fc', 'chattermate', stdout=handle)
    with dump.open('rb') as handle:
        run('docker', 'exec', '-i', DATA[0], 'pg_restore', '--list', stdin=handle, stdout=subprocess.DEVNULL)
    uploads = next(m for m in inspect('chattermate-backend-1')['Mounts']
                   if m['Destination'] == '/app/uploads')
    if uploads.get('Name') != 'chattermate_uploads':
        raise RuntimeError('Unexpected uploads volume')
    with tarfile.open(dest / 'uploads.tar.gz', 'w:gz') as archive:
        archive.add(uploads['Source'], arcname='uploads')
    with tarfile.open(dest / 'configuration.tar.gz', 'w:gz') as archive:
        for path in CONFIGS:
            archive.add(path, arcname=str(path.relative_to(APP)))
        if (APP / 'config').exists():
            archive.add(APP / 'config', arcname='config')
    return dest


def wait_healthy():
    import time
    for _ in range(90):
        try:
            run('curl', '-fsS', '--max-time', '5', 'http://127.0.0.1:8080/health', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            run('curl', '-fsS', '--max-time', '5', 'http://127.0.0.1:3080/', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return
        except subprocess.CalledProcessError:
            time.sleep(10)
    raise RuntimeError('Application health check failed; database is never auto-restored')


def deploy(sha):
    before = verify()
    untouched = others()
    releases = STATE / 'releases'
    releases.mkdir(exist_ok=True)
    release = Path(tempfile.mkdtemp(prefix=sha + '-', dir=releases))
    bundle = release / 'source.tar.gz'
    with bundle.open('wb') as handle:
        total = 0
        while chunk := sys.stdin.buffer.read(1024 * 1024):
            total += len(chunk)
            if total > 100 * 1024 * 1024:
                raise RuntimeError('Source archive exceeds 100 MiB')
            handle.write(chunk)
    source = release / 'source'
    source.mkdir()
    with tarfile.open(bundle, 'r:gz') as archive:
        for member in archive.getmembers():
            path = Path(member.name)
            if path.is_absolute() or '..' in path.parts or member.issym() or member.islnk():
                raise RuntimeError('Unsafe archive entry')
            if path.name in ('.env', '.env.growmiq', '.env.prod', '.env.dev'):
                raise RuntimeError('Runtime environment files must stay on the VPS')
        archive.extractall(source, filter='data')
    # Only public frontend configuration is included in its image build.
    shutil.copy2(APP / 'frontend/.env', source / 'frontend/.env')
    backend = f'chattermate-ci-backend:{sha}'
    frontend = f'chattermate-ci-frontend:{sha}'
    run('docker', 'build', '-f', str(source / 'Dockerfile'), '-t', backend, str(source))
    run('docker', 'build', '-f', str(source / 'Dockerfile.frontend.prod'), '-t', frontend, str(source))
    verify()
    dest = backup(sha)
    (dest / 'before.json').write_text(json.dumps({'counts': before['counts'], 'others': untouched}, indent=2))
    previous = {}
    for service in SERVICES:
        previous[service] = {'image': inspect(f'chattermate-{service}-1')['Image']}
    rollback = dest / 'previous-images.json'
    rollback.write_text(json.dumps({'services': previous}))
    override = release / 'images.json'
    override.write_text(json.dumps({'services': {
        'backend': {'image': backend}, 'knowledge_processor': {'image': backend},
        'frontend': {'image': frontend}}}))
    try:
        # Explicit services + --no-deps: never recreate Postgres/Redis or other apps.
        dc(override, 'up', '-d', '--no-deps', '--no-build', '--pull', 'never', *SERVICES)
        wait_healthy()
        after = verify()
        if others() != untouched:
            raise RuntimeError('An unrelated service changed during deployment')
        if any(after['counts'][key] < value for key, value in before['counts'].items()):
            raise RuntimeError('A protected row count decreased; investigate before continuing')
    except Exception:
        # Roll back application images only. Never undo migrations or restore live data automatically.
        dc(rollback, 'up', '-d', '--no-deps', '--no-build', '--pull', 'never', *SERVICES)
        raise
    shutil.copy2(override, STATE / 'current-images.json')
    (STATE / 'last-deploy.json').write_text(json.dumps({'sha': sha, 'backup': str(dest), 'counts': after['counts']}))
    print(json.dumps({'status': 'deployed', 'sha': sha, 'backup': str(dest), 'counts': after['counts']}))


def main():
    os.umask(0o077)
    if sys.argv[1:] == ['--enroll']:
        STATE.mkdir(mode=0o700, exist_ok=True)
        path = STATE / 'expected.json'
        if path.exists():
            raise RuntimeError('Already enrolled; will not overwrite the baseline')
        path.write_text(json.dumps(current(), indent=2))
        print(json.dumps(verify()))
        return
    command = os.environ.get('SSH_ORIGINAL_COMMAND', '')
    if command == 'check':
        print(json.dumps(verify()))
    elif re.fullmatch(r'deploy [0-9a-f]{40}', command):
        with (STATE / 'deploy.lock').open('w') as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            deploy(command.split()[1])
    else:
        raise RuntimeError('Only check or deploy <40-character commit SHA> is allowed')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'Deploy refused/failed: {error}', file=sys.stderr)
        sys.exit(1)
