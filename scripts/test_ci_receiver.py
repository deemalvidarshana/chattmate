import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('ci_receiver', Path(__file__).with_name('ci_receiver.py'))
ci = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ci)


class DeploymentBoundaryTests(unittest.TestCase):
    def test_unrecognized_ssh_commands_cannot_execute_deployment(self):
        for command in ('bash', 'rm -rf /', 'deploy ' + 'a' * 40 + '; id', 'deploy ../main'):
            with self.subTest(command=command), patch.dict(os.environ, {'SSH_ORIGINAL_COMMAND': command}):
                with patch.object(ci, 'deploy') as deploy:
                    with self.assertRaises(RuntimeError):
                        ci.main()
                    deploy.assert_not_called()

    def test_changed_database_identity_blocks_deployment(self):
        with tempfile.TemporaryDirectory() as directory:
            state = Path(directory)
            (state / 'expected.json').write_text(json.dumps({'infrastructure': {'db': 'original'}}))
            with patch.object(ci, 'STATE', state), patch.object(ci, 'current', return_value={'infrastructure': {'db': 'replacement'}}):
                with patch.object(ci, 'counts') as counts:
                    with self.assertRaises(RuntimeError):
                        ci.verify()
                    counts.assert_not_called()

    def test_runtime_config_changes_require_review(self):
        with tempfile.TemporaryDirectory() as directory:
            state = Path(directory)
            (state / 'expected.json').write_text(json.dumps({'config': {'env': 'original'}}))
            with patch.object(ci, 'STATE', state), patch.object(ci, 'current', return_value={'config': {'env': 'changed'}}):
                with self.assertRaises(RuntimeError):
                    ci.verify()


if __name__ == '__main__':
    unittest.main()
