// Timed Mode: working through an emergency's Do Now steps against the clock (approved 2026-10-18).
// What happens is kept only on this phone (storage.ts, "wards:timed"), so the timer and the log survive the app
// closing and reopening. Nothing is sent anywhere.
import { emergencySteps, recheckSchedules, stepDoses, type DoNowStep } from '../scripts/content/emergency.mjs';
import { content, getCard } from './content';
import type { Card, Dose } from './content/types';
import { getTimed, setTimed, type TimedEntry, type TimedSession } from './storage';

export type { TimedEntry, TimedSession };

const dose = (id: string) => content.data.dose?.[id] as Dose | undefined;
export const doseName = (id: string) => dose(id)?.drug_name ?? id;

export function doNowSteps(card: Card | undefined): DoNowStep[] {
  return card?.emergency ? emergencySteps(card.emergency.blocks) : [];
}

// One thing to do at a time: each dose of each step in order, or the step itself when it has no dose.
export type Action = { step: number; dose?: string };
export function actions(steps: DoNowStep[]): Action[] {
  return steps.flatMap((s, i) => {
    const ds = stepDoses(s);
    return ds.length ? ds.map((d) => ({ step: i, dose: d })) : [{ step: i }];
  });
}
const sameAction = (e: TimedEntry, a: Action) => e.step === a.step && (e.for ?? e.dose) === a.dose;
export const isDone = (s: TimedSession, a: Action) => s.log.some((e) => sameAction(e, a));
export const entryFor = (s: TimedSession, a: Action) => s.log.find((e) => sameAction(e, a));

/** Where Timed Mode is: the next thing to do (null when every step is done), and how many steps are finished. */
export function progress(s: TimedSession) {
  const steps = doNowSteps(getCard(s.card));
  const all = actions(steps);
  const current = all.find((a) => !isDone(s, a)) ?? null;
  const stepsDone = steps.filter((_, i) => all.filter((a) => a.step === i).every((a) => isDone(s, a))).length;
  return { steps, current, stepsDone, total: steps.length };
}

export const isRunning = (s: TimedSession | null): s is TimedSession => !!s && s.end == null;

export function startTimed(card: string, now = Date.now()) {
  setTimed({ card, start: now, log: [] });
}

// Two taps closer together than this are one tap (a double tap mustn't log two doses).
export const DOUBLE_TAP_MS = 600;

function record(entry: Omit<TimedEntry, 't'>, now = Date.now()) {
  const s = getTimed();
  if (!isRunning(s)) return;
  const last = s.log[s.log.length - 1];
  if (last && now - last.t >= 0 && now - last.t < DOUBLE_TAP_MS) return;
  setTimed({ ...s, log: [...s.log, { ...entry, t: now }] });
}

/** Mark Given: the current dose (or step) is done now. */
export function markGiven(now = Date.now()) {
  const s = getTimed();
  if (!isRunning(s)) return;
  const { current } = progress(s);
  if (current) record({ step: current.step, dose: current.dose, kind: current.dose ? 'given' : 'done' }, now);
}

/** The dose's alternative was given instead (e.g. calcium chloride in cardiac arrest instead of calcium gluconate). */
export function giveAlternative(now = Date.now()) {
  const s = getTimed();
  if (!isRunning(s)) return;
  const { current } = progress(s);
  const alt = current?.dose ? dose(current.dose)?.alternative?.dose : undefined;
  if (current?.dose && alt) record({ step: current.step, dose: alt, for: current.dose, kind: 'given' }, now);
}

/** Skip: move past the current dose (or step) without giving it. */
export function skip(now = Date.now()) {
  const s = getTimed();
  if (!isRunning(s)) return;
  const { current } = progress(s);
  if (current) record({ step: current.step, dose: current.dose, kind: 'skipped' }, now);
}

/** Undo: take back the last thing logged (a mistaken tap). */
export function undoLast() {
  const s = getTimed();
  if (!isRunning(s) || !s.log.length) return;
  setTimed({ ...s, log: s.log.slice(0, -1) });
}

/** End Timed Mode (after confirmation): the timer stops; the summary shows until Done. */
export function endTimed(now = Date.now()) {
  const s = getTimed();
  if (isRunning(s)) setTimed({ ...s, end: now });
}

/** Done on the summary: forget it all. */
export const clearTimed = () => setTimed(null);

// ---- Times ----

export const clock = (t: number) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const pad = (n: number) => String(n).padStart(2, '0');
/** "06:32", or "1:02:05" past an hour (as the timer shows it). */
export function elapsed(ms: number) {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h ? `${h}:${pad(m)}:${pad(sec % 60)}` : `${pad(m)}:${pad(sec % 60)}`;
}
/** "14:32 (+02:10)": the clock time, then the time since Timed Mode started. */
export const when = (s: TimedSession, t: number) => `${clock(t)} (+${elapsed(t - s.start)})`;

const after = (m: number) => (m % 60 === 0 ? `${m / 60} h` : `${m} min`);

/**
 * What's due next: for each recheck the topic times from a dose (or from the first dose), the next time still ahead.
 * From the topic's own :::times{after=… check=…} blocks; nothing is retyped.
 */
export function dueNext(s: TimedSession, now = Date.now()): { t: number; text: string }[] {
  const card = getCard(s.card);
  if (!card) return [];
  const given = s.log.filter((e) => e.kind === 'given');
  const out: { t: number; text: string }[] = [];
  for (const r of recheckSchedules(card)) {
    const from = r.after === 'first' ? given[0] : given.find((e) => (e.for ?? e.dose) === r.after);
    if (!from) continue;
    const m = r.minutes.find((x) => from.t + x * 60000 > now);
    if (m == null) continue;
    const what = r.after === 'first' ? 'the first dose' : doseName(r.after);
    out.push({ t: from.t + m * 60000, text: `${r.check} check, ${after(m)} after ${what}` });
  }
  return out.sort((a, b) => a.t - b.t);
}

// ---- Summary ----

export function doseText(id: string) {
  const d = dose(id);
  return d ? `${d.drug_name} ${[`${d.amount} ${d.unit} ${d.route}`, d.rate].filter(Boolean).join(' ')}` : id;
}

/** The summary as plain text, for Copy Summary. Only drug names, doses and times: nothing about the patient. */
export function summaryText(s: TimedSession, now = Date.now()) {
  const card = getCard(s.card);
  const end = s.end ?? now;
  const given = s.log.filter((e) => e.kind !== 'skipped');
  const lines = [
    `${card?.title ?? s.card}: Timed Mode`,
    `Started ${clock(s.start)}, ended ${clock(end)}, ${elapsed(end - s.start)} total`,
    '',
    'Given:',
    ...(given.length ? given.map((e) => `${when(s, e.t)} ${e.dose ? doseText(e.dose) : `Step ${e.step + 1} done`}`) : ['Nothing marked as given']),
  ];
  const due = dueNext(s, end);
  if (due.length) lines.push('', 'Due next:', ...due.map((d) => `${clock(d.t)} ${d.text}`));
  return lines.join('\n');
}
