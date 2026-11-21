import assert from 'node:assert/strict';
import test from 'node:test';
import * as store from '../src/progress-store.js';
import { createSession, updateAnswer, checkCurrentAnswer } from '../src/session.js';
import { getStudyBlocks } from '../src/study-blocks.js';

const KEY = 'lifeinuk-progress-v1';
const BACKUP = 'lifeinuk-progress-backup-v1';
const questions = Array.from({ length: 407 }, (_, i) => ({
  id: `source-${String(i + 1).padStart(3, '0')}`, sourceNumber: i + 1,
  answerType: 'single', correctChoiceIds: ['b'],
  choices: ['a','b','c','d'].map(id => ({ id, text: id })),
}));
const blocks = getStudyBlocks(questions);
const context = { questions, blocks, legacyQuestionMap: { version: 1, mappings: [{
  oldId: 'old-q', newId: 'source-001', choiceIds: { a: 'a', b: 'b', c: 'c', d: 'd' },
  resumeSafe: true, reason: 'Reviewed identical question and choices.',
}] } };
const empty = () => ({
  version: 2, questions: {}, activeSession: null, completedTestCount: 0,
  completedBlockIds: [], completedSessionIds: [],
});
const memory = raw => {
  const values = new Map(raw === undefined ? [] : [[KEY, raw]]);
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
};
const oldProgress = () => ({
  version: 1, completedTestCount: 4, activeSession: null,
  questions: { 'old-q': { attempts: 2, incorrectTotal: 1, consecutiveIncorrect: 0, nextReviewTest: 7 },
    unknown: { attempts: 1, incorrectTotal: 1, consecutiveIncorrect: 1 } },
});

test('context-aware reads migrate v1 history without writing or inventing block completions', () => {
  const original = JSON.stringify(oldProgress());
  const storage = memory(original);
  const read = store.readProgress(storage, context);
  assert.equal(read.status, 'migrated');
  assert.equal(read.storageSnapshot, original);
  assert.equal(read.progress.version, 2);
  assert.deepEqual(read.progress.questions['source-001'], oldProgress().questions['old-q']);
  assert.deepEqual(read.progress.questions.unknown, oldProgress().questions.unknown);
  assert.deepEqual(read.progress.completedBlockIds, []);
  assert.equal(read.progress.completedTestCount, 4);
  assert.equal(storage.getItem(KEY), original);
  assert.equal(storage.getItem(BACKUP), null);
});

test('older calendar-based history stays attempted and becomes eligible for review', () => {
  const old = oldProgress();
  old.questions['old-q'] = { attempts: 3, incorrectTotal: 0, nextReviewAt: '2026-12-01T00:00:00Z' };
  delete old.completedTestCount;
  const read = store.readProgress(memory(JSON.stringify(old)), context);
  assert.equal(read.progress.questions['source-001'].attempts, 3);
  assert.equal(read.progress.questions['source-001'].nextReviewTest, undefined);
  assert.equal(read.progress.completedTestCount, 0);
});

test('safe legacy sessions remap answers and default missing checked state to unchecked', () => {
  const old = { ...oldProgress(), activeSession: {
    questionIds: ['old-q'], answers: { 'old-q': ['b'] }, currentIndex: 0, submitted: false,
  } };
  const read = store.readProgress(memory(JSON.stringify(old)), context);
  assert.equal(read.progress.activeSession.mode, 'legacy');
  assert.deepEqual(read.progress.activeSession.questionIds, ['source-001']);
  assert.deepEqual(read.progress.activeSession.answers, { 'source-001': ['b'] });
  assert.deepEqual(read.progress.activeSession.checkedQuestionIds, []);
  assert.ok(read.progress.activeSession.id);
});

test('migration retains both histories if an already-canonical identity collides with an alias', () => {
  const old = oldProgress();
  old.questions['source-001'] = { attempts: 9, incorrectTotal: 2 };
  const read = store.readProgress(memory(JSON.stringify(old)), context);
  assert.equal(read.progress.questions['source-001'].attempts, 9);
  assert.ok(read.progress.questions['old-q'], 'colliding old history must not disappear');
  assert.equal(read.progress.questions['old-q'].attempts, 2);
});

test('unsafe corrected legacy session is dropped with warning while history survives', () => {
  const old = { ...oldProgress(), activeSession: {
    questionIds: ['old-q'], answers: { 'old-q': ['b'] }, currentIndex: 0, submitted: false,
  } };
  const unsafe = { ...context, legacyQuestionMap: { version: 1,
    mappings: [{ ...context.legacyQuestionMap.mappings[0], resumeSafe: false }] } };
  const read = store.readProgress(memory(JSON.stringify(old)), unsafe);
  assert.equal(read.progress.activeSession, null);
  assert.match(read.warning, /unfinished|restore/i);
  assert.equal(read.progress.questions['source-001'].attempts, 2);
});

test('v2 writes require snapshot, preserve v1 backup, and detect a changed storage value', () => {
  const original = JSON.stringify(oldProgress());
  const storage = memory(original);
  const read = store.readProgress(storage, context);
  assert.equal(store.writeProgress(storage, read.progress).saved, false);
  const saved = store.writeProgress(storage, read.progress, { expectedSerialized: read.storageSnapshot });
  assert.equal(saved.saved, true);
  assert.equal(storage.getItem(BACKUP), original);
  assert.equal(saved.storageSnapshot, storage.getItem(KEY));
  storage.setItem(KEY, '{"changed":true}');
  assert.equal(store.writeProgress(storage, empty(), { expectedSerialized: saved.storageSnapshot }).saved, false);
  assert.equal(storage.getItem(KEY), '{"changed":true}');
});

test('corrupt and incompatible storage is protected even when caller supplies its raw snapshot', () => {
  for (const raw of ['{bad', '{"version":99}', JSON.stringify({ ...empty(), completedBlockIds: ['block-99'] })]) {
    const storage = memory(raw);
    const read = store.readProgress(storage, context);
    assert.ok(['corrupt','incompatible'].includes(read.status));
    assert.equal(store.writeProgress(storage, empty(), { expectedSerialized: raw }).saved, false);
    assert.equal(storage.getItem(KEY), raw);
  }
});

test('failed backup leaves original progress untouched and unavailable storage is visible', () => {
  const raw = JSON.stringify(oldProgress());
  const storage = memory(raw);
  const read = store.readProgress(storage, context);
  const failBackup = { getItem: storage.getItem, setItem(key, value) {
    if (key === BACKUP) throw new Error('quota');
    storage.setItem(key, value);
  } };
  assert.equal(store.writeProgress(failBackup, read.progress, { expectedSerialized: raw }).saved, false);
  assert.equal(storage.getItem(KEY), raw);
  assert.equal(store.readProgress(null, context).status, 'unavailable');
});

test('invalid v2 active sessions preserve valid history but cannot resume', () => {
  const base = createSession(['source-001'], { id: 'round-1', mode: 'revision' });
  for (const activeSession of [
    { ...base, currentIndex: Infinity },
    { ...base, questionIds: ['missing'] },
    { ...base, answers: { 'source-001': ['missing'] } },
    { ...base, checkedQuestionIds: ['missing'] },
    { ...base, mode: 'study', blockId: 'block-1' },
  ]) {
    const read = store.readProgress(memory(JSON.stringify({ ...empty(), activeSession,
      questions: { 'source-001': { attempts: 1 } } })), context);
    assert.equal(read.progress.activeSession, null);
    assert.match(read.warning, /unfinished|restore/i);
    assert.equal(read.progress.questions['source-001'].attempts, 1);
  }
});

test('v2 revision restores exact order, choices and checked state', () => {
  const session = { ...createSession(['source-002', 'source-001'], { id: 'r-1', mode: 'revision' }),
    answers: { 'source-002': ['b'] }, checkedQuestionIds: ['source-002'], currentIndex: 1 };
  const raw = JSON.stringify({ ...empty(), activeSession: session });
  const read = store.readProgress(memory(raw), context);
  assert.equal(read.status, 'saved');
  assert.deepEqual(read.progress.activeSession, session);
});

test('study restore preserves final-block membership and rejects duplicate and over-selected answers', () => {
  const session = createSession(blocks[7].questionIds, { id: 'last', mode: 'study', blockId: 'block-8' });
  const read = store.readProgress(memory(JSON.stringify({ ...empty(), activeSession: session })), context);
  assert.deepEqual(read.progress.activeSession, session);
  for (const bad of [
    { ...session, questionIds: [...session.questionIds, session.questionIds[0]] },
    { ...session, answers: { 'source-358': ['a','b'] } },
    { ...session, answers: { 'source-358': ['a','a'] } },
    { ...session, checkedQuestionIds: ['source-358'] },
  ]) {
    const outcome = store.readProgress(memory(JSON.stringify({ ...empty(), activeSession: bad })), context);
    assert.equal(outcome.progress.activeSession, null);
    assert.ok(outcome.warning);
  }
});

const checkedSession = (mode = 'revision') => {
  const selected = mode === 'study' ? questions.slice(357) : [questions[0]];
  let session = createSession(selected.map(q => q.id), { id: `${mode}-1`, mode,
    blockId: mode === 'study' ? 'block-8' : null });
  for (const [i, q] of selected.entries()) {
    session = { ...session, currentIndex: i };
    session = updateAnswer(session, q.id, ['b']);
    session = checkCurrentAnswer(session, q).session;
  }
  return session;
};

test('a reordered active-session object is still accepted', () => {
  const session = checkedSession();
  const reordered = Object.fromEntries(Object.entries(session).reverse());
  const outcome = store.recordCompletedSession(
    { ...empty(), activeSession: session }, reordered,
    new Map(questions.map(question => [question.id, question])),
  );
  assert.equal(outcome.error, null);
  assert.ok(outcome.result);
});

test('completed session recording is idempotent and revision never advances a block', () => {
  assert.equal(typeof store.recordCompletedSession, 'function');
  const session = checkedSession();
  const before = { ...empty(), activeSession: session };
  const map = new Map(questions.map(q => [q.id, q]));
  const once = store.recordCompletedSession(before, session, map, '2026-11-21T12:00:00Z');
  assert.equal(once.error, null);
  assert.equal(once.progress.completedTestCount, 1);
  assert.equal(once.progress.questions['source-001'].attempts, 1);
  assert.equal(once.progress.questions['source-001'].nextReviewTest, 3);
  assert.deepEqual(once.progress.completedBlockIds, []);
  assert.equal(once.progress.activeSession, null);
  const twice = store.recordCompletedSession(once.progress, session, map);
  assert.deepEqual(twice.progress, once.progress);
});

test('final block completion records coverage once but replay creates new attempts', () => {
  assert.equal(typeof store.recordCompletedSession, 'function');
  const session = checkedSession('study');
  const map = new Map(questions.map(q => [q.id, q]));
  const once = store.recordCompletedSession({ ...empty(), activeSession: session }, session, map);
  assert.equal(once.error, null);
  assert.equal(once.result.total, 50);
  assert.deepEqual(once.progress.completedBlockIds, ['block-8']);
  const replay = { ...session, id: 'study-2' };
  const twice = store.recordCompletedSession({ ...once.progress, activeSession: replay }, replay, map);
  assert.deepEqual(twice.progress.completedBlockIds, ['block-8']);
  assert.equal(twice.progress.questions['source-358'].attempts, 2);
  assert.equal(twice.progress.completedTestCount, 2);
});

test('legacy completion records an attempt without awarding a study block', () => {
  assert.equal(typeof store.recordCompletedSession, 'function');
  const session = { ...checkedSession(), mode: 'legacy' };
  const outcome = store.recordCompletedSession({ ...empty(), activeSession: session }, session,
    new Map(questions.map(q => [q.id, q])));
  assert.equal(outcome.error, null);
  assert.equal(outcome.progress.completedTestCount, 1);
  assert.deepEqual(outcome.progress.completedBlockIds, []);
});

test('incomplete, invalid or stale sessions cannot change progress or clear a different session', () => {
  assert.equal(typeof store.recordCompletedSession, 'function');
  const valid = checkedSession();
  const map = new Map(questions.map(q => [q.id, q]));
  const before = { ...empty(), activeSession: valid };
  for (const session of [
    { ...valid, checkedQuestionIds: [] }, { ...valid, id: 'stale' },
    { ...valid, questionIds: ['missing'] }, { ...valid, mode: 'study', blockId: 'block-1' },
  ]) {
    const outcome = store.recordCompletedSession(before, session, map);
    assert.ok(outcome.error);
    assert.deepEqual(outcome.progress, before);
  }
});
