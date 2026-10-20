import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AKG } from '../design/akg';
import { content, pathwayHomes, titleCase } from '../content';
import type { Pathway, PathwayStep } from '../content/types';
import { parseInline } from '../../scripts/content/inline.mjs';
import { href, open } from '../router';
import { DoseRow, Inlines, lineItems, openSources, RichText } from '../ui/Rich';
import { useSheet } from '../ui/SheetHost';
import { icons } from '../ui/icons';
import { Screen } from './common';
import { NotFoundScreen } from './Tabs';

// A pathway's own page (owner, 2026-10-19: pathways leave their cards and become pages).
// TEST BUILD (owner, 2026-10-19): layouts from the mock-up canvas, switched at the top of the page by letter (the
// canvas's option letters), so the owner can try them on the phone before choosing one. Fourth set (owner, same day; A
// replaced J):
//   I · Stages: one list of stages; finished stages fold to one line, the current one is open (top choice so far).
//   K · Choice lists: Settings-style sections; the chosen answer gets a checkmark.
//   A · One step at a time: only the current step on the page, a stage bar, Your Path for earlier answers.
//   L · Full screen: a focused full-screen task, one step at a time, answers within thumb reach.
//   M · Flowchart: the whole chart, full screen and always complete; pinch to zoom; tap answers in a row.
// All share one route: answers are kept while switching layouts, cleared by Start Over and on leaving the page.
// Caution steps are red (owner, 2026-10-19). There is no list of all treatments at the end (owner, same day).

export type Layout = 'stages' | 'choice' | 'step' | 'guided' | 'chart';
const LAYOUTS: { value: Layout; label: string; 'aria-label': string }[] = [
  { value: 'stages', label: 'I', 'aria-label': 'I, Stages' },
  { value: 'choice', label: 'K', 'aria-label': 'K, Choice lists' },
  { value: 'step', label: 'A', 'aria-label': 'A, One step at a time' },
  { value: 'guided', label: 'L', 'aria-label': 'L, Full screen' },
  { value: 'chart', label: 'M', 'aria-label': 'M, Flowchart' },
];
const LAYOUT_KEY = 'wards:pathway-layout';
function readLayout(): Layout {
  try {
    const v = localStorage.getItem(LAYOUT_KEY);
    return LAYOUTS.some((l) => l.value === v) ? (v as Layout) : 'stages';
  } catch { return 'stages'; }
}
function writeLayout(v: Layout) {
  try { localStorage.setItem(LAYOUT_KEY, v); } catch { /* not available */ }
}

// ---- The route ----

type Answer = { label: string; detail?: string; to: string };
const answersOf = (s: PathwayStep): Answer[] =>
  s.answers ?? (s.kind === 'checklist' && s.yes && s.no ? [{ label: 'All present', to: s.yes }, { label: 'Not all present', to: s.no }] : []);
const asks = (s: PathwayStep) => s.kind === 'question' || s.kind === 'checklist';

type Visit = { id: string; step: PathwayStep; answer?: number };
// Follows the answers from the start; caution and action steps lead on by themselves. Returns the steps on the
// route and whether it reached an end.
export function walk(p: Pathway, choices: Record<string, number>): { route: Visit[]; ended: boolean } {
  const route: Visit[] = [];
  const seen = new Set<string>();
  let id: string | undefined = p.start;
  while (id && p.steps[id] && !seen.has(id)) {
    seen.add(id);
    const step: PathwayStep = p.steps[id];
    if (asks(step)) {
      const a: number | undefined = choices[id];
      route.push({ id, step, answer: a });
      if (a == null) return { route, ended: false };
      id = answersOf(step)[a]?.to;
      continue;
    }
    route.push({ id, step });
    if (step.kind === 'result' && !step.next) return { route, ended: true };
    id = step.next;
  }
  return { route, ended: true };
}

const KIND: Record<PathwayStep['kind'], string> = { question: 'Question', checklist: 'Checklist', caution: 'Caution', action: 'Action', result: 'Result' };
const dosesIn = (text?: string) => [...(text ?? '').matchAll(/\{\{\s*dose\s*:\s*([a-z0-9-]+)\s*\}\}/g)].map((m) => m[1]).filter((id, i, a) => a.indexOf(id) === i);
// Answer details sit inside a button, so their values are plain text.
const Plain = ({ text }: { text?: string }) => (text ? <Inlines xs={parseInline(text)} plain /> : null);

function where(p: Pathway, to: string) {
  const t = p.steps[to];
  if (!t) return '';
  return t.kind === 'result' && !t.next ? `${t.title} (End)` : t.title;
}

function KindLabel({ step, now, noStage }: { step: PathwayStep; now?: boolean; noStage?: boolean }) {
  return (
    <p className={`pw-kind ios-caption-1-emphasized${step.kind === 'caution' ? ' pw-kind--caution' : ''}`}>
      {KIND[step.kind]}{step.stage && !noStage ? ` · ${step.stage}` : ''}{now ? ' · Now' : ''}
    </p>
  );
}

function StepBody({ step }: { step: PathwayStep }) {
  const doses = dosesIn(step.detail);
  return (
    <>
      {step.detail && <p className="ios-body"><RichText text={step.detail} /></p>}
      {doses.length > 0 && <div className="dose-rows">{doses.map((d) => <DoseRow key={d} id={d} />)}</div>}
      {step.items && <ul className="ios-body rich-list">{step.items.map((t, i) => <li key={i}><RichText text={t} /></li>)}</ul>}
      {step.list && <ul className="ios-body rich-list">{step.list.map((t, i) => <li key={i}><RichText text={t} /></li>)}</ul>}
      {step.note && <AKG.Panel tone="note" label="Note"><p className="ios-body"><RichText text={step.note} /></p></AKG.Panel>}
      {step.links?.map((l) => <a key={l} className="ios-body akg-link" href={href.card(l)}>Open {content.cards.find((c) => c.id === l)?.title ?? l}</a>)}
    </>
  );
}

// The answers under a question. Before one is chosen, every answer is a solid tile with a blue chevron; after,
// the chosen one is outlined ("Your answer") and the others say where they lead and switch the route when tapped.
function Answers({ p, v, onChoose }: { p: Pathway; v: Visit; onChoose: (i: number) => void }) {
  const list = answersOf(v.step);
  return (
    <div className="pw-answers" role="group" aria-label={`Answers: ${v.step.title}`}>
      {list.map((a, i) => {
        const chosen = v.answer === i;
        const state = v.answer == null ? 'open' : chosen ? 'chosen' : 'other';
        return (
          <button key={i} type="button" className={`pw-answer pw-answer--${state}`} aria-pressed={chosen} onClick={() => onChoose(i)}>
            <span className="pw-answer__text">
              <span className="ios-body-emphasized">{a.label}</span>
              {a.detail && <span className="ios-subheadline pw-answer__detail"><Plain text={a.detail} /></span>}
              {state === 'chosen' && <span className="ios-caption-1-emphasized pw-answer__mark">Your answer</span>}
              {state === 'other' && <span className="ios-caption-1 pw-answer__to">Switch to: {where(p, a.to)}</span>}
            </span>
            {state === 'open' && <span className="pw-answer__chevron" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

function EndMark({ reached }: { reached: boolean }) {
  return (
    <div className={`pw-end${reached ? ' pw-end--reached' : ''}`}>
      <span className="pw-end__square" aria-hidden="true" />
      <span>
        <span className="ios-headline">End of pathway</span>
        {reached && <span className="ios-footnote secondary pw-block">Nothing follows this step. Continue in the card.</span>}
      </span>
    </div>
  );
}

// ---- Layout I: stages that fold ----

function StagesLayout({ p, route, ended, onChoose }: LayoutProps) {
  const [open, setOpen] = useState<string[]>([]);
  const stages = p.stages?.length ? p.stages : [...new Set(route.map((v) => v.step.stage ?? 'Steps'))];
  const last = route[route.length - 1];
  const nowIdx = stages.indexOf(last.step.stage ?? 'Steps');
  return (
    <div className="pw-stages">
      {stages.map((s, i) => {
        const visits = route.filter((v) => (v.step.stage ?? 'Steps') === s);
        const isNow = i === nowIdx;
        const done = i < nowIdx;
        if (!done && !isNow) {
          return (
            <div key={s} className="pw-stage pw-stage--later">
              <span className="pw-stage__num ios-footnote-emphasized">{i + 1}</span>
              <span className="pw-stage__text"><span className="ios-caption-1-emphasized pw-kind">{s}</span><span className="ios-body">{ended ? 'Not on this route' : 'Not reached yet'}</span></span>
            </div>
          );
        }
        const expanded = isNow || open.includes(s);
        const summary = visits.length ? visits.map((v) => (v.answer != null ? answersOf(v.step)[v.answer]?.label : v.step.title)).join(' · ') : 'Skipped on this route';
        const header = (
          <>
            <span className={`pw-stage__num ios-footnote-emphasized${isNow ? ' pw-stage__num--now' : ''}`}>{i + 1}</span>
            <span className="pw-stage__text">
              <span className={`ios-caption-1-emphasized pw-kind${isNow ? ' pw-kind--now' : ''}`}>{s}{isNow ? (ended ? ' · Result' : ' · Now') : ''}</span>
              <span className={isNow ? 'ios-headline' : 'ios-body'}>{isNow ? last.step.title : summary}</span>
            </span>
          </>
        );
        return (
          <div key={s} className={`pw-stage${isNow ? ' pw-stage--now' : ' pw-stage--done'}`}>
            {done && visits.length ? (
              <button type="button" className="pw-stage__head" aria-expanded={expanded} onClick={() => setOpen(expanded ? open.filter((x) => x !== s) : [...open, s])}>
                {header}<span className="pw-stage__toggle ios-subheadline-emphasized">{expanded ? 'Hide' : 'Change'}</span>
              </button>
            ) : <div className="pw-stage__head">{header}</div>}
            {expanded && visits.length > 0 && (
              <div className="pw-stage__body">
                {visits.map((v) => (
                  <section key={v.id} className={`pw-step pw-step--${v.step.kind}`}>
                    {!(isNow && v === last) && <><KindLabel step={v.step} /><h2 className="ios-headline">{v.step.title}</h2></>}
                    <StepBody step={v.step} />
                    {asks(v.step) && <Answers p={p} v={v} onChoose={(a) => onChoose(v.id, a)} />}
                  </section>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <EndMark reached={ended} />
    </div>
  );
}

// ---- Layout K: choice lists ----

// One page in the style of Settings: each question is a list section and the answer you tap gets a checkmark (tap
// another to change it; HIG: option lists show a checkmark). Actions and cautions are their own sections with
// their doses; the next section appears below each answer; the page ends with End of pathway.
function ChoiceLayout({ p, route, ended, onChoose }: LayoutProps) {
  const last = route[route.length - 1];
  const ahead = (p.stages ?? []).slice((p.stages ?? []).indexOf(last.step.stage ?? '') + 1);
  return (
    <div className="pw-choice">
      {route.map((v) => {
        const now = !ended && v === last;
        const header = (
          <span className="pw-choice__head">
            <KindLabel step={v.step} now={now} />
            <span className="ios-headline">{v.step.title}</span>
          </span>
        );
        if (!asks(v.step)) {
          return (
            <section key={v.id} className="pw-choice__section">
              {header}
              <div className={`pw-choice__cell pw-step pw-step--${v.step.kind}`}><StepBody step={v.step} /></div>
            </section>
          );
        }
        return (
          <section key={v.id} className="pw-choice__section">
            {header}
            {v.step.detail && <p className="ios-subheadline secondary pw-choice__detail"><RichText text={v.step.detail} /></p>}
            <AKG.List aria-label={v.step.title}>
              {answersOf(v.step).map((a, j) => (
                <AKG.ListRow key={j} title={a.label} subtitle={a.detail ? <Plain text={a.detail} /> : undefined} checked={v.answer === j} onClick={() => onChoose(v.id, j)} aria-checked={v.answer === j} />
              ))}
            </AKG.List>
          </section>
        );
      })}
      {ended ? <EndMark reached /> : <p className="ios-footnote secondary pw-choice__then">{ahead.length ? `Then ${ahead.join(', ')}, then End of pathway.` : 'Then End of pathway.'}</p>}
    </div>
  );
}

// ---- Layout A: one step at a time ----

// Only the current step, large, on the page. A stage bar says how far you are; the last answer shows above the
// step with Change, and Your Path (top of the step) lists every earlier answer in a sheet. Actions show their doses
// with Continue; Previous Step goes back one. The last step is the result with End of pathway.
function StepLayout({ p, route, ended, view, onChoose, onNext, onPrev, onJump, after }: StepProps & { onJump: (i: number) => void }) {
  const sheet = useSheet();
  const v = route[view];
  const stages = p.stages ?? [];
  const stageIdx = stages.indexOf(v.step.stage ?? '');
  const isEnd = ended && view === route.length - 1;
  const earlier = route.slice(0, view).map((x, i) => ({ x, i })).filter(({ x }) => x.answer != null);
  const prev = earlier[earlier.length - 1];
  const showPath = () => sheet({
    title: 'Your Path',
    body: (
      <AKG.List footer="Tap a step to go back to it.">
        {earlier.map(({ x, i }) => <AKG.ListRow key={x.id} title={answersOf(x.step)[x.answer!]?.label} subtitle={x.step.title} chevron onClick={() => { sheet(null); onJump(i); }} />)}
      </AKG.List>
    ),
  });
  return (
    <div className="pw-one">
      {stages.length > 0 && (
        <div className="pw-one__progress">
          <AKG.ProgressIndicator value={isEnd ? stages.length : Math.max(stageIdx, 0) + 1} max={stages.length} aria-label={`Stage ${stageIdx + 1} of ${stages.length}`} />
          <div className="pw-one__progressline">
            <span className="ios-footnote secondary">{isEnd ? 'End of pathway' : `Stage ${stageIdx + 1} of ${stages.length} · ${v.step.stage}`}</span>
            {earlier.length > 0 && <AKG.Button variant="borderless" size="small" onClick={showPath}>Your Path ({earlier.length})</AKG.Button>}
          </div>
        </div>
      )}
      {prev && (
        <div className="pw-one__prev">
          <span className="ios-subheadline secondary">{prev.x.step.title} <strong className="pw-one__prevv">{answersOf(prev.x.step)[prev.x.answer!]?.label}</strong></span>
          <AKG.Button variant="borderless" size="small" onClick={() => onJump(prev.i)}>Change</AKG.Button>
        </div>
      )}
      <section className={`pw-one__step pw-step pw-step--${v.step.kind}`} aria-current="step">
        <KindLabel step={v.step} />
        <h2 className="ios-title-1-emphasized">{v.step.title}</h2>
        <StepBody step={v.step} />
        {asks(v.step) && <Answers p={p} v={v} onChoose={(a) => onChoose(v.id, a)} />}
        {isEnd && <EndMark reached />}
      </section>
      {!asks(v.step) && !isEnd && (
        <div className="pw-one__buttons">
          {view > 0 && <AKG.Button size="large" onClick={onPrev}>Previous Step</AKG.Button>}
          <AKG.Button variant="prominent" size="large" onClick={onNext}>Continue</AKG.Button>
        </div>
      )}
      {asks(v.step) && view > 0 && <AKG.Button variant="borderless" onClick={onPrev}>Previous Step</AKG.Button>}
      {isEnd && after}
    </div>
  );
}

// ---- Layout L: full-screen guided mode ----

// The pathway as a focused task over the whole screen (HIG: a full-screen modal for a multi-step task, a short
// title, Close at the leading edge, Done as the one main action). One step at a time; the answers sit low on the
// screen, within thumb reach, with Previous Step under them. The tab bar is hidden while it's open.
function GuidedLayout({ p, route, ended, view, onChoose, onNext, onPrev, onDone, title, cardTitle }: StepProps & { title: string; cardTitle?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => (open ? AKG.lockScroll() : undefined), [open]);
  AKG.useEscape(open, () => setOpen(false));
  const v = route[view];
  const stages = p.stages ?? [];
  const stageIdx = stages.indexOf(v.step.stage ?? '');
  const isEnd = ended && view === route.length - 1;
  const finish = () => { setOpen(false); onDone(); };
  return (
    <>
      <AKG.List footer="Opens over the whole screen, one step at a time.">
        <AKG.ListRow title={view > 0 ? 'Continue Pathway' : 'Start Pathway'} subtitle={view > 0 ? `At: ${v.step.title}` : undefined} action onClick={() => setOpen(true)} />
      </AKG.List>
      {open && (
        <div className="pw-guided" role="dialog" aria-modal="true" aria-label={title}>
          <div className="pw-guided__bar">
            <AKG.ToolbarButton icon={icons.xmark} aria-label="Close" onClick={() => setOpen(false)} />
            <span className="ios-headline pw-guided__title">{cardTitle ?? title}</span>
            {isEnd ? <AKG.ToolbarButton prominent onClick={finish}>Done</AKG.ToolbarButton> : <span className="pw-guided__spacer" />}
          </div>
          <div className="pw-guided__scroll">
            {stages.length > 0 && (
              <div className="pw-guided__progress">
                <AKG.ProgressIndicator value={isEnd ? stages.length : Math.max(stageIdx, 0) + 1} max={stages.length} aria-label={`Stage ${stageIdx + 1} of ${stages.length}`} />
                <p className="ios-footnote secondary">{isEnd ? 'End of pathway' : `Stage ${stageIdx + 1} of ${stages.length} · ${v.step.stage}`}</p>
              </div>
            )}
            <section className={`pw-guided__step pw-step pw-step--${v.step.kind}`}>
              <KindLabel step={v.step} />
              <h2 className="ios-title-1-emphasized">{v.step.title}</h2>
              <StepBody step={v.step} />
              {isEnd && <EndMark reached />}
            </section>
          </div>
          <div className="pw-guided__actions">
            {asks(v.step) && <Answers p={p} v={v} onChoose={(a) => onChoose(v.id, a)} />}
            {!asks(v.step) && !isEnd && <AKG.Button variant="prominent" size="large" className="wide-button" onClick={onNext}>Continue</AKG.Button>}
            {isEnd && <AKG.Button size="large" className="wide-button" onClick={onPrev}>Previous Step</AKG.Button>}
            {!isEnd && view > 0 && <AKG.Button variant="borderless" onClick={onPrev}>Previous Step</AKG.Button>}
          </div>
        </div>
      )}
    </>
  );
}

// ---- Layout M: the whole flowchart, full screen ----

// A traditional flowchart that is always complete: every step and every answer is drawn, in rows from the top.
// Pinch (or the zoom buttons) to zoom, drag to move around, like a map. Tap an answer in a row: it fills in blue and
// the route continues from it; the other answers in that row stay unfilled, and steps off your route turn gray.
// Only standard pieces (owner: HIG, "not random shapes and lines"): design-system buttons for answers, grouped
// cards for steps, Tags for Caution and End, right-angled 1/2pt connectors, a toolbar group for zoom.
// Only answers to questions on your route can be tapped (never two branches at once).
type ChartNode = { key: string; kind: 'step' | 'answer'; step: string; answer?: number };

function chartRows(p: Pathway): { rows: ChartNode[][]; edges: [string, string][] } {
  const nodes = new Map<string, ChartNode>();
  const kids = new Map<string, string[]>();
  const edges: [string, string][] = [];
  const add = (n: ChartNode) => { if (!nodes.has(n.key)) nodes.set(n.key, n); };
  const link = (a: string, b: string) => { edges.push([a, b]); kids.set(a, [...(kids.get(a) ?? []), b]); };
  for (const [id, s] of Object.entries(p.steps)) {
    add({ key: `s:${id}`, kind: 'step', step: id });
    if (asks(s)) {
      answersOf(s).forEach((a, j) => {
        const k = `a:${id}:${j}`;
        add({ key: k, kind: 'answer', step: id, answer: j });
        link(`s:${id}`, k);
        if (p.steps[a.to]) link(k, `s:${a.to}`);
      });
    } else if (s.next && p.steps[s.next]) link(`s:${id}`, `s:${s.next}`);
  }
  // Rows by longest distance from the start, so a step reached two ways sits below both.
  const order: string[] = [];
  const seen = new Set<string>();
  const visit = (k: string) => { if (seen.has(k)) return; seen.add(k); (kids.get(k) ?? []).forEach(visit); order.push(k); };
  visit(`s:${p.start}`);
  order.reverse();
  const depth = new Map<string, number>([[`s:${p.start}`, 0]]);
  for (const k of order) for (const c of kids.get(k) ?? []) depth.set(c, Math.max(depth.get(c) ?? 0, (depth.get(k) ?? 0) + 1));
  const rows: ChartNode[][] = [];
  for (const k of order) { const d = depth.get(k) ?? 0; (rows[d] ??= []).push(nodes.get(k)!); }
  // Within a row, follow the order of the rows above (answers stay in their own order, side by side).
  const pos = new Map<string, number>();
  rows.forEach((row, d) => {
    if (d > 0) {
      const parents = (k: string) => edges.filter(([, b]) => b === k).map(([a]) => pos.get(a)).filter((x): x is number => x != null);
      const score = (n: ChartNode) => { const ps = parents(n.key); return (ps.length ? ps.reduce((x, y) => x + y, 0) / ps.length : 0) + (n.answer ?? 0) * 0.001; };
      row.sort((a, b) => score(a) - score(b));
    }
    row.forEach((n, i) => pos.set(n.key, i - (row.length - 1) / 2));
  });
  return { rows: rows.filter(Boolean), edges };
}

function ChartLayout({ p, route, ended, onChoose, onStartOver, title }: LayoutProps & { onStartOver: () => void; title: string }) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [lines, setLines] = useState<{ d: string; on: boolean }[]>([]);
  const viewport = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, HTMLElement>());
  const { rows, edges } = useMemo(() => chartRows(p), [p]);
  useEffect(() => (open ? AKG.lockScroll() : undefined), [open]);
  AKG.useEscape(open, () => setOpen(false));

  const onRoute = new Map(route.map((v) => [v.id, v]));
  const last = route[route.length - 1];
  const chosenKey = (id: string) => { const v = onRoute.get(id); return v?.answer != null ? `a:${id}:${v.answer}` : null; };
  const edgeOn = ([a, b]: [string, string]) => {
    const [ka, ia] = a.split(':'); const [kb, ib] = b.split(':');
    if (ka === 's' && kb === 's') return onRoute.has(ia) && onRoute.has(ib);
    if (ka === 's') return chosenKey(ia) === b;
    return chosenKey(ia) === a && onRoute.has(ib);
  };

  // Measure the boxes (unscaled) and draw the lines between them.
  useLayoutEffect(() => {
    if (!open || !plane.current) return;
    const pr = plane.current.getBoundingClientRect();
    const s = scale || 1;
    const at = (k: string) => { const r = els.current.get(k)?.getBoundingClientRect(); return r && { x: (r.left - pr.left) / s, y: (r.top - pr.top) / s, w: r.width / s, h: r.height / s }; };
    setLines(edges.map((e) => {
      const a = at(e[0]); const b = at(e[1]);
      if (!a || !b) return null;
      // Right-angled connectors: down, across at the gap between the rows, down into the next box.
      const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y, m = Math.round((y1 + y2) / 2);
      return { d: x1 === x2 ? `M${x1},${y1} V${y2}` : `M${x1},${y1} V${m} H${x2} V${y2}`, on: edgeOn(e) };
    }).filter((x): x is { d: string; on: boolean } => !!x));
    setSize({ w: plane.current.offsetWidth, h: plane.current.offsetHeight });
  }, [open, choicesKey(route), scale]);

  // Start fitted to the screen width.
  useLayoutEffect(() => {
    if (open && !scale) setScale(fit());
  }, [open]);
  const fit = () => {
    const w = plane.current?.offsetWidth ?? 0, vw = viewport.current?.clientWidth ?? 0;
    return w && vw ? Math.min(1, Math.max(0.3, (vw - 16) / w)) : 1;
  };
  // The zoom in use right now (state lags behind a pinch, which zooms many times a second).
  const live = useRef(1);
  if (scale) live.current = scale;
  const zoomTo = (next: number, cx?: number, cy?: number) => {
    const vp = viewport.current; if (!vp) return;
    const s0 = live.current; const s1 = Math.min(2.5, Math.max(0.25, next));
    live.current = s1;
    const fx = cx ?? vp.clientWidth / 2, fy = cy ?? vp.clientHeight / 2;
    const px = (vp.scrollLeft + fx) / s0, py = (vp.scrollTop + fy) / s0;
    pending.current = { x: px * s1 - fx, y: py * s1 - fy };
    setScale(s1);
  };
  // Keep the point under the fingers (or the screen's center) in place: scroll once the chart has its new size.
  const pending = useRef<{ x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    const vp = viewport.current, to = pending.current;
    if (vp && to) { vp.scrollLeft = Math.max(0, to.x); vp.scrollTop = Math.max(0, to.y); pending.current = null; }
  }, [scale]);

  // Two-finger pinch zooms around the fingers; one finger scrolls natively.
  const pinch = useRef<{ d: number; s: number } | null>(null);
  useEffect(() => {
    const vp = viewport.current; if (!open || !vp) return;
    const dist = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const start = (e: TouchEvent) => { if (e.touches.length === 2) pinch.current = { d: dist(e.touches), s: live.current }; };
    const move = (e: TouchEvent) => {
      if (e.touches.length !== 2 || !pinch.current) return;
      e.preventDefault();
      const r = vp.getBoundingClientRect();
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left, cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top;
      zoomTo(pinch.current.s * (dist(e.touches) / pinch.current.d), cx, cy);
    };
    const end = () => { pinch.current = null; };
    const stop = (e: Event) => e.preventDefault();
    vp.addEventListener('touchstart', start, { passive: true });
    vp.addEventListener('touchmove', move, { passive: false });
    vp.addEventListener('touchend', end);
    vp.addEventListener('gesturestart', stop);
    vp.addEventListener('gesturechange', stop);
    return () => {
      vp.removeEventListener('touchstart', start); vp.removeEventListener('touchmove', move); vp.removeEventListener('touchend', end);
      vp.removeEventListener('gesturestart', stop); vp.removeEventListener('gesturechange', stop);
    };
  });

  const reg = (k: string) => (el: HTMLElement | null) => { if (el) els.current.set(k, el); else els.current.delete(k); };
  const s = scale || 1;
  return (
    <>
      <AKG.List footer="The whole pathway as one chart. Pinch to zoom, drag to move around.">
        <AKG.ListRow title="Open Flowchart" subtitle={route.some((v) => v.answer != null) ? `At: ${last.step.title}` : undefined} action onClick={() => setOpen(true)} />
      </AKG.List>
      {open && (
        <div className="pw-guided pw-chartview" role="dialog" aria-modal="true" aria-label={`${title}, flowchart`}>
          <div className="pw-guided__bar">
            <AKG.ToolbarButton icon={icons.xmark} aria-label="Close" onClick={() => setOpen(false)} />
            <span className="ios-headline pw-guided__title">Flowchart</span>
            <AKG.ToolbarButton onClick={onStartOver} disabled={!route.some((v) => v.answer != null)}>Start Over</AKG.ToolbarButton>
          </div>
          <div className="pw-chart__viewport" ref={viewport}>
            <div className="pw-chart__sizer" style={{ width: size.w * s, height: size.h * s }}>
              <div className="pw-chart__plane" ref={plane} style={{ transform: `scale(${s})`, visibility: scale ? 'visible' : 'hidden' }} role="group" aria-label={`${title} flowchart`}>
                <svg className="pw-chart__lines" width={size.w} height={size.h} aria-hidden="true">
                  {[...lines].sort((x, y) => Number(x.on) - Number(y.on)).map((l, i) => <path key={i} d={l.d} className={l.on ? 'pw-chart__line pw-chart__line--on' : 'pw-chart__line'} />)}
                </svg>
                {rows.map((row, d) => (
                  <div key={d} className="pw-chart__row">
                    {row.map((n) => {
                      const st = p.steps[n.step];
                      if (n.kind === 'answer') {
                        const a = answersOf(st)[n.answer!];
                        const v = onRoute.get(n.step);
                        const state = !v ? 'off' : v.answer == null ? 'open' : v.answer === n.answer ? 'chosen' : 'other';
                        // Standard buttons (HIG): filled when chosen, tinted while it can be chosen, gray otherwise.
                        const variant = state === 'chosen' ? 'prominent' : state === 'open' ? 'tinted' : 'bordered';
                        return (
                          <div key={n.key} ref={reg(n.key)} className={`pw-chart__answer pw-chart__answer--${state}`}>
                            <AKG.Button variant={variant} disabled={state === 'off'} aria-pressed={state === 'chosen'} onClick={() => onChoose(n.step, n.answer!)}>{a.label}</AKG.Button>
                            {a.detail && <span className="ios-caption-1 pw-chart__answerdetail"><Plain text={a.detail} /></span>}
                          </div>
                        );
                      }
                      const on = onRoute.has(n.step);
                      const now = !ended && last.id === n.step;
                      const end = st.kind === 'result' && !st.next;
                      return (
                        <section key={n.key} ref={reg(n.key)} className={`pw-chart__box pw-step pw-step--${st.kind}${on ? ' pw-chart__box--on' : ' pw-chart__box--off'}${now ? ' pw-chart__box--now' : ''}`} aria-current={now ? 'step' : undefined}>
                          {(st.kind === 'caution' || end) && (
                            <span className="tag-row">
                              {st.kind === 'caution' && <AKG.Tag variant="critical">Caution</AKG.Tag>}
                              {end && <AKG.Tag variant="neutral">End of Pathway</AKG.Tag>}
                            </span>
                          )}
                          {st.kind === 'caution' ? <p className="pw-kind ios-caption-1-emphasized">{st.stage}{now ? ' · Now' : ''}</p> : <KindLabel step={st} now={now} />}
                          <h2 className="ios-headline">{st.title}</h2>
                          <StepBody step={st} />
                        </section>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pw-chart__zoom">
            <AKG.ToolbarGroup>
              <AKG.ToolbarButton icon={<span className="pw-chart__glyph" aria-hidden="true">−</span>} aria-label="Zoom Out" onClick={() => zoomTo(s / 1.25)} />
              <AKG.ToolbarButton onClick={() => { zoomTo(fit()); viewport.current?.scrollTo({ left: 0 }); }}>Fit</AKG.ToolbarButton>
              <AKG.ToolbarButton icon={<span className="pw-chart__glyph" aria-hidden="true">+</span>} aria-label="Zoom In" onClick={() => zoomTo(s * 1.25)} />
            </AKG.ToolbarGroup>
          </div>
        </div>
      )}
    </>
  );
}
const choicesKey = (route: Visit[]) => route.map((v) => `${v.id}:${v.answer ?? ''}`).join('|');

type LayoutProps = { p: Pathway; route: Visit[]; ended: boolean; onChoose: (id: string, answer: number) => void };
type StepProps = LayoutProps & { view: number; onNext: () => void; onPrev: () => void; onDone: () => void; after?: ReactNode };

// ---- The page ----

export function PathwayScreen({ id }: { id: string }) {
  const p = content.data.pathway?.[id] as Pathway | undefined;
  const sheet = useSheet();
  const [layout, setLayout] = useState<Layout>(readLayout);
  const [choices, setChoices] = useState<Record<string, number>>({});
  // A and L show one step at a time: the step on screen, as a place on the route.
  const [view, setView] = useState(0);
  // A new pathway starts empty (answers are never kept between visits).
  useEffect(() => { setChoices({}); setView(0); }, [id]);
  if (!p) return <NotFoundScreen />;

  const { route, ended } = walk(p, choices);
  const at = Math.min(view, route.length - 1);
  const started = Object.keys(choices).length > 0 || view > 0;
  const homes = pathwayHomes().filter((h) => h.id === id);
  const stepped = layout === 'step' || layout === 'guided';

  // Changing an answer clears every answer after it on the route.
  const choose = (stepId: string, a: number) => {
    const i = route.findIndex((v) => v.id === stepId);
    const drop = new Set(i < 0 ? [] : route.slice(i + 1).map((v) => v.id));
    const next: Record<string, number> = {};
    for (const [k, x] of Object.entries(choices)) if (!drop.has(k)) next[k] = x;
    next[stepId] = a;
    setChoices(next);
    if (stepped) { setView(i + 1); scrollTo({ top: 0 }); }
  };
  const go = (n: number) => { setView(Math.max(0, n)); scrollTo({ top: 0 }); };
  const startOver = () => { setChoices({}); setView(0); scrollTo({ top: 0 }); };
  const done = () => { const h = homes[0]; if (h) open(href.card(h.card.id, h.section)); };
  const pick = (v: string | number) => { setLayout(v as Layout); writeLayout(v as Layout); };

  const title = titleCase(p.title ?? 'Pathway');
  const after = (
    <div className="pw-after">
      {homes.length > 0 && (
        <AKG.List header="In the Card">
          {homes.map((h) => <AKG.ListRow key={h.card.id} title={h.card.title} subtitle={h.card.sections.find((s) => s.key === h.section)?.title} chevron href={href.card(h.card.id, h.section)} />)}
        </AKG.List>
      )}
      <AKG.Button size="large" className="wide-button" onClick={startOver}>Start Over</AKG.Button>
    </div>
  );
  const props: StepProps = { p, route, ended, onChoose: choose, view: at, onNext: () => go(at + 1), onPrev: () => go(at - 1), onDone: done };
  let body: ReactNode;
  if (layout === 'choice') body = <ChoiceLayout {...props} />;
  else if (layout === 'step') body = <StepLayout {...props} after={after} onJump={go} />;
  else if (layout === 'chart') body = <ChartLayout {...props} onStartOver={startOver} title={title} />;
  else if (layout === 'guided') body = <GuidedLayout {...props} title={title} cardTitle={homes[0]?.card.title} />;
  else body = <StagesLayout {...props} />;

  return (
    <Screen
      title={title}
      back={{ label: 'Pathways', fallback: href.libraryList('pathways') }}
      trailing={<AKG.ToolbarButton onClick={startOver} disabled={!started}>Start Over</AKG.ToolbarButton>}
    >
      <div className="pw-layout">
        <AKG.SegmentedControl options={LAYOUTS} value={layout} onChange={pick} aria-label="Test layout" />
        <p className="ios-footnote secondary">Test layouts: I Stages · K Choice lists · A One step · L Full screen · M Flowchart.</p>
      </div>
      {body}
      {ended && (layout === 'stages' || layout === 'choice') && after}
      {p.sources?.length > 0 && <AKG.SourceLine className="pw-sources" items={lineItems(p.sources)} onClick={() => openSources(sheet, p.sources, title)} />}
    </Screen>
  );
}
