import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { AKG } from '../design/akg';
import { content, getCard } from '../content';
import type { Criteria, Pathway, PathwayNode } from '../content/types';
import { doseLine, resolveLink, textLines } from '../../scripts/content/pathway.mjs';
import { parseInline } from '../../scripts/content/inline.mjs';
import { goBack, href, open, setPageTitle } from '../router';
import { DoseRow, Inlines, SourcePills, openCriteria, openDose, openSources, RichText } from '../ui/Rich';
import { useSheet } from '../ui/SheetHost';
import { icons } from '../ui/icons';
import { NotFoundScreen } from './Tabs';

// A pathway (owner, 2026-10-20; simplified 2026-10-21; turned sideways 2026-10-29): a short decision tree that
// supplements its card, like a teaching flowchart. Levels run left to right and a question's answers stack top to
// bottom beside it, each leading to another question or to a step (the card's own words and dose rows, with a link
// back only where it helps). The Step | Whole map switch sets the zoom: Step frames the current question with its
// answers at reading size; Whole map fits everything, and a tap there opens that box in Step view.
// Tap a decision to choose it: it fills in with a checkmark, the other answers on that level turn gray, everything
// only they lead to fades, and your route's lines turn bold. Any decision can be tapped at any time; tap a chosen
// one again to undo. Pinch or − + to zoom; Current Step jumps to the next question you haven't answered. Choices,
// zoom and place are kept while the app is open; Clear forgets the choices.

type Choices = Record<string, number>;
// Glide only when Reduce Motion is off.
const glide = (): ScrollBehavior => (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
const asks = (n: PathwayNode) => n.kind === 'question';
const answerKey = (q: string, j: number) => `${q}#${j}`;

// What's still possible: from the start, following only the chosen answer where a question has one. Holds node ids
// and answer keys ("question#index").
export function reach(p: Pathway, choices: Choices): Set<string> {
  const out = new Set<string>();
  const stack = [p.start];
  while (stack.length) {
    const k = stack.pop()!;
    const n = p.nodes[k];
    if (!n || out.has(k)) continue;
    out.add(k);
    if (n.next) stack.push(n.next);
    (n.answers ?? []).forEach((a, j) => {
      if (choices[k] != null && choices[k] !== j) return;
      out.add(answerKey(k, j));
      stack.push(a.to);
    });
  }
  return out;
}

// Each box's (and answer's) way in, for walking back up the chart.
function parentsOf(p: Pathway): Map<string, string[]> {
  const m = new Map<string, string[]>();
  const add = (to: string, from: string) => m.set(to, [...(m.get(to) ?? []), from]);
  for (const [k, n] of Object.entries(p.nodes)) {
    if (n.next) add(n.next, k);
    (n.answers ?? []).forEach((a, j) => { add(answerKey(k, j), k); add(a.to, answerKey(k, j)); });
  }
  return m;
}

// Your route, drawn bold: each chosen answer, everything still possible above it, and the steps it leads to up to
// the next question.
function routeOf(p: Pathway, choices: Choices, live: Set<string>, parents: Map<string, string[]>): Set<string> {
  const out = new Set<string>();
  for (const [q, j] of Object.entries(choices)) {
    const key = answerKey(q, j);
    if (!live.has(key)) continue;
    out.add(key);
    const up = [key];
    while (up.length) for (const k of parents.get(up.pop()!) ?? []) if (live.has(k) && !out.has(k)) { out.add(k); up.push(k); }
    let t: string | undefined = p.nodes[q].answers?.[j]?.to;
    while (t && p.nodes[t] && !asks(p.nodes[t]) && !out.has(t)) { out.add(t); t = p.nodes[t].next; }
  }
  return out;
}

// Choose (or, tapped again, un-choose) an answer. Choosing one on a level you'd ruled out drops the earlier choices
// that ruled it out, so the new choice is always on your route.
export function choose(p: Pathway, choices: Choices, q: string, j: number): Choices {
  const next: Choices = { ...choices };
  if (next[q] === j) { delete next[q]; return next; }
  next[q] = j;
  // Drop, one at a time, an earlier choice whose removal opens up more of the chart, until q is reachable again.
  // Choices on unrelated branches stay.
  while (!reach(p, next).has(q)) {
    const size = reach(p, next).size;
    const freeing = Object.keys(next).filter((k) => k !== q).find((k) => { const t = { ...next }; delete t[k]; return reach(p, t).size > size; });
    if (!freeing) break;
    delete next[freeing];
  }
  return next;
}

const MAX_ZOOM = 2;
// Kept per pathway while the app is open.
const memory = new Map<string, { choices: Record<string, number>; scale?: number; left?: number; top?: number; font?: string }>();
export const forgetPathways = () => memory.clear();

const Plain = ({ text }: { text?: string }) => (text ? <Inlines xs={parseInline(text)} plain /> : null);

// A link back to the card: a row like the dose rows (its words come from the card, so it can't go stale).
function LinkRow({ refText, surface }: { refText: string; surface: 'fill' | 'raised' }) {
  const sheet = useSheet();
  const l = resolveLink(refText, content);
  if (l.error) return null;
  const go = () => {
    if (l.kind === 'section') open(href.card(l.card!, l.section, l.anchor));
    else if (l.kind === 'card') open(href.card(l.id!));
    else if (l.kind === 'emergency') open(href.emergency(l.id!));
    else if (l.kind === 'criteria') openCriteria(sheet, content.data.criteria?.[l.id!] as Criteria, l.id);
    else if (l.kind === 'dose') openDose(sheet, l.id!);
  };
  const value = l.kind === 'criteria' ? 'Criteria' : l.kind === 'emergency' ? 'Rapids' : l.where ?? (l.cardTitle ? `${l.cardTitle} card` : undefined);
  return <AKG.ValueRow className="pw-link" surface={surface} title={l.text} value={value} onClick={go} />;
}

// A step: what to do or what it means (white card; red tint and a Treat Now tag when urgent).
function Box({ id, node, state }: { id: string; node: PathwayNode; state: State }) {
  const surface = node.kind === 'urgent' ? 'raised' : 'fill';
  return (
    <section className={`pw-box pw-box--${node.kind} pw-box--${state}`} data-node={id}>
      {node.kind === 'urgent' && <span className="tag-row"><AKG.Tag variant="critical">Treat Now</AKG.Tag></span>}
      <h2 className="ios-headline">{node.title}</h2>
      {textLines(node.text).map((t, i) => {
        const dose = doseLine(t);
        return dose ? <DoseRow key={i} id={dose} surface={surface} /> : <p key={i} className="ios-subheadline pw-box__text"><RichText text={t} /></p>;
      })}
      {(node.links ?? []).map((r) => <LinkRow key={r} refText={r} surface={surface} />)}
    </section>
  );
}

// A question: a short heading over its answers, with any note or link under it.
function Question({ id, node, current }: { id: string; node: PathwayNode; current: boolean }) {
  return (
    <section className="pw-question" data-node={id} aria-current={current ? 'step' : undefined}>
      <h2 id={`pw-q-${id}`} className="ios-subheadline-emphasized">{node.title}</h2>
      {textLines(node.text).map((t, i) => {
        const dose = doseLine(t);
        return dose ? <DoseRow key={i} id={dose} surface="raised" /> : <p key={i} className="ios-footnote"><RichText text={t} /></p>;
      })}
      {(node.links ?? []).map((r) => <LinkRow key={r} refText={r} surface="raised" />)}
    </section>
  );
}

// on = on your route (bold) · open = still possible · off = ruled out (faded, dashed).
type State = 'on' | 'open' | 'off';
type Line = { d: string; state: State; arrow: boolean };
const ORDER: Record<State, number> = { off: 0, open: 1, on: 2 };

export function PathwayScreen({ id }: { id: string }) {
  const p = content.data.pathway?.[id] as Pathway | undefined;
  const card = p ? getCard(p.card) : undefined;
  const sheet = useSheet();
  const savedRaw = memory.get(id);
  const saved = savedRaw && savedRaw.font && typeof document !== 'undefined' && savedRaw.font !== getComputedStyle(document.documentElement).fontSize ? { choices: savedRaw.choices } : savedRaw;
  const [choices, setChoices] = useState<Record<string, number>>(saved?.choices ?? {});
  const [scale, setScale] = useState(saved?.scale ?? 0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [lines, setLines] = useState<Line[]>([]);
  const [textSize, setTextSize] = useState(0);
  const [awayFromStep, setAway] = useState(false);
  const [mode, setMode] = useState<'step' | 'map'>('step');
  // The box Step view is framing (for the back tab), and where it sits in Whole map ("You are here").
  const [framedId, setFramedId] = useState<string | undefined>();
  const [here, setHere] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const hereIds = useRef<string[]>([]);
  const afterLayout = useRef<{ nid: string; w: number; h: number } | null>(null); // a box to frame once Step view's layout is back
  const mapFit = useRef<{ w: number; h: number } | null>(null); // set while waiting to fit Whole map
  const modeSwitchAt = useRef(0);
  const viewport = useRef<HTMLDivElement>(null);
  const sizer = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, HTMLElement>());
  const live = useRef(saved?.scale ?? 1);
  const openScale = useRef(1);
  const pending = useRef<{ x: number; y: number } | null>(saved?.left != null ? { x: saved.left, y: saved.top ?? 0 } : null);
  const title = p && card ? `${card.title}: ${p.title}` : '';
  useEffect(() => { if (title) setPageTitle(title); }, [title]);
  useEffect(() => AKG.lockScroll(), []);

  const parents = useMemo(() => (p ? parentsOf(p) : new Map<string, string[]>()), [p]);
  const possible = p ? reach(p, choices) : new Set<string>();
  const route = p ? routeOf(p, choices, possible, parents) : new Set<string>();
  const stateOf = (k: string): State => (!possible.has(k) ? 'off' : route.has(k) ? 'on' : 'open');
  // The next question you haven't answered (top to bottom, then left to right).
  const open = p ? Object.entries(p.nodes).filter(([k, n]) => asks(n) && possible.has(k) && choices[k] == null).sort(([, a], [, b]) => a.at[1] - b.at[1] || a.at[0] - b.at[0]) : [];
  const current = open[0]?.[0];
  const routeKey = JSON.stringify(choices);

  // Every line: question → each answer → where it leads, and a step's "next". Every line ends in an arrowhead.
  const edges = useMemo(() => {
    const out: { from: string; to: string }[] = [];
    if (!p) return out;
    for (const [nid, n] of Object.entries(p.nodes)) {
      n.answers?.forEach((a, j) => { out.push({ from: nid, to: answerKey(nid, j) }, { from: answerKey(nid, j), to: a.to }); });
      if (n.next) out.push({ from: nid, to: n.next });
    }
    return out;
  }, [p]);

  // Lines, in the chart's own (unzoomed) units, measured only when the route or the text size changes.
  // Down: leave the box straight down, turn once in the gap just above the box it points to, and enter it at its
  // middle, so lines into the same box join at one point. Beside (older layouts only): straight across.
  useLayoutEffect(() => {
    const pl = plane.current, g = grid.current;
    if (!pl || !g) return;
    // Measured on screen and divided by the zoom, so any current zoom is undone.
    const pr = pl.getBoundingClientRect(), k0 = pl.offsetWidth ? pr.width / pl.offsetWidth : 1;
    const at = (k: string) => {
      const el = els.current.get(k); if (!el) return undefined;
      const r = el.getBoundingClientRect();
      return { x: (r.left - pr.left) / k0, y: (r.top - pr.top) / k0, w: r.width / k0, h: r.height / k0 };
    };
    const half = parseFloat(getComputedStyle(g).columnGap || '32') / 2;
    setLines(edges.map((e) => {
      const a = at(e.from), b = at(e.to);
      if (!a || !b) return null;
      const ends = [stateOf(e.from), stateOf(e.to)];
      const state: State = ends.includes('off') ? 'off' : ends.every((s) => s === 'on') ? 'on' : 'open', arrow = true;
      const ay = a.y + a.h / 2, by = b.y + b.h / 2;
      if (b.x >= a.x + a.w) {
        const x1 = a.x + a.w, x2 = b.x;
        if (Math.abs(ay - by) < 1) return { d: `M${x1},${ay} H${x2}`, state, arrow };
        const m = Math.round(x2 - half);
        return { d: `M${x1},${ay} H${m} V${by} H${x2}`, state, arrow };
      }
      const lane = Math.max(a.x + a.w, b.x + b.w) + half;
      return { d: `M${a.x + a.w},${ay} H${lane} V${by} H${b.x + b.w}`, state, arrow };
    }).filter((x): x is Line => !!x));
    // Whole map: outline the group Step view was framing.
    if (mode === 'map') {
      const rs = hereIds.current.map(at).filter((r): r is NonNullable<ReturnType<typeof at>> => !!r);
      if (rs.length) {
        const x0 = Math.min(...rs.map((r) => r.x)), y0 = Math.min(...rs.map((r) => r.y));
        setHere({ x: x0, y: y0, w: Math.max(...rs.map((r) => r.x + r.w)) - x0, h: Math.max(...rs.map((r) => r.y + r.h)) - y0 });
      }
    }
    if (pl.offsetWidth !== size.w || pl.offsetHeight !== size.h) setSize({ w: pl.offsetWidth, h: pl.offsetHeight });
  }, [routeKey, edges, textSize, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Text Size changes reflow the boxes: measure again.
  useEffect(() => {
    const pl = plane.current; if (!pl || typeof ResizeObserver === 'undefined') return;
    let w = pl.offsetWidth, h = pl.offsetHeight;
    const ro = new ResizeObserver(() => { if (pl.offsetWidth !== w || pl.offsetHeight !== h) { w = pl.offsetWidth; h = pl.offsetHeight; setTextSize((n) => n + 1); } });
    ro.observe(pl);
    return () => ro.disconnect();
  }, []);

  // The whole map at once, in both directions (Whole map).
  const fitScale = () => {
    const vw = viewport.current?.clientWidth ?? 0, vh = viewport.current?.clientHeight ?? 0;
    return size.w && size.h && vw && vh ? Math.min(1, vw / size.w, vh / size.h) : 1;
  };
  const minZoom = () => fitScale();

  // ---- Zoom. The chart is drawn once at full size and scaled; the page scrolls natively at any zoom. ----
  // Set the zoom to s1, keeping the chart point under (fx, fy) (viewport pixels) where it is.
  const apply = (s1: number, fx: number, fy: number) => {
    const vp = viewport.current, pl = plane.current, sz = sizer.current; if (!vp || !pl || !sz) return;
    const s0 = live.current;
    const px = (vp.scrollLeft + fx - sz.offsetLeft) / s0, py = (vp.scrollTop + fy) / s0;
    live.current = s1;
    pl.style.transform = `scale(${s1})`;
    sz.style.width = `${size.w * s1}px`; sz.style.height = `${size.h * s1}px`;
    vp.scrollLeft = px * s1 + sz.offsetLeft - fx; vp.scrollTop = py * s1 - fy;
  };
  const clamp = (s: number) => Math.min(MAX_ZOOM, Math.max(minZoom(), s));

  // Step view: frame a question with all its answers stacked beside it (a step with the box it leads to), zoomed out
  // if needed (never below a readable 60%). The left edge keeps a sliver of the step before. Used on opening, by
  // Current Step, by the Step button and after an answer.
  const READABLE = 0.6;
  const BELOW = 120; // the floating controls and tab bar cover this much of the viewport's bottom
  const frame = (nid: string | undefined, smooth: boolean) => {
    const vp = viewport.current, pl = plane.current; if (!vp || !pl || !nid || !p) return;
    selfMove.current = Date.now(); setAway(false); setMode('step'); setFramedId(nid);
    const pr = pl.getBoundingClientRect(), k0 = pl.offsetWidth ? pr.width / pl.offsetWidth : 1;
    const n = p.nodes[nid];
    const ids = [nid, ...(asks(n) ? (n.answers ?? []).map((_, j) => `${nid}#${j}`) : n.next ? [n.next] : [])];
    hereIds.current = ids;
    const rs = ids.map((k) => els.current.get(k)?.getBoundingClientRect()).filter((r): r is DOMRect => !!r);
    if (!rs.length) return;
    const x0 = Math.min(...rs.map((r) => r.left)), x1 = Math.max(...rs.map((r) => r.right));
    const y0 = Math.min(...rs.map((r) => r.top)), y1 = Math.max(...rs.map((r) => r.bottom));
    const box = { x: (x0 - pr.left) / k0, w: (x1 - x0) / k0, y: (y0 - pr.top) / k0, h: (y1 - y0) / k0 };
    const room = Math.max(120, vp.clientHeight - BELOW);
    const want = Math.min(openScale.current, Math.max(READABLE, Math.min((vp.clientWidth - 64) / box.w, room / box.h)));
    if (Math.abs(want - live.current) > 0.01) { apply(want, vp.clientWidth / 2, 0); setScale(want); }
    const sz = sizer.current!, s1 = live.current;
    const left = Math.max(0, box.x * s1 + sz.offsetLeft - 52), top = Math.max(0, (box.y + box.h / 2) * s1 - room / 2);
    if (smooth && vp.scrollTo) vp.scrollTo({ left, top, behavior: glide() }); else { vp.scrollLeft = left; vp.scrollTop = top; }
  };
  // Whole map: every box shrinks to a block, so everything fits at once. The layout changes, so the fit waits for the
  // new size (see the effect below); "You are here" outlines the group Step view was framing.
  const showMap = () => {
    selfMove.current = Date.now(); modeSwitchAt.current = Date.now(); setAway(false);
    mapFit.current = { w: size.w, h: size.h };
    setMode('map');
  };
  // Back in Step view the full-size layout returns first, then the box is framed.
  const toStep = (nid: string | undefined, smooth = true) => {
    if (!nid) return;
    if (mode === 'map') { modeSwitchAt.current = Date.now(); afterLayout.current = { nid, w: size.w, h: size.h }; setMode('step'); } else frame(nid, smooth);
  };
  // In Whole map a tap opens that box in Step view instead of answering.
  const onMapTap = (e: React.MouseEvent) => {
    if (mode !== 'map') return;
    e.preventDefault(); e.stopPropagation();
    const t = e.target as Node;
    for (const [k, el] of els.current) if (el.contains(t)) { toStep(k.split('#')[0]); return; }
  };
  useEffect(() => {
    const vp = viewport.current;
    if (mode === 'map' && mapFit.current && vp && size.w && (size.w !== mapFit.current.w || size.h !== mapFit.current.h)) {
      mapFit.current = null;
      apply(minZoom(), 0, 0); setScale(live.current);
      vp.scrollLeft = 0; vp.scrollTop = 0;
    }
    const al = afterLayout.current;
    if (mode === 'step' && al && size.w && (size.w !== al.w || size.h !== al.h)) {
      afterLayout.current = null;
      requestAnimationFrame(() => frame(al.nid, false));
    }
  }, [mode, size.w, size.h]); // eslint-disable-line react-hooks/exhaustive-deps

  // First visit: the whole width if it fits at a readable size, else full size; the start box centered.
  // A return: where it was left.
  useLayoutEffect(() => {
    const vp = viewport.current;
    if (!vp) return;
    const fit = fitScale();
    openScale.current = fit >= 0.8 ? fit : 1;
    if (scale) return;
    const s = openScale.current;
    live.current = s;
    if (!pending.current) pending.current = { x: 0, y: 0 };
    setScale(s);
  }, [size.w]); // eslint-disable-line react-hooks/exhaustive-deps
  const framed = useRef(saved?.left != null);
  useLayoutEffect(() => {
    const vp = viewport.current, to = pending.current;
    if (vp && to && scale && size.w) { vp.scrollLeft = Math.max(0, to.x); vp.scrollTop = Math.max(0, to.y); pending.current = null; }
    // First visit: frame the first question with its answers.
    if (vp && scale && size.w && !framed.current) { framed.current = true; frame(current ?? p?.start, false); }
  }, [scale, size.w]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pinch: while two fingers are down the page stops scrolling and the chart is previewed with one transform (no
  // layout, no scrolling); when they lift, the zoom is set once and the page scrolled to match. Native scrolling
  // and the pinch never fight over the scroll position (the cause of the old map's jumps).
  useEffect(() => {
    const vp = viewport.current; if (!vp) return;
    type G = { d0: number; s0: number; ax: number; ay: number; sl0: number; st0: number; off0: number; k: number; mx: number; my: number; frame: number };
    let g: G | null = null;
    const dist = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const mid = (t: TouchList) => { const r = vp.getBoundingClientRect(); return { x: (t[0].clientX + t[1].clientX) / 2 - r.left, y: (t[0].clientY + t[1].clientY) / 2 - r.top }; };
    const start = (e: TouchEvent) => {
      if (e.touches.length !== 2 || g) return;
      const sz = sizer.current; if (!sz) return;
      const m = mid(e.touches), s0 = live.current;
      g = { d0: dist(e.touches), s0, sl0: vp.scrollLeft, st0: vp.scrollTop, off0: sz.offsetLeft, ax: (vp.scrollLeft + m.x - sz.offsetLeft) / s0, ay: (vp.scrollTop + m.y) / s0, k: 1, mx: m.x, my: m.y, frame: 0 };
      vp.classList.add('pw-viewport--pinch');
    };
    const move = (e: TouchEvent) => {
      if (!g || e.touches.length !== 2) return;
      if (e.cancelable) e.preventDefault();
      const m = mid(e.touches);
      g.k = clamp(g.s0 * (dist(e.touches) / g.d0)) / g.s0; g.mx = m.x; g.my = m.y;
      if (!g.frame) g.frame = requestAnimationFrame(() => {
        if (!g) return;
        g.frame = 0;
        // The sizer sits at (off0 − scrollLeft, −scrollTop); move it so the pinched point stays under the fingers.
        const tx = g.mx - g.off0 + g.sl0 - g.ax * g.s0 * g.k, ty = g.my + g.st0 - g.ay * g.s0 * g.k;
        sizer.current!.style.transform = `translate(${tx}px, ${ty}px) scale(${g.k})`;
      });
    };
    const end = (e: TouchEvent) => {
      if (!g || e.touches.length >= 2) return;
      const done = g; g = null;
      cancelAnimationFrame(done.frame);
      const sz = sizer.current, pl = plane.current;
      vp.classList.remove('pw-viewport--pinch');
      if (!sz || !pl) return;
      sz.style.transform = '';
      const s1 = done.s0 * done.k;
      live.current = s1;
      pl.style.transform = `scale(${s1})`;
      sz.style.width = `${size.w * s1}px`; sz.style.height = `${size.h * s1}px`;
      vp.scrollLeft = done.ax * s1 + sz.offsetLeft - done.mx; vp.scrollTop = done.ay * s1 - done.my;
      setScale(s1);
      setAway(true);
    };
    // Safari's own page zoom stays off; a trackpad pinch (Mac) zooms the chart.
    const gesture = (e: Event) => e.preventDefault();
    let wheelTimer = 0;
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const r = vp.getBoundingClientRect();
      apply(clamp(live.current * Math.exp(-e.deltaY * 0.01)), e.clientX - r.left, e.clientY - r.top);
      clearTimeout(wheelTimer); wheelTimer = window.setTimeout(() => setScale(live.current), 150);
    };
    vp.addEventListener('touchstart', start, { passive: true });
    vp.addEventListener('touchmove', move, { passive: false });
    vp.addEventListener('touchend', end);
    vp.addEventListener('touchcancel', end);
    vp.addEventListener('gesturestart', gesture);
    vp.addEventListener('gesturechange', gesture);
    vp.addEventListener('wheel', wheel, { passive: false });
    return () => {
      vp.removeEventListener('touchstart', start); vp.removeEventListener('touchmove', move); vp.removeEventListener('touchend', end);
      vp.removeEventListener('touchcancel', end); vp.removeEventListener('gesturestart', gesture); vp.removeEventListener('gesturechange', gesture);
      vp.removeEventListener('wheel', wheel);
    };
  }, [size.w, size.h]); // eslint-disable-line react-hooks/exhaustive-deps

  // The box to come back to: the next open question or, with every question answered, where the last answer leads.
  const lastChosen = p ? Object.entries(choices).filter(([q, j]) => possible.has(answerKey(q, j))).sort(([a], [b]) => p.nodes[b].at[1] - p.nodes[a].at[1])[0] : undefined;
  const stepId = current ?? (lastChosen && p ? p.nodes[lastChosen[0]].answers?.[lastChosen[1]]?.to : undefined);
  // Current Step shows once you've moved or zoomed the chart yourself, and hides after it (or an answer) frames the
  // current box. Scrolls the app starts itself (framing, gliding after an answer) don't count.
  const selfMove = useRef(0);
  useEffect(() => {
    const vp = viewport.current; if (!vp) return;
    let frameId = 0;
    const onScroll = () => {
      if (Date.now() - selfMove.current > 900) setAway(true);
      if (!frameId) frameId = requestAnimationFrame(() => { frameId = 0; memory.set(id, { ...(memory.get(id) ?? { choices: {} }), left: vp.scrollLeft, top: vp.scrollTop }); });
    };
    vp.addEventListener('scroll', onScroll, { passive: true });
    return () => { vp.removeEventListener('scroll', onScroll); cancelAnimationFrame(frameId); };
  }, [id]);

  const toCurrent = () => toStep(stepId);

  // Text Size changed while open (or since the place was saved): boxes reflowed, so frame the current step again.
  const seenTextSize = useRef(textSize);
  useEffect(() => {
    if (seenTextSize.current === textSize) return;
    seenTextSize.current = textSize;
    // A reflow caused by switching Step and Whole map is not a Text Size change.
    if (mode === 'map' || Date.now() - modeSwitchAt.current < 1500) return;
    requestAnimationFrame(() => frame(stepId, false));
  }, [textSize]); // eslint-disable-line react-hooks/exhaustive-deps
  // A saved place only fits the Text Size it was saved at.
  const fontKey = typeof document !== 'undefined' ? getComputedStyle(document.documentElement).fontSize : '';

  // Remember answers and zoom.
  useEffect(() => { memory.set(id, { ...memory.get(id), choices, scale: scale || undefined, font: fontKey }); }, [id, choices, scale, fontKey]);

  // After an answer, glide to the box it leads to (or frame the next question when the answer leads straight to it).
  const prevKey = useRef(routeKey);
  const answered = useRef<string | null>(null);
  useEffect(() => {
    if (prevKey.current === routeKey) return;
    prevKey.current = routeKey;
    const q = answered.current; answered.current = null;
    if (!q || !p) return;
    const j = choices[q];
    const to = j != null ? p.nodes[q].answers?.[j]?.to : undefined;
    if (to) frame(to, true);
  }, [routeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!p || !card) return <NotFoundScreen />;
  const reg = (k: string) => (el: HTMLElement | null) => { if (el) els.current.set(k, el); else els.current.delete(k); };
  const pick = (nid: string, j: number) => {
    answered.current = choices[nid] === j ? null : nid;
    setChoices(choose(p, choices, nid, j));
  };
  const clear = () => { setChoices({}); toStep(p.start); };
  const s = scale || 1;
  // The step before the one Step view is framing: the nearest answered question to its left, shown as a tab.
  const levelOf = (k: string) => p.nodes[k].at[1];
  const prevQ = framedId && p.nodes[framedId]
    ? Object.entries(choices).filter(([q, j]) => p.nodes[q] && possible.has(answerKey(q, j)) && levelOf(q) < levelOf(framedId)).sort(([a], [b]) => levelOf(b) - levelOf(a))[0]
    : undefined;
  const prev = prevQ ? { q: prevQ[0], label: p.nodes[prevQ[0]].answers?.[prevQ[1]]?.label ?? '' } : undefined;
  // Sideways: a box's row (level) runs left to right, its column (lane) top to bottom.
  const cell = (at: [number, number], span = 1): CSSProperties => ({ gridColumn: at[1] + 1, gridRow: `${at[0] + 1} / span ${span}` });
  const levels = 1 + Math.max(...Object.values(p.nodes).flatMap((n) => [n.at[1], ...(n.answers ?? []).map((a) => a.at[1])]));

  return (
    <div className="pw-map-page">
      <div className="top-bar">
        <AKG.Toolbar
          title={p.title}
          subtitle={card.title}
          showTitle
          leading={<AKG.ToolbarButton icon={icons.chevronBackward} aria-label={`Back to ${card.title}`} onClick={() => goBack(href.card(card.id))} />}
          trailing={<AKG.ToolbarButton onClick={clear} disabled={!Object.keys(choices).length}>Clear</AKG.ToolbarButton>}
        />
      </div>
      <div className="pw-viewport" ref={viewport}>
        <div className="pw-sizer" ref={sizer} style={{ width: size.w * s, height: size.h * s }}>
          <div className={`pw-plane${mode === 'map' ? ' pw-plane--map' : ''}`} ref={plane} style={{ transform: `scale(${s})`, visibility: scale ? 'visible' : 'hidden' }} role="group" aria-label={`${title} pathway`} onClickCapture={onMapTap}>
            <svg className="pw-lines" width={size.w} height={size.h} aria-hidden="true">
              <defs>
                <marker id="pw-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M0,1 L9,5 L0,9 z" className="pw-arrow" /></marker>
                <marker id="pw-arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M0,1 L9,5 L0,9 z" className="pw-arrow pw-arrow--on" /></marker>
              </defs>
              {/* Ruled-out lines first, your route last, so the bold route is drawn on top where lines share a stretch. */}
              {[...lines].sort((x, y) => ORDER[x.state] - ORDER[y.state]).map((l, i) => (
                <path key={i} d={l.d} className={`pw-line pw-line--${l.state}`} markerEnd={l.arrow ? `url(#${l.state === 'on' ? 'pw-arrow-on' : 'pw-arrow'})` : undefined} />
              ))}
            </svg>
            <div className="pw-grid" ref={grid} style={{ gridTemplateColumns: `repeat(${levels}, var(--pw-level))`, gridTemplateRows: `repeat(${p.columns}, minmax(var(--pw-unit), auto))` }}>
              {Object.entries(p.nodes).sort(([, a], [, b]) => a.at[1] - b.at[1] || a.at[0] - b.at[0]).flatMap(([nid, n]) => {
                const state = stateOf(nid);
                const box = (
                  <div key={nid} ref={reg(nid)} className={`pw-cell${asks(n) ? ' pw-cell--question' : ''}${state === 'off' ? ' pw-cell--off' : state === 'on' ? ' pw-cell--on' : ''}`} style={cell(n.at, n.span)}>
                    {asks(n) ? <Question id={nid} node={n} current={nid === current} /> : <Box id={nid} node={n} state={state} />}
                  </div>
                );
                if (!asks(n)) return [box];
                return [box, ...(n.answers ?? []).map((a, j) => {
                  // Nothing chosen on this question yet (and it's still possible): the tinted look. Chosen: filled with
                  // a checkmark. Another answer chosen, or the question ruled out: gray, still tappable.
                  const selected = choices[nid] != null ? choices[nid] === j : possible.has(nid) ? undefined : false;
                  return (
                    <div key={answerKey(nid, j)} ref={reg(answerKey(nid, j))} className={`pw-cell pw-answer${possible.has(nid) ? '' : ' pw-answer--off'}${choices[nid] === j ? ' pw-cell--on' : ''}`} data-question={nid} style={cell(a.at, a.span)}>
                      <AKG.Button variant="choice" block selected={selected} subtitle={a.detail ? <Plain text={a.detail} /> : undefined} aria-describedby={`pw-q-${nid}`} onClick={() => pick(nid, j)}>
                        {a.label}
                      </AKG.Button>
                    </div>
                  );
                })];
              })}
            </div>
            {mode === 'map' && here && (
              <div className="pw-here" style={{ left: here.x - 6, top: here.y - 6, width: here.w + 12, height: here.h + 12 }} aria-hidden="true">
                <span className="pw-here__chip">You are here</span>
              </div>
            )}
            {p.sources.length > 0 && (
              <div className="pw-foot">
                <SourcePills ids={p.sources} onOpen={() => openSources(sheet, p.sources, title)} />
              </div>
            )}
          </div>
        </div>
      </div>
      {mode === 'step' && prev && (
        <button type="button" className="pw-prev" onClick={() => toStep(prev.q)} aria-label={`Back to ${p.nodes[prev.q].title}`}>
          <span className="pw-prev__chev" aria-hidden="true">{icons.chevronBackward}</span>
          <span className="pw-prev__label">{prev.label}</span>
        </button>
      )}
      <div className="pw-zoom">
        {awayFromStep && stepId ? <AKG.ToolbarButton className="pw-current" onClick={toCurrent}>Current Step</AKG.ToolbarButton> : <span />}
        <AKG.SegmentedControl
          className="pw-mode"
          size="large"
          aria-label="Map view"
          options={[{ value: 'step', label: 'Step' }, { value: 'map', label: 'Whole map' }]}
          value={mode}
          onChange={(v) => (v === 'map' ? showMap() : toStep(framedId ?? stepId ?? p.start))}
        />
      </div>
    </div>
  );
}
