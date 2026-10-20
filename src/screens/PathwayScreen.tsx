import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { AKG } from '../design/akg';
import { content, pathwayHomes, titleCase } from '../content';
import type { Pathway, PathwayStep } from '../content/types';
import { parseInline } from '../../scripts/content/inline.mjs';
import { href } from '../router';
import { DoseRow, Inlines, lineItems, openSources, RichText } from '../ui/Rich';
import { useSheet } from '../ui/SheetHost';
import { Screen } from './common';
import { NotFoundScreen } from './Tabs';

// A pathway's own page (owner, 2026-10-19: pathways leave their cards and become pages).
// TEST BUILD (owner, 2026-10-19): three layouts from the mock-up canvas, switched at the top of the page, so the owner
// can try them on the phone before choosing one. Second set (owner, same day: "Replace with B, I, E2"; Stages is
// the top choice so far, so it opens first):
//   Tree (option B): the whole pathway as one scrolling decision tree, your answers in place, End marker.
//   Stages (option I): one list of stages; finished stages fold to one line, the current one is open.
//   Map (option E): a small chart of the route behind, the current step in a panel at the bottom.
// All three share one route: answers are kept while switching layouts, cleared by Start Over and on leaving the page.
// Caution steps are red (owner, 2026-10-19). There is no list of all treatments at the end (owner, same day).

export type Layout = 'tree' | 'stages' | 'map';
const LAYOUTS: { value: Layout; label: string }[] = [
  { value: 'stages', label: 'Stages' },
  { value: 'tree', label: 'Tree' },
  { value: 'map', label: 'Map' },
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

// ---- Layout B: decision tree ----

// The whole pathway as one scrolling tree: a line down the left joins the steps, grouped by stage. An answered
// question keeps your answer in place; the other answers become small "Other answer" links that switch the route.
// Stages not reached are dotted; the line ends in a square End marker.
function TreeLayout({ p, route, ended, onChoose }: LayoutProps) {
  const stages = p.stages?.length ? p.stages : [...new Set(route.map((v) => v.step.stage ?? 'Steps'))];
  const last = route[route.length - 1];
  const nowIdx = stages.indexOf(last.step.stage ?? 'Steps');
  return (
    <div className="pw-tree">
      {stages.map((s, i) => {
        const visits = route.filter((v) => (v.step.stage ?? 'Steps') === s);
        const ahead = i > nowIdx;
        return (
          <Fragment key={s}>
            <div className={`pw-tree__stage${ahead || !visits.length ? ' pw-tree__stage--ahead' : ''}`}>
              <span className="ios-caption-1-emphasized pw-kind">{s}</span>
              {!visits.length && <span className="ios-footnote secondary">{ahead && !ended ? 'Not reached yet' : 'Not on this route'}</span>}
            </div>
            {visits.map((v) => {
              const now = !ended && v === last;
              const answered = asks(v.step) && v.answer != null;
              const dot = now ? 'now' : v.step.kind === 'caution' ? 'caution' : 'done';
              return (
                <div key={v.id} className="pw-tree__node">
                  <span className={`pw-tree__dot pw-tree__dot--${dot}`} aria-hidden="true" />
                  <section className={`pw-tree__card pw-step--${v.step.kind}${now ? ' pw-tree__card--now' : ''}`} aria-current={now ? 'step' : undefined}>
                    <KindLabel step={v.step} now={now} noStage />
                    <h2 className="ios-headline">{v.step.title}</h2>
                    {answered ? (
                      <>
                        <p className="pw-tree__pick ios-body"><span className="secondary">Your answer: </span><strong>{answersOf(v.step)[v.answer!]?.label}</strong></p>
                        {answersOf(v.step).map((a, j) => j === v.answer ? null : (
                          <button key={j} type="button" className="pw-tree__stub ios-subheadline" onClick={() => onChoose(v.id, j)}>
                            <span className="secondary">Other answer: </span>{a.label}<span className="secondary"> → {where(p, a.to)}</span>
                          </button>
                        ))}
                      </>
                    ) : (
                      <>
                        <StepBody step={v.step} />
                        {asks(v.step) && <Answers p={p} v={v} onChoose={(a) => onChoose(v.id, a)} />}
                      </>
                    )}
                  </section>
                </div>
              );
            })}
          </Fragment>
        );
      })}
      <div className={`pw-tree__node pw-tree__node--end${ended ? '' : ' pw-tree__node--ahead'}`}>
        <span className="pw-tree__dot pw-tree__dot--end" aria-hidden="true" />
        <div className="pw-tree__endtext">
          <span className="ios-headline">End of pathway</span>
          {ended && <span className="ios-footnote secondary pw-block">The line stops here. Continue in the card.</span>}
        </div>
      </div>
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

// ---- Layout E: map behind, step in front ----

// The route as a small chart that fills the page (your route in the label color, other answers as gray boxes that
// switch the route, End as a rounded terminal), with the current step in a panel at the bottom, above the tab bar.
// The panel holds everything since your last answer (so an action's doses are always readable); its grabber makes
// it taller or shorter.
function MapLayout({ p, route, ended, onChoose, after }: LayoutProps) {
  const [tall, setTall] = useState(false);
  const last = route[route.length - 1];
  const ahead = (p.stages ?? []).slice((p.stages ?? []).indexOf(last.step.stage ?? '') + 1);
  // Steps shown in the panel: from just after the last answered question to the end of the route.
  let from = 0;
  for (let i = route.length - 1; i >= 0; i--) if (route[i].answer != null) { from = i + 1; break; }
  const shown = route.slice(Math.min(from, route.length - 1));
  return (
    <>
      <div className="pw-map" aria-label="Map of your route">
        {route.map((v, i) => {
          const now = !ended && v === last;
          return (
            <Fragment key={v.id}>
              {i > 0 && <span className="pw-map__arrow" aria-hidden="true" />}
              <div className={`pw-map__box pw-map__box--${v.step.kind}${now ? ' pw-map__box--now' : ''} ios-caption-1`}>{v.step.title}</div>
              {asks(v.step) && (
                <div className="pw-map__branches">
                  {answersOf(v.step).map((a, j) => {
                    const state = v.answer == null ? 'open' : v.answer === j ? 'chosen' : 'other';
                    return state === 'other'
                      ? <button key={j} type="button" className="pw-map__box pw-map__box--other ios-caption-1" onClick={() => onChoose(v.id, j)} aria-label={`Switch to ${a.label}`}>{a.label}<span className="pw-map__to"> → {where(p, a.to)}</span></button>
                      : <div key={j} className={`pw-map__box pw-map__box--${state} ios-caption-1`}>{a.label}</div>;
                  })}
                </div>
              )}
            </Fragment>
          );
        })}
        {ended
          ? <><span className="pw-map__arrow" aria-hidden="true" /><div className="pw-map__end ios-caption-1-emphasized">End</div></>
          : <><span className="pw-map__arrow pw-map__arrow--ahead" aria-hidden="true" /><p className="ios-caption-1 secondary centered">{ahead.length ? `${ahead.join(', ')}, End` : 'End'}</p></>}
      </div>
      <div className="pw-panel-space" aria-hidden="true" />
      <section className={`pw-panel${tall ? ' pw-panel--tall' : ''}`} aria-label="Current step">
        <button type="button" className="pw-panel__grabber" aria-label={tall ? 'Make step panel shorter' : 'Make step panel taller'} onClick={() => setTall(!tall)}><span /></button>
        <div className="pw-panel__body">
          {shown.map((v) => (
            <div key={v.id} className={`pw-step pw-step--${v.step.kind}`}>
              <KindLabel step={v.step} now={!ended && v === last} />
              <h2 className="ios-title-3-emphasized">{v.step.title}</h2>
              <StepBody step={v.step} />
              {asks(v.step) && <Answers p={p} v={v} onChoose={(a) => onChoose(v.id, a)} />}
            </div>
          ))}
          {ended && <><EndMark reached />{after}</>}
        </div>
      </section>
    </>
  );
}

type LayoutProps = { p: Pathway; route: Visit[]; ended: boolean; onChoose: (id: string, answer: number) => void; after?: ReactNode };

// ---- The page ----

export function PathwayScreen({ id }: { id: string }) {
  const p = content.data.pathway?.[id] as Pathway | undefined;
  const sheet = useSheet();
  const [layout, setLayout] = useState<Layout>(readLayout);
  const [choices, setChoices] = useState<Record<string, number>>({});
  // A new pathway starts empty (answers are never kept between visits).
  useEffect(() => { setChoices({}); }, [id]);
  if (!p) return <NotFoundScreen />;

  const { route, ended } = walk(p, choices);
  const started = Object.keys(choices).length > 0;
  const homes = pathwayHomes().filter((h) => h.id === id);

  // Changing an answer clears every answer after it on the route.
  const choose = (stepId: string, a: number) => {
    const i = route.findIndex((v) => v.id === stepId);
    const drop = new Set(i < 0 ? [] : route.slice(i + 1).map((v) => v.id));
    const next: Record<string, number> = {};
    for (const [k, x] of Object.entries(choices)) if (!drop.has(k)) next[k] = x;
    next[stepId] = a;
    setChoices(next);
  };
  const startOver = () => { setChoices({}); scrollTo({ top: 0 }); };
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
  const props: LayoutProps = { p, route, ended, onChoose: choose };
  let body: ReactNode;
  if (layout === 'tree') body = <TreeLayout {...props} />;
  else if (layout === 'map') body = <MapLayout {...props} after={after} />;
  else body = <StagesLayout {...props} />;

  return (
    <Screen
      title={title}
      back={{ label: 'Pathways', fallback: href.libraryList('pathways') }}
      trailing={<AKG.ToolbarButton onClick={startOver} disabled={!started}>Start Over</AKG.ToolbarButton>}
    >
      <div className="pw-layout">
        <AKG.SegmentedControl options={LAYOUTS} value={layout} onChange={pick} aria-label="Test layout" />
        <p className="ios-footnote secondary">Test layouts: try each, then choose one.</p>
      </div>
      {body}
      {ended && layout !== 'map' && after}
      {p.sources?.length > 0 && <AKG.SourceLine className="pw-sources" items={lineItems(p.sources)} onClick={() => openSources(sheet, p.sources, title)} />}
    </Screen>
  );
}
