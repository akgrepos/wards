// How card text is read for display (src/ui/Rich.tsx) and for the build checks (prose.mjs): the same rules in one place,
// so a check never disagrees with what the reader sees.

// "4 or more: possible delirium. 1–3: possible impairment. 0: unlikely." as separate lines with a range pill.
// Only when every sentence starts with a range and a colon, so ordinary notes are never split.
const RANGE = '(?:\\d+(?:\\.\\d+)?(?:\\s?[–-]\\s?\\d+(?:\\.\\d+)?)?(?:\\s+or\\s+(?:more|fewer|less|higher|lower|greater))?|[<>≤≥]\\s?\\d+(?:\\.\\d+)?)';
const BAND = new RegExp(`^(${RANGE}):\\s+(.+)$`, 'u');
export function bandsOf(text) {
  const parts = text.split(new RegExp(`(?<=[.)])\\s+(?=${RANGE}:\\s)`, 'u'));
  if (parts.length < 2) return null;
  const bands = [];
  for (const p of parts) {
    const m = p.trim().match(BAND);
    if (!m) return null;
    bands.push({ range: m[1], text: m[2].replace(/\.$/, '') });
  }
  return bands;
}

// "Label: explanation" in plain text (criteria items): the label is short and has no sentence in it.
export function labelSplit(text) {
  const m = text.match(/^([^:.{}\[]{2,70}):\s+(\S.*)$/su);
  return m ? { label: `${m[1]}:`, rest: m[2] } : null;
}

// "1. Alertness: …" in plain text: the number belongs to the item, not to a bullet.
export function numberedPrefix(text) {
  const m = text.match(/^(\d+)\.\s+(\S.*)$/su);
  return m ? { n: Number(m[1]), rest: m[2] } : null;
}

// The Monitor convention: an item whose sub-items are only What, When and Action lines shows as a designed block.
export const MONITOR_WORD = { what: 'Check', when: 'When', action: 'Then' };
export function monitorKind(inlines) {
  const first = inlines?.[0];
  if (first?.t !== 'text') return null;
  const m = first.v.match(/^\s*(What|When|Action):\s*/);
  return m ? { kind: m[1].toLowerCase(), skip: m[0].length } : null;
}
export function isMonitorItem(it) {
  return it.children.length > 0 && it.children.every((c) => monitorKind(c.inlines));
}

// A list item that is only dose pills, or a label and dose pills ("Alternatives: {{dose:a|pill}} or {{dose:b|pill}}").
// Returns the label inlines and the pills, or null.
const isPill = (x) => x.t === 'insert' && x.kind === 'dose' && x.label === 'pill';
export function doseOnlyItem(inlines) {
  const at = inlines.findIndex(isPill);
  if (at < 0) return null;
  const head = inlines.slice(0, at);
  if (head.some((x) => x.t !== 'text' && x.t !== 'strong' && x.t !== 'em')) return null;
  const headText = head.map((x) => x.v).join('');
  if (head.length && !/:\s*$/.test(headText)) return null;
  const pills = [];
  for (const x of inlines.slice(at)) {
    if (isPill(x)) pills.push(x);
    else if (x.t === 'text' && /^[\s.,;]*(?:(?:or|and)[\s.,;]*)?$/i.test(x.v)) continue;
    else return null;
  }
  return { label: head, pills };
}
export const dosePillCount = (inlines) => inlines.filter(isPill).length;
