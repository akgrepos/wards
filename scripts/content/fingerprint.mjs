// The fingerprint of a card's clinical content: a short hash of what the Opus check verified, so a later edit that changes
// a dose, number, threshold or drug fact is noticed, while a reworded sentence is not.
// Input is one card's split payload ({ card, data }, from splitContent), so a shared dose edit changes the fingerprint of
// every card that inserts it. The hash covers:
//   1. every data item the card uses (doses, regimens, thresholds, criteria, calculators, coverage, pathways …) as composed,
//      except the dose "verification" upkeep note, source records and media records;
//   2. the card's numbers: every number with its comparator and unit, plus every {{insert}}, from all card text (order ignored);
//   3. the source ids cited on the lines that carry a number or an insert (a changed citation on a clinical line counts).
// It does not cover prose wording, titles, aliases, links, tags or the checked stamp itself.
import { createHash } from 'node:crypto';

const SKIP_KINDS = new Set(['source', 'media']);
const UNIT = '(?:mg/kg/day|mg/kg|mcg/kg/min|mcg/kg|mcg/min|µg/kg|units/kg|mg/dL|mg/L|mEq/L|mmol/L|mL/kg|mL/h|mL/hr|mL/min|mL|mcg|µg|mg|kg|g|L|mEq|mmol|mmHg|mm Hg|mOsm|IU|units?|bpm|%|°C|°F|h|hr|hrs|hours?|min|minutes?|days?|weeks?|months?|years?|seconds?|sec|cm|mm|m²|kcal|Hz|J)';
const NUMBER = new RegExp(`[<>≤≥=~]?\\s?\\d[\\d,]*(?:\\.\\d+)?(?:\\s?[–-]\\s?\\d[\\d,]*(?:\\.\\d+)?)?(?:\\s?${UNIT}(?![A-Za-z]))?`, 'g');

// Plain reader text of an inline list, without link/insert ids (those carry digits that are not numbers).
export function inlinesText(inlines, { keepInserts = false } = {}) {
  return (inlines ?? []).map((x) => {
    if (x.t === 'text' || x.t === 'strong' || x.t === 'em') return x.v;
    if (x.t === 'insert') return keepInserts ? `{{${x.kind}:${x.id}}}` : (x.label ?? '');
    if (x.t === 'link') return keepInserts ? `[[${x.id}]]` : (x.label ?? '');
    if (x.t === 'tag') return keepInserts ? `[!${x.v}]` : '';
    return '';
  }).join('');
}

// The card as reader lines: { text, sources }, in page order. `text` keeps insert, link and tag markers, so two cards
// that read the same but point at different doses or cards differ.
export function readerLines(card) {
  const out = [];
  const push = (text, sources = []) => { if (text.trim()) out.push({ text: text.trim(), sources: [...sources] }); };
  const walk = (v) => {
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (!v || typeof v !== 'object') return;
    if (v.t === 'insert') { push(`{{${v.kind}:${v.id}}}`); return; }
    if (v.t === 'subheading') { push(v.text); return; }
    if (v.cells) { push(v.cells.map((c) => inlinesText(c, { keepInserts: true })).join(' | '), v.sources); return; }
    if (v.header) push(v.header.map((c) => inlinesText(c, { keepInserts: true })).join(' | '));
    if (Array.isArray(v.title)) push(inlinesText(v.title, { keepInserts: true }), v.sources); // a container's title (:::note …)
    if (typeof v.text === 'string' && v.inlines) push(v.text, v.sources); // a container's item (raw text, label and all)
    else if (v.inlines) push(inlinesText(v.inlines, { keepInserts: true }), v.sources);
    if (v.attrs) push(Object.entries(v.attrs).map(([k, x]) => `${k}=${x}`).join(' '));
    for (const k of ['blocks', 'items', 'children', 'rows', 'subsections', 'sections']) if (v[k]) walk(v[k]);
  };
  walk(card.definition);
  walk(card.sections);
  walk(card.emergency?.blocks);
  return out;
}

const INSERT = /\{\{\s*[a-z-]+\s*:\s*[a-z0-9-]+\s*\}\}/g;

// Numbers and inserts of one reader line, as normalized tokens (whitespace removed, "–" and "-" alike).
export function clinicalTokens(text) {
  const inserts = text.match(INSERT) ?? [];
  const plain = text.replace(INSERT, ' ').replace(/\[\[[^\]]*\]\]/g, ' ').replace(/\[![a-z-]+\]/g, ' ');
  const numbers = (plain.match(NUMBER) ?? []).map((n) => n.replace(/\s+/g, '').replace(/–/g, '-'));
  return [...inserts.map((i) => i.replace(/\s+/g, '')), ...numbers];
}

// What the fingerprint says about one card's text: the sorted number tokens and the sorted citations of clinical lines.
export function textFacts(card) {
  const tokens = [], cited = [];
  for (const line of readerLines(card)) {
    const t = clinicalTokens(line.text);
    if (!t.length) continue;
    tokens.push(...t);
    cited.push(...line.sources);
  }
  return { tokens: tokens.sort(), cited: cited.sort() };
}

// The data items the fingerprint covers, as { "dose/x": item } (no verification note, no source or media records).
export function clinicalData(data) {
  const out = {};
  for (const [kind, items] of Object.entries(data)) {
    if (SKIP_KINDS.has(kind)) continue;
    for (const [id, item] of Object.entries(items)) {
      const { verification, ...rest } = item;
      out[`${kind}/${id}`] = rest;
    }
  }
  return out;
}

const canonical = (v) => JSON.stringify(v, (k, x) => (x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) : x));

export function fingerprintParts({ card, data }) {
  const facts = textFacts(card);
  return { data: clinicalData(data), tokens: facts.tokens, cited: facts.cited };
}

export function fingerprint(payload) {
  return createHash('sha256').update(canonical(fingerprintParts(payload))).digest('hex').slice(0, 16);
}
