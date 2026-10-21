import { useRef, useState } from 'react';
import { AKG } from '../design/akg';
import { blockSources, emergencyGroups, getCard } from '../content';
import type { Card } from '../content/types';
import { href, open } from '../router';
import { getTimed, useStored, type TimedSession } from '../storage';
import { actions, doNowSteps, entryFor, isDone, isRunning, progress, startTimed, when } from '../timed';
import { AlternativeRow, Blocks, DoseRow, Inlines, lineItems, openSources, PathwayRows } from '../ui/Rich';
import { useSheet, type ShowSheet } from '../ui/SheetHost';
import { iconFor, icons } from '../ui/icons';
import type { DoNowStep } from '../../scripts/content/emergency.mjs';
import { Empty, Screen } from './common';
import { NotFoundScreen } from './Tabs';

// Red is the emergency color (one color, one job): every emergency's symbol is its system's, tinted red.
export const emergencyIcon = (c: Card) => ({ icon: iconFor(c.system).icon, tint: 'var(--system-red)' });

// Rapids tab: the emergencies, grouped by system, each with a one-line hint of what to do.
export function EmergenciesTab() {
  const groups = emergencyGroups();
  return (
    <Screen title="Rapids">
      {groups.length === 0 ? (
        <Empty title="No Rapids Yet" description="Rapid pages with Do Now steps will appear here." />
      ) : (
        groups.map((g) => (
          <AKG.List key={g.title} header={g.title}>
            {g.cards.map((c) => <AKG.ListRow key={c.id} title={c.title} subtitle={c.emergency?.hint} icon={emergencyIcon(c).icon} iconTint={emergencyIcon(c).tint} chevron href={href.emergency(c.id)} />)}
          </AKG.List>
        ))
      )}
    </Screen>
  );
}

// ---- Do Now steps ----

/** What to check before giving: one caution box ("Check first" for one line, a "Check First" list for more). */
export function Checks({ parts }: { parts: DoNowStep['parts'] }) {
  const checks = parts.filter((p): p is Extract<DoNowStep['parts'][number], { inlines: unknown }> => p.kind === 'check');
  if (!checks.length) return null;
  if (checks.length === 1) return <AKG.Callout variant="caution"><strong>Check first: </strong><Inlines xs={checks[0].inlines} /></AKG.Callout>;
  return (
    <AKG.Callout variant="caution" title="Check First">
      <ul className="rich-list">{checks.map((c, i) => <li key={i}><Inlines xs={c.inlines} /></li>)}</ul>
    </AKG.Callout>
  );
}

// One step's content: what to check first, then each dose (with its alternative), then short notes.
function StepParts({ step, compact }: { step: DoNowStep; compact?: boolean }) {
  return (
    <div className="step-body do-now-body">
      <Checks parts={step.parts} />
      {step.parts.map((p, i) => {
        if (p.kind === 'dose') {
          return (
            <div key={i} className="dose-rows">
              <DoseRow id={p.id} warnings={p.warnings.map((w) => w.text)} />
              {!compact && <AlternativeRow id={p.id} />}
            </div>
          );
        }
        if (p.kind === 'note' && !compact) return <p key={i} className="ios-subheadline do-now-note"><Inlines xs={p.inlines} /></p>;
        return null;
      })}
      {step.warnings.length > 0 && <span className="tag-row">{step.warnings.map((w) => <AKG.Tag key={w.text} variant="warning">{w.text}</AKG.Tag>)}</span>}
    </div>
  );
}

// "If ECG changes" (the step's condition), or, while Timed Mode runs, when the step was done.
function stepCondition(step: DoNowStep, i: number, session: TimedSession | null, all: ReturnType<typeof actions>) {
  if (session) {
    const acts = all.filter((a) => a.step === i);
    if (acts.every((a) => isDone(session, a))) {
      const entries = acts.map((a) => entryFor(session, a)!);
      const given = entries.filter((e) => e.kind !== 'skipped');
      if (!given.length) return { done: false, line: 'Skipped' };
      return { done: true, line: `${given[0].kind === 'done' ? 'Done' : 'Given'} at ${when(session, given[given.length - 1].t)}` };
    }
  }
  return { done: false, line: step.condition ? <>If <Inlines xs={step.condition.inlines} /></> : undefined };
}

export const doNowTitle = <span className="do-now-title"><span className="do-now-icon" aria-hidden="true">{icons.staroflifeFill}</span>Do Now</span>;

/** An emergency's Do Now steps: numbered (red), one drug per dose row. While its Timed Mode runs, done steps are checked. */
export function DoNow({ card, compact }: { card: Card; compact?: boolean }) {
  const sheet = useSheet();
  const stored = useStored(getTimed);
  const session = isRunning(stored) && stored.card === card.id ? stored : null;
  const steps = doNowSteps(card);
  const all = actions(steps);
  const current = session ? progress(session).current : null;
  const notes = (card.emergency?.blocks ?? []).filter((b) => b.t === 'note');
  const sources = blockSources(card.emergency?.blocks ?? []);
  const list = (
    <AKG.StepList tint="critical">
      {steps.map((st, i) => {
        const { done, line } = stepCondition(st, i, session, all);
        return (
          <AKG.Step key={i} condition={line} title={<Inlines xs={st.title} />} done={done} current={current?.step === i}>
            <StepParts step={st} compact={compact} />
          </AKG.Step>
        );
      })}
    </AKG.StepList>
  );
  if (compact) return <div className="do-now-compact">{list}</div>;
  return (
    <AKG.ContentSection
      id="sec-do-now"
      variant="card"
      inset={false}
      title={doNowTitle}
      footer={sources.length ? <AKG.SourceLine items={lineItems(sources)} onClick={() => openSources(sheet, sources, 'Do Now')} /> : undefined}
    >
      {list}
      {notes.length > 0 && <div className="do-now-notes"><Blocks blocks={notes} /></div>}
    </AKG.ContentSection>
  );
}

// ---- Starting Timed Mode ----

/** "Start Timed Mode", or "Resume Timed Mode" while it runs for this emergency. One Timed Mode at a time. */
export function StartTimedButton({ card }: { card: Card }) {
  const stored = useStored(getTimed);
  const [busy, setBusy] = useState(false);
  const running = isRunning(stored) ? stored : null;
  const mine = running?.card === card.id;
  const other = running && !mine ? getCard(running.card) : undefined;
  const start = () => {
    if (mine) { open(href.timed()); return; }
    if (running) { setBusy(true); return; }
    startTimed(card.id);
    open(href.timed());
  };
  return (
    <>
      <AKG.Button className="wide-button" variant="prominent" size="large" onClick={start}>{mine ? 'Resume Timed Mode' : 'Start Timed Mode'}</AKG.Button>
      <AKG.Alert
        open={busy}
        overlay
        fixed
        title="Timed Mode Is Running"
        message={`${other?.title ?? 'Another emergency'} is being timed. End it before starting another.`}
        actions={[
          { label: 'Cancel', role: 'cancel', onClick: () => setBusy(false) },
          { label: 'Return to It', role: 'preferred', onClick: () => { setBusy(false); open(href.timed()); } },
        ]}
      />
    </>
  );
}

// ---- Pop-ups (one at a time) ----

/** The topic pop-up (from an emergency or Timed Mode): the topic's At a Glance, then Open Full Topic. */
export function openTopicPopup(sheet: ShowSheet, card: Card) {
  const glance = card.sections.find((s) => s.key === 'at-a-glance') ?? card.sections[0];
  sheet({
    title: 'Topic',
    heading: card.title,
    body: (
      <div className="detail-sheet">
        {glance && <><p className="ios-headline">{glance.title}</p><Blocks blocks={glance.blocks} /></>}
        <AKG.Button className="wide-button" variant="prominent" size="large" onClick={() => open(href.card(card.id))}>Open Full Topic</AKG.Button>
      </div>
    ),
  });
}

function DoNowPopup({ card }: { card: Card }) {
  return (
    <div className="detail-sheet">
      <DoNow card={card} compact />
      <StartTimedButton card={card} />
      <AKG.Button className="wide-button" size="large" onClick={() => open(href.emergency(card.id))}>Open Full Emergency</AKG.Button>
    </div>
  );
}

/** The Do Now pop-up (from a topic page): the steps and doses, Start Timed Mode and Open Full Emergency. */
export const openDoNowPopup = (sheet: ShowSheet, card: Card) => sheet({ title: 'Do Now', heading: card.title, body: <DoNowPopup card={card} /> });

/** The button that opens a page's topic pop-up (the Topics tab's symbol). */
export function TopicButton({ card }: { card: Card }) {
  const sheet = useSheet();
  return <AKG.ToolbarButton icon={icons.heartTextClipboard} aria-label="Topic Summary" onClick={() => openTopicPopup(sheet, card)} />;
}

// ---- The emergency page ----

export function EmergencyScreen({ id }: { id: string }) {
  const card = getCard(id);
  const titleRef = useRef<HTMLHeadingElement>(null);
  if (!card?.emergency) return <NotFoundScreen />;
  return (
    <Screen
      title={card.title}
      titleRef={titleRef}
      back={{ label: 'Rapids', fallback: href.emergencies() }}
      trailing={<TopicButton card={card} />}
      head={
        <header className="card-head">
          <div className="card-tags"><AKG.Tag variant="critical" icon={icons.staroflifeFill}>Rapids</AKG.Tag></div>
          <h1 ref={titleRef} className="ios-large-title-emphasized">{card.title}</h1>
        </header>
      }
    >
      <StartTimedButton card={card} />
      <DoNow card={card} />
      <PathwayRows cardId={card.id} />
    </Screen>
  );
}
