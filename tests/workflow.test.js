import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

test('the deployment gate rejects PRs and manual releases from non-main branches', () => {
  const workflow = readFileSync('.github/workflows/pages.yml', 'utf8');
  const condition = workflow.match(/^  deploy:\n    if: (.+)$/m)?.[1];
  assert.ok(condition, 'deployment needs an explicit gate');
  // This workflow uses the shared JS/GitHub expression subset: string comparisons and &&.
  for (const [event_name, ref, allowed] of [
    ['push', 'refs/heads/main', true],
    ['workflow_dispatch', 'refs/heads/main', true],
    ['pull_request', 'refs/heads/main', false],
    ['pull_request', 'refs/pull/5/merge', false],
    ['workflow_dispatch', 'refs/heads/fix/example', false],
    ['push', 'refs/heads/fix/example', false],
  ]) {
    assert.equal(runInNewContext(condition, { github: { event_name, ref } }), allowed, `${event_name} ${ref}`);
  }
});
