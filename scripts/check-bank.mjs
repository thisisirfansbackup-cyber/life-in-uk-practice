import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { loadQuestionBank, validateFullCollection } from '../src/question-bank.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

try {
  const raw = await readFile(path.join(root, 'data/questions.json'), 'utf8');
  const { questions, errors } = loadQuestionBank(JSON.parse(raw));
  if (process.argv.includes('--full')) {
    const inventory = JSON.parse(await readFile(path.join(root, 'data/source-questions.json'), 'utf8'));
    errors.push(...validateFullCollection(JSON.parse(raw), inventory));
  }
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Question bank is valid (${questions.length} questions).`);
  }
} catch (error) {
  console.error(`Could not validate question bank: ${error.message}`);
  process.exitCode = 1;
}
