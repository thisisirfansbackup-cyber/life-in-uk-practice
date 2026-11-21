import { emptyProgressV2, migrateProgress, validHistory, validProgressV2, validSession } from './progress-validation.js';
import { getStudyBlocks } from './study-blocks.js';
import { submitSession } from './session.js';

// Legacy key name retained so version-1 progress can be found and migrated.
export const PROGRESS_STORAGE_KEY = 'lifeinuk-progress-v1';

const emptyProgress = () => ({ version: 1, questions: {}, activeSession: null });
const stableStringify = (value) => JSON.stringify(value, (key, item) => (
  item && typeof item === 'object' && !Array.isArray(item)
    ? Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right)))
    : item
));
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

export function readProgress(storage, context) {
  if (context) return readProgressV2(storage, context);
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

export function writeProgress(storage, progress, options) {
  if (progress?.version === 2) return writeProgressV2(storage, progress, options);
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

function readProgressV2(storage, context) {
  const fallback = status => ({ progress: emptyProgressV2(), status });
  let raw;
  try {
    raw = storage.getItem(PROGRESS_STORAGE_KEY);
  } catch {
    return fallback('unavailable');
  }
  if (raw === null) return { ...fallback('empty'), storageSnapshot: null };
  let stored;
  try {
    stored = JSON.parse(raw);
  } catch {
    return { ...fallback('corrupt'), storageSnapshot: raw };
  }
  if (stored?.version === 1) {
    if (!isProgress(stored) || !validHistory(stored.questions)) {
      return { ...fallback('corrupt'), storageSnapshot: raw };
    }
    return { ...migrateProgress(stored, context), status: 'migrated', storageSnapshot: raw };
  }
  if (stored?.version !== 2) return { ...fallback('incompatible'), storageSnapshot: raw };
  if (!validProgressV2(stored)) return { ...fallback('corrupt'), storageSnapshot: raw };
  if (stored.activeSession && !validSession(stored.activeSession, context.questions, context.blocks)) {
    return {
      progress: { ...stored, activeSession: null }, status: 'saved', storageSnapshot: raw,
      warning: 'Your unfinished test could not be restored safely. Your saved question history was retained.',
    };
  }
  return { progress: stored, status: 'saved', storageSnapshot: raw };
}

function writeProgressV2(storage, progress, options) {
  try {
    if (!options || !Object.hasOwn(options, 'expectedSerialized')
      || !(options.expectedSerialized === null || typeof options.expectedSerialized === 'string')) {
      throw new Error('A saved-progress snapshot is required.');
    }
    if (!validProgressV2(progress)) throw new Error('Progress is invalid.');
    const current = storage.getItem(PROGRESS_STORAGE_KEY);
    if (current !== options.expectedSerialized) throw new Error('Saved progress changed elsewhere. Reload before saving.');
    if (current !== null) {
      const previous = JSON.parse(current);
      if (previous?.version === 1) {
        if (!isProgress(previous) || !validHistory(previous.questions)) throw new Error('Saved progress cannot be safely replaced.');
        const backupKey = 'lifeinuk-progress-backup-v1';
        if (storage.getItem(backupKey) === null) storage.setItem(backupKey, current);
      } else if (!validProgressV2(previous)) throw new Error('Saved progress cannot be safely replaced.');
    }
    const serialized = JSON.stringify(progress);
    storage.setItem(PROGRESS_STORAGE_KEY, serialized);
    return { saved: true, error: null, storageSnapshot: serialized };
  } catch (error) {
    return { saved: false, error: error instanceof Error ? error.message : 'Progress could not be saved.' };
  }
}

export function recordCompletedSession(progress, session, questionMap, now = new Date()) {
  const fail = error => ({ progress, result: null, error });
  if (!validProgressV2(progress) || !session?.id) return fail('Invalid progress or session.');
  if (progress.completedSessionIds.includes(session.id)) return { progress, result: null, error: null };
  if (progress.activeSession?.id !== session.id
    || stableStringify(progress.activeSession) !== stableStringify(session)) return fail('This test is no longer active.');
  const questions = questionMap instanceof Map ? [...questionMap.values()] : Object.values(questionMap ?? {});
  let blocks = [];
  if (session.mode === 'study') {
    try { blocks = getStudyBlocks(questions); } catch { return fail('Study block content is incomplete.'); }
  }
  if (!validSession(session, questions, blocks)) return fail('This test could not be validated.');
  const submitted = submitSession(session, questionMap);
  if (!submitted.submitted) return fail('Check every question before finishing.');
  const updated = recordCompletedTest(progress, submitted.result, now);
  return {
    progress: {
      ...updated, version: 2, activeSession: null,
      completedSessionIds: [...progress.completedSessionIds, session.id],
      completedBlockIds: session.mode === 'study'
        ? [...new Set([...progress.completedBlockIds, session.blockId])] : [...progress.completedBlockIds],
    },
    result: submitted.result, error: null,
  };
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
