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
    moveToQuestion,
    submitSession,
    progressStore,
    now = () => new Date(),
  } = dependencies;
  const questionMap = new Map(questions.map((question) => [question.id, question]));
  let readResult;
  try {
    readResult = progressStore.read();
  } catch {
    readResult = { progress: emptyProgress(), status: 'unavailable' };
  }

  const state = {
    screen: 'home',
    progress: readResult?.progress ?? emptyProgress(),
    storageUnavailable: readResult?.status === 'unavailable',
    result: null,
    message: '',
  };
  let saveError = state.storageUnavailable ? 'Progress cannot be saved in this browser.' : '';

  const persist = (progress) => {
    state.progress = progress;
    let outcome;
    try {
      outcome = progressStore.write(progress);
    } catch (error) {
      outcome = { saved: false, error: error instanceof Error ? error.message : '' };
    }
    saveError = outcome?.saved ? '' : 'Your progress could not be saved in this browser.';
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
    const unseen = questions.filter((question) => !(state.progress.questions?.[question.id]?.attempts > 0)).length;
    const review = questions.filter((question) => {
      const item = state.progress.questions?.[question.id];
      return item && ((item.consecutiveIncorrect ?? 0) > 0 || (item.nextReviewAt && new Date(item.nextReviewAt) <= now()));
    }).length;
    const activeSession = state.progress.activeSession;
    return `
      <section class="home-view" aria-labelledby="home-title">
        <h1 id="home-title">Practice with purpose.</h1>
        <p class="intro">Build confidence one question at a time, with Roman Urdu support beneath each question.</p>
        <p class="format-note">50 questions per practice · The official test uses a different format.</p>
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

  const renderQuestion = () => {
    const session = state.progress.activeSession;
    const questionId = session.questionIds[session.currentIndex];
    const question = questionMap.get(questionId);
    if (!question) return renderHome();
    const selected = new Set(session.answers?.[questionId] ?? []);
    const inputType = question.answerType === 'select-two' ? 'checkbox' : 'radio';
    const number = session.currentIndex + 1;
    const lastQuestion = number === session.questionIds.length;
    return `
      <section class="test-view" aria-labelledby="question-heading">
        <div class="question-progress">
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
              <input type="${inputType}" name="answer" value="${escapeAttribute(choice.id)}" data-choice-id="${escapeAttribute(choice.id)}"${selected.has(choice.id) ? ' checked' : ''}>
              <span class="choice-label">${escapeHtml(choice.text)}</span>
            </label>`).join('')}
        </fieldset>
        <div class="question-actions">
          <button class="button button-secondary" type="button" data-action="previous"${number === 1 ? ' disabled' : ''}>Previous</button>
          ${lastQuestion
            ? '<button class="button button-primary" type="button" data-action="submit">Submit test</button>'
            : '<button class="button button-primary" type="button" data-action="next">Next question</button>'}
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
    const selected = selectTestQuestions(questions, state.progress, now(), 50);
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
    updateSaveWarning();
  };

  const onChange = (event) => {
    if (event.target.matches('input[name="answer"]')) saveAnswer();
  };

  const onClick = (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;

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
      render();
      focusHeading('#question-heading');
    }
    if (action === 'submit') {
      const submitted = submitSession(state.progress.activeSession, questionMap);
      const nextProgress = progressStore.recordCompletedTest(
        { ...state.progress, activeSession: null },
        submitted.result,
        now(),
      );
      persist(nextProgress);
      state.result = submitted.result;
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

  root.addEventListener('click', onClick);
  root.addEventListener('change', onChange);
  render();

  return {
    render,
    destroy() {
      root.removeEventListener('click', onClick);
      root.removeEventListener('change', onChange);
    },
  };
}
