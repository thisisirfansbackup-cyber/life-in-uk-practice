import { loadQuestionBank, validateLegacyQuestionMap } from './question-bank.js';
import { selectRevisionQuestions, selectTestQuestions } from './revision.js';
import { getStudyBlocks, getNextStudyBlock } from './study-blocks.js';
import { checkCurrentAnswer, createSession, moveToQuestion, submitSession, updateAnswer } from './session.js';
import { readProgress, recordCompletedSession, recordCompletedTest, writeProgress } from './progress-store.js';
import { mountApp } from './ui.js';
import { getQuestionRevisions } from './question-content.js';

export async function startApp({ root, fetchImpl, storage } = {}) {
  const appRoot = root ?? (typeof document === 'undefined' ? null : document.querySelector('#app-root'));
  if (!appRoot) return { render() {}, destroy() {} };

  try {
    const request = fetchImpl ?? fetch;
    const response = await request(new URL('../data/questions.json', import.meta.url));
    if (!response.ok) throw new Error('Question bank request failed.');
    const rawBank = await response.json();
    const bank = loadQuestionBank(rawBank);
    if (bank.errors.length) throw new Error('Question bank validation failed.');
    const questionRevisions = await getQuestionRevisions(bank.questions);
    const blocks = getStudyBlocks(bank.questions);
    if (bank.questions.some(question => !['verified', 'corrected'].includes(question.verificationStatus))) {
      throw new Error('The complete question collection is not ready.');
    }
    const mappingResponse = await request(new URL('../data/legacy-question-map.json', import.meta.url));
    if (!mappingResponse.ok) throw new Error('Question mapping request failed.');
    const legacyQuestionMap = await mappingResponse.json();
    if (validateLegacyQuestionMap(legacyQuestionMap, bank.questions).length) {
      throw new Error('Question mapping validation failed.');
    }

    let browserStorage = storage;
    if (browserStorage === undefined) {
      try {
        browserStorage = window.localStorage;
      } catch {
        browserStorage = null;
      }
    }

    return mountApp(appRoot, {
      questions: bank.questions,
      questionRevisions,
      blocks,
      getNextStudyBlock,
      selectRevisionQuestions,
      selectTestQuestions,
      createSession,
      updateAnswer,
      checkCurrentAnswer,
      moveToQuestion,
      submitSession,
      progressStore: {
        read: () => readProgress(browserStorage, {
          questions: bank.questions, blocks, legacyQuestionMap, questionRevisions,
        }),
        write: (progress, options) => writeProgress(browserStorage, progress, options),
        recordCompletedSession,
        recordCompletedTest,
      },
    });
  } catch {
    appRoot.innerHTML = `
      <section class="startup-error" role="alert" aria-live="polite">
        <h1>We couldn’t load the practice questions.</h1>
        <p>Check your connection, then refresh this page to try again.</p>
      </section>`;
    return { render() {}, destroy() {} };
  }
}

if (typeof document !== 'undefined') {
  const appRoot = document.querySelector('#app-root');
  if (appRoot) void startApp({ root: appRoot });
}
