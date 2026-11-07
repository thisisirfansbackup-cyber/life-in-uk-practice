import test from 'node:test';
import assert from 'node:assert/strict';
import * as sessionModule from '../src/session.js';
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
  const initial = createSession(['single', 'two']);

  assert.equal(moveToQuestion(initial, -1).currentIndex, 0);
  assert.equal(moveToQuestion(initial, 1).currentIndex, 0, 'unchecked question blocks forward navigation');

  const answered = updateAnswer(initial, 'single', ['b']);
  const checked = sessionModule.checkCurrentAnswer(answered, questionMap.single);
  assert.equal(moveToQuestion(checked.session, 1).currentIndex, 1);
  assert.equal(moveToQuestion(checked.session, 2).currentIndex, 1);
  assert.equal(moveToQuestion(checked.session, 0).currentIndex, 0, 'backward navigation remains available');
});

test('revises a saved answer for a question', () => {
  const first = updateAnswer(createSession(['single']), 'single', ['a']);
  const revised = updateAnswer(first, 'single', ['b']);

  assert.deepEqual(revised.answers.single, ['b']);
  assert.deepEqual(first.answers, { single: ['a'] });
});

test('checking a wrong answer returns incorrect feedback and locks its original selection', () => {
  const selected = updateAnswer(createSession(['single']), 'single', ['a']);
  const checked = sessionModule.checkCurrentAnswer(selected, questionMap.single);

  assert.equal(checked.correct, false);
  assert.equal(checked.error, null);
  assert.deepEqual(checked.session.checkedQuestionIds, ['single']);
  assert.deepEqual(checked.session.answers.single, ['a']);
  assert.equal(updateAnswer(checked.session, 'single', ['b']), checked.session);
});

test('checking a correct answer returns correct feedback', () => {
  const selected = updateAnswer(createSession(['single']), 'single', ['b']);
  const checked = sessionModule.checkCurrentAnswer(selected, questionMap.single);

  assert.equal(checked.correct, true);
  assert.equal(checked.error, null);
});

test('requires exactly the expected number of choices before checking', () => {
  const oneSelected = updateAnswer(createSession(['two']), 'two', ['a']);
  const threeSelected = updateAnswer(createSession(['two']), 'two', ['a', 'b', 'c']);

  for (const result of [
    sessionModule.checkCurrentAnswer(oneSelected, questionMap.two),
    sessionModule.checkCurrentAnswer(threeSelected, questionMap.two),
  ]) {
    assert.equal(result.correct, null);
    assert.match(result.error, /select exactly 2/i);
    assert.deepEqual(result.session.checkedQuestionIds, []);
  }
});

test('submission returns complete result review for all session questions', () => {
  let session = updateAnswer(createSession(['single', 'two']), 'single', ['b']);
  session = sessionModule.checkCurrentAnswer(session, questionMap.single).session;
  const blocked = submitSession(session, questionMap);
  assert.equal(blocked.submitted, false);
  assert.equal(blocked.result, undefined);

  session = moveToQuestion(session, 1);
  session = updateAnswer(session, 'two', ['a', 'c']);
  session = sessionModule.checkCurrentAnswer(session, questionMap.two).session;

  const submitted = submitSession(session, questionMap);

  assert.equal(submitted.submitted, true);
  assert.equal(submitted.result.correctCount, 2);
  assert.equal(submitted.result.total, 2);
  assert.deepEqual(submitted.result.entries.map(({ questionId, correct }) => ({ questionId, correct })), [
    { questionId: 'single', correct: true },
    { questionId: 'two', correct: true },
  ]);
});
