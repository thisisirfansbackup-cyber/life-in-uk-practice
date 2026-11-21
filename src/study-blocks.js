export function getStudyBlocks(questions) {
  if (!Array.isArray(questions) || questions.length !== 407) {
    throw new Error('Study blocks require all 407 original questions.');
  }
  const ordered = [...questions].sort((left, right) => left.sourceNumber - right.sourceNumber);
  const ids = new Set(ordered.map(question => question.id));
  if (ids.size !== 407 || ordered.some((question, index) => question.sourceNumber !== index + 1
    || question.id !== `source-${String(index + 1).padStart(3, '0')}`)) {
    throw new Error('Study blocks require unique source identities numbered 1–407.');
  }
  return Array.from({ length: 8 }, (_, index) => {
    const start = index * 51 + 1;
    const end = Math.min(start + 50, 407);
    return {
      id: `block-${index + 1}`, number: index + 1, start, end,
      questionIds: ordered.slice(start - 1, end).map(question => question.id),
    };
  });
}

export function getNextStudyBlock(blocks, completedBlockIds = []) {
  const completed = new Set(completedBlockIds);
  return blocks.find(block => !completed.has(block.id)) ?? null;
}
