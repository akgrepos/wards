// npm run content:check: loads all content (examples included) and prints every problem. Exit 1 if any.
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadContent } from './load.mjs';
import { checkContent } from './check.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const content = loadContent(root, { includeExamples: true });
const errors = checkContent(content);
if (errors.length) {
  console.error(`Content problems (${errors.length}):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`Content OK: ${content.cards.length} cards, ${Object.values(content.data).reduce((n, d) => n + Object.keys(d).length, 0)} data items.`);
