// npm run card:proof -- [--base origin/main] [--allow-removed "text"] [card-id ...]
// Proves a format-only edit changed no clinical content. For each card file that differs from the base, it compares the
// base text with the working text and checks that these are unchanged:
//   - every number (with its comparator and unit), as a list: none added, none lost;
//   - every {{insert}} ({{dose:…}}, {{criteria:…}}, {{calc:…}} …), as a list;
//   - every source id in the ^[…] markers, as a set (a split bullet may repeat a marker);
//   - every drug name in content/data/drug (name, brands, aliases): none may disappear (more mentions are allowed and shown).
// It then prints the words that were removed and added so a reader can see the wording change at a glance.
// Exit 1 when a card fails. A society name that carried a year (for example "ESC 2021") may be released with --allow-removed "2021".
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i < 0 ? null : args.splice(i, 2)[1]; };
const base = opt('--base') ?? 'origin/main';
const allowRemoved = [];
for (let v; (v = opt('--allow-removed')) !== null;) allowRemoved.push(v);
const only = args;

const UNIT = '(?:mg/kg/day|mg/kg|mcg/kg/min|mcg/kg|mcg/min|µg/kg|units/kg|mg/dL|mg/L|mEq/L|mmol/L|mL/kg|mL/h|mL/hr|mL/min|mL|mcg|µg|mg|kg|g|L|mEq|mmol|mmHg|mm Hg|mOsm|IU|units?|bpm|%|°C|°F|h|hr|hrs|hours?|min|minutes?|days?|weeks?|months?|years?|seconds?|sec|cm|mm|m²|kcal|Hz|J)';
const NUMBER = new RegExp(`[<>≤≥=~]?\\s?\\d[\\d,]*(?:\\.\\d+)?(?:\\s?[–-]\\s?\\d[\\d,]*(?:\\.\\d+)?)?(?:\\s?${UNIT}(?![A-Za-z]))?`, 'g');
const INSERT = /\{\{\s*[a-z-]+\s*:\s*[a-z0-9-]+\s*(?:\|[^}]*)?\}\}/g;
const SOURCES = /\^\[([^\]]+)\]/g;

const git = (a) => execFileSync('git', a, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

function splitFront(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  return m ? { front: m[1], body: text.slice(m[0].length) } : { front: '', body: text };
}

const bag = (list) => { const m = new Map(); for (const x of list) m.set(x, (m.get(x) ?? 0) + 1); return m; };
function bagDiff(a, b) {
  const lost = [], gained = [];
  for (const [k, n] of a) if ((b.get(k) ?? 0) < n) lost.push(`${k}${n - (b.get(k) ?? 0) > 1 ? ` x${n - (b.get(k) ?? 0)}` : ''}`);
  for (const [k, n] of b) if ((a.get(k) ?? 0) < n) gained.push(`${k}${n - (a.get(k) ?? 0) > 1 ? ` x${n - (a.get(k) ?? 0)}` : ''}`);
  return { lost, gained };
}

// Drug words from content/data/drug: the name, brands and aliases, lower case, whole words.
function drugTerms() {
  const dir = join(root, 'content', 'data', 'drug');
  if (!existsSync(dir)) return [];
  const terms = new Set();
  for (const f of readdirSync(dir)) {
    const d = YAML.parse(readFileSync(join(dir, f), 'utf8')) ?? {};
    for (const v of [d.name, ...(d.brands ?? []), ...(d.aliases ?? [])]) if (typeof v === 'string' && v.length >= 4) terms.add(v.toLowerCase());
  }
  return [...terms];
}

function facts(body, drugs) {
  const sources = [...body.matchAll(SOURCES)].flatMap((m) => m[1].split(',').map((s) => s.trim()).filter(Boolean));
  const inserts = body.match(INSERT)?.map((s) => s.replace(/\|[^}]*/, '').replace(/\s+/g, '')) ?? [];
  const plain = body.replace(SOURCES, ' ').replace(INSERT, ' ').replace(/\[\[[^\]]*\]\]/g, ' ').replace(/\[![a-z-]+\]/g, ' ').replace(/^:::.*$/gm, ' ');
  const numbers = (plain.match(NUMBER) ?? []).map((n) => n.replace(/\s+/g, '').replace(/–/g, '-'));
  const lower = plain.toLowerCase();
  const drugCounts = new Map();
  for (const t of drugs) {
    const n = (lower.match(new RegExp(`(?<![a-z])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z])`, 'g')) ?? []).length;
    if (n) drugCounts.set(t, n);
  }
  const words = (plain.toLowerCase().match(/[\p{L}][\p{L}'-]*/gu) ?? []);
  return { sources, inserts, numbers, drugCounts, words };
}

const drugs = drugTerms();
const changed = git(['diff', '--name-only', base, '--', 'content/cards']).split('\n').filter((f) => f.endsWith('.md'));
const untracked = git(['ls-files', '--others', '--exclude-standard', 'content/cards']).split('\n').filter((f) => f.endsWith('.md'));
const files = [...new Set([...changed, ...untracked])].filter((f) => !only.length || only.some((id) => f.endsWith(`/${id}.md`)));
let failed = 0;
for (const f of files) {
  let beforeText;
  try { beforeText = git(['show', `${base}:${f}`]); } catch { console.log(`${f}: new card, nothing to compare`); continue; }
  const b = splitFront(beforeText).body, a = splitFront(readFileSync(join(root, f), 'utf8')).body;
  const fb = facts(b, drugs), fa = facts(a, drugs);
  const problems = [];
  let n = bagDiff(bag(fb.numbers), bag(fa.numbers));
  n = { lost: n.lost.filter((x) => !allowRemoved.some((r) => x.includes(r))), gained: n.gained };
  if (n.lost.length || n.gained.length) problems.push(`numbers: lost [${n.lost.join(', ')}] gained [${n.gained.join(', ')}]`);
  const i = bagDiff(bag(fb.inserts), bag(fa.inserts));
  if (i.lost.length || i.gained.length) problems.push(`inserts: lost [${i.lost.join(', ')}] gained [${i.gained.join(', ')}]`);
  const sb = new Set(fb.sources), sa = new Set(fa.sources);
  const sLost = [...sb].filter((x) => !sa.has(x)), sGained = [...sa].filter((x) => !sb.has(x));
  if (sLost.length || sGained.length) problems.push(`source ids: lost [${sLost.join(', ')}] gained [${sGained.join(', ')}]`);
  const dLost = [...fb.drugCounts].filter(([k, c]) => !fa.drugCounts.has(k)).map(([k]) => k);
  if (dLost.length) problems.push(`drug names lost: ${dLost.join(', ')}`);
  const dMore = [...fa.drugCounts].filter(([k, c]) => c > (fb.drugCounts.get(k) ?? 0)).map(([k, c]) => `${k} ${fb.drugCounts.get(k) ?? 0}→${c}`);
  const w = bagDiff(bag(fb.words), bag(fa.words));
  const sourceCount = `source markers ${fb.sources.length}→${fa.sources.length}`;
  console.log(`${problems.length ? 'FAIL' : 'ok  '} ${f}  (${sourceCount}${dMore.length ? `; drug mentions up: ${dMore.join(', ')}` : ''})`);
  for (const p of problems) console.log(`     ${p}`);
  if (!only.length ? false : true) {
    console.log(`     words removed: ${w.lost.join(' ')}`);
    console.log(`     words added:   ${w.gained.join(' ')}`);
  }
  if (problems.length) failed++;
}
if (!files.length) console.log('No changed card files to compare.');
process.exit(failed ? 1 : 0);
