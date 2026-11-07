import test from 'node:test';
import assert from 'node:assert/strict';
import { selectTestQuestions } from '../src/revision.js';

const questions = (count) => Array.from({ length: count }, (_, index) => ({
  id: `q${index}`,
  verificationStatus: 'verified',
}));

const progressWith = (entries) => ({ questions: entries });

test('prioritizes previously missed questions ahead of unseen questions', () => {
  const bank = questions(52);
  const progress = progressWith({
    q0: { attempts: 1, incorrectTotal: 1, consecutiveIncorrect: 1, lastSeenAt: '2026-11-06T10:00:00.000Z' },
  });

  const result = selectTestQuestions(bank, progress, '2026-11-07T10:00:00.000Z', 50, () => 0.5);

  assert.equal(result.error, null);
  assert.equal(result.questionIds[0], 'q0');
  assert.equal(result.questionIds.includes('q51'), false);
});

test('ranks repeated misses before less frequently missed questions, then by recency', () => {
  const bank = questions(52);
  const progress = progressWith({
    q0: { attempts: 3, incorrectTotal: 2, consecutiveIncorrect: 2, lastSeenAt: '2026-11-06T12:00:00.000Z' },
    q1: { attempts: 5, incorrectTotal: 4, consecutiveIncorrect: 1, lastSeenAt: '2026-11-05T12:00:00.000Z' },
    q2: { attempts: 4, incorrectTotal: 4, consecutiveIncorrect: 1, lastSeenAt: '2026-11-06T11:00:00.000Z' },
  });

  const result = selectTestQuestions(bank, progress, '2026-11-07T10:00:00.000Z', 50, () => 0.5);

  assert.deepEqual(result.questionIds.slice(0, 3), ['q2', 'q1', 'q0']);
});

test('puts unseen questions before due correct reviews', () => {
  const bank = questions(50);
  const progress = progressWith({
    q0: { attempts: 1, incorrectTotal: 0, consecutiveIncorrect: 0, lastSeenAt: '2026-11-01T10:00:00.000Z', nextReviewAt: '2026-11-06T10:00:00.000Z' },
  });

  const result = selectTestQuestions(bank, progress, '2026-11-07T10:00:00.000Z', 50, () => 0.5);

  assert.equal(result.questionIds[0], 'q1');
  assert.equal(result.questionIds.at(-1), 'q0');
});

test('randomizes questions within the same priority tier', () => {
  const bank = questions(52);
  const preserveOrder = selectTestQuestions(bank, {}, '2026-11-07T10:00:00.000Z', 50, () => 0.5);
  let calls = 0;
  const varyOrder = selectTestQuestions(bank, {}, '2026-11-07T10:00:00.000Z', 50, () => (calls++ % 2 ? 0.9 : 0.1));

  assert.notDeepEqual(varyOrder.questionIds, preserveOrder.questionIds);
});

test('returns 50 distinct eligible question IDs', () => {
  const bank = [...questions(50), questions(1)[0], { id: 'unverified', verificationStatus: 'unconfirmed' }];

  const result = selectTestQuestions(bank, {}, '2026-11-07T10:00:00.000Z', 50, () => 0.5);

  assert.equal(result.questionIds.length, 50);
  assert.equal(new Set(result.questionIds).size, 50);
  assert.equal(result.error, null);
});

test('returns a clear error rather than a partial test with fewer than 50 eligible unique questions', () => {
  const result = selectTestQuestions(questions(49), {}, '2026-11-07T10:00:00.000Z', 50, () => 0.5);

  assert.deepEqual(result.questionIds, []);
  assert.match(result.error, /needs 50.*only 49/i);
});
