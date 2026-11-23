import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export function assemblePreparedBank(lessons) {
  const questions = lessons.flat().sort((left, right) => left.sourceNumber - right.sourceNumber);
  if (questions.length !== 407) {
    throw new Error(`Prepared content has ${questions.length} of 407 questions; refusing to assemble a partial bank.`);
  }
  questions.forEach((question, index) => {
    if (question.sourceNumber !== index + 1) {
      throw new Error(`Missing or duplicate source number at position ${index + 1}.`);
    }
  });
  return questions;
}

if (process.argv[1] && process.argv[1].endsWith('assemble-bank.mjs')) {
  try {
    const directory = 'data/prepared';
    const files = (await readdir(directory)).filter(file => file.endsWith('.json')).sort();
    const lessons = await Promise.all(files.map(async file => JSON.parse(
      await readFile(path.join(directory, file), 'utf8'),
    )));
    const questions = assemblePreparedBank(lessons);
    await writeFile('data/questions.json', `${JSON.stringify(questions, null, 2)}\n`);
    console.log(`Assembled ${questions.length} prepared questions from ${files.length} lessons.`);
  } catch (error) {
    console.error(`Could not assemble question bank: ${error.message}`);
    process.exitCode = 1;
  }
}
