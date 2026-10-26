// Prose checks for the actionable-card rules (docs/CARD-WRITING-CHEATSHEET.md, "Writing style" and "Abbreviations").
// Safety items are errors (a dose written in a way that gets misread); style items are warnings (a rule of thumb that can misfire).
// Only card prose is read: the text of lines, definitions, table headings and step titles. Dose, calculator and other inserts,
// ids, links' targets and the shared data files are never read, so a unit string in a dose record is never flagged.
import { allBlocks, runs } from './walk.mjs';

const DOC = '(docs/CARD-WRITING-CHEATSHEET.md, "Abbreviations" and "Writing style")';

export const PROSE_RULES = {
  abbreviation: 'abbreviation rule',
  repeat: 'repeat rule',
  vague: 'vague-word rule',
  link: 'link rule',
  length: 'treatment length rule',
  monitor: 'monitor rule',
  nesting: 'nesting rule',
  caps: 'capitalization rule',
};
// Errors fail the build. Everything else is a warning.
export const PROSE_ERRORS = new Set(['abbreviation']);
export const MAX_TREATMENT_BULLETS = 25;

// Text a reader sees: words, bold and italic, and the label of a link that has one. Inserts and bare links show another card's or record's words.
const textOf = (inlines) => (inlines ?? []).map((x) => (x.t === 'link' ? x.label ?? '' : x.t === 'insert' || x.t === 'tag' ? ' ' : x.v ?? '')).join('');
const plainOf = (inlines) => (inlines ?? []).filter((x) => x.t === 'text' || x.t === 'em').map((x) => x.v).join(' ');
const show = (t) => `"${t.length > 60 ? `${t.slice(0, 60)}…` : t}"`;

// ISMP "do not use" abbreviations. Each entry: [name shown, pattern, what to write instead].
// Decisions on the lookalikes (so the check does not cry wolf):
//  - U for units only when it sits right after a number ("10 U"). "U/L" (enzyme units), "U-500" and "U.S." do not match.
//  - IU is flagged, except IU/ followed by a volume ("0.5 IU/mL" is how anti-Xa is reported).
//  - µg is flagged except as a concentration (µg/mL, µg/L, µg/dL: MIC, D-dimer, drug levels), where it is the lab's unit.
//  - A trailing zero or a bare decimal is flagged only on a drug-dose unit. Lab values ("creatinine 1.0 mg/dL", "pH 7.0") are not doses.
//  - MS is always flagged, even for multiple sclerosis or mitral stenosis, because the reader cannot tell which; spell it out.
//  - HS is flagged only in capitals and not inside "hs-troponin" style words. DC / D/C are flagged, but not "DC cardioversion".
const DOSE_UNIT = '(?:mg|mcg|g|mL|units?|mEq|mmol)(?!\\/(?:dL|L)\\b)(?![\\p{L}])';
export const BANNED = [
  ['U for units', /\d\s?[Uu](?![\p{L}\p{N}/.\-])/u, 'write "units"'],
  ['IU', /(?<![\p{L}])IU(?![\p{L}])(?!\/m?L)/u, 'write "units"'],
  ['QD', /(?<![\p{L}])(?:QD|qd|Q\.D\.|q\.d\.)(?![\p{L}])/u, 'write "daily"'],
  ['QOD', /(?<![\p{L}])(?:QOD|qod|Q\.O\.D\.|q\.o\.d\.)(?![\p{L}])/u, 'write "every other day"'],
  ['trailing zero', new RegExp(`(?<![\\d.])\\d+\\.0+\\s?${DOSE_UNIT}`, 'u'), 'write 5 mg, not 5.0 mg'],
  ['missing leading zero', new RegExp(`(?<![\\d.])\\.\\d+\\s?${DOSE_UNIT}`, 'u'), 'write 0.5 mg, not .5 mg'],
  ['µg', /[µμ]g(?!\/(?:m?L|dL)\b)/u, 'write "mcg"'],
  ['MS', /(?<![\p{L}\p{N}-])MS(?![\p{L}\p{N}-])/u, 'write "morphine", "magnesium sulfate", "multiple sclerosis" or "mitral stenosis"'],
  ['MSO4', /(?<![\p{L}])MSO[4₄](?![\p{L}\p{N}])/u, 'write "morphine"'],
  ['MgSO4', /(?<![\p{L}])MgSO[4₄](?![\p{L}\p{N}])/u, 'write "magnesium sulfate"'],
  ['D/C', /(?<![\p{L}])D\/C(?![\p{L}])/u, 'write "discharge" or "stop"'],
  ['DC', /(?<![\p{L}])DC(?:'d)?(?![\p{L}\p{N}])(?!\s(?:cardioversion|shock|current))/u, 'write "discharge" or "stop"'],
  ['HS', /(?<![\p{L}\p{N}-])HS(?![\p{L}\p{N}-])/u, 'write "at bedtime"'],
];

// Words that make a line vague. The second item of a pair is a lookbehind-style exception handled in `vagueIn`.
const VAGUE = [
  [/\bmonitor(?:ing|ed)?\s+closely\b/i, '"monitor closely": say what is checked and how often'],
  [/\bfrequent(?:ly)?\b/i, '"frequently": give the interval or the trigger'],
  [/\bconsider(?:s|ed|ing)?\b/i, '"consider": say what to do, or when'],
  [/\breview(?:s|ed|ing)?\b/i, '"review": name the order or action'],
  [/\bbrain imaging\b/i, '"brain imaging": name the modality (CT head without contrast, MRI brain)'],
];
const REVIEW_OK = /(?:systematic|narrative|cochrane|literature|peer)\s+reviews?\b/i;
export function vagueIn(text) {
  const out = [];
  const clean = text.replace(REVIEW_OK, ' ');
  for (const [re, why] of VAGUE) if (re.test(clean)) out.push(why);
  return out;
}
// "medication" used on its own, as a stand-in for a named drug. Bold labels ("Medications:") name a Causes group and are fine.
const MEDICATION = /\bmedications?\b(?!\s+(?:reconciliation|list|history|adherence|error|safety))/i;

// Heading and title style: sentence case, so a second capitalised word in a short title or heading is the tell.
export function titleCase(t) {
  const words = t.replace(/[(),:;.]/g, ' ').split(/\s+/).filter(Boolean);
  const caps = words.slice(1).filter((w) => /^[A-Z][a-z]{3,}$/.test(w));
  return caps.length >= 2;
}

const WHEN = /\b(?:every|q\d+\s?h|daily|hourly|once|twice|within|after|before|until|each|weekly|per shift|then|baseline|on (?:admission|arrival|day|presentation)|day \d|serially|if|when|while|during|whenever|per day|morning|evening|overnight|at \d|\d+\s*(?:min(?:utes?)?|h|hrs?|hours?|days?|weeks?|months?))\b|\/day\b/i;
const ACTION = /\b(?:if|then|stop|hold|reduce|increase|decrease|repeat|call|escalate|adjust|titrate|discontinue|continue|switch|resume|target|goal|aim|keep|maintain|add|transfer|treat|give|replace|lower|raise|taper|page|consult|admit|redose|change|limit|avoid|do not|until|above|below|exceeds?|triggers?|means)\b|[≥≤<>]/i;
export function monitorGap(text) {
  const gaps = [];
  if (!WHEN.test(text)) gaps.push('when');
  if (!ACTION.test(text)) gaps.push('action');
  return gaps;
}

// Lines more than one level deep outside numbered steps. A numbered step's body is indented by the step itself.
export function deepNestLines(src) {
  const lines = src.split('\n');
  let start = 0;
  if (lines[0]?.trim() === '---') start = lines.findIndex((l, i) => i > 0 && l.trim() === '---') + 1;
  const found = [];
  let inStep = false;
  let inFence = false;
  for (let i = start; i < lines.length; i++) {
    const l = lines[i];
    if (/^:::/.test(l.trim())) inFence = !/^:::\s*$/.test(l.trim()) ? true : false;
    if (inFence) continue;
    if (/^(?:\d+|or)\.\s/.test(l)) inStep = true;
    else if (l.trim() && !/^\s/.test(l)) inStep = false;
    if (!inStep && /^\s{4,}[-*]\s/.test(l)) found.push(i + 1);
  }
  return found;
}

// Every place a card shows prose, with the section it belongs to: [{ section, blocks }] plus the definition.
function places(c) {
  const out = c.sections.map((s) => ({ section: s.title, key: s.key, blocks: [...allBlocks(s.blocks), ...(s.subsections ?? []).flatMap((x) => [...allBlocks(x.blocks)])] }));
  if (c.emergency) out.push({ section: 'Do Now', key: 'emergency', blocks: [...allBlocks(c.emergency.blocks)] });
  return out;
}
const runsOf = (blocks) => [...runs(blocks)];

const tokens = (t) => new Set(t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2));
const jaccard = (a, b) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n / (a.size + b.size - n || 1); };

function cardFindings(c, { cards }) {
  const found = [];
  const add = (rule, items, describe) => { if (items.length) found.push({ rule, severity: PROSE_ERRORS.has(rule) ? 'error' : 'warn', count: items.length, message: `${c.file}: ${PROSE_RULES[rule]}, ${describe(items)}` }); };
  const where = places(c);

  // ERROR: unsafe abbreviations, in definitions, lines, table headings and step titles.
  const texts = [];
  if (c.definition) texts.push({ section: 'definition', text: textOf(c.definition.inlines) });
  for (const p of where) for (const r of runsOf(p.blocks)) texts.push({ section: p.section, text: textOf(r.inlines) });
  const banned = [];
  for (const { section, text } of texts) for (const [name, re, fix] of BANNED) { const m = text.match(re); if (m) banned.push({ name, fix, section, near: show(text.slice(Math.max(0, m.index - 15), m.index + m[0].length + 15).trim()) }); }
  add('abbreviation', banned, (x) => `${x.length} unsafe abbreviation${x.length === 1 ? '' : 's'}: ${x.slice(0, 4).map((b) => `${b.name} in ${b.section} near ${b.near} (${b.fix})`).join('; ')}${x.length > 4 ? '; …' : ''} ${DOC}`);

  // WARNINGS
  const vague = [];
  for (const { section, text } of texts) for (const why of vagueIn(text)) vague.push(`${section}: ${why}`);
  for (const p of where) for (const r of runsOf(p.blocks)) {
    if (r.header || r.timesTitle) continue;
    if (MEDICATION.test(plainOf(r.inlines))) vague.push(`${p.section}: "medication" on its own: name the drug or the drug class`);
  }
  add('vague', vague, (x) => `${x.length} vague wording${x.length === 1 ? '' : 's'}, for example ${x[0]} ${DOC}`);

  // A fact has one home: nearly the same line in two sections. At a Glance and Do Now summarize on purpose, so they are left out.
  const seen = [];
  const repeats = [];
  for (const p of where) {
    if (p.key === 'at-a-glance' || p.key === 'emergency') continue;
    for (const b of p.blocks) {
      const lines = b.t === 'list' ? b.items.flatMap((i) => [i, ...i.children]) : b.t === 'paragraph' ? [b] : [];
      for (const it of lines) {
        const t = textOf(it.inlines).trim();
        const tk = tokens(t);
        if (tk.size < 5) continue;
        const twin = seen.find((s) => s.section !== p.section && jaccard(s.tk, tk) >= 0.8);
        if (twin) repeats.push(`${show(t)} (${twin.section} and ${p.section})`);
        else seen.push({ section: p.section, tk });
      }
    }
  }
  add('repeat', repeats, (x) => `${x.length} line${x.length === 1 ? '' : 's'} repeated in two sections, for example ${x[0]}; keep one home and point to it ${DOC}`);

  // A live card named in plain words in a section that never links to it.
  const named = [];
  for (const p of where) {
    const linked = new Set();
    const plain = [];
    for (const r of runsOf(p.blocks)) { for (const x of r.inlines) if (x.t === 'link') linked.add(x.id); plain.push(plainOf(r.inlines) + ' ' + (r.inlines ?? []).filter((x) => x.t === 'strong').map((x) => x.v).join(' ')); }
    const body = plain.join('\n');
    for (const o of cards) {
      if (o.id === c.id || !o.title || o.title.length < 5 || linked.has(o.id)) continue;
      const word = o.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp(`(?<![\\p{L}\\p{N}])${word}(?![\\p{L}\\p{N}])`, 'iu').test(body)) named.push(`"${o.title}" in ${p.section}`);
    }
  }
  add('link', named, (x) => `${x.length} live card${x.length === 1 ? '' : 's'} named in plain text without a [[link]]: ${x.slice(0, 4).join(', ')}${x.length > 4 ? ', …' : ''} ${DOC}`);

  // Treatment that has grown past a phone-sized list.
  const treat = where.filter((p) => p.key === 'treatment');
  const bullets = treat.reduce((n, p) => n + p.blocks.filter((b) => b.t === 'list').reduce((m, b) => m + b.items.reduce((k, i) => k + 1 + i.children.length, 0), 0), 0);
  if (bullets > MAX_TREATMENT_BULLETS) add('length', [bullets], (x) => `Treatment has ${x[0]} bullets (about ${MAX_TREATMENT_BULLETS} at most); split the card or move detail to More Information ${DOC}`);

  // Monitor lines: what is checked, when, and the action.
  const gaps = [];
  for (const p of where.filter((q) => q.key === 'monitor' || q.key === 'monitoring')) {
    for (const b of p.blocks) {
      if (b.t !== 'list') continue;
      for (const it of b.items) {
        const t = [it, ...it.children].map((i) => textOf(i.inlines)).join(' ');
        const gap = monitorGap(t);
        if (gap.length) gaps.push(`${show(textOf(it.inlines))} has no ${gap.join(' or ')}`);
      }
    }
  }
  add('monitor', gaps, (x) => `${x.length} Monitor line${x.length === 1 ? '' : 's'} missing a when or an action, for example ${x[0]} ${DOC}`);

  // Nesting: one level of sub-bullets, except inside numbered steps.
  add('nesting', c.nestedLines ?? [], (x) => `${x.length} bullet${x.length === 1 ? '' : 's'} nested past one level (first at line ${x[0]}); flatten or split the list ${DOC}`);

  // Capitalization: sentence case for step titles and table headings; a heading has no end punctuation.
  const caps = [];
  for (const p of where) {
    for (const b of p.blocks) {
      if (b.t === 'steps') for (const it of b.items) { const t = textOf(it.inlines).trim(); if (titleCase(t)) caps.push(`step title ${show(t)}`); }
      if (b.t === 'table') {
        const heads = b.header.map((h) => textOf(h).trim()).filter(Boolean);
        for (const h of heads) {
          if (titleCase(h)) caps.push(`table heading ${show(h)}`);
          else if (/[.:;]$/.test(h)) caps.push(`table heading ${show(h)} ends with punctuation`);
        }
        const lower = heads.filter((h) => /^[a-z]/.test(h)).length;
        if (lower > 0 && lower < heads.length) caps.push(`table headings mix upper and lower case (${heads.join(', ')})`);
      }
    }
  }
  add('caps', caps, (x) => `${x.length} heading${x.length === 1 ? '' : 's'} not in sentence case, for example ${x[0]} ${DOC}`);
  return found;
}

// All prose findings: { rule, severity, count, message, card }.
export function proseFindings({ cards }) {
  return cards.flatMap((c) => cardFindings(c, { cards }).map((f) => ({ ...f, card: c.id })));
}

// One row per rule: how many cards and how many places it flags.
export function proseSummary(findings) {
  return Object.keys(PROSE_RULES).map((rule) => {
    const hits = findings.filter((f) => f.rule === rule);
    return { rule, severity: PROSE_ERRORS.has(rule) ? 'error' : 'warn', cards: hits.length, places: hits.reduce((n, f) => n + f.count, 0) };
  });
}
