import { readdir, readFile, writeFile } from 'node:fs/promises';

const seededRandom = (seed) => {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
};

export function shuffleChoices(question) {
  const random = seededRandom(question.sourceNumber * 7919 + 17);
  const choices = [...question.choices];
  for (let index = choices.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [choices[index], choices[other]] = [choices[other], choices[index]];
  }
  return { ...question, choices };
}

if (process.argv[1] && process.argv[1].endsWith('shuffle-choices.mjs')) {
  const files = (await readdir('data/prepared')).filter(file => file.endsWith('.json')).sort();
  for (const file of files) {
    const path = `data/prepared/${file}`;
    const questions = JSON.parse(await readFile(path, 'utf8'));
    await writeFile(path, `${JSON.stringify(questions.map(shuffleChoices), null, 2)}\n`);
  }
  console.log(`Shuffled choices in ${files.length} prepared lesson files.`);
}
