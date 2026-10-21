// Media items (docs/DATA-TYPES.md, 11. Media): ECG recordings from open datasets and drawn ECGs, shown as figures.
// An ECG keeps only the leads it shows, 10 seconds at most, as numbers in 0.01 mV; the rest of the record stays out.

export const MEDIA_KINDS = ['ecg', 'ecg-drawing'];
export const MEDIA_FIELDS = ['kind', 'title', 'alt', 'caption', 'illustrates', 'sources', 'show', 'marks', 'recording', 'panels'];
export const MARK_KINDS = {
  // Bracket over a stretch of time, with its measurement ("R-R 602 ms"); above the trace unless place: below.
  interval: ['from', 'to', 'label'],
  // A shaded stretch from low to high mV: the part of the wave to look at.
  band: ['from', 'to', 'low', 'high'],
  // A dashed line at a voltage (the PR baseline that ST and T are measured from).
  baseline: ['from', 'to', 'mv'],
  // A vertical bracket from one voltage to another at a time, with its measurement ("9.5 mm").
  height: ['at', 'from_mv', 'to_mv', 'label'],
  // A label at a time and voltage; place: above, below or below2 (a second line under it); align: start, middle, end.
  text: ['at', 'mv', 'label'],
};
const PLACES = ['above', 'below', 'below2'];
const ALIGNS = ['start', 'middle', 'end'];

// "12 -3 40 …" → numbers (0.01 mV).
export function samples(text) {
  return String(text).trim().split(/\s+/).map(Number);
}

const num = (v) => typeof v === 'number' && Number.isFinite(v);

function checkMarks(marks, lo, hi, say) {
  if (marks === undefined) return;
  if (!Array.isArray(marks)) return say('"marks" must be a list');
  marks.forEach((m, i) => {
    const at = `mark ${i + 1}`;
    const need = MARK_KINDS[m?.kind];
    if (!need) return say(`${at}: kind must be one of ${Object.keys(MARK_KINDS).join(', ')}`);
    for (const f of need) if (m[f] === undefined) say(`${at} (${m.kind}) needs "${f}"`);
    for (const f of ['from', 'to', 'at']) if (m[f] !== undefined && (!num(m[f]) || m[f] < lo || m[f] > hi)) say(`${at}: "${f}" must be a time in seconds inside the part shown (${lo}–${hi} s)`);
    for (const f of ['low', 'high', 'mv', 'from_mv', 'to_mv']) if (m[f] !== undefined && (!num(m[f]) || Math.abs(m[f]) > 5)) say(`${at}: "${f}" must be a voltage in mV`);
    if (num(m.from) && num(m.to) && m.from >= m.to) say(`${at}: "from" must come before "to"`);
    if (m.label !== undefined && (typeof m.label !== 'string' || !m.label.trim() || m.label.length > 24)) say(`${at}: "label" is a short measurement or word (24 characters at most)`);
    if (m.place !== undefined && !PLACES.includes(m.place) && !(m.kind === 'interval' && ['above', 'below'].includes(m.place))) say(`${at}: "place" is ${PLACES.join(', ')}`);
    if (m.align !== undefined && !ALIGNS.includes(m.align)) say(`${at}: "align" is ${ALIGNS.join(', ')}`);
  });
}

export function checkMedia(id, item, { data }) {
  const out = [];
  const say = (m) => out.push(m);
  for (const f of Object.keys(item)) if (f !== '_file' && !MEDIA_FIELDS.includes(f)) say(`unknown media field "${f}" (see docs/DATA-TYPES.md)`);
  if (!MEDIA_KINDS.includes(item.kind)) { say(`kind must be ${MEDIA_KINDS.join(' or ')}`); return out; }
  if (item.kind === 'ecg') {
    const r = item.recording;
    if (!r || typeof r !== 'object') { say('an ECG needs "recording": dataset, record, rate, leads'); return out; }
    const ds = data.source?.[r.dataset];
    if (!ds) say(`recording: unknown dataset source "${r.dataset}"`);
    else {
      if (ds.kind !== 'dataset') say(`recording: "${r.dataset}" is a ${ds.kind}, not a dataset`);
      if (!ds.license || !ds.license_url) say(`dataset "${r.dataset}" needs its "license" (e.g. CC BY 4.0) and "license_url", shown and linked in the credit`);
    }
    if (typeof r.record !== 'string' || !r.record) say('recording: "record" is the dataset\'s record ID, in quotes');
    if (!num(r.rate) || r.rate < 100 || r.rate > 1000) say('recording: "rate" is samples per second (e.g. 250)');
    const leads = r.leads && typeof r.leads === 'object' ? r.leads : {};
    const names = Object.keys(leads);
    if (!names.length) say('recording: "leads" needs at least one lead');
    let n = null;
    for (const L of names) {
      const xs = samples(leads[L]);
      if (xs.some((v) => !Number.isInteger(v) || Math.abs(v) > 1000)) say(`lead ${L}: samples are whole numbers in 0.01 mV (within ±10 mV)`);
      if (n !== null && xs.length !== n) say(`lead ${L}: every lead needs the same number of samples`);
      n = xs.length;
    }
    const seconds = n && num(r.rate) ? n / r.rate : 0;
    if (seconds > 10.01) say(`keep 10 seconds at most (has ${seconds.toFixed(1)} s): only the excerpt shown`);
    const s = item.show;
    if (!s || typeof s !== 'object') say('an ECG needs "show": { lead, from, to }');
    else {
      if (!names.includes(s.lead)) say(`show: lead "${s.lead}" is not in the recording`);
      if (!num(s.from) || !num(s.to) || s.from < 0 || s.to > seconds || s.from >= s.to) say(`show: from and to are seconds inside the recording (0–${seconds.toFixed(1)})`);
      else if (s.to - s.from > 4) say('show: a card shows 4 seconds at most; full screen shows the whole recording');
      if (s.smooth !== undefined && (!num(s.smooth) || s.smooth < 0 || s.smooth > 4)) say('show: "smooth" is 0–4 samples');
      checkMarks(item.marks, s.from ?? 0, s.to ?? seconds, say);
    }
    if (item.panels !== undefined) say('"panels" is for drawn ECGs (kind: ecg-drawing)');
  }
  if (item.kind === 'ecg-drawing') {
    if (item.recording !== undefined || item.show !== undefined) say('a drawing has "panels", not a recording');
    const ps = item.panels;
    if (!Array.isArray(ps) || ps.length < 1 || ps.length > 6) { say('"panels" needs 1–6 drawings'); return out; }
    ps.forEach((p, i) => {
      const at = `panel ${i + 1}`;
      if (!p?.title) say(`${at} needs a "title"`);
      if (!num(p?.seconds) || p.seconds <= 0 || p.seconds > 4) say(`${at}: "seconds" is its width in time (up to 4)`);
      const hasWaves = p?.waves !== undefined, hasSine = p?.sine !== undefined;
      if (hasWaves === hasSine) say(`${at} needs either "waves" (with "beats") or "sine"`);
      if (hasWaves && (!Array.isArray(p.waves) || p.waves.some((w) => !Array.isArray(w) || w.length !== 3 || !w.every(num) || w[2] <= 0))) say(`${at}: each wave is [height mV, center s from the R wave, width s]`);
      if (hasWaves && (!Array.isArray(p.beats) || !p.beats.length || !p.beats.every(num))) say(`${at}: "beats" lists when each R wave falls (seconds)`);
      if (hasSine && (!num(p.sine?.mv) || !num(p.sine?.period) || p.sine.period <= 0)) say(`${at}: "sine" is { mv, period, phase }`);
      checkMarks(p.marks, 0, p.seconds ?? 0, (m) => say(`${at}: ${m}`));
    });
  }
  return out;
}
