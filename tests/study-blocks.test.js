import assert from 'node:assert/strict';
import test from 'node:test';

const questions = () => Array.from({ length: 407 }, (_, index) => ({
  id: `source-${String(index + 1).padStart(3, '0')}`, sourceNumber: index + 1,
}));
const module = () => import('../src/study-blocks.js').catch(() => ({}));

test('blocks cover all questions once and preserve source order regardless of input order', async () => {
  const { getStudyBlocks } = await module();
  assert.equal(typeof getStudyBlocks, 'function', 'ordered study-block module must exist');
  const blocks = getStudyBlocks(questions().reverse());
  assert.deepEqual(blocks.map(block => block.questionIds.length), [51,51,51,51,51,51,51,50]);
  assert.deepEqual(blocks.map(block => [block.start, block.end]),
    [[1,51],[52,102],[103,153],[154,204],[205,255],[256,306],[307,357],[358,407]]);
  assert.deepEqual(blocks.flatMap(block => block.questionIds), questions().map(q => q.id));
  assert.equal(new Set(blocks.flatMap(block => block.questionIds)).size, 407);
  assert.deepEqual(blocks.map(b => b.id), ['block-1','block-2','block-3','block-4','block-5','block-6','block-7','block-8']);
});

test('invalid source coverage cannot produce misleading study blocks', async () => {
  const { getStudyBlocks } = await module();
  assert.equal(typeof getStudyBlocks, 'function');
  for (const input of [
    null, [], questions().slice(1), [...questions(), questions()[0]],
    questions().map((q, i) => i === 1 ? { ...q, sourceNumber: 1 } : q),
    questions().map((q, i) => i === 1 ? { ...q, id: 'source-001' } : q),
  ]) assert.throws(() => getStudyBlocks(input));
});

test('next unfinished block skips completion without hiding individually selectable blocks', async () => {
  const { getStudyBlocks, getNextStudyBlock } = await module();
  assert.equal(typeof getNextStudyBlock, 'function');
  const blocks = getStudyBlocks(questions());
  assert.equal(getNextStudyBlock(blocks, []).id, 'block-1');
  assert.equal(getNextStudyBlock(blocks, ['block-1', 'block-3']).id, 'block-2');
  assert.equal(getNextStudyBlock(blocks, blocks.map(b => b.id)), null);
  assert.equal(blocks[0].questionIds[0], 'source-001');
});
