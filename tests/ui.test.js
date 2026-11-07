import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const pagePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
const html = existsSync(pagePath) ? readFileSync(pagePath, 'utf8') : '';

test('page shell has a named, non-official main practice area', () => {
  assert.match(html, /<main\b[^>]*\bid=["']app["']/i);
  assert.match(html, /<meta\s+name=["']viewport["']/i);
  assert.match(html, /<title>[^<]*(practice|study)[^<]*<\/title>/i);
  assert.doesNotMatch(html, /<title>[^<]*(official|government)[^<]*<\/title>/i);
});
