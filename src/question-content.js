// Evidence and display order may change without changing what an answer means.
export async function getQuestionRevisions(questions) {
  const encoder = new TextEncoder();
  return Object.fromEntries(await Promise.all(questions.map(async question => {
    const content = JSON.stringify([
      question.question, question.romanUrdu, question.answerType,
      question.choices.map(choice => [choice.id, choice.text])
        .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0),
      [...question.correctChoiceIds].sort(),
    ]);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(content));
    const revision = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    return [question.id, revision];
  })));
}

export function refreshSessionContent(session, revisions, legacyRevisions) {
  if (!session || !Array.isArray(session.questionIds) || !Array.isArray(session.checkedQuestionIds)
    || !session.questionIds.every(id => typeof id === 'string')
    || !session.checkedQuestionIds.every(id => typeof id === 'string')
    || !Number.isInteger(session.currentIndex)
    || !session.answers || typeof session.answers !== 'object' || Array.isArray(session.answers)) {
    return { session };
  }
  const previous = session.questionRevisions ?? legacyRevisions;
  if (!previous || typeof previous !== 'object' || Array.isArray(previous)) return { session };
  const changed = session.questionIds.filter(id => previous[id] !== revisions[id]
    && (Object.hasOwn(session.answers, id) || session.checkedQuestionIds.includes(id)));
  const changedIds = new Set(changed);
  const warning = changed.length
    ? 'Some questions were updated. Your other answers are kept; please answer the updated questions again.'
    : undefined;
  return {
    session: {
      ...session,
      questionRevisions: Object.fromEntries(session.questionIds.map(id => [id, revisions[id]])),
      ...(changed.length ? {
        answers: Object.fromEntries(Object.entries(session.answers).filter(([id]) => !changedIds.has(id))),
        checkedQuestionIds: session.checkedQuestionIds.filter(id => !changedIds.has(id)),
        currentIndex: Math.min(session.currentIndex, ...changed.map(id => session.questionIds.indexOf(id))),
        contentNotice: warning,
      } : {}),
    },
    warning,
  };
}
