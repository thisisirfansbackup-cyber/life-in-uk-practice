import { readdir, readFile } from 'node:fs/promises';

const files = (await readdir('data/prepared')).filter(file => file.endsWith('.json')).sort();
const questions = (await Promise.all(files.map(async file => JSON.parse(
  await readFile(`data/prepared/${file}`, 'utf8'),
)))).flat();
const numbers = new Set(questions.map(question => question.sourceNumber));
const missing = Array.from({ length: 407 }, (_, index) => index + 1)
  .filter(number => !numbers.has(number));
const byLesson = Object.fromEntries(Array.from({ length: 17 }, (_, index) => {
  const lesson = index + 1;
  return [lesson, questions.filter(question => question.lessonNumbers.includes(lesson)).length];
}));

console.log(`Prepared: ${questions.length}/407 questions in ${files.length} lesson files.`);
console.log(`Lessons complete: ${Object.entries(byLesson).filter(([, count]) => count > 0).map(([lesson, count]) => `L${lesson} (${count})`).join(', ') || 'none'}`);
if (missing.length) {
  console.log(`Next missing source numbers: ${missing.slice(0, 12).join(', ')}${missing.length > 12 ? '…' : ''}`);
  console.log('Release gate remains closed until every source number is prepared and verified.');
} else {
  console.log('All 407 source positions are prepared; run npm run build:bank and npm run check:bank:full.');
}
