import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { validateLegacyQuestionMap } from '../src/question-bank.js';

const oldBank = JSON.parse(readFileSync('data/audits/legacy-published-bank.json', 'utf8'));
const map = JSON.parse(readFileSync('data/legacy-question-map.json', 'utf8'));
const realBank = JSON.parse(readFileSync('data/questions.json', 'utf8'));
const finalBank = Array.from({ length: 407 }, (_, index) => ({
  id: `source-${String(index + 1).padStart(3, '0')}`, sourceNumber: index + 1,
  choices: ['a','b','c','d'].map(id => ({ id, text: id })),
}));
const documentedUnmapped = new Set([
  'lesson-7-q7', 'lesson-9-q3', 'lesson-12-q6',
  'lesson-14-q8', 'lesson-14-q13', 'lesson-15-q6',
]);

test('every published identity is explicitly mapped or documented as unmappable', () => {
  const mapped = new Set(map.mappings.map(entry => entry.oldId));
  const uncovered = oldBank.map(question => question.id)
    .filter(id => !mapped.has(id) && !documentedUnmapped.has(id));
  assert.deepEqual(uncovered, []);
  assert.ok(map.mappings.length > 0);
});

test('map targets final identities and preserves safe resume only with all four choices', () => {
  assert.deepEqual(validateLegacyQuestionMap(map, finalBank), []);
  for (const entry of map.mappings.filter(entry => entry.resumeSafe)) {
    assert.equal(Object.keys(entry.choiceIds).length, 4, entry.oldId);
    const oldQuestion = oldBank.find(question => question.id === entry.oldId);
    const newQuestion = realBank.find(question => question.id === entry.newId);
    const mappedCorrect = oldQuestion.correctChoiceIds.map(id => entry.choiceIds[id]).sort();
    assert.deepEqual(mappedCorrect, [...newQuestion.correctChoiceIds].sort(), entry.oldId);
  }
});
