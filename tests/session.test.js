import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSession,
  moveToQuestion,
  scoreSession,
  submitSession,
  updateAnswer,
} from '../src/session.js';

const questionMap = {
  single: { id: 'single', correctChoiceIds: ['b'], answerType: 'single' },
  two: { id: 'two', correctChoiceIds: ['a', 'c'], answerType: 'select-two' },
};

test('scores a correct single-choice answer', () => {
  const session = updateAnswer(createSession(['single']), 'single', ['b']);

  assert.deepEqual(scoreSession(session, questionMap), {
    total: 1,
    correctCount: 1,
    scorePercentage: 100,
    entries: [{ questionId: 'single', selectedChoiceIds: ['b'], correctChoiceIds: ['b'], correct: true }],
  });
});

test('scores select-two answers by exact set equality, independent of selection order', () => {
  const session = updateAnswer(createSession(['two']), 'two', ['c', 'a']);

  assert.equal(scoreSession(session, questionMap).entries[0].correct, true);
});

test('marks partial and extra select-two selections incorrect', () => {
  const partial = updateAnswer(createSession(['two']), 'two', ['a']);
  const extra = updateAnswer(createSession(['two']), 'two', ['a', 'c', 'b']);

  assert.equal(scoreSession(partial, questionMap).entries[0].correct, false);
  assert.equal(scoreSession(extra, questionMap).entries[0].correct, false);
});

test('moves through the question list without going out of bounds', () => {
  const session = createSession(['single', 'two']);

  assert.equal(moveToQuestion(session, -1).currentIndex, 0);
  assert.equal(moveToQuestion(session, 1).currentIndex, 1);
  assert.equal(moveToQuestion(session, 2).currentIndex, 1);
});

test('revises a saved answer for a question', () => {
  const first = updateAnswer(createSession(['single']), 'single', ['a']);
  const revised = updateAnswer(first, 'single', ['b']);

  assert.deepEqual(revised.answers.single, ['b']);
  assert.deepEqual(first.answers, { single: ['a'] });
});

test('submission returns complete result review for all session questions', () => {
  const session = updateAnswer(
    updateAnswer(createSession(['single', 'two']), 'single', ['b']),
    'two',
    ['a'],
  );

  const submitted = submitSession(session, questionMap);

  assert.equal(submitted.submitted, true);
  assert.equal(submitted.result.correctCount, 1);
  assert.equal(submitted.result.total, 2);
  assert.deepEqual(submitted.result.entries.map(({ questionId, correct }) => ({ questionId, correct })), [
    { questionId: 'single', correct: true },
    { questionId: 'two', correct: false },
  ]);
});
