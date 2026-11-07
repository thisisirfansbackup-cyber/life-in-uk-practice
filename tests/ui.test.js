import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { selectTestQuestions } from '../src/revision.js';
import { checkCurrentAnswer, createSession, moveToQuestion, submitSession, updateAnswer } from '../src/session.js';
import { recordCompletedTest } from '../src/progress-store.js';
import { mountApp } from '../src/ui.js';
import { startApp } from '../src/main.js';

const pagePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
const html = existsSync(pagePath) ? readFileSync(pagePath, 'utf8') : '';
const questionPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'questions.json');
const bankContent = existsSync(questionPath) ? JSON.parse(readFileSync(questionPath, 'utf8')) : [];
const stylesPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'styles.css');
const styles = existsSync(stylesPath) ? readFileSync(stylesPath, 'utf8') : '';

test('page shell has a named, non-official main practice area', () => {
  assert.match(html, /<main\b[^>]*\bid=["']app["']/i);
  assert.match(html, /<meta\s+name=["']viewport["']/i);
  assert.match(html, /<title>[^<]*(practice|study)[^<]*<\/title>/i);
  assert.doesNotMatch(html, /<title>[^<]*(official|government)[^<]*<\/title>/i);
});

test('declares an empty data favicon so browsers do not request a missing file', () => {
  assert.match(html, /<link\s+rel=["']icon["'][^>]*href=["']data:,["']/i);
});

test('keeps internal answer-correction notes out of learner-facing explanations', () => {
  for (const question of bankContent) {
    assert.doesNotMatch(question.explanation, /older guide|original.{0,20}wording|was ambiguous|not (?:a )?precise|out of date/i, question.id);
  }
});

test('lets long question headings use a readable line length', () => {
  assert.match(styles, /\.question-prompt\s*\{[^}]*max-width:\s*(?:3[0-9]|4[0-9])ch/s);
});

const makeQuestions = () => Array.from({ length: 50 }, (_, index) => ({
  id: `q${index}`,
  question: index === 0 ? 'Which answer is correct?' : `Question ${index + 1}?`,
  romanUrdu: index === 0 ? 'Kaunsa jawab sahi hai?' : `Sawal number ${index + 1}?`,
  choices: [
    { id: 'a', text: index === 0 ? 'English choice one' : 'Choice one' },
    { id: 'b', text: 'Choice two' },
    { id: 'c', text: 'Choice three' },
    { id: 'd', text: 'Choice four' },
  ],
  correctChoiceIds: index === 1 ? ['a', 'c'] : ['a'],
  answerType: index === 1 ? 'select-two' : 'single',
  verificationStatus: 'verified',
  lessonNumbers: [1],
  explanation: 'A short explanation.',
  sources: [{ title: 'Official source', url: 'https://example.gov.uk', locator: 'Section 1', checkedAt: '2026-11-07' }],
}));

const makeHarness = ({ questions = makeQuestions(), initialProgress, readStatus = 'saved', writeResult = { saved: true, error: null }, chooseQuestions } = {}) => {
  const dom = new JSDOM('<main id="app-root"></main>', { url: 'https://example.test' });
  let progress = structuredClone(initialProgress ?? { version: 1, questions: {}, activeSession: null });
  const root = dom.window.document.querySelector('#app-root');
  let writeCount = 0;
  const progressStore = {
    read: () => ({ progress: structuredClone(progress), status: readStatus }),
    write: (nextProgress) => {
      writeCount += 1;
      progress = structuredClone(nextProgress);
      return writeResult;
    },
    recordCompletedTest,
  };
  const app = mountApp(root, {
    questions,
    selectTestQuestions: chooseQuestions ?? ((bank, progress, size) => bank.length < size
      ? selectTestQuestions(bank, progress, size, () => 0.5)
      : { questionIds: bank.slice(0, size).map((question) => question.id), error: null }),
    createSession,
    updateAnswer,
    checkCurrentAnswer,
    moveToQuestion,
    submitSession,
    progressStore,
    now: () => new Date('2026-11-07T12:00:00.000Z'),
  });

  const click = (selector) => root.querySelector(selector).dispatchEvent(
    new dom.window.MouseEvent('click', { bubbles: true }),
  );

  return { dom, root, progress: () => progress, writes: () => writeCount, app, click };
};

test('home summarizes unseen and missed questions', () => {
  const harness = makeHarness({
    initialProgress: {
      version: 1,
      completedTestCount: 1,
      questions: {
        q0: { attempts: 2, consecutiveIncorrect: 1, nextReviewTest: 4 },
        q1: { attempts: 1, consecutiveIncorrect: 0, nextReviewTest: 2 },
        q2: { attempts: 1, consecutiveIncorrect: 0, nextReviewTest: 5 },
      },
      activeSession: null,
    },
  });

  assert.match(harness.root.textContent, /47 unseen/i);
  assert.match(harness.root.textContent, /2 to review/i);
});

test('discloses lessons missing from the current question set', () => {
  const harness = makeHarness({ questions: bankContent });

  assert.match(harness.root.textContent, /does not yet include questions from Lessons 2, 3 and 6/i);
});

test('shows Roman Urdu directly below the English question without translating choices', () => {
  const harness = makeHarness();
  harness.click('[data-action="start"]');

  const prompt = harness.root.querySelector('.question-prompt');
  assert.equal(prompt.textContent, 'Which answer is correct?');
  assert.equal(prompt.nextElementSibling.className, 'question-translation');
  assert.equal(prompt.nextElementSibling.textContent, 'Kaunsa jawab sahi hai?');
  assert.deepEqual([...harness.root.querySelectorAll('.choice-label')].map((label) => label.textContent.trim()), [
    'English choice one', 'Choice two', 'Choice three', 'Choice four',
  ]);
});

test('requires checking an answer before advancing and shows immediate wrong-answer feedback', () => {
  const harness = makeHarness();
  harness.click('[data-action="start"]');
  assert.equal(harness.root.querySelector('input[type="radio"]') !== null, true);
  assert.equal(harness.root.querySelector('[data-action="next"]').disabled, true);
  harness.click('[data-action="next"]');
  assert.match(harness.root.textContent, /Question 1 of 50/);

  harness.root.querySelector('[data-choice-id="b"]').checked = true;
  harness.root.querySelector('[data-choice-id="b"]').dispatchEvent(new harness.dom.window.Event('change', { bubbles: true }));
  harness.click('[data-action="check"]');
  assert.match(harness.root.textContent, /Incorrect/i);
  assert.match(harness.root.textContent, /English choice one/i);
  assert.match(harness.root.textContent, /A short explanation/i);
  assert.equal(harness.root.querySelector('[data-action="next"]').disabled, false);
  assert.equal(harness.root.querySelector('[data-choice-id="b"]').disabled, true);
  assert.equal(harness.progress().activeSession.checkedQuestionIds.includes('q0'), true);
  assert.equal(harness.progress().questions.q0, undefined, 'unfinished tests do not update revision history');

  harness.click('[data-action="next"]');
  assert.match(harness.root.textContent, /Question 2 of 50/);
  assert.equal(harness.root.querySelectorAll('input[type="checkbox"]').length, 4);
  assert.equal(harness.root.querySelector('[data-action="check"]').disabled, true);
});

test('requires exactly two selections before checking a select-two question', () => {
  const harness = makeHarness();
  harness.click('[data-action="start"]');
  harness.root.querySelector('[data-choice-id="a"]').checked = true;
  harness.root.querySelector('[data-choice-id="a"]').dispatchEvent(new harness.dom.window.Event('change', { bubbles: true }));
  harness.click('[data-action="check"]');
  harness.click('[data-action="next"]');
  harness.root.querySelector('[data-choice-id="a"]').checked = true;
  harness.root.querySelector('[data-choice-id="a"]').dispatchEvent(new harness.dom.window.Event('change', { bubbles: true }));
  assert.equal(harness.root.querySelector('[data-action="check"]').disabled, true);
  harness.root.querySelector('[data-choice-id="c"]').checked = true;
  harness.root.querySelector('[data-choice-id="c"]').dispatchEvent(new harness.dom.window.Event('change', { bubbles: true }));
  assert.equal(harness.root.querySelector('[data-action="check"]').disabled, false);
  assert.deepEqual(harness.progress().activeSession.checkedQuestionIds, ['q0']);
});

test('keeps keyboard focus on the selected answer when progress is saved', () => {
  const harness = makeHarness();
  harness.click('[data-action="start"]');
  const choice = harness.root.querySelector('[data-choice-id="a"]');
  choice.focus();
  choice.checked = true;
  choice.dispatchEvent(new harness.dom.window.Event('change', { bubbles: true }));

  assert.equal(harness.root.ownerDocument.activeElement.dataset.choiceId, 'a');
});

test('submits answers and shows a score with a complete end-of-test review', () => {
  const harness = makeHarness();
  harness.click('[data-action="start"]');
  const firstChoice = harness.root.querySelector('[data-choice-id="a"]');
  firstChoice.checked = true;
  firstChoice.dispatchEvent(new harness.dom.window.Event('change', { bubbles: true }));
  harness.click('[data-action="check"]');
  assert.equal(harness.progress().completedTestCount, undefined, 'checking answers does not count an unfinished test');
  harness.click('[data-action="next"]');
  for (const choiceId of ['a', 'c']) {
    const choice = harness.root.querySelector(`[data-choice-id="${choiceId}"]`);
    choice.checked = true;
    choice.dispatchEvent(new harness.dom.window.Event('change', { bubbles: true }));
  }
  harness.click('[data-action="check"]');
  for (let index = 1; index < 49; index += 1) {
    harness.click('[data-action="next"]');
    harness.root.querySelector('[data-choice-id="a"]').checked = true;
    harness.root.querySelector('[data-choice-id="a"]').dispatchEvent(new harness.dom.window.Event('change', { bubbles: true }));
    harness.click('[data-action="check"]');
  }
  harness.click('[data-action="submit"]');

  assert.match(harness.root.textContent, /Your result/i);
  assert.match(harness.root.textContent, /50\s*\/\s*50/);
  assert.equal(harness.root.querySelectorAll('.review-item').length, 50);
  assert.equal(harness.progress().questions.q0.attempts, 1, 'completed tests update revision history');
  assert.equal(harness.progress().completedTestCount, 1, 'a completed 50-question test advances the schedule once');
});

test('shows an unavailable-test message instead of starting a short test', () => {
  const harness = makeHarness({ questions: makeQuestions().slice(0, 49) });
  harness.click('[data-action="start"]');

  assert.match(harness.root.textContent, /needs 50.*only 49/i);
  assert.equal(harness.root.querySelector('.question-prompt'), null);
});

test('warns when browser storage refuses to save progress', () => {
  const harness = makeHarness({ writeResult: { saved: false, error: 'quota exceeded' } });
  harness.click('[data-action="start"]');

  assert.match(harness.root.textContent, /could not be saved/i);
});

test('preserves corrupt or incompatible saved data instead of overwriting it', () => {
  for (const readStatus of ['corrupt', 'incompatible']) {
    const harness = makeHarness({ readStatus });
    harness.click('[data-action="start"]');

    assert.equal(harness.writes(), 0, `${readStatus} saved data must not be replaced`);
    assert.match(harness.root.textContent, /could not be read/i);
    assert.match(harness.root.textContent, /not overwrite/i);
  }
});

test('resumes an unfinished session with its saved order and answers', () => {
  const first = makeHarness();
  first.click('[data-action="start"]');
  const choice = first.root.querySelector('[data-choice-id="a"]');
  choice.checked = true;
  choice.dispatchEvent(new first.dom.window.Event('change', { bubbles: true }));
  first.click('[data-action="check"]');
  first.click('[data-action="next"]');
  const savedIds = first.progress().activeSession.questionIds;

  const restored = makeHarness({ initialProgress: first.progress() });
  assert.ok(restored.root.querySelector('[data-action="resume"]'));
  restored.click('[data-action="resume"]');

  assert.match(restored.root.textContent, /Question 2 of 50/);
  assert.deepEqual(restored.progress().activeSession.questionIds, savedIds);
  assert.deepEqual(restored.progress().activeSession.answers.q0, ['a']);
});

test('treats a saved pre-check session as unchecked when it has no checked status', () => {
  const legacySession = {
    questionIds: Array.from({ length: 50 }, (_, index) => `q${index}`),
    answers: { q0: ['a'] },
    currentIndex: 0,
    submitted: false,
  };
  const harness = makeHarness({
    initialProgress: { version: 1, questions: {}, activeSession: legacySession },
  });
  harness.click('[data-action="resume"]');

  assert.equal(harness.root.querySelector('[data-choice-id="a"]').checked, true);
  assert.equal(harness.root.querySelector('[data-action="next"]').disabled, true);
  assert.equal(harness.root.querySelector('[data-action="check"]').disabled, false);
});

test('resumes a checked question with its feedback and locked answer', () => {
  const first = makeHarness();
  first.click('[data-action="start"]');
  first.root.querySelector('[data-choice-id="b"]').checked = true;
  first.root.querySelector('[data-choice-id="b"]').dispatchEvent(new first.dom.window.Event('change', { bubbles: true }));
  first.click('[data-action="check"]');

  const restored = makeHarness({ initialProgress: first.progress() });
  restored.click('[data-action="resume"]');
  assert.match(restored.root.textContent, /Incorrect/i);
  assert.equal(restored.root.querySelector('[data-choice-id="b"]').disabled, true);
  assert.equal(restored.root.querySelector('[data-action="next"]').disabled, false);
});

test('shows a recoverable startup message when the question bank cannot load', async () => {
  const dom = new JSDOM('<main id="app-root"></main>');
  const root = dom.window.document.querySelector('#app-root');

  await startApp({ root, fetchImpl: async () => { throw new Error('offline'); }, storage: null });

  assert.match(root.querySelector('[role="alert"]').textContent, /couldn.t load[\s\S]*refresh/i);
});
