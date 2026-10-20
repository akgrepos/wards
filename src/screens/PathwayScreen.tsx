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
// TEST BUILD (owner, 2026-10-19: "build the best options to use in the actual app"): three layouts from the
// mock-up canvas, switched at the top of the page, so the owner can try them on the phone before choosing one.
//   Flowchart (option D): boxes and arrows; answer by tapping a box; other answers stay as boxes saying where they lead.
//   Stages (option I): one list of stages; finished stages fold to one line, the current one is open.
//   Steps (option H): one step at a time, with every stage on a rail beside it.
// All three share one route: answers are kept while switching layouts, cleared by Start Over and on leaving the page.
// Caution steps are red (owner, 2026-10-19). There is no list of all treatments at the end (owner, same day).

export type Layout = 'flowchart' | 'stages' | 'steps';
const LAYOUTS: { value: Layout; label: string }[] = [
  { value: 'flowchart', label: 'Flowchart' },
  { value: 'stages', label: 'Stages' },
  { value: 'steps', label: 'Steps' },
];
const LAYOUT_KEY = 'wards:pathway-layout';
function readLayout(): Layout {
  try {
    const v = localStorage.getItem(LAYOUT_KEY);
    return LAYOUTS.some((l) => l.value === v) ? (v as Layout) : 'flowchart';
  } catch { return 'flowchart'; }
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
// Follows the answers from the start. Caution and action steps lead on by themselves, except where `stopAt` is given
// (Steps layout: each needs Continue). Returns the steps on the route and whether it reached an end.
export function walk(p: Pathway, choices: Record<string, number>, stopAt?: Set<string>): { route: Visit[]; ended: boolean } {
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
    if (stopAt && !stopAt.has(id)) return { route, ended: false };
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

function KindLabel({ step, now }: { step: PathwayStep; now?: boolean }) {
  return (
    <p className={`pw-kind ios-caption-1-emphasized${step.kind === 'caution' ? ' pw-kind--caution' : ''}`}>
      {KIND[step.kind]}{step.stage ? ` · ${step.stage}` : ''}{now ? ' · Now' : ''}
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
function Answers({ p, v, onChoose, compact }: { p: Pathway; v: Visit; onChoose: (i: number) => void; compact?: boolean }) {
  const list = answersOf(v.step);
  // Side by side, like a flowchart's branches, only when every answer is short; long ones stack (owner: no cramped boxes).
  const grid = compact && list.length > 1 && list.every((a) => a.label.length <= 24 && (a.detail ?? '').replace(/\{\{[^}]*\}\}/g, 'xxxxxxxxxx').length <= 24);
  return (
    <div className={`pw-answers${compact ? ' pw-answers--branch' : ''}${grid ? ' pw-answers--grid' : ''}`} role="group" aria-label={`Answers: ${v.step.title}`}>
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

// ---- Layout D: flowchart ----

function FlowchartLayout({ p, route, ended, onChoose }: LayoutProps) {
  const last = route[route.length - 1];
  const ahead = (p.stages ?? []).slice((p.stages ?? []).indexOf(last.step.stage ?? '') + 1);
  return (
    <div className="pw-flow">
      {route.map((v, i) => {
        const now = !ended && v === last;
        return (
          <Fragment key={v.id}>
            {i > 0 && <span className="pw-arrow" aria-hidden="true" />}
            <section className={`pw-box pw-box--${v.step.kind}${now ? ' pw-box--now' : ''}`} aria-current={now ? 'step' : undefined}>
              <KindLabel step={v.step} now={now} />
              <h2 className="ios-headline">{v.step.title}</h2>
              <StepBody step={v.step} />
            </section>
            {asks(v.step) && <><span className="pw-branch" aria-hidden="true" /><Answers p={p} v={v} onChoose={(a) => onChoose(v.id, a)} compact /></>}
          </Fragment>
        );
      })}
      {ended ? (
        <><span className="pw-arrow" aria-hidden="true" /><div className="pw-terminal"><span className="ios-caption-1-emphasized pw-kind">End</span><span className="ios-headline">End of pathway</span></div></>
      ) : (
        <><span className="pw-arrow pw-arrow--ahead" aria-hidden="true" /><p className="ios-footnote secondary centered">{ahead.length ? `Then ${ahead.join(', ')}, then End` : 'Then End'}</p></>
      )}
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

// ---- Layout H: one step with a stage rail ----

function StepsLayout({ p, route, ended, onChoose, onContinue, onBack }: LayoutProps) {
  const v = route[route.length - 1];
  const prev = route[route.length - 2];
  const stages = p.stages ?? [];
  const nowIdx = stages.indexOf(v.step.stage ?? '');
  const prevLabel = prev ? (prev.answer != null ? `${prev.step.title} ${answersOf(prev.step)[prev.answer]?.label}` : prev.step.title) : null;
  return (
    <div className="pw-railbox"><div className="pw-railwrap">
      <ol className="pw-rail" aria-label="Stages">
        {stages.map((s, i) => {
          const state = i < nowIdx || (ended && i === nowIdx) ? 'done' : i === nowIdx ? 'now' : 'later';
          return <li key={s} className={`pw-rail__stage pw-rail__stage--${state} ios-caption-1-emphasized`} aria-current={state === 'now' ? 'step' : undefined}><span className="pw-rail__dot" aria-hidden="true" />{s}</li>;
        })}
        <li className={`pw-rail__stage pw-rail__stage--end${ended ? ' pw-rail__stage--done' : ' pw-rail__stage--later'} ios-caption-1-emphasized`}><span className="pw-rail__dot" aria-hidden="true" />End</li>
      </ol>
      <div className="pw-railmain">
        {prevLabel && (
          <div className="pw-prev">
            <span className="ios-subheadline secondary">After: <span className="pw-prev__v">{prevLabel}</span></span>
            <AKG.Button variant="borderless" onClick={onBack}>Back</AKG.Button>
          </div>
        )}
        <section className={`pw-single pw-step--${v.step.kind}`} aria-current="step">
          <KindLabel step={v.step} />
          <h2 className="ios-title-2-emphasized">{v.step.title}</h2>
          <StepBody step={v.step} />
          {asks(v.step) && <Answers p={p} v={v} onChoose={(a) => onChoose(v.id, a)} />}
          {!asks(v.step) && !ended && <AKG.Button variant="prominent" size="large" className="wide-button" onClick={() => onContinue(v.id)}>Continue</AKG.Button>}
          {ended && <EndMark reached />}
        </section>
      </div>
    </div></div>
  );
}

type LayoutProps = {
  p: Pathway; route: Visit[]; ended: boolean;
  onChoose: (id: string, answer: number) => void; onContinue: (id: string) => void; onBack: () => void;
};

// ---- The page ----

export function PathwayScreen({ id }: { id: string }) {
  const p = content.data.pathway?.[id] as Pathway | undefined;
  const sheet = useSheet();
  const [layout, setLayout] = useState<Layout>(readLayout);
  const [choices, setChoices] = useState<Record<string, number>>({});
  const [acks, setAcks] = useState<string[]>([]);
  // A new pathway starts empty (answers are never kept between visits).
  useEffect(() => { setChoices({}); setAcks([]); }, [id]);
  if (!p) return <NotFoundScreen />;

  const ackSet = new Set(acks);
  const { route, ended } = walk(p, choices, layout === 'steps' ? ackSet : undefined);
  const started = Object.keys(choices).length > 0 || acks.length > 0;
  const homes = pathwayHomes().filter((h) => h.id === id);

  // Changing an answer clears everything after it on the route.
  const after = (stepId: string) => {
    const full = walk(p, choices).route;
    const i = full.findIndex((v) => v.id === stepId);
    return new Set(i < 0 ? [] : full.slice(i + 1).map((v) => v.id));
  };
  const choose = (stepId: string, a: number) => {
    const drop = after(stepId);
    const next: Record<string, number> = {};
    for (const [k, x] of Object.entries(choices)) if (!drop.has(k)) next[k] = x;
    next[stepId] = a;
    setChoices(next);
    setAcks(acks.filter((k) => !drop.has(k)));
  };
  const cont = (stepId: string) => setAcks([...acks, stepId]);
  // Back (Steps): undo the last answer or Continue.
  const back = () => {
    for (let i = route.length - 1; i >= 0; i--) {
      const v = route[i];
      if (v.answer != null) { const next = { ...choices }; delete next[v.id]; setChoices(next); setAcks(acks.filter((k) => !after(v.id).has(k))); return; }
      if (ackSet.has(v.id)) { setAcks(acks.filter((k) => k !== v.id)); return; }
    }
  };
  const startOver = () => { setChoices({}); setAcks([]); scrollTo({ top: 0 }); };
  const pick = (v: string | number) => { setLayout(v as Layout); writeLayout(v as Layout); };
  const props: LayoutProps = { p, route, ended, onChoose: choose, onContinue: cont, onBack: back };

  const title = titleCase(p.title ?? 'Pathway');
  let body: ReactNode;
  if (layout === 'stages') body = <StagesLayout {...props} />;
  else if (layout === 'steps') body = <StepsLayout {...props} />;
  else body = <FlowchartLayout {...props} />;

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
      {ended && (
        <div className="pw-after">
          {homes.length > 0 && (
            <AKG.List header="In the Card">
              {homes.map((h) => <AKG.ListRow key={h.card.id} title={h.card.title} subtitle={h.card.sections.find((s) => s.key === h.section)?.title} chevron href={href.card(h.card.id, h.section)} />)}
            </AKG.List>
          )}
          <AKG.Button size="large" className="wide-button" onClick={startOver}>Start Over</AKG.Button>
        </div>
      )}
      {p.sources?.length > 0 && <AKG.SourceLine className="pw-sources" items={lineItems(p.sources)} onClick={() => openSources(sheet, p.sources, title)} />}
    </Screen>
  );
}
