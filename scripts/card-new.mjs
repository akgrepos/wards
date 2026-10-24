// npm run card:new -- <type> <system> <id> "<title>" [--variant <name>]
// Writes content/cards/<system>/<id>.md with the type's sections. Every placeholder says "SCAFFOLD:",
// and npm run content:check rejects any card still containing one, so an unfinished scaffold cannot ship.
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { CARD_TYPES } from './content/schema.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const vi = args.indexOf('--variant');
const variant = vi >= 0 ? args.splice(vi, 2)[1] : null;
const [type, system, id, title] = args;
const die = (m) => { console.error(m); process.exit(1); };
if (!title) die('Usage: npm run card:new -- <type> <system> <id> "<title>" [--variant <name>]');
const def = CARD_TYPES[type];
if (!def) die(`Unknown type "${type}". Types: ${Object.keys(CARD_TYPES).join(', ')}`);
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) die('The id must be lowercase words joined by hyphens.');
const systems = YAML.parse(readFileSync(join(root, 'content/systems.yaml'), 'utf8'));
if (!systems.some((s) => s.id === system)) die(`Unknown system "${system}". Systems: ${systems.map((s) => s.id).join(', ')}`);
if (variant && !def.variants?.[variant]) die(`Unknown ${type} variant "${variant}". Variants: ${Object.keys(def.variants ?? {}).join(', ') || 'none'}`);

const keys = variant ? new Set(def.variants[variant]) : null;
const sections = def.sections.filter((s) => s.key === 'pearls' || (keys ? keys.has(s.key) : s.key !== 'more'));
const out = [`---`, `id: ${id}`, `type: ${type}`, ...(variant ? [`variant: ${variant}`] : []), `system: ${system}`];
if (type === 'condition') out.push('subsection: "SCAFFOLD: subsection name"');
out.push(`title: ${JSON.stringify(title)}`, 'aliases: []');
if (def.topic) out.push('definition: "SCAFFOLD: one-line definition. ^[source-id]"', `reviewed: ${new Date().toISOString().slice(0, 10)}`);
out.push('related:', '  differential: []', '  conditions: []', '  tools: []', '---');
for (const s of sections) out.push(`## ${s.title}`, `- SCAFFOLD: replace with sourced content. ^[source-id]`, '');
const file = join(root, 'content/cards', system, `${id}.md`);
if (existsSync(file)) die(`${file} already exists.`);
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, out.join('\n'));
// A new card is a draft until the Opus check stamps it (front matter `checked`); content/unchecked.txt lists it meanwhile.
const uncheckedFile = join(root, 'content/unchecked.txt');
appendFileSync(uncheckedFile, `${existsSync(uncheckedFile) && !readFileSync(uncheckedFile, 'utf8').endsWith('\n') ? '\n' : ''}${id}\n`);
console.log(`Wrote content/cards/${system}/${id}.md (${sections.length} sections). content:check fails until every "SCAFFOLD:" is replaced. Added to content/unchecked.txt; the Opus check removes it and adds the \`checked\` stamp.`);
