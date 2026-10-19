import { useEffect, useState } from 'react';
import { AKG } from '../design/akg';
import { content, getCard } from '../content';
import { goBack, href, open, setPageTitle } from '../router';
import { getTimed, useStored, type TimedSession } from '../storage';
import { clearTimed, clock, doseName, doseText, dueNext, elapsed, endTimed, giveAlternative, isRunning, markGiven, progress, skip, summaryText, undoLast, when } from '../timed';
import type { Dose } from '../content/types';
import { AlternativeRow, DoseRow, Inlines, plainText } from '../ui/Rich';
import { icons } from '../ui/icons';
import { Empty, Screen } from './common';
import { Checks, TopicButton } from './Emergency';

const altOf = (id?: string) => (id ? (content.data.dose?.[id] as Dose | undefined)?.alternative?.dose : undefined);

// The log, newest first: what was given (or skipped) and when.
function Log({ s }: { s: TimedSession }) {
  if (!s.log.length) return null;
  return (
    <AKG.List header="Log" headerAction={<AKG.Button variant="borderless" onClick={undoLast}>Undo</AKG.Button>} footer="Undo takes back the last entry.">
      {[...s.log].reverse().map((e, i) => (
        <AKG.ListRow
          key={i}
          title={e.dose ? (e.kind === 'skipped' ? `Skipped: ${doseName(e.dose)}` : doseText(e.dose)) : e.kind === 'skipped' ? `Skipped step ${e.step + 1}` : `Step ${e.step + 1} done`}
          subtitle={when(s, e.t)}
        />
      ))}
    </AKG.List>
  );
}

function DueNext({ s, now }: { s: TimedSession; now: number }) {
  const due = dueNext(s, now);
  if (!due.length) return null;
  return (
    <AKG.List header="Due Next">
      {due.map((d, i) => <AKG.ListRow key={i} title={clock(d.t)} subtitle={d.text} />)}
    </AKG.List>
  );
}

// Timed Mode: full screen (no tab bar). The timer at the top; the step to do now, with large doses; Skip and Mark
// Given; the log. Minimize keeps it running in the bar above the tab bar; End asks first, then shows the summary.
export function TimedScreen() {
  const s = useStored(getTimed);
  const [endingAt, setEndingAt] = useState<number | null>(null);
  // Due Next moves on as time passes.
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(t); }, []);
  const card = isRunning(s) ? getCard(s.card) : undefined;
  useEffect(() => { setPageTitle('Timed Mode'); }, []);
  // A new step starts at the top of the screen.
  const stepNow = isRunning(s) ? progress(s).current?.step : undefined;
  useEffect(() => { scrollTo(0, 0); }, [stepNow]);

  if (!isRunning(s) || !card) {
    return (
      <Screen title="Timed Mode" back={{ label: 'Rapids', fallback: href.emergencies() }}>
        <Empty title="Timed Mode Isn’t Running" description="Start it from a page in Rapids." />
      </Screen>
    );
  }
  const { steps, current, stepsDone, total } = progress(s);
  const step = current ? steps[current.step] : null;
  const doses = step ? step.parts.filter((p) => p.kind === 'dose') : [];
  const checks = step ? step.parts.filter((p) => p.kind === 'check') : [];
  const notes = step ? step.parts.filter((p) => p.kind === 'note') : [];
  const alt = altOf(current?.dose);
  const minimize = () => goBack(href.emergency(card.id));
  const end = () => { endTimed(); setEndingAt(null); goBack(href.emergency(card.id)); };

  return (
    <div className="screen-page timed-page">
      <div className="top-bar">
        <AKG.Toolbar
          leading={<AKG.ToolbarButton icon={icons.chevronDown} aria-label="Minimize Timed Mode" onClick={minimize} />}
          title={<AKG.TimerCapsule start={s.start} label="Timed Mode, elapsed time" />}
          trailing={<TopicButton card={card} />}
        />
      </div>
      <main className="screen-body timed-body">
        <AKG.ProgressIndicator value={stepsDone} max={total} aria-label={`${stepsDone} of ${total} steps done`} />
        {step ? (
          <>
            <div className="timed-head">
              <p className="ios-footnote-emphasized secondary eyebrow">{card.title} · Step {current!.step + 1} of {total} · {plainText(step.title)}</p>
              <h1 className="ios-title-1-emphasized">{step.condition ? <>If <Inlines xs={step.condition.inlines} /></> : <Inlines xs={step.title} />}</h1>
            </div>
            <Checks parts={checks} />
            {doses.length > 0 && (
              <div className="timed-doses">
                {doses.map((p) => {
                  if (p.kind !== 'dose') return null;
                  const e = s.log.find((x) => x.step === current!.step && (x.for ?? x.dose) === p.id);
                  const isCurrent = current!.dose === p.id;
                  const label = e ? (e.kind === 'skipped' ? 'Skipped' : `Given ${when(s, e.t)}${e.for ? `: ${doseName(e.dose!)}` : ''}`) : isCurrent ? 'Give' : 'Then Give';
                  return (
                    <div key={p.id} className={`timed-dose${isCurrent ? ' timed-dose--current' : ''}${e ? ' timed-dose--done' : ''}`} aria-current={isCurrent ? 'step' : undefined}>
                      <p className="ios-footnote-emphasized eyebrow secondary">{label}</p>
                      <DoseRow id={p.id} warnings={p.warnings.map((w) => w.text)} large={isCurrent} />
                      {isCurrent && alt && (
                        <div className="timed-alt">
                          <AlternativeRow id={p.id} />
                          <AKG.Button variant="tinted" onClick={() => giveAlternative()}>Mark {doseName(alt)} Given Instead</AKG.Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {notes.length > 0 && <ul className="ios-subheadline rich-list timed-notes">{notes.map((n, i) => <li key={i}>{'inlines' in n && <Inlines xs={n.inlines} />}</li>)}</ul>}
          </>
        ) : (
          <div className="timed-head">
            <p className="ios-footnote-emphasized secondary eyebrow">{card.title} · {total} of {total} steps</p>
            <h1 className="ios-title-1-emphasized">All Steps Done</h1>
            <p className="ios-body secondary">The timer keeps running. End Timed Mode to see the summary.</p>
          </div>
        )}
        <DueNext s={s} now={now} />
        <Log s={s} />
      </main>
      <div className="timed-actions">
        <div className="timed-buttons">
          <AKG.Button size="large" disabled={!current} onClick={() => skip()}>Skip</AKG.Button>
          <AKG.Button variant="prominent" size="large" disabled={!current} onClick={() => markGiven()}>{current && !current.dose ? 'Mark Done' : 'Mark Given'}</AKG.Button>
        </div>
        <AKG.Button variant="borderless" destructive onClick={() => setEndingAt(Date.now())}>End Timed Mode</AKG.Button>
      </div>
      <AKG.Alert
        open={endingAt != null}
        overlay
        fixed
        title="End Timed Mode?"
        message={`The timer stops at ${elapsed((endingAt ?? Date.now()) - s.start)}. You’ll see a summary of what was given and when.`}
        actions={[
          { label: 'Cancel', role: 'cancel', onClick: () => setEndingAt(null) },
          { label: 'End', role: 'destructive', onClick: end },
        ]}
      />
    </div>
  );
}

/** The bar above the tab bar while Timed Mode runs (on every screen but Timed Mode itself): tap to return to it. */
export function TimedAccessory({ s }: { s: TimedSession }) {
  const card = getCard(s.card);
  const { current, total } = progress(s);
  return (
    <AKG.TimerCapsule
      variant="accessory"
      start={s.start}
      title={card?.title}
      subtitle={current ? `Timed Mode · Step ${current.step + 1} of ${total}` : 'Timed Mode · All steps done'}
      label={`${card?.title ?? ''} Timed Mode, elapsed time`}
      onClick={() => open(href.timed())}
    />
  );
}

async function copy(text: string) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fall back below */ }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    el.remove();
    return ok;
  } catch { return false; }
}

/** After End: what was given and when, what's due next, Copy Summary and Done. Kept on this phone until Done. */
export function TimedSummary() {
  const s = useStored(getTimed);
  const [copied, setCopied] = useState(false);
  const ended = s && s.end != null ? s : null;
  const card = ended ? getCard(ended.card) : undefined;
  const given = ended ? ended.log.filter((e) => e.kind !== 'skipped') : [];
  const done = () => { setCopied(false); clearTimed(); };
  return (
    <AKG.Sheet open={!!ended} onClose={done} title="Timed Mode Ended" heading={card?.title} subheading={ended ? `Started ${clock(ended.start)} · ended ${clock(ended.end!)} · ${elapsed(ended.end! - ended.start)} total` : undefined} detents={['large']} fixed cancelLabel="Done">
      {ended && (
        <div className="sheet-body detail-sheet timed-summary">
          <AKG.List header="What Was Given">
            {given.length === 0 ? <AKG.ListRow title="Nothing marked as given" /> : given.map((e, i) => (
              <AKG.ListRow key={i} title={e.dose ? doseText(e.dose) : `Step ${e.step + 1} done`} subtitle={`${when(ended, e.t)} · Step ${e.step + 1}`} />
            ))}
          </AKG.List>
          {dueNext(ended, ended.end!).length > 0 && (
            <AKG.List header="Due Next">
              {dueNext(ended, ended.end!).map((d, i) => <AKG.ListRow key={i} title={clock(d.t)} subtitle={d.text} />)}
            </AKG.List>
          )}
          <div className="timed-buttons">
            <AKG.Button size="large" onClick={async () => setCopied(await copy(summaryText(ended)))}>{copied ? 'Copied' : 'Copy Summary'}</AKG.Button>
            <AKG.Button variant="prominent" size="large" onClick={done}>Done</AKG.Button>
          </div>
          <p className="ios-caption-1 secondary centered">Kept on this iPhone only until you tap Done. Nothing is sent anywhere.</p>
        </div>
      )}
    </AKG.Sheet>
  );
}
