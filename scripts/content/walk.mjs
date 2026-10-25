// Ways of walking a parsed card, shared by the content checks (check.mjs) and the format rules (rules.mjs).
const DOSE_ONLY = /^\{\{\s*dose\s*:\s*([a-z0-9-]+)\s*\}\}$/;

export function inlineText(inlines) {
  return inlines.filter((x) => x.t !== 'insert' && x.t !== 'link').map((x) => x.v ?? '').join('');
}

// Every block's inline runs, with the sources attached to it (steps and containers included).
export function* runs(blocks) {
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
export function* allBlocks(blocks) {
  for (const b of blocks) { yield b; if (b.t === 'steps') for (const it of b.items) yield* allBlocks(it.blocks); }
}
