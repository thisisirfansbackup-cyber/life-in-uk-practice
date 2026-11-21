import { emptyProgressV2 } from './progress-validation.js';

const emptyProgress = () => ({ version: 1, questions: {}, activeSession: null });

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character]));

const escapeAttribute = escapeHtml;

export function mountApp(root, dependencies) {
  const {
    questions,
    selectTestQuestions,
    createSession,
    updateAnswer,
    checkCurrentAnswer,
    moveToQuestion,
    submitSession,
    progressStore,
    blocks,
    getNextStudyBlock,
    selectRevisionQuestions,
    now = () => new Date(),
  } = dependencies;
  const questionMap = new Map(questions.map((question) => [question.id, question]));
  let readResult;
  try {
    readResult = progressStore.read();
  } catch {
    readResult = { progress: blocks ? emptyProgressV2() : emptyProgress(), status: 'unavailable' };
  }

  const representedLessons = new Set(questions.flatMap((question) => question.lessonNumbers ?? []));
  const missingLessons = Array.from({ length: 17 }, (_, index) => index + 1)
    .filter((lessonNumber) => !representedLessons.has(lessonNumber));
  const formatList = (items) => items.length < 2
    ? String(items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;

  const state = {
    screen: 'home',
    progress: readResult?.progress ?? (blocks ? emptyProgressV2() : emptyProgress()),
    storageUnavailable: readResult?.status === 'unavailable',
    preserveExistingStorage: ['corrupt', 'incompatible'].includes(readResult?.status),
    result: null,
    message: readResult?.warning ?? '',
    storageSnapshot: readResult?.storageSnapshot,
    pendingStart: null,
    returnFocus: null,
  };
  let saveError = state.preserveExistingStorage
    ? 'Your saved progress could not be read. We will not overwrite it; new progress may not be saved.'
    : state.storageUnavailable ? 'Progress cannot be saved in this browser.' : '';

  const persist = (progress) => {
    state.progress = progress;
    if (state.preserveExistingStorage) return;
    let outcome;
    try {
      outcome = progressStore.write(progress, { expectedSerialized: state.storageSnapshot });
    } catch (error) {
      outcome = { saved: false, error: error instanceof Error ? error.message : '' };
    }
    saveError = outcome?.saved ? '' : 'Your progress could not be saved in this browser.';
    if (outcome?.saved) state.storageSnapshot = outcome.storageSnapshot;
    if (/changed elsewhere/i.test(outcome?.error ?? '')) {
      saveError = 'Your progress changed in another tab. Reload before saving more progress.';
      state.preserveExistingStorage = true;
    }
  };

  const warningText = () => saveError
    ? `${saveError} You can keep practicing, but it may not be here next time.`
    : '';
  const renderWarning = () => saveError
    ? `<p class="save-warning" role="status">${escapeHtml(warningText())}</p>`
    : '';
  const updateSaveWarning = () => {
    let warning = root.querySelector('.save-warning');
    if (!saveError) {
      warning?.remove();
      return;
    }
    if (!warning) {
      warning = root.ownerDocument.createElement('p');
      warning.className = 'save-warning';
      warning.setAttribute('role', 'status');
      root.querySelector('section')?.append(warning);
    }
    warning.textContent = warningText();
  };
  const focusHeading = (selector) => root.querySelector(selector)?.focus();

  const renderHome = () => {
    if (blocks) return renderBlockHome();
    const unseen = questions.filter((question) => !(state.progress.questions?.[question.id]?.attempts > 0)).length;
    const upcomingTestNumber = (state.progress.completedTestCount ?? 0) + 1;
    const review = questions.filter((question) => {
      const item = state.progress.questions?.[question.id];
      return item && ((item.consecutiveIncorrect ?? 0) > 0
        || !Number.isInteger(item.nextReviewTest)
        || item.nextReviewTest <= upcomingTestNumber);
    }).length;
    const activeSession = state.progress.activeSession;
    return `
      <section class="home-view" aria-labelledby="home-title">
        <h1 id="home-title">Practice with purpose.</h1>
        <p class="intro">Build confidence one question at a time, with Roman Urdu support beneath each question.</p>
        <p class="format-note">50 questions per practice · The official test uses a different format.</p>
        ${missingLessons.length ? `<p class="coverage-note">This question set does not yet include questions from Lessons ${formatList(missingLessons)}. Check those lessons as well.</p>` : ''}
        <div class="progress-summary" aria-label="Study progress">
          <p><strong>${unseen}</strong> <span>unseen</span></p>
          <p><strong>${review}</strong> <span>to review</span></p>
        </div>
        <div class="home-actions">
          ${activeSession ? '<button class="button button-secondary" type="button" data-action="resume">Resume unfinished test</button>' : ''}
          <button class="button button-primary" type="button" data-action="start">Start a 50-question test</button>
        </div>
        <p class="privacy-note">Your progress is saved only in this browser on this device. Clearing site data may remove it.</p>
        ${renderWarning()}
        ${state.message ? `<p class="inline-error" role="alert">${escapeHtml(state.message)}</p>` : ''}
      </section>`;
  };

  const renderBlockHome = () => {
    const completed = state.progress.completedBlockIds ?? [];
    const next = getNextStudyBlock(blocks, completed);
    const review = selectRevisionQuestions(questions, state.progress);
    const active = state.progress.activeSession;
    return `
      <section class="home-view" aria-labelledby="home-title">
        <h1 id="home-title" tabindex="-1">Practice with purpose.</h1>
        <p class="intro">Work through all 407 questions in order. Return to mistakes in separate revision rounds.</p>
        <p class="format-note">Seven blocks of 51 questions, then one of 50 · Independent practice, not the official test format.</p>
        <p class="block-coverage">${completed.length} of 8 blocks completed. Coverage is not the same as mastery.</p>
        <div class="home-actions">
          ${active ? '<button class="button button-primary" type="button" data-action="resume">Resume unfinished test</button>' : ''}
          ${next ? `<button class="button ${active ? 'button-secondary' : 'button-primary'}" type="button" data-action="next-block">Continue with Block ${next.number}</button>` : '<p>You have worked through all 407 questions. Keep revising the ones you missed.</p>'}
        </div>
        <ol class="study-blocks" aria-label="Study blocks">
          ${blocks.map(block => `<li>
            <button class="block-choice" type="button" data-action="study-block" data-block-id="${escapeAttribute(block.id)}">
              <strong>Block ${block.number}</strong>
              <span>Questions ${block.start}–${block.end}</span>
              <span class="block-state">${completed.includes(block.id) ? 'Completed · Practice again' : active?.blockId === block.id ? 'In progress' : 'Not completed'}</span>
            </button>
          </li>`).join('')}
        </ol>
        <section class="revision-section" aria-labelledby="revision-heading">
          <h2 id="revision-heading">Revisit what needs practice</h2>
          <p>Mistakes and due reviews stay separate from your study blocks.</p>
          <button class="button button-secondary" type="button" data-action="revision">Start revision${review.questionIds.length ? ` · ${review.questionIds.length} ${review.questionIds.length === 1 ? 'question' : 'questions'}` : ''}</button>
        </section>
        <p class="privacy-note">Your progress is saved only in this browser on this device. Clearing site data may remove it.</p>
        ${renderWarning()}
        ${state.message ? `<p class="inline-error" role="status">${escapeHtml(state.message)}</p>` : ''}
        ${state.pendingStart ? `<div class="replacement-overlay"><div class="replace-confirmation" role="alertdialog" aria-modal="true" aria-labelledby="replace-title" aria-describedby="replace-description">
          <h2 id="replace-title">Replace your unfinished test?</h2>
          <p id="replace-description">Starting this practice will replace your unfinished answers. Your completed history will stay saved.</p>
          <div class="home-actions">
            <button class="button button-secondary" type="button" data-action="cancel-replace">Keep unfinished test</button>
            <button class="button button-primary" type="button" data-action="confirm-replace">Replace and start</button>
          </div>
        </div></div>` : ''}
      </section>`;
  };

  const renderQuestion = () => {
    const session = state.progress.activeSession;
    const questionId = session.questionIds[session.currentIndex];
    const question = questionMap.get(questionId);
    if (!question) return renderHome();
    const selected = new Set(session.answers?.[questionId] ?? []);
    const checked = session.checkedQuestionIds?.includes(questionId) ?? false;
    const requiredCount = question.answerType === 'select-two' ? 2 : 1;
    const canCheck = selected.size === requiredCount && !checked;
    const inputType = question.answerType === 'select-two' ? 'checkbox' : 'radio';
    const number = session.currentIndex + 1;
    const lastQuestion = number === session.questionIds.length;
    return `
      <section class="test-view" aria-labelledby="question-heading">
        <div class="question-progress">
          ${blocks ? `<p class="practice-mode">${session.mode === 'study' ? `Block ${escapeHtml(session.blockId?.split('-')[1])}` : session.mode === 'revision' ? 'Revision round' : 'Earlier unfinished test'}</p>` : ''}
          <p class="question-count">Question ${number} of ${session.questionIds.length}</p>
          <progress value="${number}" max="${session.questionIds.length}" aria-label="Test progress"></progress>
        </div>
        <h1 id="question-heading" class="question-prompt" tabindex="-1">${escapeHtml(question.question)}</h1>
        <p class="question-translation" lang="ur-Latn" dir="ltr">${escapeHtml(question.romanUrdu)}</p>
        <p class="answer-instruction">${question.answerType === 'select-two' ? 'Select two answers.' : 'Select one answer.'}</p>
        <fieldset class="answer-list" aria-labelledby="question-heading">
          <legend class="visually-hidden">${escapeHtml(question.question)}</legend>
          ${question.choices.map((choice) => `
            <label class="answer-option${selected.has(choice.id) ? ' is-selected' : ''}">
              <input type="${inputType}" name="answer" value="${escapeAttribute(choice.id)}" data-choice-id="${escapeAttribute(choice.id)}"${selected.has(choice.id) ? ' checked' : ''}${checked ? ' disabled' : ''}>
              <span class="choice-label">${escapeHtml(choice.text)}</span>
            </label>`).join('')}
        </fieldset>
        ${checked ? (() => {
          const checkedResult = checkCurrentAnswer(session, question);
          const correctChoices = question.choices.filter((choice) => question.correctChoiceIds.includes(choice.id));
          return `<div class="answer-feedback ${checkedResult.correct ? 'is-correct' : 'is-incorrect'}" role="status" aria-live="polite" tabindex="-1">
            <p class="feedback-status">${checkedResult.correct ? 'Correct — well done.' : 'Incorrect — the correct answer is:'}</p>
            ${checkedResult.correct ? '' : `<ul>${correctChoices.map((choice) => `<li>${escapeHtml(choice.text)}</li>`).join('')}</ul>${question.explanation ? `<p>${escapeHtml(question.explanation)}</p>` : ''}`}
          </div>`;
        })() : ''}
        ${state.questionError ? `<p class="inline-error" role="alert">${escapeHtml(state.questionError)}</p>` : ''}
        <div class="question-actions">
          <button class="button button-secondary" type="button" data-action="previous"${number === 1 ? ' disabled' : ''}>Previous</button>
          ${lastQuestion
            ? `<button class="button button-primary" type="button" data-action="submit"${checked ? '' : ' disabled'}>See results</button>`
            : `<button class="button button-primary" type="button" data-action="next"${checked ? '' : ' disabled'}>Next question</button>`}
          ${checked ? '' : `<button class="button button-secondary" type="button" data-action="check"${canCheck ? '' : ' disabled'}>Check answer</button>`}
        </div>
        ${renderWarning()}
      </section>`;
  };

  const renderResults = () => {
    const result = state.result;
    if (!result) return renderHome();
    return `
      <section class="results-view" aria-labelledby="results-title">
        <h1 id="results-title" tabindex="-1">Your result</h1>
        <p class="score-line"><strong>${result.correctCount} / ${result.total}</strong><span>${result.scorePercentage}% correct</span></p>
        <p class="result-intro">Review your answers below. You can practice again whenever you’re ready.</p>
        <ol class="review-list">
          ${result.entries.map((entry, index) => {
            const question = questionMap.get(entry.questionId);
            const selected = new Set(entry.selectedChoiceIds);
            const correct = new Set(entry.correctChoiceIds);
            return `<li class="review-item">
              <h2>${index + 1}. ${escapeHtml(question.question)}</h2>
              <p class="question-translation" lang="ur-Latn" dir="ltr">${escapeHtml(question.romanUrdu)}</p>
              <p class="review-status ${entry.correct ? 'is-correct' : 'is-incorrect'}">${entry.correct ? 'Correct' : 'Review this answer'}</p>
              <ul class="review-choices">${question.choices.map((choice) => {
                const labels = [];
                if (selected.has(choice.id)) labels.push('Your answer');
                if (correct.has(choice.id)) labels.push('Correct answer');
                return `<li>${escapeHtml(choice.text)}${labels.length ? ` <span>${escapeHtml(labels.join(' · '))}</span>` : ''}</li>`;
              }).join('')}</ul>
              ${question.explanation ? `<p class="explanation">${escapeHtml(question.explanation)}</p>` : ''}
            </li>`;
          }).join('')}
        </ol>
        <button class="button button-primary" type="button" data-action="home">Back to study home</button>
        ${renderWarning()}
      </section>`;
  };

  const render = () => {
    if (state.screen === 'test') root.innerHTML = renderQuestion();
    else if (state.screen === 'results') root.innerHTML = renderResults();
    else root.innerHTML = renderHome();
  };

  const startTest = () => {
    const selected = selectTestQuestions(questions, state.progress, 50);
    if (selected.error) {
      state.message = selected.error;
      render();
      return;
    }
    state.progress = { ...state.progress, activeSession: createSession(selected.questionIds) };
    persist(state.progress);
    state.message = '';
    state.screen = 'test';
    render();
    focusHeading('#question-heading');
  };

  const beginPractice = (request) => {
    state.pendingStart = null;
    persist({ ...state.progress, activeSession: createSession(request.questionIds, request) });
    state.message = '';
    state.screen = 'test';
    render();
    focusHeading('#question-heading');
  };

  const requestPractice = (request, returnFocus) => {
    if (state.progress.activeSession) {
      state.pendingStart = request;
      state.returnFocus = returnFocus;
      render();
      root.querySelector('[data-action="cancel-replace"]')?.focus();
    } else beginPractice(request);
  };

  const cancelReplacement = () => {
    state.pendingStart = null;
    render();
    root.querySelector(state.returnFocus)?.focus();
  };

  const saveAnswer = () => {
    const session = state.progress.activeSession;
    const questionId = session.questionIds[session.currentIndex];
    const selectedChoiceIds = [...root.querySelectorAll('input[name="answer"]:checked')].map((input) => input.value);
    const updatedSession = updateAnswer(session, questionId, selectedChoiceIds);
    persist({ ...state.progress, activeSession: updatedSession });
    const selected = new Set(updatedSession.answers?.[questionId] ?? []);
    for (const option of root.querySelectorAll('.answer-option')) {
      option.classList.toggle('is-selected', selected.has(option.querySelector('input')?.value));
    }
    const question = questionMap.get(questionId);
    const requiredCount = question.answerType === 'select-two' ? 2 : 1;
    const checkButton = root.querySelector('[data-action="check"]');
    if (checkButton) checkButton.disabled = selected.size !== requiredCount;
    updateSaveWarning();
  };

  const onChange = (event) => {
    if (event.target.matches('input[name="answer"]')) {
      state.questionError = '';
      saveAnswer();
    }
  };

  const onClick = (event) => {
    const control = event.target.closest('[data-action]');
    const action = control?.dataset.action;
    if (!action) return;
    if (state.pendingStart && !['confirm-replace', 'cancel-replace'].includes(action)) return;

    if (action === 'cancel-replace') { cancelReplacement(); return; }
    if (action === 'confirm-replace') {
      if (state.pendingStart) beginPractice(state.pendingStart);
      return;
    }
    if (blocks && (action === 'study-block' || action === 'next-block')) {
      const block = action === 'next-block'
        ? getNextStudyBlock(blocks, state.progress.completedBlockIds ?? [])
        : blocks.find(item => item.id === control.dataset.blockId);
      if (block) requestPractice({ questionIds: block.questionIds, mode: 'study', blockId: block.id },
        action === 'next-block' ? '[data-action="next-block"]' : `[data-block-id="${block.id}"]`);
      return;
    }
    if (blocks && action === 'revision') {
      const selected = selectRevisionQuestions(questions, state.progress);
      if (!selected.questionIds.length || selected.error) {
        state.message = selected.error ?? 'There is nothing to revise right now. Continue with your study blocks.';
        render();
        root.querySelector('[data-action="revision"]')?.focus();
      } else requestPractice({ questionIds: selected.questionIds, mode: 'revision' }, '[data-action="revision"]');
      return;
    }

    if (action === 'start') startTest();
    if (action === 'resume' && state.progress.activeSession) {
      state.screen = 'test';
      state.message = '';
      render();
      focusHeading('#question-heading');
    }
    if (action === 'previous' || action === 'next') {
      const offset = action === 'previous' ? -1 : 1;
      const session = moveToQuestion(state.progress.activeSession, state.progress.activeSession.currentIndex + offset);
      persist({ ...state.progress, activeSession: session });
      state.questionError = '';
      render();
      focusHeading('#question-heading');
    }
    if (action === 'check') {
      const session = state.progress.activeSession;
      const questionId = session.questionIds[session.currentIndex];
      const checked = checkCurrentAnswer(session, questionMap.get(questionId));
      state.questionError = checked.error ?? '';
      if (checked.error) {
        render();
        root.querySelector('[data-action="check"]')?.focus();
      } else {
        persist({ ...state.progress, activeSession: checked.session });
        render();
        root.querySelector('.answer-feedback')?.focus();
      }
    }
    if (action === 'submit') {
      if (!state.progress.activeSession) return;
      if (blocks) {
        const outcome = progressStore.recordCompletedSession(
          state.progress, state.progress.activeSession, questionMap, now(),
        );
        if (outcome.error || !outcome.result) {
          state.questionError = outcome.error ?? '';
          render();
          return;
        }
        persist(outcome.progress);
        state.result = outcome.result;
        state.questionError = '';
        state.screen = 'results';
        render();
        focusHeading('#results-title');
        return;
      }
      const submitted = submitSession(state.progress.activeSession, questionMap);
      if (!submitted.submitted) return;
      const nextProgress = progressStore.recordCompletedTest(
        { ...state.progress, activeSession: null },
        submitted.result,
        now(),
      );
      persist(nextProgress);
      state.result = submitted.result;
      state.questionError = '';
      state.screen = 'results';
      render();
      focusHeading('#results-title');
    }
    if (action === 'home') {
      state.screen = 'home';
      state.result = null;
      state.message = '';
      render();
      focusHeading('#home-title');
    }
  };

  const onKeyDown = event => {
    if (!state.pendingStart) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelReplacement();
    } else if (event.key === 'Tab') {
      const buttons = [...root.querySelectorAll('.replace-confirmation button')];
      const first = buttons[0];
      const last = buttons.at(-1);
      if (event.shiftKey && root.ownerDocument.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && root.ownerDocument.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  };

  root.addEventListener('click', onClick);
  root.addEventListener('change', onChange);
  root.addEventListener('keydown', onKeyDown);
  render();

  return {
    render,
    destroy() {
      root.removeEventListener('click', onClick);
      root.removeEventListener('change', onChange);
      root.removeEventListener('keydown', onKeyDown);
    },
  };
}
