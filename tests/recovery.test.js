import assert from 'node:assert/strict';
import test from 'node:test';
import { selectRevisionQuestions } from '../src/revision.js';
import { readProgress, writeProgress } from '../src/progress-store.js';
import { getStudyBlocks } from '../src/study-blocks.js';

const KEY = 'lifeinuk-progress-v1';
const questions = Array.from({ length: 407 }, (_, index) => ({
  id: `source-${String(index + 1).padStart(3, '0')}`, sourceNumber: index + 1,
  answerType: 'single', correctChoiceIds: ['b'],
  choices: ['a', 'b', 'c', 'd'].map(id => ({ id, text: id })),
}));
const blocks = getStudyBlocks(questions);
const context = { questions, blocks, legacyQuestionMap: { version: 1, mappings: [] } };
const memory = raw => {
  const values = new Map([[KEY, raw]]);
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
};
const empty = () => ({
  version: 2, questions: {}, activeSession: null, completedTestCount: 0,
  completedBlockIds: [], completedSessionIds: [],
});

test('an unreadable timestamp keeps question history and still allows revision selection', () => {
  const raw = JSON.stringify({
    ...empty(), completedTestCount: 3,
    questions: {
      'source-001': { attempts: 4, incorrectTotal: 2, consecutiveIncorrect: 1,
        lastSeenAt: { valueOf: null, toString: null } },
    },
  });
  const storage = memory(raw);
  const read = readProgress(storage, context);
  assert.equal(read.progress.questions['source-001'].attempts, 4);
  assert.equal(read.progress.questions['source-001'].lastSeenAt, undefined);
  assert.match(read.warning, /saved detail|could not be read/i);
  assert.doesNotThrow(() => selectRevisionQuestions(questions, read.progress));
  assert.equal(storage.getItem(KEY), raw, 'reading must not overwrite the original bytes');
});

test('an invalid saved-session shape keeps completed history and coverage', () => {
  const raw = JSON.stringify({
    ...empty(), completedTestCount: 2, completedBlockIds: ['block-1'],
    questions: { 'source-001': { attempts: 3, incorrectTotal: 1 } },
    activeSession: [],
  });
  const storage = memory(raw);
  const read = readProgress(storage, context);
  assert.equal(read.progress.activeSession, null);
  assert.equal(read.progress.questions['source-001'].attempts, 3);
  assert.deepEqual(read.progress.completedBlockIds, ['block-1']);
  assert.equal(read.progress.completedTestCount, 2);
  assert.match(read.warning, /unfinished test could not be restored/i);
  assert.equal(storage.getItem(KEY), raw);
});

test('repaired history can be saved afterwards without losing attempts', () => {
  const raw = JSON.stringify({
    ...empty(), questions: { 'source-001': { attempts: 2, lastSeenAt: 12345 } },
  });
  const storage = memory(raw);
  const read = readProgress(storage, context);
  const saved = writeProgress(storage, read.progress, { expectedSerialized: read.storageSnapshot });
  assert.equal(saved.saved, true);
  const reread = readProgress(storage, context);
  assert.equal(reread.progress.questions['source-001'].attempts, 2);
  assert.equal(reread.progress.questions['source-001'].lastSeenAt, undefined);
  assert.equal(reread.warning, undefined);
});

test('a repaired overwrite keeps the original bytes in a backup', () => {
  const raw = JSON.stringify({
    ...empty(), questions: { 'source-001': { attempts: 2, lastSeenAt: { bad: true } } },
  });
  const storage = memory(raw);
  const read = readProgress(storage, context);
  assert.equal(writeProgress(storage, read.progress, { expectedSerialized: read.storageSnapshot }).saved, true);
  assert.equal(storage.getItem('lifeinuk-progress-backup-repaired'), raw);
});

test('a missing active-session key does not warn about an unrestorable test', () => {
  const progress = { ...empty() };
  delete progress.activeSession;
  const read = readProgress(memory(JSON.stringify(progress)), context);
  assert.equal(read.status, 'saved');
  assert.equal(read.warning, undefined);
  assert.equal(read.progress.activeSession, null);
});

test('legacy version-one history with an unreadable timestamp is repaired, not discarded', () => {
  const raw = JSON.stringify({
    version: 1, completedTestCount: 1, activeSession: null,
    questions: { 'source-001': { attempts: 5, incorrectTotal: 2, lastSeenAt: { bad: true } } },
  });
  const storage = memory(raw);
  const read = readProgress(storage, context);
  assert.equal(read.status, 'migrated');
  assert.equal(read.progress.questions['source-001'].attempts, 5);
  assert.equal(read.progress.questions['source-001'].lastSeenAt, undefined);
  assert.match(read.warning, /saved detail|could not be read/i);
  assert.equal(storage.getItem(KEY), raw);
});
