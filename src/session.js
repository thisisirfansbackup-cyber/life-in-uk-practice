export function createSession(questionIds) {
  return {
    questionIds: [...questionIds],
    answers: {},
    checkedQuestionIds: [],
    currentIndex: 0,
    submitted: false,
  };
}

export function updateAnswer(session, questionId, selectedChoiceIds) {
  if (!session.questionIds.includes(questionId)
    || session.submitted
    || session.checkedQuestionIds?.includes(questionId)) return session;

  return {
    ...session,
    answers: {
      ...session.answers,
      [questionId]: [...new Set(selectedChoiceIds)],
    },
  };
}

export function checkCurrentAnswer(session, question) {
  const questionId = session.questionIds[session.currentIndex];
  if (!question || question.id !== questionId || session.submitted) {
    return { session, correct: null, error: 'This question cannot be checked right now.' };
  }

  const selectedChoiceIds = session.answers?.[questionId] ?? [];
  const requiredCount = question.answerType === 'select-two' ? 2 : 1;
  if (selectedChoiceIds.length !== requiredCount) {
    return {
      session,
      correct: null,
      error: `Select exactly ${requiredCount} ${requiredCount === 1 ? 'choice' : 'choices'} before checking.`,
    };
  }

  const selected = new Set(selectedChoiceIds);
  const correct = new Set(question.correctChoiceIds);
  const isCorrect = selected.size === correct.size && [...selected].every((choiceId) => correct.has(choiceId));
  if (session.checkedQuestionIds?.includes(questionId)) {
    return { session, correct: isCorrect, error: null };
  }

  return {
    session: {
      ...session,
      checkedQuestionIds: [...new Set([...(session.checkedQuestionIds ?? []), questionId])],
    },
    correct: isCorrect,
    error: null,
  };
}

export function moveToQuestion(session, index) {
  const lastIndex = Math.max(0, session.questionIds.length - 1);
  const target = Number.isFinite(index) ? Math.trunc(index) : session.currentIndex;
  const currentIndex = Math.min(lastIndex, Math.max(0, session.currentIndex));
  const boundedTarget = Math.min(lastIndex, Math.max(0, target));
  if (boundedTarget > currentIndex) {
    const currentQuestionId = session.questionIds[currentIndex];
    const isChecked = session.checkedQuestionIds?.includes(currentQuestionId);
    if (!isChecked) return { ...session, currentIndex };
    return { ...session, currentIndex: Math.min(currentIndex + 1, boundedTarget) };
  }

  return { ...session, currentIndex: boundedTarget };
}

export function scoreSession(session, questionMap) {
  const entries = session.questionIds.map((questionId) => {
    const question = questionMap instanceof Map ? questionMap.get(questionId) : questionMap[questionId];
    const selectedChoiceIds = [...(session.answers[questionId] ?? [])];
    const correctChoiceIds = [...(question?.correctChoiceIds ?? [])];
    const selected = new Set(selectedChoiceIds);
    const correct = new Set(correctChoiceIds);
    const isCorrect = Boolean(question)
      && selected.size === correct.size
      && [...selected].every((choiceId) => correct.has(choiceId));

    return { questionId, selectedChoiceIds, correctChoiceIds, correct: isCorrect };
  });
  const correctCount = entries.filter((entry) => entry.correct).length;

  return {
    total: entries.length,
    correctCount,
    scorePercentage: entries.length ? Math.round((correctCount / entries.length) * 100) : 0,
    entries,
  };
}

export function submitSession(session, questionMap) {
  const checkedQuestionIds = new Set(session.checkedQuestionIds ?? []);
  if (!session.questionIds.every((questionId) => checkedQuestionIds.has(questionId))) {
    return { ...session, submitted: false };
  }

  return {
    ...session,
    submitted: true,
    result: scoreSession(session, questionMap),
  };
}
