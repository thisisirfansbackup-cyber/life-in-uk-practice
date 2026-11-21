import { readFile, writeFile } from 'node:fs/promises';

const questions = JSON.parse(await readFile('data/questions.json', 'utf8'));
const rows = questions.map(question => {
  const source = question.sources[0];
  return `| ${question.sourceNumber} | ${question.id} | ${question.lessonNumbers.join(', ')} | ${question.verificationStatus} | ${source.title} | ${source.url} | ${source.checkedAt} |`;
});
const document = `# Per-item release audit

Generated from \`data/questions.json\` on 2026-11-21. One row per original source position.

| Source | Runtime ID | Lesson | Status | Primary source | URL | Checked |
|---:|---|---|---|---|---|---|
${rows.join('\n')}
`;
await writeFile('data/audits/per-item-coverage.md', document);
console.log(`Wrote ${questions.length} per-item audit rows.`);
