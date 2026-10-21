// Content checks, run on every pull request (npm run content:check) and in the tests.
// Each rule comes from docs/CARD-TYPES.md and docs/DATA-TYPES.md.
import { CARD_TYPES, CALC_FIELDS, MDCALC_URL, DATA_TYPES, DOSE_FIELDS, REGIMEN_FIELDS, REGIMEN_OPTION_FIELDS, SHARED_SECTIONS, UNITS, DOSE_IN_TEXT } from './schema.mjs';
import { TAGS, parseInline } from './inline.mjs';
import { onsetMinutes } from './onset.mjs';
import { emergencySteps, offsetMinutes, stepDoses } from './emergency.mjs';
import { checkPathway } from './pathway.mjs';
import { checkMedia } from './media.mjs';

const DOSE_ONLY = /^\{\{\s*dose\s*:\s*([a-z0-9-]+)\s*\}\}$/;

function inlineText(inlines) {
  return inlines.filter((x) => x.t !== 'insert' && x.t !== 'link').map((x) => x.v ?? '').join('');
}

// Every block's inline runs, with the sources attached to it (steps and containers included).
function* runs(blocks) {
  for (const b of blocks) {
    if (b.t === 'paragraph') yield { inlines: b.inlines, sources: b.sources };
    // A sub-bullet without its own source uses its parent's.
    if (b.t === 'list') for (const it of b.items) { yield { inlines: it.inlines, sources: it.sources }; for (const c of it.children) yield { inlines: c.inlines, sources: c.sources.length ? c.sources : it.sources }; }
    // Values in table cells and scale bands show as plain text (the row or band already says what they mean).
    if (b.t === 'table') { for (const h of b.header) yield { inlines: h, sources: [], header: true }; for (const r of b.rows) for (const c of r.cells) yield { inlines: c, sources: r.sources, plain: true }; }
    if (b.t === 'steps') for (const it of b.items) { yield { inlines: it.inlines, sources: it.sources, header: true }; yield* runs(it.blocks); }
    if (b.t === 'note') for (const it of b.items) yield { inlines: it.inlines, sources: it.sources.length ? it.sources : b.sources };
    if (b.t === 'scale' || b.t === 'compare') {
      yield { inlines: b.title, sources: b.sources, header: true };
      for (const it of b.items) yield { inlines: [...it.label, ...it.inlines], sources: it.sources.length ? it.sources : b.sources, plain: b.t === 'scale' };
    }
    if (b.t === 'times') yield { inlines: b.title, sources: b.sources, timesTitle: true };
    if (b.t === 'onset') {
      yield { inlines: b.title, sources: b.sources, header: true };
      // Dose items carry their own onset and sources; the others are "Name: onset | lasts ^[source]".
      for (const it of b.items) if (!DOSE_ONLY.test(it.text.trim())) yield { inlines: [...it.label, ...it.inlines], sources: it.sources.length ? it.sources : b.sources };
    }
  }
}

// Every block, steps' contents included.
function* allBlocks(blocks) {
  for (const b of blocks) { yield b; if (b.t === 'steps') for (const it of b.items) yield* allBlocks(it.blocks); }
}

// A cutoff's pop-up shows its name, value, unit, sources and `note`. Only the note can add anything the reader
// can't already see on the line (the value is on it and the sources are in its pill), so a cutoff is tappable only
// when it has a note that says something new (owner's rule, 2026-10-19).
const STOP = new Set('the and for with this that from than then into when what which who are was were has have had not but its also only may can all any per'.split(' '));
const words = (text) => (text.toLowerCase().match(/[a-z0-9][a-z0-9-]*/g) ?? []).filter((w) => w.length >= 3 && !STOP.has(w) && !/^[\d.]+$/.test(w));
// "needs" and "needing" count as the same word as "need".
const stem = (w) => w.replace(/(ing|ed|es|s)$/, '');
export function noteRepeats(note, visible) {
  const seen = new Set(words(visible).map(stem));
  const ws = words(note);
  if (!ws.length) return true;
  // A note says only what the line doesn't: at least two-thirds of its words must be new.
  return ws.filter((w) => seen.has(stem(w))).length / ws.length > 1 / 3;
}
const numbers = (v) => String(v).match(/\d+(\.\d+)?/g) ?? [];

// Finds the names of known calculators (their `match` words) in plain text, so a mention can't go without its link.
const escapeRe = (t) => t.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
export function calcMatcher(calcs) {
  const list = Object.entries(calcs ?? {}).flatMap(([id, c]) => (Array.isArray(c.match) ? c.match : []).map((term) => ({ id, term, re: new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(String(term))}(?![\\p{L}\\p{N}])`, 'iu') })));
  return (text) => list.filter((m) => m.re.test(text));
}

const CONTAINERS = { scale: [2, 5], compare: [2, 3], times: [1, 12], onset: [2, 12], note: [1, 3] };

export function checkContent({ systems, cards, data }) {
  const errors = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);
  const systemIds = new Set(systems.map((s) => s.id));
  const calcMentions = calcMatcher(data.calc);
  for (const s of systems) if (typeof s.title !== 'string' || !s.title || typeof s.id !== 'string') errors.push(`content/systems.yaml: system "${s.id}" needs an id and a title (quote titles that contain commas)`);
  const cardIds = new Map();
  // Where each cutoff appears: the words around it, and whether it shows plain there (tables, scales).
  const thresholdUses = new Map();
  const useAt = (inlines, where, plain) => {
    for (const x of inlines) if (x.t === 'insert' && x.kind === 'threshold') {
      if (!thresholdUses.has(x.id)) thresholdUses.set(x.id, []);
      thresholdUses.get(x.id).push({ where, plain: !!plain, text: inlines.map((y) => (y.t === 'insert' ? '' : y.v ?? y.label ?? '')).join('') });
    }
  };

  for (const c of cards) {
    const where = c.file;
    if (!c.id || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id)) err(where, `card id "${c.id}" must be lowercase words joined by hyphens`);
    if (cardIds.has(c.id)) err(where, `card id "${c.id}" is also used by ${cardIds.get(c.id)}`);
    cardIds.set(c.id, c.file);
    if (!c.title) err(where, 'missing title');
    if (c.group === 'condition' && !c.subsection) err(where, 'condition cards need a subsection (e.g. "Arrhythmias")');
    if (c.group !== 'condition' && c.subsection) err(where, 'only condition cards have a subsection; approach and reference cards are listed in their own groups');
    if (!systemIds.has(c.system)) err(where, `unknown system "${c.system}"`);
    const type = CARD_TYPES[c.type];
    if (!type) { err(where, `unknown card type "${c.type}"`); continue; }
    if (c.variant && !type.variants?.[c.variant]) err(where, `unknown ${c.type} variant "${c.variant}"`);
    for (const t of c.unknownSections) err(where, `section "${t}" is not part of a ${c.type} card`);
    for (const t of c.unknownSubsections ?? []) err(where, `"${t}" is not a More Information subsection of a ${c.type} card (### headings only go inside More Information)`);
    const order = type.sections.map((s) => s.key);
    const allowed = c.variant ? new Set([...type.variants[c.variant], ...SHARED_SECTIONS]) : null;
    let lastIdx = -1;
    for (const s of c.sections) {
      const idx = order.indexOf(s.key);
      if (idx < 0) continue;
      if (idx <= lastIdx) err(where, `section "${s.title}" is out of order`);
      lastIdx = Math.max(lastIdx, idx);
      if (allowed && !allowed.has(s.key)) err(where, `section "${s.title}" is not part of the ${c.variant} variant`);
      const subOrder = (type.more ?? []).map((x) => x.key);
      let lastSub = -1;
      for (const x of s.subsections ?? []) {
        const j = subOrder.indexOf(x.key);
        if (j < 0) continue;
        if (j <= lastSub) err(where, `"${x.title}" is out of order in More Information`);
        lastSub = Math.max(lastSub, j);
        if (x.description && x.description.length > 60) err(where, `"${x.title}": the description is over 60 characters`);
      }
      if (s.key === 'more' && s.blocks.length) err(where, 'More Information holds only ### subsections; move the text into one');
    }
    for (const req of type.sections.filter((s) => s.required)) {
      if (!c.sections.some((s) => s.key === req.key)) err(where, `missing required section "${req.title}"`);
    }
    const kp = c.sections.find((s) => s.key === 'at-a-glance');
    if (kp) {
      const n = kp.blocks.filter((b) => b.t === 'list').reduce((a, b) => a + b.items.length, 0);
      if (n < 3 || n > 6) err(where, `At a Glance should have 3–6 bullets (has ${n})`);
    }
    // The page header: a one-line definition, the guidelines it is based on, and the date it was last reviewed.
    if (type.topic && !c.example) {
      if (!c.definition) err(where, 'topic pages need a one-line "definition" in the front matter');
      if (!c.reviewed) err(where, 'topic pages need a "reviewed" date (YYYY-MM-DD) in the front matter');
    }
    if (c.reviewed && !/^\d{4}-\d{2}-\d{2}$/.test(c.reviewed)) err(where, `reviewed date "${c.reviewed}" must be YYYY-MM-DD`);
    if (c.definition) {
      if (!c.definition.sources.length) err(where, 'the definition has no source');
      for (const id of c.definition.sources) if (!data.source?.[id]) err(where, `the definition cites unknown source "${id}"`);
      for (const x of c.definition.inlines) if (x.t === 'insert' && !data[x.kind]?.[x.id]) err(where, `the definition inserts unknown ${x.kind} "${x.id}"`);
      if (c.definition.inlines.some((x) => x.t === 'insert' && x.kind === 'dose')) err(where, 'the definition cannot contain a dose');
      useAt(c.definition.inlines, `${where} definition`, false);
      for (const m of calcMentions(inlineText(c.definition.inlines))) err(where, `the definition names "${m.term}", a calculator; write {{calc:${m.id}}} so it links to MDCalc`);
    }
    for (const id of c.basedOn ?? []) if (!data.source?.[id]) err(where, `based_on lists unknown source "${id}"`);
    const parts = c.sections.flatMap((s) => [{ title: s.title, blocks: s.blocks }, ...(s.subsections ?? []).map((x) => ({ title: x.title, blocks: x.blocks }))]);
    // The emergency (## Do Now): numbered steps in the Do Now format, then optional :::note boxes. Its lines follow
    // the same rules as the page's (sources, doses on their own line, inserts that exist).
    if (c.emergencyHintOnly) err(where, '"emergency_hint" is only for a topic with a "## Do Now" section');
    const doNowDoses = new Set();
    if (c.emergency) {
      parts.push({ title: 'Do Now', blocks: c.emergency.blocks });
      if (!type.topic) err(where, `a ${c.type} card can't have an emergency (## Do Now); only condition and approach topics can`);
      const hint = c.emergency.hint;
      if (!hint) err(where, 'an emergency needs "emergency_hint" in the front matter: one short line for the Rapids list ("Calcium, insulin-dextrose, remove K⁺")');
      else if (String(hint).length > 50) err(where, `"emergency_hint" is over 50 characters`);
      const bs = c.emergency.blocks;
      if (bs[0]?.t !== 'steps') err(where, 'Do Now starts with numbered steps ("1. Stabilize the myocardium")');
      bs.slice(1).forEach((b) => { if (b.t !== 'note') err(where, 'after its steps, Do Now holds only :::note boxes'); });
      const problems = [];
      const steps = emergencySteps(bs, problems);
      problems.forEach((p) => err(where, `Do Now ${p}`));
      if (steps.length && (steps.length < 2 || steps.length > 8)) err(where, `Do Now needs 2–8 steps (has ${steps.length})`);
      steps.forEach((st) => stepDoses(st).forEach((d) => doNowDoses.add(d)));
    }
    for (const { title, blocks } of parts) {
      for (const r of runs(blocks)) {
        useAt(r.inlines, `${where} "${title}"`, r.plain);
        const text = inlineText(r.inlines);
        for (const m of calcMentions(text)) err(where, `"${title}" names "${m.term}", a calculator; write {{calc:${m.id}}} so it links to MDCalc`);
        if (DOSE_IN_TEXT.test(text)) err(where, `"${title}" has a dose typed as text ("${text.match(DOSE_IN_TEXT)[0]}"); insert it with {{dose:…}}`);
        for (const id of r.sources) if (!data.source?.[id]) err(where, `"${title}" cites unknown source "${id}"`);
        const factual = !r.header && text.replace(/[\s.,;:()–-]/g, '').length > 0;
        if ((factual || r.timesTitle) && r.sources.length === 0 && !r.inlines.some((x) => x.t === 'insert')) err(where, `"${title}": a line has no source ("${text.slice(0, 60)}…")`);
        for (const x of r.inlines) {
          if (x.t === 'insert' && !data[x.kind]?.[x.id]) err(where, `"${title}" inserts unknown ${x.kind} "${x.id}"`);
          if (x.t === 'insert' && x.kind === 'dose') err(where, `"${title}": put each dose on a line of its own ({{dose:${x.id}}}), so it shows as one dose row`);
          if (x.t === 'insert' && x.kind === 'regimen') err(where, `"${title}": put each regimen on a line of its own ({{regimen:${x.id}}}), so it shows in full`);
          if (x.t === 'insert' && x.kind === 'media') err(where, `"${title}": put each figure on a line of its own ({{media:${x.id}}})`);
          if (x.t === 'link') {
            const target = cards.find((k) => k.id === x.id);
            if (!target) err(where, `"${title}" links to unknown card "${x.id}"`);
            else if (x.section && !target.sections.some((t) => t.key === x.section || t.subsections?.some((u) => u.key === x.section))) err(where, `"${title}" links to unknown section "${x.section}" of "${x.id}"`);
          }
          if (x.t === 'tag' && !TAGS[x.v]) err(where, `"${title}": unknown tag "[!${x.v}]" (use ${Object.keys(TAGS).map((k) => `[!${k}]`).join(' or ')})`);
        }
      }
      for (const b of allBlocks(blocks)) {
        if (b.t === 'insert' && !data[b.kind]?.[b.id]) err(where, `"${title}" inserts unknown ${b.kind} "${b.id}"`);
        if (b.t === 'insert' && b.kind === 'calc') err(where, `"${title}": a calculator link goes inside a sentence ({{calc:${b.id}}}), not on a line of its own`);
        if (b.t === 'insert' && b.kind === 'pathway') err(where, `"${title}": a pathway opens from the card's header (its file names the card with "card:"); remove {{pathway:${b.id}}}`);
        if (CONTAINERS[b.t]) {
          const [lo, hi] = CONTAINERS[b.t];
          if (b.items.length < lo || b.items.length > hi) err(where, `"${title}": a :::${b.t} needs ${lo}–${hi} items (has ${b.items.length})`);
          if ((b.t === 'scale' || b.t === 'compare') && b.items.some((it) => !it.inlines.length)) err(where, `"${title}": each :::${b.t} item is "Label: text"`);
          if (b.attrs) {
            // :::times{after=first|<dose id> check=<what> unit=min|h}: what Timed Mode lists under Due Next.
            const a = b.attrs;
            if (b.t !== 'times') err(where, `"${title}": only :::times takes {…} settings`);
            for (const k of Object.keys(a)) if (!['after', 'check', 'unit'].includes(k)) err(where, `"${title}": unknown :::times setting "${k}" (use after, check, unit)`);
            if (!a.after || !a.check) err(where, `"${title}": :::times{…} needs after= (first, or a dose in Do Now) and check= (what is rechecked)`);
            else if (a.after !== 'first' && !doNowDoses.has(a.after)) err(where, `"${title}": :::times after="${a.after}" must be "first" or a dose in this topic's Do Now`);
            if (a.unit && !['min', 'h'].includes(a.unit)) err(where, `"${title}": :::times unit is min or h`);
            if (b.t === 'times' && b.items.some((it) => offsetMinutes(it.text, a.unit) == null)) err(where, `"${title}": every time needs a number and a unit ("1 h", or "30" with unit=min)`);
          }
          if (b.t === 'onset') for (const it of b.items) {
            const d = it.text.trim().match(DOSE_ONLY);
            if (d) {
              const dose = data.dose?.[d[1]];
              if (!dose) err(where, `"${title}": :::onset lists unknown dose "${d[1]}"`);
              else if (onsetMinutes(dose.onset) == null) err(where, `"${title}": dose "${d[1]}" needs an "onset" such as "About 15 minutes" to be compared`);
            } else if (!/^[^:]+: [^|]+(\|.*)?$/.test(it.text.trim()) || onsetMinutes(it.text.split(': ').slice(1).join(': ').split('|')[0]) == null) {
              err(where, `"${title}": each :::onset item is {{dose:id}} or "Name: onset | lasts" with an onset such as "Immediate" or "About 1 hour" ("${it.text.slice(0, 40)}")`);
            }
          }
        } else if (!['paragraph', 'list', 'table', 'steps', 'insert', 'subheading'].includes(b.t)) err(where, `"${title}": unknown block ":::${b.t}" (use scale, compare, times, onset or note)`);
      }
    }
    for (const [group, ids] of Object.entries(c.related ?? {})) {
      for (const id of ids ?? []) if (!cards.some((k) => k.id === id)) err(where, `related (${group}) lists unknown card "${id}"`);
    }
  }

  for (const [kind, items] of Object.entries(data)) {
    const def = DATA_TYPES[kind];
    for (const [id, item] of Object.entries(items)) {
      const where = item._file;
      if (!def) { err(where, `unknown data type "${kind}"`); continue; }
      for (const f of def.required) if (item[f] === undefined || item[f] === '') err(where, `missing "${f}"`);
      if (def.sourced) {
        if (!Array.isArray(item.sources) || item.sources.length === 0) err(where, 'has no sources');
        for (const s of item.sources ?? []) if (!data.source?.[s]) err(where, `cites unknown source "${s}"`);
      }
      if (item.unit && !UNITS.includes(item.unit)) err(where, `unit "${item.unit}" is not a recognized US unit`);
      if (kind === 'dose') {
        if (item.drug && !cards.some((k) => k.id === item.drug)) err(where, `drug card "${item.drug}" does not exist`);
        if (!item.frequency && !item.rate) err(where, 'needs a "frequency" or a "rate"');
        for (const f of Object.keys(item)) if (f !== '_file' && !DOSE_FIELDS.includes(f)) err(where, `unknown dose field "${f}" (see docs/DATA-TYPES.md)`);
        const alt = item.alternative;
        if (alt !== undefined && (typeof alt !== 'object' || !alt.dose)) err(where, 'alternative needs "dose" (a dose id) and optional "when"');
        if (alt?.dose && !data.dose?.[alt.dose]) err(where, `alternative dose "${alt.dose}" does not exist`);
        if (alt?.dose === id) err(where, 'a dose cannot be its own alternative');
        if (item.cautions !== undefined && (!Array.isArray(item.cautions) || item.cautions.some((x) => typeof x !== 'string'))) err(where, 'cautions must be a list of short sentences');
      }
      // A regimen: options joined by "or", each a list of parts given together; a part is a dose id or a list of dose
      // ids (any one of them). Its words never carry a dose: the dose rows do.
      if (kind === 'regimen') {
        for (const f of Object.keys(item)) if (f !== '_file' && !REGIMEN_FIELDS.includes(f)) err(where, `unknown regimen field "${f}" (see docs/DATA-TYPES.md)`);
        if (!Array.isArray(item.options) || !item.options.length) err(where, 'needs at least one option');
        for (const [i, o] of (Array.isArray(item.options) ? item.options : []).entries()) {
          const at = `option ${i + 1}`;
          if (!o || typeof o !== 'object') { err(where, `${at} must be { label, doses }`); continue; }
          for (const f of Object.keys(o)) if (!REGIMEN_OPTION_FIELDS.includes(f)) err(where, `${at}: unknown field "${f}" (use label, when, doses)`);
          if (!Array.isArray(o.doses) || !o.doses.length) { err(where, `${at} needs "doses": a list of dose ids (a nested list means any one of them)`); continue; }
          for (const part of o.doses) {
            const ids = Array.isArray(part) ? part : [part];
            if (!ids.length) err(where, `${at} has an empty list of doses`);
            for (const d of ids) if (typeof d !== 'string' || !data.dose?.[d]) err(where, `${at} lists unknown dose "${d}"`);
          }
        }
        if (item.notes !== undefined && (!Array.isArray(item.notes) || item.notes.some((x) => typeof x !== 'string'))) err(where, 'notes must be a list of short sentences');
        const texts = [item.name, item.indication, item.setting, item.duration, ...(item.notes ?? []), ...(item.options ?? []).flatMap((o) => [o?.label, o?.when])];
        for (const t of texts) if (typeof t === 'string' && DOSE_IN_TEXT.test(t)) err(where, `has a dose typed as text ("${t.match(DOSE_IN_TEXT)[0]}"); the dose rows show the doses`);
      }
      if (kind === 'calc') {
        for (const f of Object.keys(item)) if (f !== '_file' && !CALC_FIELDS.includes(f)) err(where, `unknown calculator field "${f}" (use ${CALC_FIELDS.join(', ')})`);
        if (typeof item.url === 'string' && !MDCALC_URL.test(item.url)) err(where, 'url must be an MDCalc calculator page: https://www.mdcalc.com/calc/<number>/<name>');
        if (!Array.isArray(item.match) || !item.match.length || item.match.some((x) => typeof x !== 'string' || !x.trim())) err(where, '"match" is a list of the words that name this calculator in the content');
        for (const [oid, o] of Object.entries(items)) {
          if (oid < id && o.url === item.url) err(where, `has the same url as calculator "${oid}"`);
          if (oid !== id) for (const term of item.match ?? []) if ((o.match ?? []).some((t) => String(t).toLowerCase() === String(term).toLowerCase())) err(where, `"${term}" is also a match word of calculator "${oid}"`);
        }
      }
      if (kind === 'criteria' && !(item.items?.length || item.rows?.length)) err(where, 'needs items or rows');
      if (kind === 'criteria') {
        const lay = item.layout ?? 'columns';
        if (!['columns', 'stacked'].includes(lay)) err(where, '"layout" is columns or stacked');
        if (lay === 'stacked') {
          if (!item.rows?.length) err(where, 'layout: stacked needs rows');
          else if (!Array.isArray(item.tones) || item.tones.length !== item.rows.length || item.tones.some((t) => !['yellow', 'orange', 'red'].includes(t))) err(where, 'layout: stacked needs "tones": one of yellow, orange, red per row, in order (severity only)');
        } else if (item.tones) err(where, '"tones" only applies with layout: stacked');
      }
      if (kind === 'criteria' && item.rows?.some((r) => !Array.isArray(r) || r.length !== (item.columns ?? []).length)) err(where, 'every row needs one cell per column');
      // A pathway: every link resolves, every box is reachable, doses come only from the card (docs/DATA-TYPES.md, 9).
      if (kind === 'pathway') for (const m of checkPathway(id, item, { cards, data })) err(where, m.slice(id.length + 2));
      if (kind === 'media') for (const m of checkMedia(id, item, { data })) err(where, m);
      // Words in shared data that show in the app follow the same rule as a card's: a named calculator is a link.
      const shown = kind === 'regimen' ? [item.name, item.setting, item.duration, ...(item.notes ?? []), ...(item.options ?? []).flatMap((o) => [o?.label, o?.when])]
        : kind === 'criteria' ? [...(item.items ?? []), ...(item.notes ?? []), ...(item.rows ?? []).flat()]
        : kind === 'pathway' ? Object.values(item.nodes ?? {}).flatMap((n) => (Array.isArray(n.text) ? n.text : [n.text]))
        : [];
      for (const t of shown) if (typeof t === 'string') for (const m of calcMentions(inlineText(parseInline(t)))) err(where, `names "${m.term}", a calculator; write {{calc:${m.id}}} so it links to MDCalc ("${t.slice(0, 50)}")`);
      if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id) === false) err(where, `id "${id}" must be lowercase words joined by hyphens`);
    }
  }

  // A cutoff with a note must be tappable somewhere, and its note must add something to every line it is tappable on.
  for (const [id, t] of Object.entries(data.threshold ?? {})) {
    const where = t._file;
    if (t.meaning !== undefined) err(where, '"meaning" is now "note": only what the reader can\'t see on the line (see docs/DATA-TYPES.md)');
    if (t.note === undefined) continue;
    const uses = thresholdUses.get(id) ?? [];
    const tappable = uses.filter((u) => !u.plain);
    if (!tappable.length) err(where, 'has a note, but it only appears in tables or scales, where values are plain; remove the note');
    if (numbers(t.value).some((n) => new RegExp(`(^|[^\\d.])${n.replace('.', '\\.')}($|[^\\d])`).test(t.note))) err(where, 'the note repeats the value; say only what the line doesn\'t');
    for (const u of tappable) {
      if (noteRepeats(t.note, `${u.text} ${t.name} ${t.unit}`)) err(where, `the note mostly repeats what ${u.where} already says; remove it (the value then shows plain) or say only what the line doesn't`);
    }
  }
  return errors;
}
