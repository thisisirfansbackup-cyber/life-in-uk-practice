import assert from 'node:assert/strict';
import test from 'node:test';
import { shuffleChoices } from '../scripts/shuffle-choices.mjs';

const question = {
  sourceNumber: 42,
  choices: [
    { id: 'a', text: 'Alpha' },
    { id: 'b', text: 'Beta' },
    { id: 'c', text: 'Gamma' },
    { id: 'd', text: 'Delta' },
  ],
  correctChoiceIds: ['b'],
};

test('shuffling choices is deterministic and idempotent', () => {
  const once = shuffleChoices(question);
  const twice = shuffleChoices(once);
  assert.deepEqual(twice.choices, once.choices);
  assert.deepEqual(once.choices.map(choice => choice.id).sort(), ['a', 'b', 'c', 'd']);
  assert.deepEqual(once.correctChoiceIds, ['b']);
});
