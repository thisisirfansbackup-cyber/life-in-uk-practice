import test from 'node:test';
import assert from 'node:assert/strict';
import { readProgress, recordCompletedTest, writeProgress } from '../src/progress-store.js';

const memoryStorage = (initial = {}) => {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
};

const resultFor = (questionId, correct) => ({
  entries: [{ questionId, correct }],
});

test('round-trips versioned progress through browser storage', () => {
  const storage = memoryStorage();
  const progress = {
    version: 1,
    questions: { q1: { attempts: 2, incorrectTotal: 1, consecutiveIncorrect: 0 } },
    activeSession: null,
  };

  assert.deepEqual(writeProgress(storage, progress), { saved: true, error: null });
  assert.deepEqual(readProgress(storage), { progress, status: 'saved' });
});

test('records attempts, incorrect totals, and last-seen time', () => {
  const start = { version: 1, questions: {}, activeSession: null };
  const updated = recordCompletedTest(start, resultFor('q1', false), '2026-11-07T12:00:00.000Z');

  assert.deepEqual(updated.questions.q1, {
    attempts: 1,
    incorrectTotal: 1,
    consecutiveIncorrect: 1,
    correctStreak: 0,
    lastSeenAt: '2026-11-07T12:00:00.000Z',
    nextReviewAt: '2026-11-07T12:00:00.000Z',
  });
});

test('advances correct-answer review intervals through 1, 3, 7, 14, then 30 days', () => {
  let progress = { version: 1, questions: {}, activeSession: null };
  const expectedDays = [1, 3, 7, 14, 30, 30];
  const start = new Date('2026-11-07T12:00:00.000Z');

  for (let index = 0; index < expectedDays.length; index += 1) {
    const now = new Date(start.getTime() + index * 1000).toISOString();
    progress = recordCompletedTest(progress, resultFor('q1', true), now);
    const due = new Date(progress.questions.q1.nextReviewAt);
    assert.equal(Math.round((due - new Date(now)) / 86400000), expectedDays[index]);
  }
});

test('a wrong answer restores next-test priority and resets the correct interval sequence', () => {
  const start = {
    version: 1,
    questions: {
      q1: { attempts: 2, incorrectTotal: 1, consecutiveIncorrect: 0, correctStreak: 2 },
    },
    activeSession: null,
  };

  const updated = recordCompletedTest(start, resultFor('q1', false), '2026-11-07T12:00:00.000Z');

  assert.equal(updated.questions.q1.consecutiveIncorrect, 1);
  assert.equal(updated.questions.q1.correctStreak, 0);
  assert.equal(updated.questions.q1.nextReviewAt, '2026-11-07T12:00:00.000Z');
});

test('returns a safe empty state for corrupt JSON', () => {
  const storage = memoryStorage({ 'lifeinuk-progress-v1': '{not json' });

  assert.deepEqual(readProgress(storage), {
    progress: { version: 1, questions: {}, activeSession: null },
    status: 'corrupt',
  });
});

test('reports unsupported storage without throwing', () => {
  assert.deepEqual(readProgress(null), {
    progress: { version: 1, questions: {}, activeSession: null },
    status: 'unavailable',
  });
  assert.deepEqual(writeProgress(null, { version: 1, questions: {}, activeSession: null }), {
    saved: false,
    error: 'Browser storage is unavailable.',
  });
});

test('reports storage quota errors without throwing', () => {
  const storage = { setItem() { throw new Error('quota exceeded'); } };

  assert.deepEqual(writeProgress(storage, { version: 1, questions: {}, activeSession: null }), {
    saved: false,
    error: 'quota exceeded',
  });
});

test('returns a safe empty state for an incompatible stored version', () => {
  const storage = memoryStorage({
    'lifeinuk-progress-v1': JSON.stringify({ version: 2, questions: {}, activeSession: null }),
  });

  assert.deepEqual(readProgress(storage), {
    progress: { version: 1, questions: {}, activeSession: null },
    status: 'incompatible',
  });
});

test('restores the same active question order and answers after reloading storage', () => {
  const storage = memoryStorage();
  const session = {
    questionIds: Array.from({ length: 50 }, (_, index) => `q${index}`),
    answers: { q0: ['b'], q1: ['a', 'c'] },
    currentIndex: 1,
    submitted: false,
  };
  const progress = { version: 1, questions: {}, activeSession: session };

  writeProgress(storage, progress);
  const restored = readProgress(storage);

  assert.deepEqual(restored.progress.activeSession.questionIds, session.questionIds);
  assert.deepEqual(restored.progress.activeSession.answers, session.answers);
});
