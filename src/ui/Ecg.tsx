// ECG figures (docs/DATA-TYPES.md, 11. Media; DECISIONS 2026-10-21 "ECG figures").
// Drawn to the true ECG scale on a 1 mm / 5 mm grid: 25 mm/s and 10 mm/mV, whatever the screen width. The card shows a
// short, lightly smoothed excerpt with the measurements its criteria use; full screen shows every stored lead for the
// whole recording, unsmoothed, with no marks. Labels follow Text Size; colors follow light and dark.
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { AKG } from '../design/akg';
import { content } from '../content';
import type { EcgDrawing, EcgMark, EcgRecording, Inline, Source } from '../content/types';
import { samples } from '../../scripts/content/media.mjs';

const MM_PER_S = 25;
const MM_PER_MV = 10;
const FULL_PX_PER_MM = 5; // full screen at 1× (zoom goes to 4×)

// Width of the element and the size of 11-point text (Text Size), both kept up to date.
function useBox() {
  const ref = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState({ w: 0, font: 11 });
  useLayoutEffect(() => {
    const read = () => setBox({ w: ref.current?.clientWidth ?? 0, font: probe.current?.getBoundingClientRect().height || 11 });
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read);
    if (ref.current) ro.observe(ref.current);
    if (probe.current) ro.observe(probe.current);
    return () => ro.disconnect();
  }, []);
  return { ref, probe, ...box };
}

// A light Gaussian smoothing, for the card only (the credit says "smoothed for display").
function smooth(x: number[], sigma: number) {
  if (!sigma) return x;
  const r = Math.ceil(sigma * 2.5);
  const k = Array.from({ length: 2 * r + 1 }, (_, i) => Math.exp(-(((i - r) / sigma) ** 2) / 2));
  const sum = k.reduce((a, b) => a + b, 0);
  return x.map((_, i) => k.reduce((acc, w, j) => acc + w * x[Math.min(x.length - 1, Math.max(0, i + j - r))], 0) / sum);
}

// A smooth curve through the points (Catmull-Rom as cubic Béziers).
function curve(p: [number, number][]) {
  if (!p.length) return '';
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], e = p[Math.min(p.length - 1, i + 2)];
    d += `C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)} ${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)} ${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`;
  }
  return d;
}

// Grid lines every millimetre, heavier every 5 mm, lined up with 0 mV and the first second shown.
function Grid({ w, h, k, x0, y0 }: { w: number; h: number; k: number; x0: number; y0: number }) {
  const minor: string[] = [], major: string[] = [];
  const first = (o: number) => Math.ceil(-o / k);
  for (let i = first(x0); x0 + i * k <= w; i++) (i % 5 ? minor : major).push(`M${(x0 + i * k).toFixed(1)} 0V${h.toFixed(1)}`);
  for (let i = first(y0); y0 + i * k <= h; i++) (i % 5 ? minor : major).push(`M0 ${(y0 + i * k).toFixed(1)}H${w.toFixed(1)}`);
  return <><path className="ecg-grid-minor" d={minor.join('')} /><path className="ecg-grid-major" d={major.join('')} /></>;
}

type Trace = { label?: string; mv: number[]; rate: number; t0: number };

// One strip: a trace (mV against seconds) from `from` to `to`, its marks, on the grid. Coordinates are screen pixels,
// so text keeps its real size. Marks are placed clear of the trace using the trace's own extent.
function Strip({ trace, from, to, marks = [], width, font, lead, margin = 1, room = 0 }: { trace: Trace; from: number; to: number; marks?: EcgMark[]; width: number; font: number; lead?: string; margin?: number; room?: number }) {
  const k = width / ((to - from) * MM_PER_S + 2 * margin); // px per mm
  const X = (t: number) => (margin + (t - from) * MM_PER_S) * k;
  const Y = (mv: number) => -mv * MM_PER_MV * k; // 0 mV at 0; shifted below
  const i0 = Math.max(0, Math.floor((from - trace.t0) * trace.rate)), i1 = Math.min(trace.mv.length - 1, Math.ceil((to - trace.t0) * trace.rate));
  const pts: [number, number][] = [];
  for (let i = i0; i <= i1; i++) pts.push([X(trace.t0 + i / trace.rate), Y(trace.mv[i])]);
  const within = (a: number, b: number) => pts.filter(([x]) => x >= X(a) - 1 && x <= X(b) + 1).map(([, y]) => y);
  const gap = Math.max(4, font * 0.35), line = font * 1.25;
  // Everything drawn, with its vertical extent, so the strip is tall enough and nothing is clipped.
  const parts: ReactNode[] = [];
  let top = Math.min(...pts.map((p) => p[1])), bottom = Math.max(...pts.map((p) => p[1]));
  const extend = (a: number, b: number) => { top = Math.min(top, a, b); bottom = Math.max(bottom, a, b); };
  // Rough width of a label (system font, semibold); labels are kept inside the strip.
  const est = (s: string) => s.length * font * 0.58;
  const text = (x: number, y: number, s: string, anchor: 'start' | 'middle' | 'end' = 'middle', key?: string) => {
    const w = est(s), left = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
    x += Math.max(0, 2 - left) - Math.max(0, left + w - (width - 2));
    extend(y - font, y + font * 0.3);
    return <text key={key} className="ecg-mark-text" x={x} y={y} textAnchor={anchor} style={{ fontSize: font }}>{s}</text>;
  };
  marks.forEach((m, n) => {
    const key = `m${n}`;
    if (m.kind === 'band') { extend(Y(m.high!), Y(m.low!)); parts.push(<rect key={key} className="ecg-band" x={X(m.from!)} y={Y(m.high!)} width={X(m.to!) - X(m.from!)} height={Y(m.low!) - Y(m.high!)} rx={3} />); }
    if (m.kind === 'baseline') parts.push(<path key={key} className="ecg-baseline" d={`M${X(m.from!)} ${Y(m.mv!)}H${X(m.to!)}`} />);
    if (m.kind === 'interval') {
      const ys = within(m.from!, m.to!);
      const below = m.place === 'below';
      const y = below ? Math.max(...ys) + gap * 1.5 : Math.min(...ys) - gap * 1.5;
      const tick = below ? -gap : gap;
      parts.push(<path key={key} className="ecg-mark" d={`M${X(m.from!)} ${y + tick}V${y}H${X(m.to!)}V${y + tick}`} />);
      extend(y, y);
      // align: end puts the label's end at the bracket's end (room on the left), start at its start; middle by default.
      const lx = m.align === 'end' ? X(m.to!) : m.align === 'start' ? X(m.from!) : (X(m.from!) + X(m.to!)) / 2;
      parts.push(text(lx, below ? y + font + 2 : y - 4, m.label!, m.align ?? 'middle', `${key}t`));
    }
    if (m.kind === 'height') {
      const x = X(m.at!), ya = Y(m.from_mv!), yb = Y(m.to_mv!);
      parts.push(<path key={key} className="ecg-mark" d={`M${x - 3} ${ya}H${x + 3}M${x} ${ya}V${yb}M${x - 3} ${yb}H${x + 3}`} />);
      // Beside the bracket when it fits; otherwise above its top end, ending at the bracket.
      if (x + 5 + est(m.label!) <= width - 2) parts.push(text(x + 5, (ya + yb) / 2 + font * 0.35, m.label!, 'start', `${key}t`));
      else parts.push(text(x + 3, Math.min(ya, yb) - gap, m.label!, 'end', `${key}t`));
    }
    if (m.kind === 'text') {
      const y0 = Y(m.mv!);
      const y = m.place === 'above' ? y0 - gap : m.place === 'below2' ? y0 + gap + font + line : y0 + gap + font;
      parts.push(text(X(m.at!), y, m.label!, m.align ?? 'middle', key));
    }
  });
  // `room`: space kept clear under the trace (for the Figure's enlarge badge in the corner).
  const padTop = lead ? Math.max(gap, font + 6) : gap, padBottom = Math.max(gap, room);
  const shift = -top + padTop;
  const h = bottom - top + padTop + padBottom;
  return (
    <svg className="ecg-strip" width={width} height={h} viewBox={`0 0 ${width} ${h}`} aria-hidden="true">
      <rect className="ecg-paper" width={width} height={h} />
      <Grid w={width} h={h} k={k} x0={X(from)} y0={shift} />
      <g transform={`translate(0 ${shift})`}>
        {parts}
        <path className="ecg-trace" d={curve(pts)} />
      </g>
      {lead && <text className="ecg-lead" x={4} y={font + 2} style={{ fontSize: font }}>{lead}</text>}
    </svg>
  );
}

// The card's excerpt, sized to the column.
function CardStrip({ ecg }: { ecg: EcgRecording }) {
  const { ref, probe, w, font } = useBox();
  const rate = ecg.recording.rate;
  const raw = samples(ecg.recording.leads[ecg.show.lead]).map((v) => v / 100);
  const mv = smooth(raw, ecg.show.smooth ?? 0);
  return (
    <div ref={ref} className="ecg-box">
      <span ref={probe} className="ecg-probe" aria-hidden="true">0</span>
      {w > 0 && <Strip trace={{ mv, rate, t0: 0 }} from={ecg.show.from} to={ecg.show.to} marks={ecg.marks} width={w} font={font} lead={ecg.show.lead} room={40} />}
    </div>
  );
}

// Full screen: every stored lead, the whole recording, raw, no marks; the Figure viewer scrolls and zooms it.
function FullStrips({ ecg }: { ecg: EcgRecording }) {
  const { ref, probe, w, font } = useBox();
  const rate = ecg.recording.rate;
  const leads = Object.entries(ecg.recording.leads).map(([L, s]) => ({ L, mv: samples(s).map((v) => v / 100) }));
  const secs = leads[0].mv.length / rate;
  return (
    <div ref={ref} className="ecg-box ecg-full">
      <span ref={probe} className="ecg-probe" aria-hidden="true">0</span>
      {w > 0 && leads.map(({ L, mv }) => <Strip key={L} trace={{ mv, rate, t0: 0 }} from={0} to={secs} width={w} font={font} lead={L} />)}
    </div>
  );
}
export const fullWidth = (ecg: EcgRecording) => {
  const first = Object.values(ecg.recording.leads)[0];
  return Math.round((samples(first).length / ecg.recording.rate * MM_PER_S + 2) * FULL_PX_PER_MM);
};

// A drawn beat: smooth bumps [height mV, center s from the R wave, width s] around each R wave, or a sine wave.
function drawPanel(p: EcgDrawing['panels'][number], rate = 250) {
  const n = Math.round(p.seconds * rate);
  return Array.from({ length: n }, (_, i) => {
    const t = i / rate;
    if (p.sine) return p.sine.mv * Math.sin((2 * Math.PI * (t - (p.sine.phase ?? 0))) / p.sine.period);
    return (p.beats ?? []).reduce((acc, r) => acc + (p.waves ?? []).reduce((s, [a, c, wd]) => s + a * Math.exp(-(((t - r - c) / wd) ** 2) / 2), 0), 0);
  });
}

function DrawnPanel({ p }: { p: EcgDrawing['panels'][number] }) {
  const { ref, probe, w, font } = useBox();
  return (
    <div ref={ref} className="ecg-box">
      <span ref={probe} className="ecg-probe" aria-hidden="true">0</span>
      {w > 0 && <Strip trace={{ mv: drawPanel(p), rate: 250, t0: 0 }} from={0} to={p.seconds} marks={p.marks} width={w} font={font} />}
    </div>
  );
}

const src = (id: string) => content.data.source?.[id] as (Source & { license?: string; license_url?: string }) | undefined;

// The figure a card shows for {{media:id}}. `pill` is the card's source pill for the caption (its criteria's sources).
export function MediaFigure({ id, pill }: { id: string; pill: (ids: string[], quote: Inline[] | string) => ReactNode }) {
  const item = content.data.media?.[id] as EcgRecording | EcgDrawing | undefined;
  if (!item) return <span className="missing">[missing media: {id}]</span>;
  const scale = '25 mm/s · 10 mm/mV';
  if (item.kind === 'ecg-drawing') {
    const based = item.sources.map((s) => src(s)?.short ?? s).join(', ');
    return (
      <figure className="ecg-set" aria-label={item.alt}>
        <div className="ecg-panels">
          {item.panels.map((p, i) => (
            <AKG.Figure key={i} alt={`${p.title}: ${p.cue ?? ''}`} zoomable={false} caption={<><span className="ecg-panel-title">{p.title}</span>{p.cue && <><br />{p.cue}</>}</>}>
              <DrawnPanel p={p} />
            </AKG.Figure>
          ))}
        </div>
        <figcaption className="akg-figure__caption">
          <span>{item.caption}{pill(item.sources, item.caption)}</span>
          <span className="akg-figure__credit">Drawing based on {based} · {scale}</span>
        </figcaption>
      </figure>
    );
  }
  const ds = src(item.recording.dataset);
  // CC BY credit: the dataset, the record, what was changed, and the license (linked).
  const license = ds?.license ? (ds.license_url ? <a className="akg-link" href={ds.license_url} target="_blank" rel="noreferrer">{ds.license}</a> : ds.license) : null;
  const credit = <>{ds?.short ?? item.recording.dataset} record {item.recording.record} · excerpt{item.show.smooth ? ', smoothed for display' : ''}{license && <> · {license}</>} · {scale}</>;
  return (
    <AKG.Figure
      className="ecg-figure"
      alt={item.alt}
      caption={<>{item.caption}{pill(item.sources, item.caption)}</>}
      credit={credit}
      full={<FullStrips ecg={item} />}
      fullWidth={fullWidth(item)}
    >
      <CardStrip ecg={item} />
    </AKG.Figure>
  );
}
