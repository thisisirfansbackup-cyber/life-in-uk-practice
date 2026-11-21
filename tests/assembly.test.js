import assert from 'node:assert/strict';
import test from 'node:test';
import { assemblePreparedBank } from '../scripts/assemble-bank.mjs';

const lesson = (start, count, lessonNumber) => Array.from({ length: count }, (_, index) => ({
  id: `source-${String(start + index).padStart(3, '0')}`,
  sourceNumber: start + index,
  lessonNumbers: [lessonNumber],
}));
const full = () => [
  lesson(1, 24, 1), lesson(25, 24, 2), lesson(49, 24, 3), lesson(73, 24, 4),
  lesson(97, 24, 5), lesson(121, 24, 6), lesson(145, 24, 7), lesson(169, 24, 8),
  lesson(193, 24, 9), lesson(217, 24, 10), lesson(241, 23, 11), lesson(264, 24, 12),
  lesson(288, 24, 13), lesson(312, 24, 14), lesson(336, 24, 15), lesson(360, 24, 16),
  lesson(384, 24, 17),
];

test('assembly orders all 407 original positions and refuses partial content', () => {
  assert.equal(assemblePreparedBank(full()).length, 407);
  assert.deepEqual(assemblePreparedBank(full().reverse()).map(q => q.sourceNumber),
    Array.from({ length: 407 }, (_, i) => i + 1));
  assert.throws(() => assemblePreparedBank(full().slice(0, 16)), /407/);
  const duplicate = full();
  duplicate[1] = duplicate[1].map((q, i) => i === 0 ? { ...q, sourceNumber: 24 } : q);
  assert.throws(() => assemblePreparedBank(duplicate), /duplicate|missing/i);
});
