// The antimicrobial coverage tool on the Empiric Antimicrobials card (docs/DATA-TYPES.md, 10; DECISIONS 2026-10-22):
// pick organisms to see the drugs that cover them all, browse every drug at a glance, or compare up to three drugs.
// Coverage is a gray shape plus a word, never color alone.
import { useState } from 'react';
import { AKG } from '../design/akg';
import { content } from '../content';
import type { CoverageGrid, CoverageRow } from '../content/types';
import { byClass, closestDrugs, drugsCovering, LEVEL_TO_MARK, MAX_ORGANISMS, togglePick, type CoverageMode } from '../coverage';
import { useSheet, type ShowSheet } from './SheetHost';
import { SheetSources } from './Rich';
import { icons } from './icons';

type View = 'organism' | 'all' | 'compare';

function Mark({ grid, row, col }: { grid: CoverageGrid; row: CoverageRow; col: string }) {
  const lv = row.cells[col];
  const c = grid.columns.find((x) => x.id === col)!;
  return (
    <span className="cov-mark">
      <AKG.CoverageMark level={LEVEL_TO_MARK[lv]} label={`${c.name}: ${grid.levels[lv].word}`} />
    </span>
  );
}

// What each shape means, including what "Variable" depends on; always on screen under the tool.
function Legend({ grid }: { grid: CoverageGrid }) {
  return (
    <div className="cov-legend">
      {(['R', 'V', 'N'] as const).map((l) => (
        <p key={l} className="ios-footnote secondary">
          <AKG.CoverageMark level={LEVEL_TO_MARK[l]} label={grid.levels[l].word} showLabel={false} />
          <span><strong>{grid.levels[l].word}.</strong> {grid.levels[l].meaning}</span>
        </p>
      ))}
      <p className="ios-footnote secondary">Antipseudomonal and ESBL coverage still needs the patient's susceptibility results.</p>
    </div>
  );
}

function openDrug(sheet: ShowSheet, grid: CoverageGrid, row: CoverageRow) {
  const practice = (row.cp_cells ?? []).map((id) => grid.columns.find((c) => c.id === id)?.name).filter(Boolean);
  sheet({
    title: 'Coverage',
    heading: row.drug,
    subheading: row.class,
    body: (
      <div className="detail-sheet">
        <p className="ios-body">{row.note}</p>
        <ul className="cov-detail" aria-label={`${row.drug} coverage`}>
          {grid.columns.map((c) => (
            <li key={c.id}>
              <span>{c.name}</span>
              <AKG.CoverageMark level={LEVEL_TO_MARK[row.cells[c.id]]} label={grid.levels[row.cells[c.id]].word} />
            </li>
          ))}
        </ul>
        {practice.length > 0 && <p className="ios-footnote secondary">Rests on common clinical practice rather than a guideline statement: {practice.join(', ')}.</p>}
        <SheetSources ids={row.sources} />
        <Legend grid={grid} />
      </div>
    ),
  });
}

// A drug's row: name over its marks (or its strip), tapping opens its sheet.
function DrugRow({ grid, row, children }: { grid: CoverageGrid; row: CoverageRow; children: React.ReactNode }) {
  const sheet = useSheet();
  return (
    <button type="button" className="cov-row" onClick={() => openDrug(sheet, grid, row)}>
      <span className="cov-row-text">
        <span className="ios-headline">{row.drug}</span>
        {children}
      </span>
      <span className="cov-chevron" aria-hidden="true">{chevron}</span>
    </button>
  );
}
const chevron = (
  <svg viewBox="0 0 9 16" width="9" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1.6 1.6 7.4 8l-5.8 6.4" /></svg>
);

function ClassHeader({ name }: { name: string }) {
  return <p className="ios-footnote-emphasized secondary cov-class">{name}</p>;
}

type Picks = { picked: string[]; setPicked: (p: string[]) => void };

function ByOrganism({ grid, picked, setPicked }: { grid: CoverageGrid } & Picks) {
  const [mode, setMode] = useState<CoverageMode>('reliable');
  const names = picked.map((id) => grid.columns.find((c) => c.id === id)!.name);
  const full = drugsCovering(grid, picked, mode);
  const near = picked.length > 1 && !full.length ? closestDrugs(grid, picked, mode) : [];
  const marks = (row: CoverageRow) => (
    <span className="cov-marks">{picked.map((id) => <Mark key={id} grid={grid} row={row} col={id} />)}</span>
  );
  return (
    <>
      <p className="ios-subheadline secondary">Pick up to {MAX_ORGANISMS} organism groups to see the drugs that cover all of them.</p>
      <div className="cov-chips" role="group" aria-label="Organism groups">
        {grid.columns.map((c) => {
          const on = picked.includes(c.id);
          return (
            <AKG.Button key={c.id} variant="toggle" size="medium" icon={on ? icons.checkmark : undefined} pressed={on} disabled={!on && picked.length >= MAX_ORGANISMS} onPressedChange={() => setPicked(togglePick(picked, c.id))}>
              {c.name}
            </AKG.Button>
          );
        })}
      </div>
      <p className="ios-footnote secondary">Count as covered:</p>
      <AKG.SegmentedControl
        aria-label="What counts as covered"
        options={[{ value: 'reliable', label: 'Reliable only' }, { value: 'reliable-or-variable', label: 'Reliable or variable' }]}
        value={mode}
        onChange={(v) => setMode(v as CoverageMode)}
      />
      <div aria-live="polite">
        {!picked.length && <p className="ios-subheadline secondary">Select an organism group.</p>}
        {picked.length > 0 && (
          <p className="ios-headline cov-result">
            {full.length ? `${full.length} drug${full.length > 1 ? 's cover' : ' covers'} ${names.join(' + ')}` : `No single drug covers ${names.join(' + ')}`}
          </p>
        )}
        {full.length > 0 && byClass(full).map((g) => (
          <div key={g.name}>
            <ClassHeader name={g.name} />
            {g.rows.map((r) => <DrugRow key={r.drug} grid={grid} row={r}>{marks(r)}</DrugRow>)}
          </div>
        ))}
        {!full.length && picked.length > 1 && <p className="ios-subheadline secondary">Combine one drug from each group.</p>}
        {!full.length && picked.length === 1 && <p className="ios-subheadline secondary">Try “Reliable or variable”.</p>}
        {near.length > 0 && (
          <>
            <p className="ios-subheadline secondary">Closest options, covering part of the set:</p>
            {near.map(({ row, count }) => (
              <DrugRow key={row.drug} grid={grid} row={row}>
                <span className="ios-footnote secondary">Covers {count} of {picked.length}</span>
                {marks(row)}
              </DrugRow>
            ))}
          </>
        )}
      </div>
    </>
  );
}

function AllDrugs({ grid }: { grid: CoverageGrid }) {
  return (
    <>
      <p className="ios-subheadline secondary">Each drug's coverage of all {grid.columns.length} organism groups. Tap a drug for the words, a note and sources.</p>
      {byClass(grid.rows).map((g) => (
        <div key={g.name}>
          <ClassHeader name={g.name} />
          {g.rows.map((r) => (
            <DrugRow key={r.drug} grid={grid} row={r}>
              <AKG.CoverageStrip labels={Object.fromEntries((['R', 'V', 'N'] as const).map((l) => [LEVEL_TO_MARK[l], grid.levels[l].word]))} items={grid.columns.map((c) => ({ short: c.short, name: c.name, level: LEVEL_TO_MARK[r.cells[c.id]] }))} />
            </DrugRow>
          ))}
        </div>
      ))}
    </>
  );
}

function Compare({ grid, picked, setPicked }: { grid: CoverageGrid } & Picks) {
  const rows = picked.map((d) => grid.rows.find((r) => r.drug === d)!);
  return (
    <>
      <p className="ios-subheadline secondary">Choose up to {MAX_ORGANISMS} drugs; the comparison appears below the list.</p>
      <div className="cov-picklist">
        {grid.rows.map((r) => {
          const on = picked.includes(r.drug);
          return <AKG.CheckRow key={r.drug} label={r.drug} checked={on} disabled={!on && picked.length >= MAX_ORGANISMS} onChange={() => setPicked(togglePick(picked, r.drug))} />;
        })}
      </div>
      {rows.length > 0 && (
        <div className="cov-compare" lang="en" style={{ gridTemplateColumns: `auto repeat(${rows.length}, minmax(0, 1fr))` }} role="table" aria-label="Drug comparison">
          <div role="row" className="cov-compare-row">
            <span role="columnheader" />
            {rows.map((r) => <span key={r.drug} role="columnheader" className="ios-footnote-emphasized">{r.drug}</span>)}
          </div>
          {grid.columns.map((c) => (
            <div key={c.id} role="row" className="cov-compare-row">
              <span role="rowheader" className="ios-footnote-emphasized secondary">{c.name}</span>
              {rows.map((r) => (
                <span key={r.drug} role="cell" className="cov-compare-cell">
                  <AKG.CoverageMark level={LEVEL_TO_MARK[r.cells[c.id]]} label={grid.levels[r.cells[c.id]].word} />
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function CoverageBlock({ id }: { id: string }) {
  const grid = content.data.coverage?.[id];
  const [view, setView] = useState<View>('organism');
  const [organisms, setOrganisms] = useState<string[]>([]);
  const [drugs, setDrugs] = useState<string[]>([]);
  if (!grid) return <span className="missing">[missing coverage: {id}]</span>;
  return (
    <AKG.Panel tone="plain" label="Coverage" className="coverage">
      <p className="ios-headline">{grid.title}</p>
      <AKG.SegmentedControl
        aria-label="Coverage view"
        options={[{ value: 'organism', label: 'By organism' }, { value: 'all', label: 'All drugs' }, { value: 'compare', label: 'Compare' }]}
        value={view}
        onChange={(v) => setView(v as View)}
      />
      {view === 'organism' && <ByOrganism grid={grid} picked={organisms} setPicked={setOrganisms} />}
      {view === 'all' && <AllDrugs grid={grid} />}
      {view === 'compare' && <Compare grid={grid} picked={drugs} setPicked={setDrugs} />}
      <Legend grid={grid} />
    </AKG.Panel>
  );
}
