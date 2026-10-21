import { useState } from 'react';
import { AKG } from '../design/akg';
import { content } from '../content';
import type { Calc, CalcBandSet } from '../content/types';
import { bandFor, computeResult, totalPoints } from '../calculators';
import type { ShowSheet } from './SheetHost';
import { CalcLink, RichText, SheetSources } from './Rich';

// The in-app calculators (docs/DATA-TYPES.md, 7), opened in a bottom sheet from a score's name or its "Calculate" button.
// Nothing is saved: the entries live only while the sheet is open.

export const calcItem = (id: string) => content.data.calc?.[id] as Calc | undefined;
export const hasCalculator = (id: string) => !!calcItem(id)?.calculator;

export const openCalculator = (sheet: ShowSheet, id: string) =>
  sheet({ title: 'Calculator', body: <CalculatorSheet id={id} /> });

export function CalculatorSheet({ id }: { id: string }) {
  const [current, setCurrent] = useState(id);
  const c = calcItem(current)!;
  const partner = c.calculator?.with;
  // Wells PE and DVT share one sheet; the control switches between them.
  const options = partner ? [id, partner].map((x) => ({ value: x, label: calcItem(x)!.short.replace('score for ', '') })) : null;
  return (
    <div className="calc-sheet">
      {options && <AKG.SegmentedControl options={options} value={current} onChange={(v) => setCurrent(String(v))} aria-label="Score" />}
      <h3 className="ios-headline">{c.calculator!.heading}</h3>
      {/* Keyed so switching scores starts from a blank form. */}
      {c.calculator!.kind === 'checklist' ? <Checklist key={current} c={c} /> : <Formula key={current} c={c} />}
      <p className="ios-body"><CalcLink c={c} label={`${c.short} on MDCalc`} /></p>
      {c.calculator!.notes?.map((n, i) => <p key={i} className="ios-footnote secondary"><RichText text={n} /></p>)}
      <SheetSources ids={c.sources ?? []} />
    </div>
  );
}

const fmt = (n: number) => String(n);

function BandResult({ set, total }: { set: CalcBandSet; total: number }) {
  const b = bandFor(set, total);
  if (!b) return null;
  return (
    <div className="calc-band">
      {set.title && <p className="ios-caption-1 secondary">{set.title}</p>}
      <p className={`ios-headline${b.high ? ' calc-high' : ''}`}>{b.label} <span className="secondary">({b.range})</span></p>
      {b.risk && <p className="ios-subheadline secondary">{b.risk}</p>}
      {b.action && <p className="ios-body"><RichText text={b.action} /></p>}
    </div>
  );
}

function Checklist({ c }: { c: Calc }) {
  const k = c.calculator!;
  const items = k.items!;
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const total = totalPoints(items.map((i) => i.points), checked);
  return (
    <>
      <div className="calc-rows">
        {items.map((it, i) => (
          <AKG.CheckRow key={i} checked={checked[i]} label={<RichText text={it.label} />} points={`${it.points > 0 ? '+' : '−'}${fmt(Math.abs(it.points))}`}
            onChange={(v) => setChecked((p) => p.map((x, j) => (j === i ? v : x)))} />
        ))}
      </div>
      <div className="calc-result" role="status" aria-live="polite">
        <p className="ios-title-2-emphasized">{fmt(total)} {total === 1 || total === -1 ? 'point' : 'points'}</p>
        {k.bandSets!.map((s, i) => <BandResult key={i} set={s} total={total} />)}
        <AKG.Button variant="bordered" block disabled={!checked.some(Boolean)} onClick={() => setChecked(items.map(() => false))}>Reset</AKG.Button>
      </div>
    </>
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
      <div className="calc-inputs" key={n}>
        {k.inputs!.map((inp) => (
          <AKG.NumberField key={inp.id} label={inp.label} unit={inp.unit} min={inp.min} max={inp.max} enterKeyHint="done"
            onChange={(v) => setValues((p) => ({ ...p, [inp.id]: v }))} />
        ))}
      </div>
      <div className="calc-result" role="status" aria-live="polite">
        {shown.length ? shown.map(({ r, text }) => (
          <div key={r.fn}>
            <p className="ios-caption-1 secondary">{r.label}</p>
            <p className="ios-title-2-emphasized">{text} {r.unit}</p>
          </div>
        )) : <p className="ios-subheadline secondary">Enter the values to see the result.</p>}
        <p className="ios-subheadline secondary"><RichText text={k.reference} /></p>
        <AKG.Button variant="bordered" block disabled={!Object.values(values).some((v) => v !== null && v !== undefined)} onClick={() => { setValues({}); setN(n + 1); }}>Reset</AKG.Button>
      </div>
    </>
  );
}
