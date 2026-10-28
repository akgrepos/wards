// npm run content:check: loads all content (examples included) and prints every problem. Exit 1 if any.
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadContent } from './load.mjs';
import { checkContent, checkWarnings, wantedCards } from './check.mjs';
import { checkFingerprints } from './checked.mjs';
import { ruleFindings, ruleSummary, RULES } from './rules.mjs';
import { proseFindings, proseSummary, PROSE_RULES } from './prose.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const content = loadContent(root, { includeExamples: true, tag: false });
// Each problem gets a one-line pointer to the rule it enforces and the doc to read (first matching hint).
const HINTS = [
  [/bullet rule|parallel rule/, 'Rule: a bullet is one idea, at most two sentences and about 160 characters; parallel items share one shape. Read docs/CARD-WRITING-CHEATSHEET.md "Writing style".'],
  [/table rule/, 'Rule: a table has at most 3 columns and short cells; a wider comparison is a :::compare block. Read docs/CARD-WRITING-CHEATSHEET.md "Writing style".'],
  [/scale rule/, 'Rule: a severity ladder or risk-level table is a :::scale block. Read docs/CARD-WRITING-CHEATSHEET.md "Writing style".'],
  [/names rule|title rule|related rule|alias rule/, 'Rule: no society, guideline or study names in card text; titles up to 32 characters; related cards link both ways; aliases are words, not bare numbers. Read docs/CARD-WRITING-CHEATSHEET.md "Writing style".'],
  [/duplicate alias|alias bloat/, 'Rule: an alias belongs to one card. Read docs/CARD-WRITING-CHEATSHEET.md "Consistency rules".'],
  [/subsection vocabulary/, `Rule: a condition card's subsection is one of its system's names in content/systems.yaml. Read docs/CARD-WRITING-CHEATSHEET.md "Consistency rules".`],
  [/abbreviation rule/, 'Rule: no ISMP "do not use" abbreviations (U for units, IU, QD, QOD, trailing zero, missing leading zero, µg, MS, MSO4, MgSO4, D/C, DC, HS). Read docs/CARD-WRITING-CHEATSHEET.md "Abbreviations".'],
  [/semicolon rule/, 'Rule: no semicolons in card text; a list becomes bullets, a clause join becomes two sentences. Read docs/CARD-WRITING-CHEATSHEET.md "No semicolons".'],
  [/tags rule/, 'Rule: [!cannot-miss] and [!most-common] go only on causes in the Causes section. Read docs/CARD-WRITING-CHEATSHEET.md "Consistency rules".'],
  [/table width/, 'Rule: tables are at most four columns. Read docs/CARD-WRITING-CHEATSHEET.md "Consistency rules".'],
  [/out of order|not part of a|missing required section|At a Glance should/, 'Rule: sections appear in the type\'s fixed order, exact names. Read docs/CARD-TYPES.md Part 2.'],
  [/SCAFFOLD/, 'Rule: a scaffold from card:new cannot ship until every placeholder is replaced. Read docs/CARD-WRITING-CHEATSHEET.md.'],
  [/source/i, 'Rule: every content line ends ^[source-id] (ids in content/data/source/). Read docs/CARD-WRITING-CHEATSHEET.md "Lines and sources".'],
  [/dose|\bmg\b|unit/i, 'Rule: doses are only ever {{dose:id}} inserts, one per line, never typed. Read docs/DATA-TYPES.md.'],
  [/calculator|MDCalc|calc/i, 'Rule: every named score or calculator is {{calc:id}} with a verified MDCalc link. Read docs/DATA-TYPES.md "calc".'],
  [/pathway/i, 'Rule: pathways are standalone decision trees. Read docs/CARD-WRITING-CHEATSHEET.md "Pathways".'],
  [/definition|checked|front matter|subsection|system|title/i, 'Rule: front matter fields are required per type. Read docs/CARD-WRITING-CHEATSHEET.md.'],
];
const hint = (m) => HINTS.find(([re]) => re.test(m))?.[1];
const errors = checkContent(content).map((m) => { const h = hint(m); return h ? `${m}\n    ${h}` : m; });
// Fingerprints need every reference to resolve, so they are checked only once the rest passes.
if (!errors.length) errors.push(...checkFingerprints(content));
const allWarnings = checkWarnings(content);
// The prose style rules fire on most existing cards, so the default output is one count per rule; --prose lists every place.
const PROSE_WARNING = new RegExp(`: (?:${Object.values(PROSE_RULES).join('|')}),`);
const warnings = process.argv.includes('--prose') ? allWarnings : allWarnings.filter((m) => !PROSE_WARNING.test(m));
const proseWarn = proseSummary(proseFindings(content)).filter((r) => r.severity === 'warn' && r.cards);
if (!process.argv.includes('--prose') && proseWarn.length) console.warn('Prose warnings (these do not fail the check; npm run content:check -- --prose lists each place):\n' + proseWarn.map((r) => `- ${PROSE_RULES[r.rule].padEnd(24)} ${String(r.cards).padStart(2)} cards, ${r.places} places`).join('\n') + '\n');
if (warnings.length) console.warn(`Content warnings (${warnings.length}, these do not fail the check):\n- ` + warnings.join('\n- ') + '\n');
const wanted = wantedCards(content.cards);
if (wanted.length) console.warn(`Wanted cards (linked from other cards, not written yet; a link to one shows as plain words until it exists):\n` + wanted.map(([id, n]) => `- ${id.padEnd(40)} linked from ${n} card${n === 1 ? '' : 's'}`).join('\n') + '\n');
// How many existing cards each format rule flags: the to-do list for the sweep. Cards in unchecked.txt get errors instead.
const summary = ruleSummary(ruleFindings(content)).filter((r) => r.cards);
if (summary.length) console.warn('Format rules, existing cards flagged until the sweep:\n' + summary.map((r) => `- ${RULES[r.rule].padEnd(14)} ${String(r.cards).padStart(2)} cards, ${r.places} places`).join('\n') + '\n');
if (errors.length) {
  console.error(`Content problems (${errors.length}):\n- ` + errors.join('\n- '));
  process.exit(1);
}
const examples = content.cards.filter((c) => c.example).length;
console.log(`Content OK: ${content.cards.length - examples} cards${examples ? ` (+${examples} example)` : ''}, ${Object.values(content.data).reduce((n, d) => n + Object.keys(d).length, 0)} data items.`);
