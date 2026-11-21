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
    verificationStatus: 'verified',
    lessonNumbers: [1],
    explanation: '',
    sources: [{ title: 'Official study guide', url: 'https://www.gov.uk/life-in-the-uk-test', locator: 'Chapter 1', checkedAt: '2026-11-07' }],
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

test('rejects impossible official-source check dates', async () => {
  const { validateQuestion } = await getBankModule();

  const invalidDate = question({
    sources: [{ title: 'Official study guide', locator: 'Chapter 1', checkedAt: '2026-19-45' }],
  });
  assert.ok(validateQuestion(invalidDate).some((error) => error.includes('checkedAt')));
});

test('requires a source URL using HTTPS', async () => {
  const { validateQuestion } = await getBankModule();

  const invalidUrl = question({
    sources: [{ title: 'Official source', url: 'http://example.com', locator: 'Section 1', checkedAt: '2026-11-07' }],
  });
  assert.ok(validateQuestion(invalidUrl).some((error) => error.includes('url')));
});

test('requires an explicit verification status for every item', async () => {
  const { validateQuestion } = await getBankModule();

  assert.ok(validateQuestion(question({ verificationStatus: 'pending' })).some((error) => error.includes('verificationStatus')));
  assert.ok(validateQuestion(question({ verificationStatus: undefined })).some((error) => error.includes('verificationStatus')));
});

const inventory = Array.from({ length: 407 }, (_, i) => ({ n: i + 1, lesson: 'L1' }));
const fullBank = () => inventory.map(({ n }) => question({
  id: `source-${String(n).padStart(3, '0')}`, sourceNumber: n,
}));

async function getFullValidator() {
  const module = await getBankModule();
  assert.equal(typeof module.validateFullCollection, 'function', 'full collection release gate must exist');
  return module.validateFullCollection;
}

test('full release gate rejects partial content without rejecting small ordinary banks', async () => {
  const validateFullCollection = await getFullValidator();
  const { loadQuestionBank } = await getBankModule();
  assert.deepEqual(loadQuestionBank(fullBank().slice(0, 51)).errors, []);
  assert.ok(validateFullCollection(fullBank().slice(0, 51), inventory).length > 0);
  assert.deepEqual(validateFullCollection(fullBank(), inventory), []);
});

test('full release gate identifies invalid content by original source number', async () => {
  const validate = await getFullValidator();
  for (const override of [
    { sourceNumber: 1 }, { romanUrdu: '' }, { verificationStatus: 'unconfirmed' },
    { lessonNumbers: [2] }, { id: 'wrong-source-id' }, { romanUrdu: 'یہ سوال ہے' },
  ]) {
    const bank = fullBank();
    bank[1] = { ...bank[1], ...override };
    const errors = validate(bank, inventory);
    assert.ok(errors.length > 0, JSON.stringify(override));
    assert.ok(errors.some(error => /2|002/.test(error)), JSON.stringify(errors));
  }
});

test('full release gate rejects malformed inventory rather than claiming full coverage', async () => {
  const validate = await getFullValidator();
  for (const invalid of [null, [], inventory.slice(1), inventory.map(q => ({ ...q, n: 1 }))]) {
    assert.ok(validate(fullBank(), invalid).length > 0);
  }
});
