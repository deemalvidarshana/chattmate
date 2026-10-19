# ChatterMate deployment from deemalvidarshana/chattmate

`Deploy to growmiq VPS` runs checks on main pushes and manual runs. A manual run
with `deploy=false` verifies the existing SSH connection without deploying.
Production deployment also requires `PRODUCTION_DEPLOY_ENABLED=true` and passing
backend/frontend tests and repository guards.

Repository secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS`.
The host key is pinned. The dedicated SSH key is constrained by a forced command
to `check` or `deploy <commit SHA>`; it does not expose a general shell.

The installed, root-owned receiver is `/usr/local/lib/chattmate-ci.py`. Its
reviewed source is `scripts/ci_receiver.py`. Updating that file in Git alone does
not replace the installed receiver. Its enrollment is stored outside the repo
in `/var/lib/chattmate-ci/expected.json`.

## Existing data and other applications

The receiver verifies the enrolled database/Redis container IDs and mounts and
the hashes of production Compose and environment files. It refuses to deploy
if these change. Intentional infrastructure maintenance needs an administrator
to review and update the enrollment.

It builds commit-tagged application images in isolated release directories,
then backs up the existing database, uploads, configuration and encryption key
under `/var/backups/chattermate/ci-<timestamp>-<commit>/`. The database archive
must pass `pg_restore --list` before deployment proceeds. Backups stay private
on the VPS; configure an independent off-site copy for disaster recovery.

Only `backend`, `knowledge_processor`, and `frontend` are updated, using the
existing production Compose project and `up --no-deps --no-build --pull never`.
The pipeline never runs Compose down, volume removal, pruning, database restore,
test-tenant creation/deletion, rate-limit deletion, or Nginx/Checkfunnel restart.
It compares existing data counts and unrelated service identities afterwards.
Backend startup still applies normal forward database migrations.

If application startup fails, the receiver attempts to restore the previous
application images. It never reverses migrations or restores live data
automatically: application rollback cannot guarantee compatibility with every
future schema change. Database recovery requires deliberate operator action.

The current image override is `/var/lib/chattmate-ci/current-images.json`.
For manual app maintenance, include it alongside the existing production file:

```bash
docker compose -p chattermate --project-directory /opt/chattermate \
  -f /opt/chattermate/docker-compose.growmiq.yml \
  -f /var/lib/chattmate-ci/current-images.json \
  --env-file /opt/chattermate/.env.growmiq ps
```

This automation retains the existing server directory, runtime secrets, named
volumes, private ports and proxy configuration. Source releases and old images
are retained for review; cleanup is deliberately separate from deployment.
