// A coverage grid (docs/DATA-TYPES.md, 10): items (drugs) by organism groups, each cell reliable, variable or none.
// Shared by the content check and its tests. Returns every problem as a message.
export const COVERAGE_LEVELS = ['R', 'V', 'N'];

export function checkCoverage(id, g, { data }) {
  const out = [];
  const levels = g.levels ?? {};
  for (const l of COVERAGE_LEVELS) {
    if (typeof levels[l]?.word !== 'string' || typeof levels[l]?.meaning !== 'string') out.push(`"levels.${l}" needs a "word" and a "meaning" (the legend shows both)`);
  }
  const cols = Array.isArray(g.columns) ? g.columns : [];
  if (cols.length < 1 || cols.length > 7) out.push('"columns" lists 1 to 7 organism groups (a row of symbols must fit a phone)');
  const colIds = new Set();
  for (const c of cols) {
    if (!c?.id || !c?.name || !c?.short) out.push(`every column needs "id", "name" and "short" (${JSON.stringify(c)})`);
    else if (colIds.has(c.id)) out.push(`column "${c.id}" is listed twice`);
    else colIds.add(c.id);
    if (typeof c?.short === 'string' && c.short.length > 6) out.push(`column "${c.id}": "short" is under the symbol, keep it to 6 characters or fewer`);
  }
  const rows = Array.isArray(g.rows) ? g.rows : [];
  if (!rows.length) out.push('"rows" is empty');
  const seen = new Set();
  for (const r of rows) {
    const w = `row "${r?.drug}"`;
    if (!r?.drug || !r?.class) { out.push(`every row needs "drug" and "class" (${JSON.stringify(r?.drug ?? r)})`); continue; }
    if (seen.has(r.drug)) out.push(`${w} is listed twice`);
    seen.add(r.drug);
    const keys = Object.keys(r.cells ?? {});
    for (const c of colIds) if (!keys.includes(c)) out.push(`${w} has no cell for "${c}"`);
    for (const k of keys) {
      if (!colIds.has(k)) out.push(`${w} has a cell for unknown column "${k}"`);
      else if (!COVERAGE_LEVELS.includes(r.cells[k])) out.push(`${w}, "${k}": a cell is R, V or N`);
    }
    for (const k of r.cp_cells ?? []) if (!colIds.has(k)) out.push(`${w}: cp_cells names unknown column "${k}"`);
    if (typeof r.note !== 'string' || !r.note) out.push(`${w} needs a "note"`);
    if (!Array.isArray(r.sources) || !r.sources.length) out.push(`${w} has no sources`);
    for (const s of r.sources ?? []) {
      if (!data.source?.[s]) out.push(`${w} cites unknown source "${s}"`);
      else if (!(g.sources ?? []).includes(s)) out.push(`${w}: source "${s}" is missing from the top-level "sources" (the card lists them)`);
    }
  }
  return out;
}
