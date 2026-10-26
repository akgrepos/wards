// Shared by the build and the app (no Node imports here).
// Inline text → tokens: text, strong, em, insert, link, tag.
// Links: [[card-id]], [[card-id|label]], [[card-id/section|label]] (opens that page at a section).
// Calculators: {{calc:curb-65}} or {{calc:anion-gap|Anion gap}} (the words shown, when they differ from the calculator's own).
// Tags: [!cannot-miss], [!most-common] (a small label after a cause).
export const TAGS = { 'cannot-miss': 'Cannot miss', 'most-common': 'Most common' };
// An author marker, never shown: a warning line in More Information that Treatment or Monitor already carries ([!also-above]).
export const ALSO_ABOVE = 'also-above';

export function parseInline(text) {
  const out = [];
  const re = /\{\{\s*([a-z-]+)\s*:\s*([a-z0-9-]+)(?:\|([^}]*?))?\s*\}\}|\[\[([a-z0-9-]+)(?:\/([a-z0-9-]+))?(?:\|([^\]]+))?\]\]|\[!([a-z-]+)\]|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push({ t: 'text', v: text.slice(last, m.index) });
    if (m[1]) out.push({ t: 'insert', kind: m[1], id: m[2], ...(m[3] != null ? { label: m[3] } : {}) });
    else if (m[4]) out.push({ t: 'link', id: m[4], section: m[5] ?? null, label: m[6] ?? null });
    else if (m[7]) out.push({ t: 'tag', v: m[7] });
    else if (m[8]) out.push({ t: 'strong', v: m[8] });
    else out.push({ t: 'em', v: m[9] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ t: 'text', v: text.slice(last) });
  return out;
}
