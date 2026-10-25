import { useState } from 'react';
import { AKG } from '../design/akg';
import { content } from '../content';
import type { Calc } from '../content/types';
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
