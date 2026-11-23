const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const integer = value => Number.isInteger(value) && value >= 0;
const uniqueStrings = value => Array.isArray(value)
  && value.every(item => typeof item === 'string' && item.length > 0)
  && new Set(value).size === value.length;

export const emptyProgressV2 = () => ({
  version: 2, questions: {}, activeSession: null, completedTestCount: 0,
  completedBlockIds: [], completedSessionIds: [],
});

export function validHistory(history) {
  return object(history) && Object.values(history).every(record => object(record)
    && ['attempts', 'incorrectTotal', 'consecutiveIncorrect', 'correctStreak', 'nextReviewTest']
      .every(key => record[key] === undefined || integer(record[key])));
}

export function validProgressV2(progress) {
  return object(progress) && progress.version === 2 && validHistory(progress.questions)
    && integer(progress.completedTestCount)
    && uniqueStrings(progress.completedBlockIds)
    && progress.completedBlockIds.every(id => /^block-[1-8]$/.test(id))
    && uniqueStrings(progress.completedSessionIds)
    && (progress.activeSession === null || object(progress.activeSession));
}

export function validSession(session, questions, blocks = []) {
  if (!object(session) || typeof session.id !== 'string' || !session.id
    || !['study', 'revision', 'legacy'].includes(session.mode)
    || !uniqueStrings(session.questionIds) || session.questionIds.length === 0
    || !Number.isInteger(session.currentIndex) || session.currentIndex < 0
    || session.currentIndex >= session.questionIds.length
    || session.submitted !== false || !object(session.answers)
    || !uniqueStrings(session.checkedQuestionIds)) return false;
  const map = new Map(questions.map(question => [question.id, question]));
  const ids = new Set(session.questionIds);
  if (session.questionIds.some(id => !map.has(id))
    || session.checkedQuestionIds.some(id => !ids.has(id))) return false;
  if (session.mode === 'study') {
    const block = blocks.find(item => item.id === session.blockId);
    if (!block || JSON.stringify(block.questionIds) !== JSON.stringify(session.questionIds)) return false;
  } else if (session.blockId !== null) return false;
  if (session.mode === 'revision' && session.questionIds.length > 51) return false;
  if (session.questionRevisions !== undefined && (!object(session.questionRevisions)
    || session.questionIds.some(id => typeof session.questionRevisions[id] !== 'string'
      || !session.questionRevisions[id]))) return false;
  if (session.contentNotice !== undefined && typeof session.contentNotice !== 'string') return false;
  for (const [id, selected] of Object.entries(session.answers)) {
    const question = map.get(id);
    if (!ids.has(id) || !question || !uniqueStrings(selected)) return false;
    const allowed = new Set(question.choices.map(choice => choice.id));
    const required = question.answerType === 'select-two' ? 2 : 1;
    // Extra checkbox selections are a recoverable draft, never a checked answer.
    if ((question.answerType !== 'select-two' && selected.length > required)
      || selected.some(choice => !allowed.has(choice))) return false;
  }
  return session.checkedQuestionIds.every(id => (
    (session.answers[id]?.length ?? 0) === (map.get(id).answerType === 'select-two' ? 2 : 1)
  ));
}

export function migrateProgress(old, { questions, legacyQuestionMap, blocks }) {
  const mappings = new Map(legacyQuestionMap.mappings.map(entry => [entry.oldId, entry]));
  const mappedHistory = new Map();
  for (const [oldId, history] of Object.entries(old.questions)) {
    const newId = mappings.get(oldId)?.newId ?? oldId;
    if (mappedHistory.has(newId) || (newId !== oldId && Object.hasOwn(old.questions, newId))) {
      // Preserve both records without adding attempts to a guessed shared identity.
      mappedHistory.set(oldId, history);
    } else mappedHistory.set(newId, history);
  }
  const progress = {
    ...emptyProgressV2(), questions: Object.fromEntries(mappedHistory),
    completedTestCount: integer(old.completedTestCount) ? old.completedTestCount : 0,
  };
  let warning;
  if (old.activeSession) {
    const original = old.activeSession;
    try {
      const mapId = id => {
        const entry = mappings.get(id);
        if (!entry?.resumeSafe) throw new Error('Unsafe legacy question.');
        return entry.newId;
      };
      const answers = Object.fromEntries(Object.entries(original.answers ?? {}).map(([id, selected]) => [
        mapId(id), selected.map(choice => {
          const mapped = mappings.get(id)?.choiceIds[choice];
          if (!mapped) throw new Error('Unmapped answer choice.');
          return mapped;
        }),
      ]));
      const session = {
        ...original, id: original.id ?? 'legacy-active-session', mode: 'legacy', blockId: null,
        questionIds: original.questionIds.map(mapId), answers,
        checkedQuestionIds: (original.checkedQuestionIds ?? []).map(mapId),
      };
      if (!validSession(session, questions, blocks)) throw new Error('Invalid legacy session.');
      progress.activeSession = session;
    } catch {
      warning = 'Your unfinished test could not be restored safely. Your saved question history was retained.';
    }
  }
  return { progress, warning };
}
