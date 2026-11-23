import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { mountApp } from '../src/ui.js';
import { getStudyBlocks, getNextStudyBlock } from '../src/study-blocks.js';
import { selectRevisionQuestions } from '../src/revision.js';
import { createSession, updateAnswer, moveToQuestion, checkCurrentAnswer, submitSession } from '../src/session.js';
import { readProgress, writeProgress, recordCompletedSession } from '../src/progress-store.js';
import { startApp } from '../src/main.js';

const questions = Array.from({ length: 407 }, (_, i) => ({
  id: `source-${String(i + 1).padStart(3,'0')}`, sourceNumber: i + 1,
  question: `Question ${i + 1}?`, romanUrdu: `Sawal ${i + 1}?`,
  choices: ['a','b','c','d'].map(id => ({ id, text: `Choice ${id}` })),
  correctChoiceIds: ['b'], answerType: 'single', verificationStatus: 'verified',
  lessonNumbers: [1], explanation: '',
}));
const blocks = getStudyBlocks(questions);
const blank = () => ({ version: 2, questions: {}, activeSession: null,
  completedTestCount: 0, completedBlockIds: [], completedSessionIds: [] });

function harness(initialProgress = blank(), rawOverride, bank = questions) {
  const dom = new JSDOM('<main id="app-root"></main>', { url: 'https://example.test' });
  const root = dom.window.document.querySelector('main');
  if (rawOverride !== undefined) dom.window.localStorage.setItem('lifeinuk-progress-v1', rawOverride);
  else dom.window.localStorage.setItem('lifeinuk-progress-v1', JSON.stringify(initialProgress));
  const context = { questions: bank, blocks, legacyQuestionMap: { version: 1, mappings: [] } };
  mountApp(root, {
    questions: bank, blocks, getNextStudyBlock, selectRevisionQuestions,
    createSession, updateAnswer, moveToQuestion, checkCurrentAnswer, submitSession,
    progressStore: {
      read: () => readProgress(dom.window.localStorage, context),
      write: (progress, options) => writeProgress(dom.window.localStorage, progress, options),
      recordCompletedSession,
    },
  });
  const click = selector => {
    const node = root.querySelector(selector);
    assert.ok(node, `control exists: ${selector}`);
    node.click();
  };
  return { root, dom, click,
    progress: () => JSON.parse(dom.window.localStorage.getItem('lifeinuk-progress-v1')),
    choose: () => {
      const input = root.querySelector('input[value="b"]');
      input.checked = true;
      input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    },
  };
}

test('home presents eight ordered study blocks and separate revision', () => {
  const app = harness();
  assert.equal(app.root.querySelectorAll('[data-action="study-block"]').length, 8);
  assert.match(app.root.textContent, /358\s*[–-]\s*407/);
  assert.match(app.root.textContent, /407/);
  app.click('[data-action="study-block"][data-block-id="block-8"]');
  assert.match(app.root.textContent, /Question 1 of 50/);
  assert.equal(app.progress().activeSession.mode, 'study');
  assert.equal(app.progress().activeSession.questionIds[0], 'source-358');
});

test('next unfinished block does not hide earlier individually selectable blocks', () => {
  const app = harness({ ...blank(), completedBlockIds: ['block-1','block-3'] });
  assert.equal(app.root.querySelectorAll('[data-action="study-block"]').length, 8);
  app.click('[data-action="next-block"]');
  assert.equal(app.progress().activeSession.blockId, 'block-2');
});

test('empty revision explains that there is nothing due without starting a session', () => {
  const app = harness();
  app.click('[data-action="revision"]');
  assert.equal(app.progress().activeSession, null);
  assert.match(app.root.textContent, /nothing.*revise|no questions.*review/i);
});

test('one-question revision finishes once without completing a study block', () => {
  const app = harness({ ...blank(), questions: {
    'source-001': { attempts: 1, consecutiveIncorrect: 1, incorrectTotal: 1 },
  } });
  app.click('[data-action="revision"]');
  assert.match(app.root.textContent, /Question 1 of 1/);
  app.choose();
  app.click('[data-action="check"]');
  app.click('[data-action="submit"]');
  assert.equal(app.progress().completedTestCount, 1);
  assert.equal(app.progress().questions['source-001'].attempts, 2);
  assert.deepEqual(app.progress().completedBlockIds, []);
  assert.equal(app.progress().activeSession, null);
  assert.equal(app.progress().completedTestCount, 1);
});

test('replacing an unfinished session needs confirmation and cancel preserves its bytes', () => {
  const initial = { ...blank(), activeSession: createSession(blocks[0].questionIds,
    { id: 'old-active', mode: 'study', blockId: 'block-1' }) };
  const app = harness(initial);
  const before = app.dom.window.localStorage.getItem('lifeinuk-progress-v1');
  app.click('[data-action="study-block"][data-block-id="block-2"]');
  assert.ok(app.root.querySelector('[role="dialog"]'));
  assert.equal(app.root.querySelector('#home-title').hasAttribute('inert'), true);
  assert.equal(app.root.querySelector('#home-title').getAttribute('aria-hidden'), 'true');
  app.click('[data-action="cancel-replace"]');
  assert.equal(app.dom.window.localStorage.getItem('lifeinuk-progress-v1'), before);
  app.click('[data-action="study-block"][data-block-id="block-2"]');
  app.click('[data-action="confirm-replace"]');
  assert.equal(app.progress().activeSession.blockId, 'block-2');
});

test('final block completion and reload retain coverage independently of score', () => {
  const active = {
    ...createSession(blocks[7].questionIds, { id: 'last', mode: 'study', blockId: 'block-8' }),
    currentIndex: 49, checkedQuestionIds: blocks[7].questionIds.slice(0,49),
    answers: Object.fromEntries(blocks[7].questionIds.slice(0,49).map(id => [id, ['a']])),
  };
  const app = harness({ ...blank(), activeSession: active });
  app.click('[data-action="resume"]');
  app.choose();
  app.click('[data-action="check"]');
  app.click('[data-action="submit"]');
  assert.deepEqual(app.progress().completedBlockIds, ['block-8']);
  assert.equal(app.progress().questions['source-358'].incorrectTotal, 1);
  assert.match(app.root.textContent, /1\s*\/\s*50/);
  const reload = harness(app.progress());
  assert.match(reload.root.textContent, /1 of 8|1\s*\/\s*8/);
});

test('corrupt saved data is not overwritten during study or revision interactions', () => {
  const app = harness(blank(), '{bad');
  app.click('[data-action="study-block"][data-block-id="block-1"]');
  app.choose();
  app.click('[data-action="check"]');
  assert.equal(app.dom.window.localStorage.getItem('lifeinuk-progress-v1'), '{bad');
  assert.match(app.root.textContent, /could not be read|cannot be saved|could not be saved/i);
});

test('all blocks complete does not imply mastery and keeps block replay and revision available', () => {
  const app = harness({ ...blank(), completedBlockIds: blocks.map(b => b.id) });
  assert.equal(app.root.querySelector('[data-action="next-block"]'), null);
  assert.equal(app.root.querySelectorAll('[data-action="study-block"]').length, 8);
  assert.ok(app.root.querySelector('[data-action="revision"]'));
  assert.match(app.root.textContent, /coverage is not the same as mastery/i);
});

test('revision starts with the most repeatedly missed question and asks before replacement', () => {
  const initial = { ...blank(), activeSession: createSession(blocks[0].questionIds,
    { id: 'pending', mode: 'study', blockId: 'block-1' }), questions: {
    'source-001': { attempts: 2, consecutiveIncorrect: 1, incorrectTotal: 1 },
    'source-003': { attempts: 4, consecutiveIncorrect: 4, incorrectTotal: 4 },
  } };
  const app = harness(initial);
  app.click('[data-action="revision"]');
  assert.ok(app.root.querySelector('[role="dialog"]'));
  app.click('[data-action="confirm-replace"]');
  assert.deepEqual(app.progress().activeSession.questionIds, ['source-003','source-001']);
  assert.equal(app.progress().questions['source-003'].attempts, 4);
});

test('replacement confirmation traps keyboard focus and Escape restores the trigger', () => {
  const initial = { ...blank(), activeSession: createSession(blocks[0].questionIds,
    { id: 'pending', mode: 'study', blockId: 'block-1' }) };
  const app = harness(initial);
  app.click('[data-action="study-block"][data-block-id="block-2"]');
  const cancel = app.root.querySelector('[data-action="cancel-replace"]');
  const confirm = app.root.querySelector('[data-action="confirm-replace"]');
  assert.equal(app.dom.window.document.activeElement, cancel);
  cancel.dispatchEvent(new app.dom.window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
  assert.equal(app.dom.window.document.activeElement, confirm);
  confirm.dispatchEvent(new app.dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(app.root.querySelector('[role="dialog"]'), null);
  assert.equal(app.dom.window.document.activeElement.dataset.blockId, 'block-2');
});

test('revision resumes after reload with locked checked answer and unchanged order', () => {
  const first = harness({ ...blank(), questions: {
    'source-001': { attempts: 1, consecutiveIncorrect: 1, incorrectTotal: 1 },
    'source-003': { attempts: 2, consecutiveIncorrect: 2, incorrectTotal: 2 },
  } });
  first.click('[data-action="revision"]');
  first.choose();
  first.click('[data-action="check"]');
  const saved = first.progress();
  const second = harness(saved);
  second.click('[data-action="resume"]');
  assert.equal(second.progress().activeSession.id, saved.activeSession.id);
  assert.deepEqual(second.progress().activeSession.questionIds, ['source-003','source-001']);
  assert.ok(second.root.querySelector('input[value="b"]').disabled);
  assert.match(second.root.textContent, /correct.*well done/i);
});

test('extra unchecked select-two choices survive reload without losing earlier checked work', () => {
  const bank = structuredClone(questions);
  bank[1].answerType = 'select-two';
  bank[1].correctChoiceIds = ['a', 'b'];
  const first = harness(blank(), undefined, bank);
  first.click('[data-action="next-block"]');
  first.choose();
  first.click('[data-action="check"]');
  first.click('[data-action="next"]');
  for (const id of ['a', 'b', 'c']) {
    const input = first.root.querySelector(`input[value="${id}"]`);
    input.checked = true;
    input.dispatchEvent(new first.dom.window.Event('change', { bubbles: true }));
  }
  assert.equal(first.root.querySelector('[data-action="check"]').disabled, true);

  const reloaded = harness(first.progress(), undefined, bank);
  reloaded.click('[data-action="resume"]');
  assert.deepEqual(reloaded.progress().activeSession.checkedQuestionIds, ['source-001']);
  assert.equal(reloaded.root.querySelectorAll('input:checked').length, 3);
  assert.equal(reloaded.root.querySelector('[data-action="check"]').disabled, true);
  const extra = reloaded.root.querySelector('input[value="c"]');
  extra.checked = false;
  extra.dispatchEvent(new reloaded.dom.window.Event('change', { bubbles: true }));
  reloaded.click('[data-action="check"]');
  assert.match(reloaded.root.textContent, /correct.*well done/i);
  assert.deepEqual(reloaded.progress().activeSession.checkedQuestionIds, ['source-001', 'source-002']);
});

test('a changed storage snapshot halts later writes while practice stays usable in memory', () => {
  const app = harness();
  const foreign = JSON.stringify({ ...blank(), completedBlockIds: ['block-3'] });
  app.dom.window.localStorage.setItem('lifeinuk-progress-v1', foreign);
  app.click('[data-action="study-block"][data-block-id="block-1"]');
  app.choose();
  app.click('[data-action="check"]');
  assert.equal(app.dom.window.localStorage.getItem('lifeinuk-progress-v1'), foreign);
  assert.match(app.root.textContent, /another tab.*reload/i);
});

test('duplicate finish activation records one completion and remount shows saved coverage', () => {
  const active = {
    ...createSession(blocks[0].questionIds, { id: 'once', mode: 'study', blockId: 'block-1' }),
    currentIndex: 50, checkedQuestionIds: blocks[0].questionIds.slice(0,50),
    answers: Object.fromEntries(blocks[0].questionIds.slice(0,50).map(id => [id, ['b']])),
  };
  const app = harness({ ...blank(), activeSession: active });
  app.click('[data-action="resume"]');
  app.choose();
  app.click('[data-action="check"]');
  const submit = app.root.querySelector('[data-action="submit"]');
  submit.click();
  submit.click();
  assert.equal(app.progress().completedTestCount, 1);
  assert.deepEqual(app.progress().completedBlockIds, ['block-1']);
  assert.equal(app.progress().questions['source-001'].attempts, 1);
  const reload = harness(app.progress());
  assert.match(reload.root.textContent, /1 of 8/);
});

test('corrupt-storage warning survives answer changes and navigation', () => {
  const app = harness(blank(), '{bad');
  app.click('[data-action="study-block"][data-block-id="block-1"]');
  app.choose();
  app.click('[data-action="check"]');
  app.click('[data-action="next"]');
  assert.match(app.root.textContent, /could not be read|cannot be saved|could not be saved/i);
});

test('unsafe content is displayed as text rather than inserted markup', () => {
  const bank = structuredClone(questions);
  bank[0].question = '<img src=x onerror="alert(1)">';
  bank[0].romanUrdu = '<script>bad()</script>';
  bank[0].choices[0].text = '<iframe>bad</iframe>';
  bank[0].explanation = '<svg onload="bad()">';
  const app = harness(blank(), undefined, bank);
  app.click('[data-action="study-block"][data-block-id="block-1"]');
  assert.equal(app.root.querySelector('img,script,iframe,svg'), null);
  assert.match(app.root.textContent, /<img/);
});

test('startup loads and validates the complete collection and explicit legacy map', async () => {
  const dom = new JSDOM('<main id="app-root"></main>', { url: 'https://example.test' });
  const root = dom.window.document.querySelector('main');
  const complete = questions.map(q => ({ ...q, sources: [{
    title: 'Official fixture', locator: 'Section 1', url: 'https://example.gov.uk/fixture', checkedAt: '2026-11-21',
  }] }));
  await startApp({ root, storage: dom.window.localStorage,
    fetchImpl: async url => ({ ok: true, json: async () => String(url).endsWith('legacy-question-map.json')
      ? { version: 1, mappings: [] } : complete }) });
  assert.equal(root.querySelectorAll('[data-action="study-block"]').length, 8);
});

test('startup refuses partial, unconfirmed or unmapped invalid runtime content', async () => {
  const complete = questions.map(q => ({ ...q, sources: [{
    title: 'Official fixture', locator: 'Section 1', url: 'https://example.gov.uk/fixture', checkedAt: '2026-11-21',
  }] }));
  for (const [bank, map] of [
    [complete.slice(0,51), { version: 1, mappings: [] }],
    [complete.map((q, i) => i === 0 ? { ...q, verificationStatus: 'unconfirmed' } : q), { version: 1, mappings: [] }],
    [complete, { version: 99, mappings: [] }],
  ]) {
    const dom = new JSDOM('<main id="app-root"></main>');
    const root = dom.window.document.querySelector('main');
    await startApp({ root, storage: null,
      fetchImpl: async url => ({ ok: true, json: async () => String(url).endsWith('legacy-question-map.json') ? map : bank }) });
    assert.ok(root.querySelector('.startup-error'));
    assert.equal(root.querySelector('[data-action="study-block"]'), null);
  }
});

const bootSavedPractice = async (bank, saved) => {
  const dom = new JSDOM('<main id="app-root"></main>', { url: 'https://example.test' });
  const storage = dom.window.localStorage;
  if (saved) storage.setItem('lifeinuk-progress-v1', saved);
  const root = dom.window.document.querySelector('main');
  const app = await startApp({
    root, storage,
    fetchImpl: async url => ({ ok: true, json: async () => String(url).endsWith('legacy-question-map.json')
      ? { version: 1, mappings: [] } : bank }),
  });
  return { root, storage, dom, close: () => { app.destroy(); dom.window.close(); } };
};

test('changed question meaning reopens only affected answers instead of silently rescoring them', async t => {
  const bank = questions.map(q => ({ ...q, sources: [{
    title: 'Fixture evidence', locator: 'Section 1',
    url: 'https://example.gov.uk/fixture', checkedAt: '2026-11-21',
  }] }));
  const first = await bootSavedPractice(bank);
  t.after(first.close);
  first.root.querySelector('[data-action="next-block"]').click();
  for (let i = 0; i < 2; i++) {
    const input = first.root.querySelector('input[value="b"]');
    input.click();
    first.root.querySelector('[data-action="check"]').click();
    first.root.querySelector('[data-action="next"]').click();
  }
  const saved = first.storage.getItem('lifeinuk-progress-v1');

  for (const [name, change] of [
    ['answer key', q => { q.correctChoiceIds = ['a']; }],
    ['question wording', q => { q.question = 'A revised question?'; }],
    ['choice meaning', q => { q.choices[1].text = 'A different meaning'; }],
    ['translation', q => { q.romanUrdu = 'Badla hua sawal?'; }],
    ['answer type', q => { q.answerType = 'select-two'; q.correctChoiceIds = ['a', 'b']; }],
  ]) {
    await t.test(name, async () => {
      const updated = structuredClone(bank);
      change(updated[0]);
      const reloaded = await bootSavedPractice(updated, saved);
      try {
        assert.match(reloaded.root.textContent, /questions?.*updated/i);
        assert.equal(reloaded.storage.getItem('lifeinuk-progress-v1'), saved, 'reads must not overwrite the original');
        reloaded.root.querySelector('[data-action="resume"]').click();
        assert.equal(reloaded.root.querySelector('h1').textContent, updated[0].question);
        assert.equal(reloaded.root.querySelectorAll('input:checked').length, 0);
        assert.equal(reloaded.root.querySelector('input').disabled, false);
        assert.match(reloaded.root.textContent, /updated/i, 'the explanation must remain visible after resuming');
      } finally { reloaded.close(); }
    });
  }

  await t.test('citation, explanation and choice-order changes retain checked answers', async () => {
    const updated = structuredClone(bank);
    updated[0].sources[0].checkedAt = '2026-11-23';
    updated[0].explanation = 'A clearer explanation of the same answer.';
    updated[0].choices.reverse();
    const reloaded = await bootSavedPractice(updated, saved);
    try {
      reloaded.root.querySelector('[data-action="resume"]').click();
      reloaded.root.querySelector('[data-action="previous"]').click();
      assert.equal(reloaded.root.querySelector('input[value="b"]').checked, true);
      assert.equal(reloaded.root.querySelector('input[value="b"]').disabled, true);
      assert.match(reloaded.root.textContent, /correct.*well done/i);
    } finally { reloaded.close(); }
  });
});
