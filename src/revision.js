const timestamp = (value) => {
  const parsed = value == null ? NaN : new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const shuffle = (items, random) => {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }

  return result;
};

const shuffleMissesWithinRanks = (misses, random) => {
  const ranked = [...misses].sort((left, right) => {
    const leftProgress = left.progress;
    const rightProgress = right.progress;
    return (rightProgress.incorrectTotal ?? 0) - (leftProgress.incorrectTotal ?? 0)
      || timestamp(rightProgress.lastSeenAt) - timestamp(leftProgress.lastSeenAt);
  });
  const shuffled = [];

  for (let start = 0; start < ranked.length;) {
    const first = ranked[start].progress;
    let end = start + 1;
    while (end < ranked.length) {
      const next = ranked[end].progress;
      if ((next.incorrectTotal ?? 0) !== (first.incorrectTotal ?? 0)
        || timestamp(next.lastSeenAt) !== timestamp(first.lastSeenAt)) break;
      end += 1;
    }
    shuffled.push(...shuffle(ranked.slice(start, end), random));
    start = end;
  }

  return shuffled;
};

export function selectTestQuestions(questions, progress = {}, now = new Date(), size = 50, random = Math.random) {
  const progressById = progress?.questions ?? {};
  const unique = new Map();
  for (const question of questions ?? []) {
    if (!question?.id || !['verified', 'corrected'].includes(question.verificationStatus)) continue;
    if (!unique.has(question.id)) unique.set(question.id, question);
  }

  const eligible = [...unique.values()];
  if (eligible.length < size) {
    return {
      questionIds: [],
      error: `A ${size}-question test needs ${size} eligible questions; only ${eligible.length} are available.`,
    };
  }

  const currentTime = timestamp(now);
  const misses = [];
  const unseen = [];
  const due = [];
  const remaining = [];

  for (const question of eligible) {
    const questionProgress = progressById[question.id];
    if (!questionProgress || !(questionProgress.attempts > 0)) {
      unseen.push(question);
    } else if ((questionProgress.consecutiveIncorrect ?? 0) > 0) {
      misses.push({ ...question, progress: questionProgress });
    } else if (timestamp(questionProgress.nextReviewAt) <= currentTime) {
      due.push(question);
    } else {
      remaining.push(question);
    }
  }

  const ordered = [
    ...shuffleMissesWithinRanks(misses, random),
    ...shuffle(unseen, random),
    ...shuffle(due, random),
    ...shuffle(remaining, random),
  ];

  return { questionIds: ordered.slice(0, size).map((question) => question.id), error: null };
}
