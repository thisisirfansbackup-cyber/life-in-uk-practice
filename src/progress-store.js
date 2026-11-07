export const PROGRESS_STORAGE_KEY = 'lifeinuk-progress-v1';

const emptyProgress = () => ({ version: 1, questions: {}, activeSession: null });
const REVIEW_TEST_MILESTONES = [1, 3, 7, 14, 30];

const nextReviewTestAfter = (testNumber) => REVIEW_TEST_MILESTONES.find((milestone) => milestone > testNumber)
  ?? testNumber + 30;

const asIsoString = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new TypeError('A valid date is required.');
  return date.toISOString();
};

const isProgress = (value) => value
  && typeof value === 'object'
  && !Array.isArray(value)
  && value.version === 1
  && value.questions
  && typeof value.questions === 'object'
  && !Array.isArray(value.questions)
  && (value.activeSession === null || typeof value.activeSession === 'object');

export function readProgress(storage) {
  if (!storage || typeof storage.getItem !== 'function') {
    return { progress: emptyProgress(), status: 'unavailable' };
  }

  let serialized;
  try {
    serialized = storage.getItem(PROGRESS_STORAGE_KEY);
  } catch {
    return { progress: emptyProgress(), status: 'unavailable' };
  }

  if (serialized == null) return { progress: emptyProgress(), status: 'empty' };

  let progress;
  try {
    progress = JSON.parse(serialized);
  } catch {
    return { progress: emptyProgress(), status: 'corrupt' };
  }

  if (progress?.version !== 1) return { progress: emptyProgress(), status: 'incompatible' };
  if (!isProgress(progress)) return { progress: emptyProgress(), status: 'corrupt' };

  return { progress, status: 'saved' };
}

export function writeProgress(storage, progress) {
  if (!storage || typeof storage.setItem !== 'function') {
    return { saved: false, error: 'Browser storage is unavailable.' };
  }

  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    return { saved: true, error: null };
  } catch (error) {
    return { saved: false, error: error instanceof Error ? error.message : 'Progress could not be saved.' };
  }
}

export function recordCompletedTest(progress, result, now = new Date()) {
  const lastSeenAt = asIsoString(now);
  const updated = {
    ...emptyProgress(),
    ...progress,
    questions: { ...(progress?.questions ?? {}) },
  };
  const completedTestCount = (updated.completedTestCount ?? 0) + 1;
  updated.completedTestCount = completedTestCount;

  for (const entry of result?.entries ?? []) {
    if (!entry?.questionId) continue;
    const previous = updated.questions[entry.questionId] ?? {};
    const attempts = (previous.attempts ?? 0) + 1;
    const incorrectTotal = (previous.incorrectTotal ?? 0) + (entry.correct ? 0 : 1);
    const consecutiveIncorrect = entry.correct ? 0 : (previous.consecutiveIncorrect ?? 0) + 1;
    const correctStreak = entry.correct ? (previous.correctStreak ?? 0) + 1 : 0;
    const nextReviewTest = entry.correct
      ? (Number.isInteger(previous.nextReviewTest) && previous.nextReviewTest > completedTestCount
        ? previous.nextReviewTest
        : nextReviewTestAfter(completedTestCount))
      : completedTestCount + 1;

    updated.questions[entry.questionId] = {
      attempts,
      incorrectTotal,
      consecutiveIncorrect,
      correctStreak,
      lastSeenAt,
      nextReviewTest,
    };
  }

  return updated;
}
