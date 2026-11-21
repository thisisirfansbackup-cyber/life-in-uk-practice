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

  const result = selectTestQuestions(bank, progress, 50, () => 0.5);

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

  const result = selectTestQuestions(bank, progress, 50, () => 0.5);

  assert.deepEqual(result.questionIds.slice(0, 3), ['q2', 'q1', 'q0']);
});

test('puts unseen questions before reviews due in the upcoming test', () => {
  const bank = questions(50);
  const progress = {
    completedTestCount: 1,
    questions: {
      q0: {
        attempts: 1,
        incorrectTotal: 0,
        consecutiveIncorrect: 0,
        nextReviewAt: '2099-01-01T00:00:00.000Z',
      },
    },
  };

  const result = selectTestQuestions(bank, progress, 50, () => 0.5);

  assert.equal(result.questionIds[0], 'q1');
  assert.equal(result.questionIds.at(-1), 'q0');
});

test('keeps a not-yet-due review behind other known questions', () => {
  const bank = questions(52);
  const progress = {
    completedTestCount: 1,
    questions: Object.fromEntries(bank.map((question, index) => [question.id, {
      attempts: 1,
      incorrectTotal: 0,
      consecutiveIncorrect: 0,
      nextReviewTest: index === 0 ? 3 : index === 1 ? 2 : 20,
    }])),
  };

  const result = selectTestQuestions(bank, progress, 50, () => 0.5);

  assert.ok(result.questionIds.indexOf('q1') < result.questionIds.indexOf('q0'));
  assert.equal(result.questionIds.includes('q1'), true);
});

test('randomizes questions within the same priority tier', () => {
  const bank = questions(52);
  const preserveOrder = selectTestQuestions(bank, {}, 50, () => 0.5);
  let calls = 0;
  const varyOrder = selectTestQuestions(bank, {}, 50, () => (calls++ % 2 ? 0.9 : 0.1));

  assert.notDeepEqual(varyOrder.questionIds, preserveOrder.questionIds);
});

test('returns 50 distinct eligible question IDs', () => {
  const bank = [...questions(50), questions(1)[0], { id: 'unverified', verificationStatus: 'unconfirmed' }];

  const result = selectTestQuestions(bank, {}, 50, () => 0.5);

  assert.equal(result.questionIds.length, 50);
  assert.equal(new Set(result.questionIds).size, 50);
  assert.equal(result.error, null);
});

test('returns a clear error rather than a partial test with fewer than 50 eligible unique questions', () => {
  const result = selectTestQuestions(questions(49), {}, 50, () => 0.5);

  assert.deepEqual(result.questionIds, []);
  assert.match(result.error, /needs 50.*only 49/i);
});
test('separate revision includes misses and due attempts but never unseen fill', async () => {
  const { selectRevisionQuestions } = await import('../src/revision.js');
  assert.equal(typeof selectRevisionQuestions, 'function', 'separate revision selector must exist');
  const questions = Array.from({ length: 6 }, (_, i) => ({ id: `r${i}`, verificationStatus: 'verified' }));
  const progress = { completedTestCount: 3, questions: {
    r0: { attempts: 1, consecutiveIncorrect: 1, incorrectTotal: 1, lastSeenAt: '2026-11-21' },
    r1: { attempts: 4, consecutiveIncorrect: 2, incorrectTotal: 3, lastSeenAt: '2026-11-20' },
    r2: { attempts: 4, consecutiveIncorrect: 2, incorrectTotal: 3, lastSeenAt: '2026-11-21' },
    r3: { attempts: 1, consecutiveIncorrect: 0, nextReviewTest: 4 },
    r4: { attempts: 1, consecutiveIncorrect: 0, nextReviewTest: 7 },
  }};
  const before = structuredClone(progress);
  assert.deepEqual(selectRevisionQuestions(questions, progress, 51, () => 0.5),
    { questionIds: ['r2', 'r1', 'r0', 'r3'], error: null });
  assert.deepEqual(progress, before);
});

test('revision permits empty and short rounds, limits 51, and removes duplicates', async () => {
  const { selectRevisionQuestions } = await import('../src/revision.js');
  assert.equal(typeof selectRevisionQuestions, 'function');
  for (const [count, expected] of [[0,0],[1,1],[50,50],[51,51],[52,51]]) {
    const questions = Array.from({ length: count }, (_, i) => ({ id: `r${i}`, verificationStatus: 'verified' }));
    const progress = { questions: Object.fromEntries(questions.map(q => [q.id, { attempts: 1, consecutiveIncorrect: 1 }])) };
    const result = selectRevisionQuestions([...questions, ...questions], progress, 51, () => 0.5);
    assert.equal(result.error, null);
    assert.equal(result.questionIds.length, expected);
    assert.equal(new Set(result.questionIds).size, expected);
  }
});

test('revision respects completed-test milestones and treats legacy attempted history as due', async () => {
  const { selectRevisionQuestions } = await import('../src/revision.js');
  assert.equal(typeof selectRevisionQuestions, 'function');
  const questions = ['a', 'b', 'c'].map(id => ({ id, verificationStatus: 'verified' }));
  for (const count of [0,1,3,7,14,30]) {
    const result = selectRevisionQuestions(questions, { completedTestCount: count, questions: {
      a: { attempts: 1, nextReviewTest: count + 1 },
      b: { attempts: 1, nextReviewTest: count + 2 },
      c: { attempts: 1 },
    } }, 51, () => 0.99);
    assert.deepEqual(new Set(result.questionIds), new Set(['a', 'c']));
  }
});

test('revision uses injected randomness within equal miss ranks', async () => {
  const { selectRevisionQuestions } = await import('../src/revision.js');
  assert.equal(typeof selectRevisionQuestions, 'function');
  const questions = ['a','b','c'].map(id => ({ id, verificationStatus: 'verified' }));
  const progress = { questions: Object.fromEntries(questions.map(q => [q.id,
    { attempts: 1, consecutiveIncorrect: 1, incorrectTotal: 1, lastSeenAt: '2026-11-21' }])) };
  assert.notDeepEqual(selectRevisionQuestions(questions, progress, 51, () => 0).questionIds,
    selectRevisionQuestions(questions, progress, 51, () => 0.99).questionIds);
});
