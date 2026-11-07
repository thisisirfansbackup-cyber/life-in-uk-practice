export function createSession(questionIds) {
  return {
    questionIds: [...questionIds],
    answers: {},
    currentIndex: 0,
    submitted: false,
  };
}

export function updateAnswer(session, questionId, selectedChoiceIds) {
  if (!session.questionIds.includes(questionId) || session.submitted) return session;

  return {
    ...session,
    answers: {
      ...session.answers,
      [questionId]: [...new Set(selectedChoiceIds)],
    },
  };
}

export function moveToQuestion(session, index) {
  const lastIndex = Math.max(0, session.questionIds.length - 1);
  const target = Number.isFinite(index) ? Math.trunc(index) : session.currentIndex;

  return { ...session, currentIndex: Math.min(lastIndex, Math.max(0, target)) };
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
  return {
    ...session,
    submitted: true,
    result: scoreSession(session, questionMap),
  };
}
