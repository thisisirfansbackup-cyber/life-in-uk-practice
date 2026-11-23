import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { assemblePreparedBank } from '../scripts/assemble-bank.mjs';
import { loadQuestionBank } from '../src/question-bank.js';

const bank = assemblePreparedBank(readdirSync('data/prepared')
  .filter(file => file.endsWith('.json'))
  .map(file => JSON.parse(readFileSync(`data/prepared/${file}`, 'utf8'))));
const question = number => bank.find(item => item.sourceNumber === number);
const answers = item => item.choices.filter(choice => item.correctChoiceIds.includes(choice.id)).map(choice => choice.text);
const hasCitation = (item, url) => assert.ok(item.sources.some(source =>
  source.url === url && source.locator && source.checkedAt === '2026-11-23'), item.id);

test('corrected content still assembles all 407 stable identities with four distinct choices', () => {
  assert.deepEqual(bank.map(item => item.sourceNumber), Array.from({ length: 407 }, (_, index) => index + 1));
  assert.deepEqual(bank.map(item => item.id), Array.from({ length: 407 }, (_, index) =>
    `source-${String(index + 1).padStart(3, '0')}`));
  assert.deepEqual(loadQuestionBank(bank).errors, []);
  for (const number of [156, 179, 344, 356, 365, 377, 401, 405]) {
    const item = question(number);
    assert.equal(item.choices.length, 4, item.id);
    assert.equal(new Set(item.choices.map(choice => choice.text.toLowerCase().trim())).size, 4, item.id);
  }
});

test('source 344 selects two alternative England/Wales court compositions, not two people or NI rules', () => {
  const item = question(344);
  assert.match(item.question, /England and Wales/);
  assert.match(item.question, /ways|compositions|constituted/i);
  assert.doesNotMatch(item.question, /Northern Ireland|TWO people/i);
  assert.equal(item.answerType, 'select-two');
  assert.equal(answers(item).length, 2);
  assert.ok(answers(item).some(text => /three.*magistrates/i.test(text)));
  assert.ok(answers(item).some(text => /district judge/i.test(text)));
  assert.match(item.romanUrdu, /England aur Wales/);
  assert.match(item.romanUrdu, /DO.*tareeq/i);
  assert.doesNotMatch(item.romanUrdu, /Northern Ireland|DO log/);
  hasCitation(item, 'https://www.gov.uk/courts/youth-courts');
});

test('source 401 marks the combined NI district-judge-and-two-lay-magistrates panel correct', () => {
  const item = question(401);
  assert.match(item.question, /Northern Ireland/);
  assert.equal(item.answerType, 'single');
  assert.equal(answers(item).length, 1);
  assert.match(answers(item)[0], /district judge.*chair.*and two lay magistrates/i);
  assert.match(item.explanation, /district judge.*chair.*and two lay magistrates/i);
  assert.match(item.romanUrdu, /district judge.*lay magistrates/i);
  hasCitation(item, 'https://www.nidirect.gov.uk/articles/youth-justice');
});

test('source 156 rewards abolition in most of the Empire and teaches the statutory territorial exceptions', () => {
  const item = question(156);
  assert.equal(item.answerType, 'single');
  assert.match(item.question, /1833/);
  assert.match(answers(item)[0], /most of the British Empire.*exceptions/i);
  assert.doesNotMatch(item.question, /throughout/);
  for (const territory of [/East India Company/, /Ceylon/, /Saint Helena/]) {
    assert.match(item.explanation, territory);
  }
  assert.match(item.romanUrdu, /ilaqai.*dair/i);
  hasCitation(item, 'https://www.irishstatutebook.ie/eli/1833/act/73/section/64/enacted/en/html');
});

test('source 356 asks the passage year, not an Empire-wide immediate abolition year', () => {
  const item = question(356);
  assert.equal(item.answerType, 'single');
  assert.deepEqual(answers(item), ['1833']);
  assert.match(item.question, /passed|enacted/i);
  assert.match(item.question, /most of the British Empire/);
  assert.doesNotMatch(`${item.question} ${item.explanation}`, /throughout the British Empire/);
  assert.match(item.explanation, /1834/);
  for (const territory of [/East India Company/, /Ceylon/, /Saint Helena/]) {
    assert.match(item.explanation, territory);
  }
  assert.match(item.romanUrdu, /pass|manzoor/i);
  assert.match(item.romanUrdu, /zyada tar hisson/);
  assert.doesNotMatch(item.romanUrdu, /poori British Empire/);
  hasCitation(item, 'https://www.irishstatutebook.ie/eli/1833/act/73/section/64/enacted/en/html');
});

test('source 365 selects two alternative E/W court compositions without extending them to NI', () => {
  const item = question(365);
  assert.equal(item.answerType, 'select-two');
  assert.equal(answers(item).length, 2);
  assert.match(item.question, /England and Wales/);
  assert.match(item.question, /ways|compositions|constituted/i);
  assert.doesNotMatch(item.question, /Northern Ireland|TWO people/i);
  assert.ok(answers(item).some(text => /three.*magistrates/i.test(text)));
  assert.ok(answers(item).some(text => /district judge/i.test(text)));
  assert.match(item.explanation, /England and Wales.*either.*magistrates or a district judge/i);
  assert.match(item.romanUrdu, /England aur Wales/);
  assert.match(item.romanUrdu, /DO.*tareeq/i);
  assert.doesNotMatch(item.romanUrdu, /Northern Ireland|DO log/);
  hasCitation(item, 'https://www.gov.uk/courts/youth-courts');
});

test('source 405 teaches the ten-hour textile-work limit for women and young people aged 13–18', () => {
  const item = question(405);
  assert.match(answers(item)[0], /ten.hour.*women and young (people|persons).*13[–-]18/i);
  assert.doesNotMatch(answers(item)[0], /women and children/);
  assert.match(item.explanation, /women and young (people|persons).*13[–-]18/i);
  assert.match(item.romanUrdu, /13[–-]18/);
  hasCitation(item, 'https://www.parliament.uk/about/living-heritage/transformingsociety/livinglearning/19thcentury/overview/laterfactoryleg');
});

test('source 377 retains Ellie Simmonds and her 2016 gold with athlete-results evidence', () => {
  const item = question(377);
  assert.deepEqual(answers(item), ['Ellie Simmonds']);
  assert.match(item.question, /2008, 2012 and 2016/);
  assert.match(item.romanUrdu, /2008, 2012 aur 2016/);
  assert.match(item.explanation, /2016/);
  hasCitation(item, 'https://paralympics.org.uk/athletes/ellie-simmonds');
});

test('source 179 keeps name/address as select-two under the ordinary E/W collar rule with exemptions', () => {
  const item = question(179);
  assert.match(item.question, /England and Wales/);
  assert.match(item.question, /usual|ordinary|not exempt/i);
  assert.equal(item.answerType, 'select-two');
  assert.deepEqual(new Set(answers(item)), new Set(["The owner's name", "The owner's address"]));
  assert.match(item.explanation, /plate or badge attached to (it|the collar)/i);
  assert.match(item.explanation, /exemptions.*working.*guide dogs/i);
  assert.match(item.romanUrdu, /England aur Wales/);
  assert.match(item.romanUrdu, /aam qanoon|istisna/i);
  hasCitation(item, 'https://www.legislation.gov.uk/uksi/1992/901/article/2/made');
});

test('the generated release bank contains the assembled prepared corrections', () => {
  const generated = JSON.parse(readFileSync('data/questions.json', 'utf8'));
  assert.deepEqual(generated, bank);
});
