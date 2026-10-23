// npm run content:check: loads all content (examples included) and prints every problem. Exit 1 if any.
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadContent } from './load.mjs';
import { checkContent, checkWarnings } from './check.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const content = loadContent(root, { includeExamples: true });
// Each problem gets a one-line pointer to the rule it enforces and the doc to read (first matching hint).
const HINTS = [
  [/duplicate alias|alias bloat/, 'Rule: an alias belongs to one card. Read docs/CONTENT-FORMAT.md "Consistency rules".'],
  [/subsection vocabulary/, `Rule: a condition card's subsection is one of its system's names in content/systems.yaml. Read docs/CONTENT-FORMAT.md "Consistency rules".`],
  [/tags rule/, 'Rule: [!cannot-miss] and [!most-common] go only on causes in the Causes section. Read docs/CONTENT-FORMAT.md "Consistency rules".'],
  [/table width/, 'Rule: tables are at most four columns. Read docs/CONTENT-FORMAT.md "Consistency rules".'],
  [/out of order|not part of a|missing required section|At a Glance should/, 'Rule: sections appear in the type\'s fixed order, exact names. Read docs/CARD-TYPES.md Part 2.'],
  [/SCAFFOLD/, 'Rule: a scaffold from card:new cannot ship until every placeholder is replaced. Read docs/CARD-WRITING-CHEATSHEET.md.'],
  [/source/i, 'Rule: every content line ends ^[source-id] (ids in content/data/source/). Read docs/CARD-WRITING-CHEATSHEET.md "Lines and sources".'],
  [/dose|\bmg\b|unit/i, 'Rule: doses are only ever {{dose:id}} inserts, one per line, never typed. Read docs/DATA-TYPES.md.'],
  [/calculator|MDCalc|calc/i, 'Rule: every named score or calculator is {{calc:id}} with a verified MDCalc link. Read docs/DATA-TYPES.md "calc".'],
  [/pathway/i, 'Rule: pathways are standalone decision trees. Read docs/CONTENT-FORMAT.md "Pathways".'],
  [/definition|reviewed|front matter|subsection|system|title/i, 'Rule: front matter fields are required per type. Read docs/CONTENT-FORMAT.md.'],
];
const hint = (m) => HINTS.find(([re]) => re.test(m))?.[1];
const errors = checkContent(content).map((m) => { const h = hint(m); return h ? `${m}\n    ${h}` : m; });
const warnings = checkWarnings(content);
if (warnings.length) console.warn(`Content warnings (${warnings.length}, these do not fail the check):\n- ` + warnings.join('\n- ') + '\n');
if (errors.length) {
  console.error(`Content problems (${errors.length}):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`Content OK: ${content.cards.length} cards, ${Object.values(content.data).reduce((n, d) => n + Object.keys(d).length, 0)} data items.`);
