// Content checks, run on every pull request (npm run content:check) and in the tests.
// Each rule comes from docs/CARD-TYPES.md and docs/DATA-TYPES.md.
import { CARD_TYPES, DATA_TYPES, UNITS, DOSE_IN_TEXT } from './schema.mjs';

function inlineText(inlines) {
  return inlines.filter((x) => x.t !== 'insert' && x.t !== 'link').map((x) => x.v ?? '').join('');
}

// Every block's inline runs, with the sources attached to it.
function* runs(blocks) {
  for (const b of blocks) {
    if (b.t === 'paragraph') yield { inlines: b.inlines, sources: b.sources };
    if (b.t === 'list') for (const it of b.items) { yield { inlines: it.inlines, sources: it.sources }; for (const c of it.children) yield { inlines: c.inlines, sources: c.sources }; }
    if (b.t === 'table') { for (const h of b.header) yield { inlines: h, sources: [], header: true }; for (const r of b.rows) for (const c of r.cells) yield { inlines: c, sources: r.sources }; }
  }
}

export function checkContent({ systems, cards, data }) {
  const errors = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);
  const systemIds = new Set(systems.map((s) => s.id));
  for (const s of systems) if (typeof s.title !== 'string' || !s.title || typeof s.id !== 'string') errors.push(`content/systems.yaml: system "${s.id}" needs an id and a title (quote titles that contain commas)`);
  const cardIds = new Map();

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
    const order = type.sections.map((s) => s.key);
    const allowed = c.variant ? new Set([...type.variants[c.variant], 'pearls']) : null;
    let lastIdx = -1;
    for (const s of c.sections) {
      const idx = order.indexOf(s.key);
      if (idx < 0) continue;
      if (idx <= lastIdx) err(where, `section "${s.title}" is out of order`);
      lastIdx = Math.max(lastIdx, idx);
      if (allowed && !allowed.has(s.key)) err(where, `section "${s.title}" is not part of the ${c.variant} variant`);
    }
    for (const req of type.sections.filter((s) => s.required)) {
      if (!c.sections.some((s) => s.key === req.key)) err(where, `missing required section "${req.title}"`);
    }
    const kp = c.sections.find((s) => s.key === 'key-points');
    if (kp) {
      const n = kp.blocks.filter((b) => b.t === 'list').reduce((a, b) => a + b.items.length, 0);
      if (n < 3 || n > 6) err(where, `Key points should have 3–6 bullets (has ${n})`);
    }
    for (const s of c.sections) {
      if (s.summary && !(s.summarySources ?? []).length) err(where, `"${s.title}": the summary has no source`);
      for (const id of s.summarySources ?? []) if (!data.source?.[id]) err(where, `"${s.title}" summary cites unknown source "${id}"`);
      for (const blocks of [s.blocks, s.more]) {
        for (const r of runs(blocks)) {
          const text = inlineText(r.inlines);
          if (DOSE_IN_TEXT.test(text)) err(where, `"${s.title}" has a dose typed as text ("${text.match(DOSE_IN_TEXT)[0]}"); insert it with {{dose:…}}`);
          for (const id of r.sources) if (!data.source?.[id]) err(where, `"${s.title}" cites unknown source "${id}"`);
          const factual = !r.header && text.replace(/[\s.,;:()–-]/g, '').length > 0;
          if (factual && r.sources.length === 0 && !r.inlines.some((x) => x.t === 'insert')) err(where, `"${s.title}": a line has no source ("${text.slice(0, 60)}…")`);
          for (const x of r.inlines) {
            if (x.t === 'insert' && !data[x.kind]?.[x.id]) err(where, `"${s.title}" inserts unknown ${x.kind} "${x.id}"`);
            if (x.t === 'link' && !cards.some((k) => k.id === x.id)) err(where, `"${s.title}" links to unknown card "${x.id}"`);
          }
        }
        for (const b of blocks) if (b.t === 'insert' && !data[b.kind]?.[b.id]) err(where, `"${s.title}" inserts unknown ${b.kind} "${b.id}"`);
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
      if (kind === 'dose' && item.drug && !cards.some((k) => k.id === item.drug)) err(where, `drug card "${item.drug}" does not exist`);
      if (kind === 'pathway') {
        const steps = item.steps ?? {};
        if (!steps[item.start]) err(where, `start step "${item.start}" does not exist`);
        for (const [sid, st] of Object.entries(steps)) {
          const targets = [...(st.answers ?? []).map((a) => a.to), st.yes, st.no, st.next].filter(Boolean);
          for (const t of targets) if (!steps[t]) err(where, `step "${sid}" leads to missing step "${t}"`);
          if (st.kind !== 'result' && targets.length === 0) err(where, `step "${sid}" leads nowhere`);
          if (item.stages && st.stage && !item.stages.includes(st.stage)) err(where, `step "${sid}" has unknown stage "${st.stage}"`);
        }
      }
      if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id) === false) err(where, `id "${id}" must be lowercase words joined by hyphens`);
    }
  }
  return errors;
}
