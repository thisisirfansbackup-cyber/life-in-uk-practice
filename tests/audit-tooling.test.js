import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('bank assembly reports prepared content rather than claiming factual verification', () => {
  const before = readFileSync('data/questions.json', 'utf8');
  const output = execFileSync(process.execPath, ['scripts/assemble-bank.mjs'], { encoding: 'utf8' });
  assert.match(output, /407 prepared questions/i);
  assert.doesNotMatch(output, /verified questions/i);
  assert.equal(readFileSync('data/questions.json', 'utf8'), before, 'assembly must remain deterministic');
});

test('per-item audit distinguishes the first cited source from a primary source', () => {
  execFileSync(process.execPath, ['scripts/audit-coverage.mjs'], { encoding: 'utf8' });
  const document = readFileSync('data/audits/per-item-coverage.md', 'utf8');
  assert.match(document, /First cited source/);
  assert.doesNotMatch(document, /Primary source/);
});
