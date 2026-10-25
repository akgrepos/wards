// Writing-style lint (docs/CARD-WRITING-CHEATSHEET.md, "Writing style"). Warnings only: they print with the other
// content warnings and never fail the check. One warning per card and rule, with how many bullets and the first one.
const MAX_BULLET = 220;
const ABBR = /\b(e\.g|i\.e|vs|approx|Dr|St|No|Fig|etc|cf)\./g;

const textOf = (inlines) => (inlines ?? []).map((x) => (x.t === 'link' ? x.label ?? x.id : x.t === 'insert' ? '' : x.v ?? '')).join('');
const sentences = (t) => t.replace(ABBR, (m) => m.replace('.', '')).split(/[.!?]\s+(?=[A-Z(])/).filter((s) => s.trim());

function* lists(blocks) {
  for (const b of blocks ?? []) if (b.t === 'list') yield b.items;
}

export function checkStyle({ cards }) {
  const out = [];
  for (const c of cards) {
    const parts = c.sections.flatMap((s) => [s.blocks, ...(s.subsections ?? []).map((x) => x.blocks)]);
    const many = []; // bullets with several sentences or very long
    const mixed = []; // lists whose items do not share one shape
    for (const blocks of parts) {
      for (const items of lists(blocks)) {
        const flat = items.flatMap((i) => [i, ...i.children]);
        for (const it of flat) {
          const t = textOf(it.inlines);
          if (sentences(t).length > 1 || t.length > MAX_BULLET) many.push(t);
        }
        if (items.length >= 3) {
          const labelled = items.filter((i) => i.inlines?.[0]?.t === 'strong').length;
          if (labelled > 0 && labelled < items.length) mixed.push(textOf(items[0].inlines));
        }
      }
    }
    const show = (t) => `"${t.slice(0, 60)}${t.length > 60 ? '…' : ''}"`;
    if (many.length) out.push(`${c.file}: style, one idea per bullet: ${many.length} bullet${many.length === 1 ? '' : 's'} run to several sentences or over ${MAX_BULLET} characters, for example ${show(many[0])} (docs/CARD-WRITING-CHEATSHEET.md, "Writing style")`);
    if (mixed.length) out.push(`${c.file}: style, parallel items: ${mixed.length} list${mixed.length === 1 ? '' : 's'} mix bold-label bullets with plain ones, for example the list starting ${show(mixed[0])} (docs/CARD-WRITING-CHEATSHEET.md, "Writing style")`);
  }
  return out;
}
