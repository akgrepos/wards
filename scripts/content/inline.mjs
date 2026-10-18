// Shared by the build and the app (no Node imports here).
// Inline text → tokens: text, strong, em, insert, link, tag.
// Links: [[card-id]], [[card-id|label]], [[card-id/section|label]] (opens that page at a section).
// Tags: [!cannot-miss], [!most-common] (a small label after a cause).
export const TAGS = { 'cannot-miss': 'Cannot miss', 'most-common': 'Most common' };

export function parseInline(text) {
  const out = [];
  const re = /\{\{\s*([a-z-]+)\s*:\s*([a-z0-9-]+)\s*\}\}|\[\[([a-z0-9-]+)(?:\/([a-z0-9-]+))?(?:\|([^\]]+))?\]\]|\[!([a-z-]+)\]|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push({ t: 'text', v: text.slice(last, m.index) });
    if (m[1]) out.push({ t: 'insert', kind: m[1], id: m[2] });
    else if (m[3]) out.push({ t: 'link', id: m[3], section: m[4] ?? null, label: m[5] ?? null });
    else if (m[6]) out.push({ t: 'tag', v: m[6] });
    else if (m[7]) out.push({ t: 'strong', v: m[7] });
    else out.push({ t: 'em', v: m[8] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ t: 'text', v: text.slice(last) });
  return out;
}
