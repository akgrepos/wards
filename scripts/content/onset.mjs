// Shared by the build and the app (no Node imports here).
// A :::onset block lists treatments by how fast they act. Each item is a dose ({{dose:id}}, whose onset and
// duration come from the dose item) or, for something that isn't a dose, "Name: onset | lasts ^[source]".

const DOSE_ONLY = /^\{\{\s*dose\s*:\s*([a-z0-9-]+)\s*\}\}$/;

// "1–3 minutes" → 1, "About 7 hours" → 420, "Immediate" → 0; null when it can't be read.
export function onsetMinutes(text) {
  if (typeof text !== 'string') return null;
  const s = text.toLowerCase();
  if (/immediate/.test(s)) return 0;
  const m = s.match(/(\d+(?:\.\d+)?)\s*(?:[–-]\s*\d+(?:\.\d+)?\s*)?(min|minutes?|h|hours?)\b/);
  if (!m) return null;
  return Number(m[1]) * (m[2].startsWith('h') ? 60 : 1);
}

// The block's rows, fastest first: { name, onset, lasts, dose?, sources }.
export function onsetRows(items, doses) {
  const rows = items.map((it, i) => {
    const d = it.text.trim().match(DOSE_ONLY);
    if (d) {
      const dose = doses?.[d[1]];
      return { i, name: dose?.drug_name ?? d[1], onset: dose?.onset ?? '', lasts: dose?.lasts ?? '', dose: d[1], sources: dose?.sources ?? [] };
    }
    const at = it.text.indexOf(': ');
    const name = at < 0 ? it.text.trim() : it.text.slice(0, at).trim();
    const [onset = '', lasts = ''] = (at < 0 ? '' : it.text.slice(at + 2)).split('|').map((x) => x.trim());
    return { i, name, onset, lasts, sources: it.sources };
  });
  const key = (r) => onsetMinutes(r.onset) ?? Infinity;
  return rows.sort((a, b) => key(a) - key(b) || a.i - b.i);
}
