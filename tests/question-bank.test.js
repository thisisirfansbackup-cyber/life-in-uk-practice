import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const here = path.dirname(fileURLToPath(import.meta.url));
const modulePath = path.join(here, '..', 'src', 'question-bank.js');

async function getBankModule() {
  assert.ok(existsSync(modulePath), 'question-bank module should exist');
  return import('../src/question-bank.js');
}

function question(overrides = {}) {
  return {
    id: 'lesson-1-q1',
    question: 'Where is Big Ben located?',
    romanUrdu: 'Big Ben kahan waqay hai?',
    choices: [
      { id: 'a', text: 'At the Houses of Parliament' },
      { id: 'b', text: 'In Edinburgh' },
      { id: 'c', text: 'In Cardiff' },
      { id: 'd', text: 'In Belfast' },
    ],
    correctChoiceIds: ['a'],
    answerType: 'single',
    lessonNumbers: [1],
    explanation: '',
    sources: [{ title: 'Official study guide', locator: 'Chapter 1', checkedAt: '2026-11-07' }],
    ...overrides,
  };
}

test('accepts valid single-answer and select-two questions', async () => {
  const { loadQuestionBank } = await getBankModule();
  const twoAnswer = question({
    id: 'lesson-1-q2',
    answerType: 'select-two',
    correctChoiceIds: ['a', 'b'],
  });

  assert.deepEqual(loadQuestionBank([question(), twoAnswer]).errors, []);
});

test('reports duplicate question IDs', async () => {
  const { loadQuestionBank } = await getBankModule();
  const result = loadQuestionBank([question(), question({ lessonNumbers: [2] })]);

  assert.ok(result.errors.some((error) => error.includes('duplicate') && error.includes('lesson-1-q1')));
});

test('requires a Roman Urdu translation', async () => {
  const { validateQuestion } = await getBankModule();

  assert.ok(validateQuestion(question({ romanUrdu: '' })).some((error) => error.includes('romanUrdu')));
});

test('requires exactly four answer choices', async () => {
  const { validateQuestion } = await getBankModule();

  assert.ok(validateQuestion(question({ choices: question().choices.slice(0, 3) })).some((error) => error.includes('four')));
});

test('rejects correct choice IDs that are not in the choices', async () => {
  const { validateQuestion } = await getBankModule();

  assert.ok(validateQuestion(question({ correctChoiceIds: ['missing'] })).some((error) => error.includes('correctChoiceIds')));
});

test('requires answer count to match answer type', async () => {
  const { validateQuestion } = await getBankModule();

  assert.ok(validateQuestion(question({ answerType: 'select-two' })).some((error) => error.includes('select-two')));
  assert.ok(validateQuestion(question({ answerType: 'single', correctChoiceIds: ['a', 'b'] })).some((error) => error.includes('single')));
});

test('requires lesson provenance and a dated source locator', async () => {
  const { validateQuestion } = await getBankModule();

  assert.ok(validateQuestion(question({ lessonNumbers: [] })).some((error) => error.includes('lessonNumbers')));
  assert.ok(validateQuestion(question({ sources: [] })).some((error) => error.includes('sources')));
});
