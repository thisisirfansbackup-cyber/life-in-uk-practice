import { loadQuestionBank } from './question-bank.js';
import { selectTestQuestions } from './revision.js';
import { createSession, moveToQuestion, submitSession, updateAnswer } from './session.js';
import { readProgress, recordCompletedTest, writeProgress } from './progress-store.js';
import { mountApp } from './ui.js';

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
      selectTestQuestions,
      createSession,
      updateAnswer,
      moveToQuestion,
      submitSession,
      progressStore: {
        read: () => readProgress(browserStorage),
        write: (progress) => writeProgress(browserStorage, progress),
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
