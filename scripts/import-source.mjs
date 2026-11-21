import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function extractSourceQuestions(html) {
  const match = typeof html === 'string'
    && html.match(/\bconst CARDS = CARDS_DATA = (\[[\s\S]*?\]);\s*function esc\s*\(/);
  if (!match) throw new Error('Source question assignment was not found.');
  const records = JSON.parse(match[1]);
  if (!Array.isArray(records) || records.length !== 407) {
    throw new Error('Source collection must contain 407 questions.');
  }
  for (const [index, record] of records.entries()) {
    if (!record || record.n !== index + 1
      || !/^L(?:[1-9]|1[0-7])$/.test(record.lesson)
      || typeof record.q !== 'string' || !record.q.trim()
      || typeof record.orig !== 'string' || !record.orig.trim()
      || !Array.isArray(record.opt) || record.opt.length !== 4
      || record.opt.some(choice => typeof choice !== 'string' || !choice.trim())
      || !Number.isInteger(record.a) || record.a < 0 || record.a > 3) {
      throw new Error(`Invalid source question at position ${index + 1}.`);
    }
  }
  return records;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [, , input, output] = process.argv;
    if (!input || !output) throw new Error('Usage: import-source.mjs <source.html> <output.json>');
    const records = extractSourceQuestions(await readFile(input, 'utf8'));
    await writeFile(output, `${JSON.stringify(records, null, 2)}\n`);
    console.log(`Preserved ${records.length} source questions.`);
  } catch (error) {
    console.error(`Could not import source: ${error.message}`);
    process.exitCode = 1;
  }
}
