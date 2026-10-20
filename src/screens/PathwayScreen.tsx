import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AKG } from '../design/akg';
import { content, getCard, titleCase } from '../content';
import type { Criteria, Pathway, PathwayNode } from '../content/types';
import { resolveLink } from '../../scripts/content/pathway.mjs';
import { parseInline } from '../../scripts/content/inline.mjs';
import { goBack, href, open, setPageTitle } from '../router';
import { Inlines, lineItems, openCriteria, openDose, openSources, RichText } from '../ui/Rich';
import { useSheet, type ShowSheet } from '../ui/SheetHost';
import { icons } from '../ui/icons';
import { NotFoundScreen } from './Tabs';

// A pathway (owner, 2026-10-19): the whole card as one flowchart, a second way to look at the card. Every box is
// always drawn, on a grid (docs/DATA-TYPES.md, 9). Pinch or the zoom buttons to zoom, drag to move around. Only
// questions branch: tap an answer and it fills in blue, the others in its row stay gray, and boxes off your route
// dim. Boxes hold a short decision or instruction from the card and link to the card's own sections, criteria,
// dose sheets, other cards and the Rapids page instead of copying them. Only standard pieces (owner: HIG):
// cards for boxes, buttons for answers and links, Tags, right-angled lines, a toolbar group for zoom.
// Answers and the place on the map are kept while the app is open (following a link and coming back keeps them);
// Start Over clears them.

type Visit = { id: string; node: PathwayNode; answer?: number };
const asks = (n: PathwayNode) => n.kind === 'question';

export function walk(p: Pathway, choices: Record<string, number>): { route: Visit[]; ended: boolean } {
  const route: Visit[] = [];
  const seen = new Set<string>();
  let id: string | undefined = p.start;
  while (id && p.nodes[id] && !seen.has(id)) {
    seen.add(id);
    const node: PathwayNode = p.nodes[id];
    if (asks(node)) {
      const a: number | undefined = choices[id];
      route.push({ id, node, answer: a });
      if (a == null) return { route, ended: false };
      id = node.answers?.[a]?.to;
      continue;
    }
    route.push({ id, node });
    if (node.kind === 'result' || node.kind === 'link') return { route, ended: true };
    id = node.next;
  }
  return { route, ended: true };
}

// Fit can always show the whole width, even at the largest text sizes.
const MIN_ZOOM = 0.1;

// Kept per pathway while the app is open.
const memory = new Map<string, { choices: Record<string, number>; scale?: number; left?: number; top?: number }>();
export const forgetPathways = () => memory.clear();

const KIND: Record<PathwayNode['kind'], string> = { start: 'Start', question: 'Question', do: 'Do', urgent: '', note: 'Note', result: 'Result', link: '' };
const LINK_ICON: Record<string, ReactNode> = {
  section: icons.listBullet, criteria: icons.checklist, dose: icons.pills, card: icons.heartTextClipboard, emergency: icons.staroflifeFill,
};
const Plain = ({ text }: { text?: string }) => (text ? <Inlines xs={parseInline(text)} plain /> : null);

function follow(sheet: ShowSheet, ref: string) {
  const l = resolveLink(ref, content);
  if (l.error) return;
  if (l.kind === 'section') open(href.card(l.card!, l.section, l.anchor));
  else if (l.kind === 'card') open(href.card(l.id!));
  else if (l.kind === 'emergency') open(href.emergency(l.id!));
  else if (l.kind === 'dose') openDose(sheet, l.id!);
  else if (l.kind === 'criteria') openCriteria(sheet, content.data.criteria?.[l.id!] as Criteria);
}

// One link: a small tinted button with the symbol of what it opens (red for Rapids).
function LinkButton({ refText }: { refText: string }) {
  const sheet = useSheet();
  const l = resolveLink(refText, content);
  if (l.error) return null;
  const label = l.kind === 'section' && l.where && !l.label ? `${l.text} · ${l.where}` : l.text;
  return (
    <AKG.Button variant="tinted" size="small" destructive={l.kind === 'emergency'} icon={LINK_ICON[l.kind]} className="pw-link" onClick={() => follow(sheet, refText)}>
      {label}
    </AKG.Button>
  );
}

function Box({ id, node, state }: { id: string; node: PathwayNode; state: string }) {
  const sheet = useSheet();
  if (node.kind === 'link') {
    const l = resolveLink(node.to!, content);
    return (
      <AKG.List className={`pw-box pw-box--link pw-box--${state}`}>
        <AKG.ListRow
          overline={l.kind === 'emergency' ? 'Rapids' : l.kind === 'card' ? 'Card' : l.cardTitle}
          title={l.text}
          subtitle={node.text ? <RichText text={node.text} /> : undefined}
          icon={LINK_ICON[l.kind]}
          iconTint={l.kind === 'emergency' ? 'var(--system-red)' : 'var(--accent)'}
          chevron
          onClick={() => follow(sheet, node.to!)}
        />
      </AKG.List>
    );
  }
  const end = node.kind === 'result';
  const kind = [KIND[node.kind], node.stage, state === 'now' ? 'Now' : null].filter(Boolean).join(' · ');
  return (
    <section className={`pw-box pw-box--${node.kind} pw-box--${state}`} aria-current={state === 'now' ? 'step' : undefined} data-node={id}>
      {(node.kind === 'urgent' || end) && (
        <span className="tag-row">
          {node.kind === 'urgent' && <AKG.Tag variant="critical">Treat Now</AKG.Tag>}
          {end && <AKG.Tag>End of Pathway</AKG.Tag>}
        </span>
      )}
      {kind && <p className="pw-kind ios-caption-1-emphasized">{kind}</p>}
      <h2 className="ios-headline">{node.title}</h2>
      {node.text && <p className="ios-subheadline pw-box__text"><RichText text={node.text} /></p>}
      {!!node.links?.length && <div className="pw-links">{node.links.map((r) => <LinkButton key={r} refText={r} />)}</div>}
    </section>
  );
}

export function PathwayScreen({ id }: { id: string }) {
  const p = content.data.pathway?.[id] as Pathway | undefined;
  const sheet = useSheet();
  const saved = memory.get(id);
  const [choices, setChoices] = useState<Record<string, number>>(saved?.choices ?? {});
  const [scale, setScale] = useState(saved?.scale ?? 0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [lines, setLines] = useState<{ d: string; on: boolean; dash: boolean }[]>([]);
  const viewport = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sizer = useRef<HTMLDivElement>(null);
  const [textSize, setTextSize] = useState(0);
  const els = useRef(new Map<string, HTMLElement>());
  const live = useRef(saved?.scale ?? 1);
  const pending = useRef<{ x: number; y: number } | null>(saved?.left != null ? { x: saved.left, y: saved.top ?? 0 } : null);
  const card = p ? getCard(p.card) : undefined;
  useEffect(() => { if (p) setPageTitle(titleCase(p.title)); }, [p]);
  useEffect(() => AKG.lockScroll(), []);

  const { route, ended } = p ? walk(p, choices) : { route: [] as Visit[], ended: false };
  const onRoute = new Map(route.map((v) => [v.id, v]));
  const last = route[route.length - 1];
  const routeKey = route.map((v) => `${v.id}:${v.answer ?? ''}`).join('|');

  // Every line: question → answer → next box, a box's "next", and a link box under the box it hangs from.
  const edges = useMemo(() => {
    const out: { from: string; to: string; on: (r: Map<string, Visit>) => boolean; dash: boolean }[] = [];
    if (!p) return out;
    for (const [nid, n] of Object.entries(p.nodes)) {
      if (asks(n)) {
        n.answers?.forEach((a, j) => {
          const k = `${nid}#${j}`;
          out.push({ from: nid, to: k, on: (r) => r.get(nid)?.answer === j, dash: false });
          out.push({ from: k, to: a.to, on: (r) => r.get(nid)?.answer === j && r.has(a.to), dash: !!a.rejoin });
        });
      } else if (n.kind === 'link' && n.from) {
        out.push({ from: n.from, to: nid, on: () => false, dash: false });
      } else if (n.next) {
        out.push({ from: nid, to: n.next, on: (r) => r.has(nid) && r.has(n.next!), dash: !!n.rejoin });
      }
    }
    return out;
  }, [p]);

  // Measure the boxes (unscaled) and draw right-angled lines between them. Downward lines go down, across at the
  // gap between the rows, and down again; lines that rejoin (dashed) or go up run along the side.
  // Measure the boxes in the map's own (unzoomed) units, from layout offsets, so zooming never re-measures:
  // lines are redrawn only when the route or the text size changes (owner: the first map lagged).
  useLayoutEffect(() => {
    const pl = plane.current, grid = gridRef.current;
    if (!pl || !grid) return;
    const at = (k: string) => { const el = els.current.get(k); return el && { x: grid.offsetLeft + el.offsetLeft, y: grid.offsetTop + el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }; };
    const gap = 24;
    setLines(edges.map((e) => {
      const a = at(e.from), b = at(e.to);
      if (!a || !b) return null;
      const on = e.on(onRoute), dash = e.dash;
      if (!dash && b.y > a.y + a.h) {
        const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y, m = Math.round(y2 - gap);
        return { d: Math.abs(x1 - x2) < 1 ? `M${x1},${y1} V${y2}` : `M${x1},${y1} V${m} H${x2} V${y2}`, on, dash };
      }
      // Along the side: out of the facing side, to a lane between the two, then into the other's facing side.
      const right = b.x >= a.x + a.w ? true : b.x + b.w <= a.x ? false : null;
      const sy = a.y + Math.min(a.h / 2, 24), ty = b.y + Math.min(b.h / 2, 24);
      if (right === null) {
        const lane = Math.max(a.x + a.w, b.x + b.w) + gap;
        return { d: `M${a.x + a.w},${sy} H${lane} V${ty} H${b.x + b.w}`, on, dash };
      }
      const sx = right ? a.x + a.w : a.x, tx = right ? b.x : b.x + b.w, lane = Math.round((sx + tx) / 2);
      return { d: `M${sx},${sy} H${lane} V${ty} H${tx}`, on, dash };
    }).filter((x): x is { d: string; on: boolean; dash: boolean } => !!x));
    if (pl.offsetWidth !== size.w || pl.offsetHeight !== size.h) setSize({ w: pl.offsetWidth, h: pl.offsetHeight });
  }, [routeKey, edges, textSize]); // eslint-disable-line react-hooks/exhaustive-deps

  // Text Size changes reflow the boxes: measure again.
  useEffect(() => {
    const pl = plane.current; if (!pl || typeof ResizeObserver === 'undefined') return;
    let w = pl.offsetWidth, h = pl.offsetHeight;
    const ro = new ResizeObserver(() => { if (pl.offsetWidth !== w || pl.offsetHeight !== h) { w = pl.offsetWidth; h = pl.offsetHeight; setTextSize((n) => n + 1); } });
    ro.observe(pl);
    return () => ro.disconnect();
  }, []);

  // First visit: readable size, centered on the start. A return: where it was left.
  useLayoutEffect(() => {
    const vp = viewport.current;
    if (!vp || scale) return;
    // One box fits the width with a margin each side, whatever the text size.
    const st = els.current.get(p?.start ?? '');
    const s = st?.offsetWidth ? Math.min(1, Math.max(0.4, (vp.clientWidth - 32) / st.offsetWidth)) : 1;
    live.current = s;
    const pl = plane.current;
    if (!pending.current) {
      // The start box's middle on the unscaled plane (measured on screen, so any current transform is undone).
      const r = st?.getBoundingClientRect(), pr = pl?.getBoundingClientRect();
      const k = pr && pl?.offsetWidth ? pr.width / pl.offsetWidth : 1;
      const mid = r && pr && k ? (r.left + r.width / 2 - pr.left) / k : 0;
      pending.current = { x: mid * s - vp.clientWidth / 2, y: 0 };
    }
    setScale(s);
  }, [size.w]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const vp = viewport.current, to = pending.current;
    if (vp && to && scale && size.w) { vp.scrollLeft = Math.max(0, to.x); vp.scrollTop = Math.max(0, to.y); pending.current = null; }
  }, [scale, size.w]);

  // Remember answers, zoom and place.
  useEffect(() => {
    const m = memory.get(id);
    memory.set(id, { ...m, choices, scale: scale || undefined });
  }, [id, choices, scale]);
  useEffect(() => {
    const vp = viewport.current; if (!vp) return;
    let frame = 0;
    const save = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; memory.set(id, { ...(memory.get(id) ?? { choices: {} }), left: vp.scrollLeft, top: vp.scrollTop }); });
    };
    vp.addEventListener('scroll', save, { passive: true });
    return () => vp.removeEventListener('scroll', save);
  }, [id]);

  const fit = () => {
    const w = plane.current?.offsetWidth ?? 0, vw = viewport.current?.clientWidth ?? 0;
    return w && vw ? Math.min(1, Math.max(MIN_ZOOM, (vw - 16) / w)) : 1;
  };
  // Zooming moves only the map's layer: the scale and scroll are set on the page directly, without redrawing the
  // map, and the zoom is remembered once at the end (a pinch fires many times a second).
  const apply = (s1: number, fx: number, fy: number) => {
    const vp = viewport.current, pl = plane.current, sz = sizer.current; if (!vp || !pl || !sz) return;
    const s0 = live.current;
    const px = (vp.scrollLeft + fx) / s0, py = (vp.scrollTop + fy) / s0;
    live.current = s1;
    pl.style.transform = `scale(${s1})`;
    sz.style.width = `${size.w * s1}px`; sz.style.height = `${size.h * s1}px`;
    vp.scrollLeft = px * s1 - fx; vp.scrollTop = py * s1 - fy;
  };
  const zoomTo = (next: number, cx?: number, cy?: number) => {
    const vp = viewport.current; if (!vp) return;
    apply(Math.min(2, Math.max(MIN_ZOOM, next)), cx ?? vp.clientWidth / 2, cy ?? vp.clientHeight / 2);
    setScale(live.current);
  };

  // Two-finger pinch zooms around the fingers, at most once a frame; one finger scrolls natively.
  const pinch = useRef<{ d: number; s: number; frame: number } | null>(null);
  useEffect(() => {
    const vp = viewport.current; if (!vp) return;
    const dist = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const start = (e: TouchEvent) => { if (e.touches.length === 2) { pinch.current = { d: dist(e.touches), s: live.current, frame: 0 }; plane.current?.classList.add('pw-plane--moving'); } };
    const move = (e: TouchEvent) => {
      const g = pinch.current;
      if (e.touches.length !== 2 || !g) return;
      e.preventDefault();
      const r = vp.getBoundingClientRect();
      const s1 = Math.min(2, Math.max(MIN_ZOOM, g.s * (dist(e.touches) / g.d)));
      const fx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left, fy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top;
      if (!g.frame) g.frame = requestAnimationFrame(() => { g.frame = 0; apply(s1, fx, fy); });
    };
    const end = (e: TouchEvent) => {
      if (!pinch.current || e.touches.length >= 2) return;
      cancelAnimationFrame(pinch.current.frame);
      pinch.current = null;
      plane.current?.classList.remove('pw-plane--moving');
      setScale(live.current);
    };
    const stop = (e: Event) => e.preventDefault();
    vp.addEventListener('touchstart', start, { passive: true });
    vp.addEventListener('touchmove', move, { passive: false });
    vp.addEventListener('touchend', end);
    vp.addEventListener('touchcancel', end);
    vp.addEventListener('gesturestart', stop);
    vp.addEventListener('gesturechange', stop);
    return () => {
      vp.removeEventListener('touchstart', start); vp.removeEventListener('touchmove', move); vp.removeEventListener('touchend', end);
      vp.removeEventListener('touchcancel', end); vp.removeEventListener('gesturestart', stop); vp.removeEventListener('gesturechange', stop);
    };
  }, [size.w, size.h]); // eslint-disable-line react-hooks/exhaustive-deps

  // After an answer, bring the next box into view if it's off screen.
  const prevKey = useRef(routeKey);
  useEffect(() => {
    if (prevKey.current === routeKey) return;
    prevKey.current = routeKey;
    const vp = viewport.current, el = last && els.current.get(last.id);
    if (!vp || !el) return;
    const s = live.current, x = el.offsetLeft * s, y = el.offsetTop * s, w = el.offsetWidth * s;
    const visible = x >= vp.scrollLeft && x + w <= vp.scrollLeft + vp.clientWidth && y >= vp.scrollTop && y + 80 <= vp.scrollTop + vp.clientHeight - 140;
    if (!visible) vp.scrollTo?.({ left: x + w / 2 - vp.clientWidth / 2, top: y - 80, behavior: 'smooth' });
  }, [routeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!p || !card) return <NotFoundScreen />;
  const title = titleCase(p.title);
  const reg = (k: string) => (el: HTMLElement | null) => { if (el) els.current.set(k, el); else els.current.delete(k); };
  const choose = (nid: string, a: number) => {
    const i = route.findIndex((v) => v.id === nid);
    const drop = new Set(i < 0 ? [] : route.slice(i + 1).map((v) => v.id));
    const next: Record<string, number> = {};
    for (const [k, x] of Object.entries(choices)) if (!drop.has(k)) next[k] = x;
    next[nid] = a;
    setChoices(next);
  };
  const startOver = () => { setChoices({}); viewport.current?.scrollTo?.({ top: 0, behavior: 'smooth' }); };
  const stateOf = (nid: string, n: PathwayNode) => {
    if (n.kind === 'link') return onRoute.has(nid) || (n.from && onRoute.has(n.from)) ? 'on' : 'off';
    if (!onRoute.has(nid)) return 'off';
    return !ended && last?.id === nid ? 'now' : 'on';
  };
  const s = scale || 1;

  return (
    <div className="pw-map-page">
      <div className="top-bar">
        <AKG.Toolbar
          title={title}
          showTitle
          leading={<AKG.ToolbarButton icon={icons.chevronBackward} aria-label={`Back to ${card.title}`} onClick={() => goBack(href.card(card.id))} />}
          trailing={<AKG.ToolbarButton onClick={startOver} disabled={!Object.keys(choices).length}>Start Over</AKG.ToolbarButton>}
        />
      </div>
      <div className="pw-viewport" ref={viewport}>
        <div className="pw-sizer" ref={sizer} style={{ width: size.w * s, height: size.h * s }}>
          <div className="pw-plane" ref={plane} style={{ transform: `scale(${s})`, visibility: scale ? 'visible' : 'hidden' }} role="group" aria-label={`${title} pathway`}>
            <svg className="pw-lines" width={size.w} height={size.h} aria-hidden="true">
              {[...lines].sort((x, y) => Number(x.on) - Number(y.on)).map((l, i) => (
                <path key={i} d={l.d} className={`pw-line${l.on ? ' pw-line--on' : ''}${l.dash ? ' pw-line--dash' : ''}`} />
              ))}
            </svg>
            <div className="pw-grid" ref={gridRef} style={{ gridTemplateColumns: `repeat(${p.columns}, var(--pw-col))` }}>
              {Object.entries(p.nodes).flatMap(([nid, n]) => {
                const box = (
                  <div key={nid} ref={reg(nid)} className="pw-cell" style={{ gridColumn: n.at[0] + 1, gridRow: n.at[1] + 1 }}>
                    <Box id={nid} node={n} state={stateOf(nid, n)} />
                  </div>
                );
                if (!asks(n)) return [box];
                const v = onRoute.get(nid);
                return [box, ...(n.answers ?? []).map((a, j) => {
                  const st = !v ? 'off' : v.answer == null ? 'open' : v.answer === j ? 'chosen' : 'other';
                  return (
                    <div key={`${nid}#${j}`} ref={reg(`${nid}#${j}`)} className={`pw-cell pw-answer pw-answer--${st}`} data-question={nid} style={{ gridColumn: a.at[0] + 1, gridRow: a.at[1] + 1 }}>
                      <AKG.Button variant={st === 'chosen' ? 'prominent' : st === 'open' ? 'tinted' : 'bordered'} disabled={st === 'off'} aria-pressed={st === 'chosen'} onClick={() => choose(nid, j)}>{a.label}</AKG.Button>
                      {a.detail && <span className="ios-caption-1 pw-answer__detail"><Plain text={a.detail} /></span>}
                    </div>
                  );
                })];
              })}
            </div>
            <div className="pw-foot">
              {!!p.footer?.length && <><p className="pw-kind ios-caption-1-emphasized">Every Route</p><div className="pw-links">{p.footer.map((r) => <LinkButton key={r} refText={r} />)}</div></>}
              {p.sources.length > 0 && <AKG.SourceLine items={lineItems(p.sources)} onClick={() => openSources(sheet, p.sources, title)} />}
            </div>
          </div>
        </div>
      </div>
      <div className="pw-zoom">
        <AKG.ToolbarGroup>
          <AKG.ToolbarButton icon={<span className="pw-glyph" aria-hidden="true">−</span>} aria-label="Zoom Out" onClick={() => zoomTo(s / 1.25)} />
          <AKG.ToolbarButton onClick={() => { zoomTo(fit()); viewport.current?.scrollTo?.({ left: 0 }); }}>Fit</AKG.ToolbarButton>
          <AKG.ToolbarButton icon={<span className="pw-glyph" aria-hidden="true">+</span>} aria-label="Zoom In" onClick={() => zoomTo(s * 1.25)} />
        </AKG.ToolbarGroup>
      </div>
    </div>
  );
}
