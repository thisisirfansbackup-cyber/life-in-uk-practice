import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

const source = Array.from({ length: 407 }, (_, index) => ({
  n: index + 1, lesson: 'L1', chapter: 'Citizenship', orig: `Original ${index + 1}`,
  q: `Question ${index + 1}`, ur: '', opt: ['A', 'B', 'C', 'D'], a: 0, x: '', extra: 'preserve',
}));
const html = (items) => `<script>const CARDS = CARDS_DATA = ${JSON.stringify(items)};\nfunction esc(t){return t}</script>`;
const getExtractor = async () => {
  const module = await import('../scripts/import-source.mjs').catch(() => ({}));
  assert.equal(typeof module.extractSourceQuestions, 'function', 'data-only source extractor must exist');
  return module.extractSourceQuestions;
};

test('extracts all 407 source records without changing original fields', async () => {
  const extract = await getExtractor();
  assert.deepEqual(extract(html(source)), source);
});

test('rejects missing, duplicate, out-of-order numbers and invalid choices', async () => {
  const extract = await getExtractor();
  for (const items of [
    source.slice(1),
    source.map((q, i) => i === 1 ? { ...q, n: 1 } : q),
    [...source].reverse(),
    source.map((q, i) => i === 0 ? { ...q, a: 4 } : q),
    source.map((q, i) => i === 0 ? { ...q, opt: ['a'] } : q),
    source.map((q, i) => i === 0 ? { ...q, lesson: 'L18' } : q),
  ]) assert.throws(() => extract(html(items)));
});

test('rejects malformed assignments and never executes source code', async () => {
  const extract = await getExtractor();
  globalThis.sourceExecuted = false;
  for (const text of [
    'const CARDS = [];', '<script>const CARDS = CARDS_DATA = [',
    'const CARDS = CARDS_DATA = [(globalThis.sourceExecuted = true)];\nfunction esc(){}',
  ]) assert.throws(() => extract(text));
  assert.equal(globalThis.sourceExecuted, false);
  delete globalThis.sourceExecuted;
});

test('import CLI leaves an existing output unchanged when input is invalid', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'lifeinuk-import-'));
  const input = path.join(directory, 'source.html');
  const output = path.join(directory, 'inventory.json');
  writeFileSync(input, html(source.slice(1)));
  writeFileSync(output, 'keep existing inventory');
  const result = spawnSync(process.execPath, ['scripts/import-source.mjs', input, output], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /407|source/i);
  assert.equal(readFileSync(output, 'utf8'), 'keep existing inventory');
});
