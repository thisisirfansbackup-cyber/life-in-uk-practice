import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { loadQuestionBank } from '../src/question-bank.js';

test('prepared lesson three retains every source position with verified, translated content', () => {
  assert.ok(existsSync('data/prepared/lesson-03.json'), 'lesson three content must be prepared from the evidence audit');
  const lesson = JSON.parse(readFileSync('data/prepared/lesson-03.json', 'utf8'));
  assert.deepEqual(lesson.map(q => q.sourceNumber), Array.from({ length: 24 }, (_, i) => 49 + i));
  assert.deepEqual(loadQuestionBank(lesson).errors, []);
  assert.equal(lesson.find(q => q.sourceNumber === 58).answerType, 'select-two');
  assert.equal(lesson.find(q => q.sourceNumber === 65).answerType, 'select-two');
  assert.match(lesson.find(q => q.sourceNumber === 56).question, /before|concluded|ended/i);
  assert.equal(new Set(lesson.find(q => q.sourceNumber === 67).choices.map(c => c.text)).size, 4);
});

test('every prepared item has a stable source identity, Latin translation and distinct choices', () => {
  assert.ok(existsSync('data/prepared'), 'prepared-content directory must exist');
  for (const file of readdirSync('data/prepared').filter(file => file.endsWith('.json'))) {
    const questions = JSON.parse(readFileSync(`data/prepared/${file}`, 'utf8'));
    assert.deepEqual(loadQuestionBank(questions).errors, [], file);
    for (const q of questions) {
      assert.equal(q.id, `source-${String(q.sourceNumber).padStart(3, '0')}`);
      assert.ok(['verified','corrected'].includes(q.verificationStatus), q.id);
      assert.doesNotMatch(q.romanUrdu, /[\u0600-\u06ff]/u, q.id);
      assert.equal(new Set(q.choices.map(c => c.text.toLowerCase().trim())).size, 4, q.id);
    }
  }
});
