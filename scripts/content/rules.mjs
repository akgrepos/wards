// Format rules for card text (docs/CARD-WRITING-CHEATSHEET.md, "Writing style"). Each rule finds what a reader on a phone
// trips over: a bullet that is a paragraph, a table that runs off the screen, a severity ladder without its color bands.
//
// A finding is an error for every card (the sweep of the existing cards is done). `isNew` stays on each finding so the
// warning path in check.mjs and the summary in cli.mjs keep working if a rule is ever eased for old cards again.
import { allBlocks, runs } from './walk.mjs';

export const MAX_BULLET_CHARS = 160;
export const MAX_BULLET_SENTENCES = 2;
export const MAX_TABLE_COLS = 3;
export const MAX_CELL_CHARS = 25;
export const MAX_TITLE_CHARS = 32;

export const RULES = {
  bullet: 'bullet rule',
  parallel: 'parallel rule',
  table: 'table rule',
  scale: 'scale rule',
  names: 'names rule',
  title: 'title rule',
  related: 'related rule',
  alias: 'alias rule',
};
const DOC = '(docs/CARD-WRITING-CHEATSHEET.md, "Writing style")';

const ABBR = /\b(e\.g|i\.e|vs|approx|Dr|St|No|Fig|etc|cf)\./g;
const textOf = (inlines) => (inlines ?? []).map((x) => (x.t === 'link' ? x.label ?? x.id : x.t === 'insert' ? '' : x.v ?? '')).join('');
const sentences = (t) => t.replace(ABBR, (m) => m.replace('.', '')).split(/[.!?]\s+(?=[A-Z(])/).filter((s) => s.trim());
const show = (t) => `"${t.slice(0, 60)}${t.length > 60 ? '…' : ''}"`;

// The More Information subsections that exist to compare guidelines and studies, so they may name them.
const NAMING_SUBSECTION = /^(Where Guidelines Differ|Evidence)\b/;

// Every block of the card's page (sections and More Information; the Do Now page has its own format).
// With `forNames`, the blocks of the subsections allowed to name guidelines and studies are left out.
function pageBlocks(c, { forNames = false } = {}) {
  return c.sections.flatMap((s) => [...allBlocks(s.blocks), ...(s.subsections ?? []).filter((x) => !(forNames && NAMING_SUBSECTION.test(x.title ?? ''))).flatMap((x) => [...allBlocks(x.blocks)])]);
}

// A severity or risk level in the first column of a table: Mild, Moderate, Severe, Low, Intermediate, High, Stage 1 to 4.
const LEVEL_WORD = /^(?:very\s+|low[\s-]to[\s-]|moderate[\s-]to[\s-])?(mild|moderate|severe|low|intermediate|high|stage\s*[1-4])\b/i;

// Society and study names. Case matters: these are acronyms and capitalised names.
const SOCIETIES = ['ACEP', 'AHA', 'ACC', 'ESC', 'IDSA', 'ATS', 'ERS', 'KDIGO', 'ADA', 'EASD', 'ACG', 'SCCM', 'ESICM', 'ASAM', 'APA', 'CANMAT', 'NICE', 'ASH', 'AAN', 'NCCN', 'AGA', 'ASGE', 'ACOG', 'ACP', 'AAFP', 'USPSTF', 'SHM', 'ASHP', 'AASLD', 'EASL', 'ISTH', 'BTS', 'AAP', 'AUA', 'ISHLT', 'HRS', 'SCAI', 'KDOQI', 'ASN', 'ESPEN', 'ASPEN', 'ACCP', 'ESH', 'WSES', 'VA/DoD', 'CDC', 'WHO', 'SSC', 'STS'];
const SOCIETY_RE = new RegExp(`(?<![\\p{L}\\p{N}-])(?:${SOCIETIES.map((s) => s.replace('/', '\\/')).join('|')})(?![\\p{L}\\p{N}-])`, 'gu');
const ORG_RE = /\b(?:American|European|British|Canadian|Japanese|International|Infectious Diseases|Endocrine|Surviving Sepsis|Joint Commission)(?:\s+[A-Z][\p{L}&]*|\s+of|\s+for|\s+and)*\s+(?:Society|College|Association|Academy|Institute|Campaign|Commission|Guidelines?)\b/gu;
// A trial or study named by its own name: an acronym (DELIVER trial, STOP-IT study) or one capitalised name (Framingham study).
const NOT_STUDY = 'The|This|That|These|Those|Each|One|Any|Every|Large|Small|Observational|Randomized|Single|Another|Some|Most|No|A|An|In|On|For|Per|Case|Pilot|Clinical|Phase|Both|Two|Three|Older|Recent|Early|Late|Short|Long|First|Second|Same|Other|Multicenter|Prospective|Retrospective|Pooled|Controlled|Blinded|Open|Natural|Animal|Human|Adult|Pediatric|Sleep|Cohort|Validation|ICU|ED|CT|MRI|RCT|Meta|Cross';
const STUDY_RE = new RegExp(`\\b(?:(?!(?:${NOT_STUDY})\\b)[A-Z]{2,}[A-Za-z0-9-]*|[A-Za-z]*[a-z][A-Z][A-Za-z0-9-]*|(?!(?:${NOT_STUDY})\\b)[A-Z][a-z]+)\\s+(?:trials?|study)\\b|\\bet al\\b`, 'g');

// Names that may appear in text because they are a criteria set or a score: built from content/data/criteria and calc.
export function allowedNames(data) {
  const terms = [];
  const add = (v) => { if (typeof v === 'string' && v.trim()) terms.push(v.trim().replace(/,\s*(19|20)\d\d$/, '').toLowerCase()); };
  for (const it of Object.values(data.criteria ?? {})) { add(it.name); add(it.title); add(it.short); }
  for (const it of Object.values(data.calc ?? {})) { add(it.name); add(it.short); for (const m of it.match ?? []) add(m); }
  return terms;
}

// Society, guideline and study names found in a text, minus any that sit inside the name of a criteria set or score used there.
export function namesIn(text, allowed = []) {
  const lower = text.toLowerCase();
  const inUse = allowed.filter((t) => t.length >= 3 && lower.includes(t));
  const out = [];
  for (const re of [SOCIETY_RE, ORG_RE, STUDY_RE]) {
    for (const m of text.matchAll(re)) {
      const hit = m[0].toLowerCase();
      if (inUse.some((t) => t.includes(hit))) continue;
      out.push(m[0]);
    }
  }
  return out;
}

// Findings for one card: { rule, count, message } (the message starts with the card's file).
function cardFindings(c, { data, byId }) {
  const found = [];
  const add = (rule, items, describe) => { if (items.length) found.push({ rule, count: items.length, message: `${c.file}: ${RULES[rule]}, ${describe(items)}` }); };
  const blocks = pageBlocks(c);

  // Bullets: one idea, at most two sentences and about 160 characters.
  const long = [];
  const mixed = [];
  for (const b of blocks) {
    if (b.t !== 'list') continue;
    for (const it of b.items.flatMap((i) => [i, ...i.children])) {
      const t = textOf(it.inlines);
      if (t.length > MAX_BULLET_CHARS || sentences(t).length > MAX_BULLET_SENTENCES) long.push(t);
    }
    if (b.items.length >= 3) {
      const labelled = b.items.filter((i) => i.inlines?.[0]?.t === 'strong').length;
      if (labelled > 0 && labelled < b.items.length) mixed.push(textOf(b.items[0].inlines));
    }
  }
  add('bullet', long, (x) => `${x.length} bullet${x.length === 1 ? '' : 's'} run past ${MAX_BULLET_SENTENCES} sentences or ${MAX_BULLET_CHARS} characters, for example ${show(x[0])}; split it, or use a lead-in with sub-bullets ${DOC}`);
  add('parallel', mixed, (x) => `${x.length} list${x.length === 1 ? '' : 's'} mix bold-label bullets with plain ones, for example the list starting ${show(x[0])} ${DOC}`);

  // Tables: at most 3 columns, every cell short. A wider comparison is a :::compare block.
  const wide = [];
  const levelTables = [];
  for (const b of blocks) {
    if (b.t !== 'table') continue;
    const cells = [...b.header, ...b.rows.flatMap((r) => r.cells)].map(textOf);
    const longest = cells.reduce((a, t) => (t.length > a.length ? t : a), '');
    const why = [];
    if (b.header.length > MAX_TABLE_COLS) why.push(`${b.header.length} columns`);
    if (longest.length > MAX_CELL_CHARS) why.push(`a ${longest.length}-character cell (${show(longest)})`);
    if (why.length) wide.push(`${why.join(' and ')}`);
    const first = b.rows.map((r) => textOf(r.cells[0]).trim());
    if (first.filter((t) => LEVEL_WORD.test(t)).length >= 2) levelTables.push(first.slice(0, 3).join(', '));
  }
  add('table', wide, (x) => `${x.length} table${x.length === 1 ? '' : 's'} too wide for a phone (at most ${MAX_TABLE_COLS} columns, cells under ${MAX_CELL_CHARS} characters), for example ${x[0]}; write a :::compare block instead ${DOC}`);

  // Severity ladders and risk-level tables are :::scale blocks (color bands), never bullets or a gray table.
  const ladders = [...(c.severityLines ?? []).map((n) => `a bullet ladder at line ${n}`), ...levelTables.map((t) => `a table with levels in its first column (${t})`)];
  add('scale', ladders, (x) => `${x.length} severity ladder${x.length === 1 ? '' : 's'} not written as :::scale, for example ${x[0]} ${DOC}`);

  // Society, guideline and study names stay out of card text (the ^[source] markers carry them).
  const allowed = allowedNames(data);
  const named = [];
  const scan = (text) => { for (const n of namesIn(text, allowed)) named.push(n); };
  if (c.definition) scan(textOf(c.definition.inlines));
  for (const b of pageBlocks(c, { forNames: true })) for (const r of runs([b])) scan(textOf(r.inlines));
  const uniq = [...new Set(named)];
  add('names', named, () => `names a society, guideline or study in the text (${uniq.slice(0, 4).join(', ')}${uniq.length > 4 ? ', …' : ''}); the source marker carries the attribution ${DOC}`);

  // Titles name the condition only, and fit a phone's title bar.
  if (c.title && c.title.length > MAX_TITLE_CHARS) add('title', [c.title], (x) => `the title "${x[0]}" is ${x[0].length} characters (at most ${MAX_TITLE_CHARS}); move the other names to aliases ${DOC}`);

  // Related cards point both ways.
  const missing = [...new Set(Object.values(c.related ?? {}).flat())].filter((id) => byId.has(id) && !Object.values(byId.get(id).related ?? {}).flat().includes(c.id));
  add('related', missing, (x) => `${x.join(', ')} ${x.length === 1 ? 'does' : 'do'} not list this card back in related (docs/CARD-WRITING-CHEATSHEET.md, "Consistency rules")`);

  // An alias written as a bare number in the front matter (988, not "988") is read as a number, and search cannot match it.
  const bare = (c.aliases ?? []).filter((a) => typeof a !== 'string' && /^\d+$/.test(String(a).trim()));
  add('alias', bare, (x) => `alias ${x.join(', ')} is a bare number; put it in quotes ("${x[0]}") or add words a clinician would search (docs/CARD-WRITING-CHEATSHEET.md, "Consistency rules")`);
  return found;
}

// All findings, each with the card it belongs to and whether that card is new (so the finding is an error).
export function ruleFindings({ cards, data, unchecked = [] }) {
  const byId = new Map(cards.map((c) => [c.id, c]));
  return cards.flatMap((c) => cardFindings(c, { data, byId }).map((f) => ({ ...f, card: c.id, isNew: true })));
}

// How many existing cards (and how many places) each rule flags: the sweep's to-do list.
export function ruleSummary(findings) {
  const rows = Object.keys(RULES).map((rule) => {
    const hits = findings.filter((f) => f.rule === rule && !f.isNew);
    return { rule, cards: hits.length, places: hits.reduce((n, f) => n + f.count, 0) };
  });
  return rows;
}
