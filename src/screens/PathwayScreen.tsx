import { useEffect, useState, type ReactNode } from 'react';
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
// canvas's option letters), so the owner can try them on the phone before choosing one. Third set (owner, same day):
//   I · Stages: one list of stages; finished stages fold to one line, the current one is open (top choice so far).
//   K · Choice lists: Settings-style sections; the chosen answer gets a checkmark.
//   J · Drill-down: each step is its own page; the back button steps back.
//   L · Full screen: a focused full-screen task, one step at a time, answers within thumb reach.
// All share one route: answers are kept while switching layouts, cleared by Start Over and on leaving the page.
// Caution steps are red (owner, 2026-10-19). There is no list of all treatments at the end (owner, same day).

export type Layout = 'stages' | 'choice' | 'drill' | 'guided';
const LAYOUTS: { value: Layout; label: string; 'aria-label': string }[] = [
  { value: 'stages', label: 'I', 'aria-label': 'I, Stages' },
  { value: 'choice', label: 'K', 'aria-label': 'K, Choice lists' },
  { value: 'drill', label: 'J', 'aria-label': 'J, Drill-down' },
  { value: 'guided', label: 'L', 'aria-label': 'L, Full screen' },
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

// ---- Layout J: drill-down pages ----

// Each step is its own page, like Settings: the answers are a list and tapping one opens the next step; the top
// bar's back button returns a step (HIG: hierarchical navigation). Actions show their doses with a Next row. The
// last page ends with Done, which goes back to the card.
function DrillLayout({ p, route, ended, view, onChoose, onNext, onDone, after }: StepProps) {
  const v = route[view];
  const stages = p.stages ?? [];
  const stageNo = stages.indexOf(v.step.stage ?? '') + 1;
  const earlier = route.slice(0, view).filter((x) => x.answer != null);
  const isEnd = ended && view === route.length - 1;
  return (
    <div className="pw-drill">
      <header className="pw-drill__head">
        <p className="ios-caption-1-emphasized pw-kind">{v.step.stage ?? KIND[v.step.kind]}{stageNo > 0 ? ` · Stage ${stageNo} of ${stages.length}` : ''}</p>
        <h2 className="ios-title-1-emphasized">{v.step.title}</h2>
        {v.step.kind === 'caution' && <AKG.Tag variant="critical">Caution</AKG.Tag>}
      </header>
      {asks(v.step) ? (
        <>
          {v.step.detail && <p className="ios-body"><RichText text={v.step.detail} /></p>}
          <AKG.List header="Choose One" footer="Each answer opens the next step. Back returns to the last one.">
            {answersOf(v.step).map((a, j) => (
              <AKG.ListRow key={j} title={a.label} subtitle={a.detail ? <Plain text={a.detail} /> : undefined} checked={v.answer === j} chevron={v.answer !== j} onClick={() => onChoose(v.id, j)} />
            ))}
          </AKG.List>
        </>
      ) : (
        <div className={`pw-drill__body pw-step pw-step--${v.step.kind}`}><StepBody step={v.step} /></div>
      )}
      {!asks(v.step) && !isEnd && route[view + 1] && (
        <AKG.List><AKG.ListRow overline="Next" title={route[view + 1].step.title} chevron onClick={onNext} /></AKG.List>
      )}
      {isEnd && <><EndMark reached /><AKG.Button variant="prominent" size="large" className="wide-button" onClick={onDone}>Done</AKG.Button>{after}</>}
      {earlier.length > 0 && (
        <AKG.List header="So Far">
          {earlier.map((x) => <AKG.ListRow key={x.id} title={answersOf(x.step)[x.answer!]?.label} subtitle={x.step.title} />)}
        </AKG.List>
      )}
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

type LayoutProps = { p: Pathway; route: Visit[]; ended: boolean; onChoose: (id: string, answer: number) => void };
type StepProps = LayoutProps & { view: number; onNext: () => void; onPrev: () => void; onDone: () => void; after?: ReactNode };

// ---- The page ----

export function PathwayScreen({ id }: { id: string }) {
  const p = content.data.pathway?.[id] as Pathway | undefined;
  const sheet = useSheet();
  const [layout, setLayout] = useState<Layout>(readLayout);
  const [choices, setChoices] = useState<Record<string, number>>({});
  // J and L show one step at a time: the step on screen, as a place on the route.
  const [view, setView] = useState(0);
  // A new pathway starts empty (answers are never kept between visits).
  useEffect(() => { setChoices({}); setView(0); }, [id]);
  if (!p) return <NotFoundScreen />;

  const { route, ended } = walk(p, choices);
  const at = Math.min(view, route.length - 1);
  const started = Object.keys(choices).length > 0 || view > 0;
  const homes = pathwayHomes().filter((h) => h.id === id);
  const stepped = layout === 'drill' || layout === 'guided';

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
  else if (layout === 'drill') body = <DrillLayout {...props} after={after} />;
  else if (layout === 'guided') body = <GuidedLayout {...props} title={title} cardTitle={homes[0]?.card.title} />;
  else body = <StagesLayout {...props} />;

  // J: the back button steps back through the pathway's pages, then leaves the page.
  const back = layout === 'drill' && at > 0
    ? { label: route[at - 1].step.title, fallback: href.libraryList('pathways'), onBack: () => go(at - 1) }
    : { label: 'Pathways', fallback: href.libraryList('pathways') };

  return (
    <Screen
      title={title}
      back={back}
      trailing={<AKG.ToolbarButton onClick={startOver} disabled={!started}>Start Over</AKG.ToolbarButton>}
    >
      <div className="pw-layout">
        <AKG.SegmentedControl options={LAYOUTS} value={layout} onChange={pick} aria-label="Test layout" />
        <p className="ios-footnote secondary">Test layouts: I Stages · K Choice lists · J Drill-down · L Full screen.</p>
      </div>
      {body}
      {ended && (layout === 'stages' || layout === 'choice') && after}
      {p.sources?.length > 0 && <AKG.SourceLine className="pw-sources" items={lineItems(p.sources)} onClick={() => openSources(sheet, p.sources, title)} />}
    </Screen>
  );
}
