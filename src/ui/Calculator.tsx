import { useState } from 'react';
import { AKG } from '../design/akg';
import { content } from '../content';
import type { Calc, ScoreItem } from '../content/types';
import { computeResult } from '../calculators';
import type { ShowSheet } from './SheetHost';
import { CalcLink, RichText, SheetSources } from './Rich';

// The in-app calculators (docs/DATA-TYPES.md, 7), opened in a bottom sheet from a score's name or its "Calculate" button.
// Nothing is saved: the entries live only while the sheet is open.

export const calcItem = (id: string) => content.data.calc?.[id] as Calc | undefined;
export const hasCalculator = (id: string) => !!calcItem(id)?.calculator;

export const openCalculator = (sheet: ShowSheet, id: string) =>
  sheet({ title: 'Calculator', body: <CalculatorSheet id={id} />, detent: 'large' });

export function CalculatorSheet({ id }: { id: string }) {
  const c = calcItem(id)!;
  if (c.calculator!.kind === 'score') return <ScoreSheet c={c} />;
  return (
    <div className="calc-sheet">
      <h3 className="ios-headline">{c.calculator!.heading}</h3>
      <Formula c={c} />
      <p className="ios-body"><CalcLink c={c} label={`${c.short[0].toUpperCase()}${c.short.slice(1)} on MDCalc`} /></p>
      {c.calculator!.notes?.map((n, i) => <p key={i} className="ios-footnote secondary"><RichText text={n} /></p>)}
      <SheetSources ids={c.sources ?? []} />
    </div>
  );
}

function Formula({ c }: { c: Calc }) {
  const k = c.calculator!;
  const [values, setValues] = useState<Record<string, number | null>>({});
  const [n, setN] = useState(0); // Changing the key clears the fields on Reset.
  const results = k.results!.map((r) => ({ r, text: computeResult(r, values) }));
  const shown = results.filter((x) => x.text !== null);
  return (
    <>
      <p className="ios-footnote secondary">{k.expression}</p>
      {/* The result sits above the fields so it stays in view while the keyboard is open. */}
      <div className="calc-result" role="status" aria-live="polite">
        {shown.length ? shown.map(({ r, text }) => (
          <div key={r.fn}>
            <p className="ios-caption-1 secondary">{r.label}</p>
            <p className="ios-title-2-emphasized">{text} {r.unit}</p>
          </div>
        )) : <p className="ios-subheadline secondary">Enter the values to see the result.</p>}
      </div>
      <div className="calc-inputs" key={n}>
        {k.inputs!.map((inp) => (
          <AKG.NumberField key={inp.id} label={inp.label} unit={inp.unit} min={inp.min} max={inp.max} enterKeyHint="done"
            onChange={(v) => setValues((p) => ({ ...p, [inp.id]: v }))} />
        ))}
      </div>
      <p className="ios-subheadline secondary"><RichText text={k.reference} /></p>
      <div><AKG.Button variant="bordered" disabled={!Object.values(values).some((v) => v !== null && v !== undefined)} onClick={() => { setValues({}); setN(n + 1); }}>Reset</AKG.Button></div>
    </>
  );
}

// A score: the pop-up first (when to use it, when not, why, how, and a big MDCalc button), then "Score it" opens the
// picker in the same sheet. The choices live only while the sheet is open.
const USE_LABELS = [['when', 'When to use'], ['not', 'When not to'], ['why', 'Why'], ['how', 'How']] as const;

function ScoreSheet({ c }: { c: Calc }) {
  const k = c.calculator!;
  const [picking, setPicking] = useState(false);
  return (
    <div className="calc-sheet">
      <h3 className="ios-headline">{k.heading}</h3>
      {picking ? <ScorePicker c={c} /> : (
        <>
          {USE_LABELS.map(([f, label]) => (
            <div key={f}>
              <p className="ios-footnote-emphasized secondary score-use__label">{label}</p>
              <p className="ios-body"><RichText text={k.use![f]} /></p>
            </div>
          ))}
          <AKG.Button variant="prominent" block onClick={() => setPicking(true)}>Score it</AKG.Button>
          {c.url && <>
            <AKG.Button variant="tinted" block onClick={() => window.open(c.url, '_blank', 'noopener,noreferrer')}>{c.short} on MDCalc</AKG.Button>
            <p className="ios-footnote secondary">Opens MDCalc in Safari and needs internet.</p>
          </>}
        </>
      )}
      {k.notes?.map((n, i) => <p key={i} className="ios-footnote secondary"><RichText text={n} /></p>)}
      <SheetSources ids={c.sources ?? []} />
    </div>
  );
}

/** What the picked choices add up to: the total, whether every item is answered, and the result text. */
export function scoreResult(k: NonNullable<Calc['calculator']>, picks: Record<string, number>) {
  const items = k.items ?? [];
  const total = items.reduce((t, x) => t + (picks[x.id] === undefined ? 0 : x.choices[picks[x.id]].points), 0);
  const done = items.every((x) => picks[x.id] !== undefined);
  let text: string | null = null;
  if (done && k.rule) {
    const on = (id: string) => items.find((x) => x.id === id)!.choices[picks[id]].points > 0;
    text = k.rule.all.every(on) && k.rule.any.some(on) ? k.rule.yes : k.rule.no;
  } else if (done) text = k.bands?.find((b) => total >= b.min && total <= b.max)?.text ?? null;
  return { total, done, text };
}

function ScorePicker({ c }: { c: Calc }) {
  const k = c.calculator!;
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [n, setN] = useState(0); // Changing the key clears the selectors on Clear.
  const r = scoreResult(k, picks);
  const answered = Object.keys(picks).length;
  return (
    <>
      {/* The result sits above the items so it stays in view while scrolling. */}
      <div className="calc-result" role="status" aria-live="polite">
        {!k.rule && <><p className="ios-caption-1 secondary">Total so far</p><p className="ios-title-2-emphasized">{r.total}</p></>}
        {r.text ? <p className="ios-body"><RichText text={r.text} /></p> : <p className="ios-subheadline secondary">Answer every item to see the result.</p>}
      </div>
      <div className="score-items" key={n}>
        {k.items!.map((x) => (
          <div key={x.id} className="score-item">
            <p className="ios-subheadline"><RichText text={x.label} /></p>
            <ScoreChoices item={x} onPick={(i) => setPicks((p) => ({ ...p, [x.id]: i }))} />
          </div>
        ))}
      </div>
      <div><AKG.Button variant="bordered" disabled={!answered} onClick={() => { setPicks({}); setN(n + 1); }}>Clear</AKG.Button></div>
    </>
  );
}

// Nothing is selected at first; each choice is an AKG "choice" button (tinted until one is picked, then the picked one is filled).
function ScoreChoices({ item, onPick }: { item: ScoreItem; onPick: (i: number) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="score-choices" role="group" aria-label={item.label}>
      {item.choices.map((ch, i) => (
        <AKG.Button key={i} variant="choice" selected={sel === null ? undefined : sel === i} onClick={() => { setSel(i); onPick(i); }}>
          {ch.label}
        </AKG.Button>
      ))}
    </div>
  );
}
