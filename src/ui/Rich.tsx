import { Fragment, useState, type MouseEvent, type ReactNode } from 'react';
import { AKG } from '../design/akg';
import { content, getCard, isMarkerSource } from '../content';
import type { Block, ContainerItem, Criteria, Dose, Inline, ListItem, Pathway, Source, Threshold } from '../content/types';
import { parseInline, TAGS } from '../../scripts/content/inline.mjs';
import { onsetRows } from '../../scripts/content/onset.mjs';
import { href, parseRoute } from '../router';
import { useSheet, type ShowSheet } from './SheetHost';
import { icons } from './icons';

// Free, clinician-oriented, no sign-in; opens in Safari (DECISIONS 2026-10-18, "Drug interactions: link out").
export const INTERACTION_CHECKER = 'https://reference.medscape.com/drug-interactionchecker';

const src = (id: string) => content.data.source?.[id] as Source | undefined;
const doseItem = (id: string) => content.data.dose?.[id] as Dose | undefined;

// ---- Sources ----

export function SourceList({ ids }: { ids: string[] }) {
  return (
    <div className="source-list">
      {ids.filter((id) => !isMarkerSource(id)).map((id) => {
        const s = src(id);
        if (!s) return null;
        return (
          <div key={id} className="source-item">
            <p className="ios-headline">{s.society ? `${s.society}, ${s.year}` : `${s.short}`}</p>
            <p className="ios-subheadline secondary">{s.citation ?? s.title}</p>
            {s.url && (
              <a className="ios-subheadline akg-link view-citation" href={s.url} target="_blank" rel="noreferrer">
                View Citation<span className="external-mark" role="img" aria-label="Opens in Safari">{icons.arrowUpRight}</span>
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

// What the stethoscope and check markers mean, under a list of sources that uses them.
function MarkerNotes({ ids }: { ids: string[] }) {
  const practice = ids.some((id) => src(id)?.kind === 'practice');
  const verified = ids.some((id) => src(id)?.kind === 'reference');
  return (
    <>
      {practice && <p className="ios-footnote secondary">The stethoscope marks common clinical practice, without a citation.</p>}
      {verified && <p className="ios-footnote secondary">The check marks lines verified with a clinical reference that isn't named.</p>}
    </>
  );
}

// The SourceLine's items: short names, then the markers.
function lineItems(ids: string[]) {
  const named = ids.filter((id) => !isMarkerSource(id)).map((id) => src(id)?.short ?? id);
  const items: (string | { marker: 'practice' | 'verified'; label?: string })[] = [...named];
  if (ids.some((id) => src(id)?.kind === 'practice')) items.push({ marker: 'practice', label: 'common practice' });
  if (ids.some((id) => src(id)?.kind === 'reference')) items.push({ marker: 'verified', label: 'verified' });
  return items;
}

export function openSources(sheet: ShowSheet, ids: string[], forLabel?: string) {
  sheet({
    title: ids.filter((id) => !isMarkerSource(id)).length === 1 ? 'Source' : 'Sources',
    body: (
      <div className="detail-sheet">
        {forLabel && <p className="ios-footnote secondary">For {forLabel}</p>}
        <SourceList ids={ids} />
        <MarkerNotes ids={ids} />
      </div>
    ),
  });
}

// One source line at the end of a section (replaces a pill on every line); tap for the full citations.
export function SectionSources({ ids, forLabel, label }: { ids: string[]; forLabel?: string; label?: string }) {
  const sheet = useSheet();
  if (!ids.length) return null;
  return <AKG.SourceLine items={lineItems(ids)} label={label} onClick={() => openSources(sheet, ids, forLabel)} />;
}

// Inside a sheet: the source line opens the citations in place (one sheet at a time).
function SheetSources({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState(false);
  if (!ids.length) return null;
  return (
    <div className="sheet-sources">
      <AKG.SourceLine items={lineItems(ids)} aria-expanded={open} onClick={() => setOpen(!open)} />
      {open && <><SourceList ids={ids} /><MarkerNotes ids={ids} /></>}
    </div>
  );
}

// ---- Doses ----

// The dose without the drug's name, e.g. "30 mL IV over 10 minutes".
export function doseValue(d: Dose) {
  return [`${d.amount} ${d.unit} ${d.route}`, d.rate, d.frequency].filter(Boolean).join(' ');
}
export function doseLine(d: Dose) {
  return `${d.drug_name} ${doseValue(d)}`;
}
const drugTitle = (d: Dose) => (d.brand ? `${d.drug_name} (${d.brand})` : d.drug_name);
const hasBoxedWarning = (d: Dose) => !!d.boxed_warning && d.boxed_warning.toLowerCase() !== 'none';

// One fact per row: the label, then its value on the trailing side (like Settings › About).
const cap = (v: ReactNode) => (typeof v === 'string' ? v.charAt(0).toUpperCase() + v.slice(1) : v);
function Field({ label, value }: { label: string; value?: ReactNode }) {
  if (value == null || value === '') return null;
  return <AKG.ListRow className="dose-field" title={label} detail={cap(value)} />;
}

function DoseSheet({ id }: { id: string }) {
  const sheet = useSheet();
  const d = doseItem(id);
  if (!d) return null;
  const alt = d.alternative ? doseItem(d.alternative.dose) : undefined;
  const onset = [d.onset, d.lasts].filter(Boolean).join(' · ');
  return (
    <div className="detail-sheet">
      <AKG.List>
        <Field label="Dose" value={<strong>{[`${d.amount} ${d.unit} ${d.route}`, d.frequency].filter(Boolean).join(' ')}</strong>} />
        <Field label="Rate" value={d.rate} />
        <Field label="Give when" value={d.give_when} />
        <Field label="Repeat" value={d.repeat} />
        <Field label={d.onset && d.lasts ? 'Onset · lasts' : d.onset ? 'Onset' : 'Lasts'} value={onset} />
        <Field label="Duration" value={d.duration} />
        <Field label="Maximum" value={d.max} />
        <Field label="Population" value={d.population} />
        <Field label="Boxed warning" value={d.boxed_warning} />
      </AKG.List>
      {d.adjustments?.length ? (
        <AKG.List header="Adjustments">
          {d.adjustments.map((a, i) => <AKG.ListRow key={i} title={a.when} subtitle={a.change} />)}
        </AKG.List>
      ) : null}
      {alt && (
        <div className="dose-alt">
          <p className="ios-footnote-emphasized secondary">Alternative</p>
          <AKG.ValueRow title={alt.drug_name} value={doseValue(alt)} onClick={() => openDose(sheet, d.alternative!.dose)}>
            {d.alternative!.when}
          </AKG.ValueRow>
        </div>
      )}
      {d.cautions?.length ? (
        <AKG.Callout variant="caution" title="Cautions">
          <ul className="rich-list">{d.cautions.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </AKG.Callout>
      ) : null}
      {d.notes && <p className="ios-body">{d.notes}</p>}
      <AKG.List>
        <AKG.ListRow
          title="Check Interactions"
          action
          detail={<span className="external-detail">Medscape<span className="external-mark" role="img" aria-label="Opens in Safari">{icons.arrowUpRight}</span></span>}
          onClick={() => window.open(INTERACTION_CHECKER, '_blank', 'noopener')}
        />
        {d.drug && getCard(d.drug) && <AKG.ListRow title={`Open ${getCard(d.drug)!.title}`} chevron href={href.card(d.drug)} />}
      </AKG.List>
      <SheetSources ids={d.sources} />
    </div>
  );
}

// Short bar title, the drug as the heading (audit: long names don't fit a sheet's title).
export function openDose(sheet: ShowSheet, id: string) {
  const d = doseItem(id);
  if (!d) return;
  sheet({ title: 'Dose', heading: drugTitle(d), subheading: d.indication, body: <DoseSheet id={id} /> });
}

// One drug per row: its name over its dose; tap for the dose sheet.
export function DoseRow({ id }: { id: string }) {
  const sheet = useSheet();
  const d = doseItem(id);
  if (!d) return <span className="missing">[missing dose: {id}]</span>;
  return (
    <AKG.ValueRow
      title={d.drug_name}
      value={doseValue(d)}
      tags={hasBoxedWarning(d) ? <AKG.Tag variant="critical">Boxed warning</AKG.Tag> : undefined}
      onClick={() => openDose(sheet, id)}
      aria-label={`${doseLine(d)}. Opens dose details.`}
    />
  );
}

// ---- Criteria and cutoffs ----

// A criteria set (e.g. KDIGO AKI staging): the "any of" items, then the table. Shown in place, or in a sheet when tapped in text.
function CriteriaBody({ c }: { c: Criteria }) {
  return (
    <div className="criteria">
      {c.logic && <p className="ios-subheadline-emphasized secondary">{c.logic}</p>}
      {c.items?.length ? <ul className="ios-body rich-list">{c.items.map((t, i) => <li key={i}><RichText text={t} /></li>)}</ul> : null}
      {c.rows?.length ? (
        <AKG.Table stickyFirstColumn columns={(c.columns ?? []).map((h, i) => <RichText key={i} text={h} />)} rows={c.rows.map((r, i) => ({ key: i, cells: r.map((t, j) => <RichText key={j} text={t} />) }))} />
      ) : null}
      {c.notes?.length ? <ul className="ios-subheadline secondary rich-list">{c.notes.map((t, i) => <li key={i}><RichText text={t} /></li>)}</ul> : null}
    </div>
  );
}

function CriteriaBlock({ id }: { id: string }) {
  const c = content.data.criteria?.[id] as Criteria | undefined;
  if (!c) return <span className="missing">[missing criteria: {id}]</span>;
  return (
    <div className="criteria-block">
      <p className="ios-headline">{c.name}</p>
      <CriteriaBody c={c} />
    </div>
  );
}

// A criteria set in a sheet: the criteria, then its sources.
export function CriteriaSheet({ c }: { c: Criteria }) {
  return <div className="detail-sheet"><CriteriaBody c={c} /><SheetSources ids={c.sources} /></div>;
}
export const openCriteria = (sheet: ShowSheet, c: Criteria) => sheet({ title: 'Criteria', heading: c.name, body: <CriteriaSheet c={c} /> });

// `plain`: show the value as text, never tappable (inside a ScaleBar, where the band already says what it means).
// A cutoff is tappable only when its pop-up adds something beyond the value shown: a `meaning` (owner's rule, 2026-10-18).
function Insert({ kind, id, plain }: { kind: string; id: string; plain?: boolean }) {
  const sheet = useSheet();
  const item = content.data[kind]?.[id];
  if (!item) return <span className="missing">[missing {kind}: {id}]</span>;
  if (kind === 'dose') {
    // Only flowcharts put a dose inside a sentence: the drug's name here, its dose row under the step.
    const d = item as unknown as Dose;
    return <AKG.TappableValue onClick={() => openDose(sheet, id)}>{d.drug_name}</AKG.TappableValue>;
  }
  if (kind === 'threshold') {
    const t = item as unknown as Threshold;
    if (plain || !t.meaning) return <span className="plain-value">{t.value} {t.unit}</span>;
    return (
      <AKG.TappableValue onClick={() => sheet({ title: 'Cutoff', heading: t.name, body: <div className="detail-sheet"><p className="ios-title-3-emphasized">{t.value} {t.unit}</p><p className="ios-body">{t.meaning}</p><SheetSources ids={t.sources} /></div> })}>
        {t.value} {t.unit}
      </AKG.TappableValue>
    );
  }
  if (kind === 'criteria') {
    const c = item as unknown as Criteria;
    return <AKG.TappableValue onClick={() => openCriteria(sheet, c)}>{c.short}</AKG.TappableValue>;
  }
  return <span>{id}</span>;
}

// A link to a section of the page on screen scrolls there instead of opening the page again (CardScreen listens).
export const JUMP_EVENT = 'wards:jump';
function jumpWithin(e: MouseEvent, id: string, section?: string | null) {
  const r = parseRoute(location.hash);
  if (!section || r.name !== 'card' || r.id !== id) return;
  e.preventDefault();
  dispatchEvent(new CustomEvent(JUMP_EVENT, { detail: section }));
}

export function Inlines({ xs, plain }: { xs: Inline[]; plain?: boolean }) {
  return (
    <>
      {xs.map((x, i) => {
        if (x.t === 'insert') return <Insert key={i} kind={x.kind} id={x.id} plain={plain} />;
        if (x.t === 'tag') return <AKG.Tag key={i} className="inline-tag" variant={x.v === 'cannot-miss' ? 'critical' : 'neutral'}>{TAGS[x.v] ?? x.v}</AKG.Tag>;
        if (x.t !== 'link') return x.t === 'strong' ? <strong key={i}>{x.v}</strong> : x.t === 'em' ? <em key={i}>{x.v}</em> : <Fragment key={i}>{x.v}</Fragment>;
        const c = getCard(x.id);
        return <a key={i} className="akg-link" href={href.card(x.id, x.section ?? undefined)} onClick={(e) => jumpWithin(e, x.id, x.section)}>{x.label ?? c?.title ?? x.id}</a>;
      })}
    </>
  );
}

// Plain text with inserts and links (used inside flowcharts and criteria).
export const RichText = ({ text }: { text?: string }) => (text ? <Inlines xs={parseInline(text)} /> : null);

function Item({ it }: { it: ListItem }) {
  return (
    <li>
      <Inlines xs={it.inlines} />
      {it.children.length > 0 && <ul>{it.children.map((c, i) => <Item key={i} it={c} />)}</ul>}
    </li>
  );
}

// A flowchart step's doses, one row each, under the step's text.
const dosesIn = (text?: string) => [...(text ?? '').matchAll(/\{\{\s*dose\s*:\s*([a-z0-9-]+)\s*\}\}/g)].map((m) => m[1]).filter((id, i, a) => a.indexOf(id) === i);

function PathwayBlock({ id }: { id: string }) {
  const p = content.data.pathway?.[id] as Pathway | undefined;
  if (!p) return null;
  const steps: Record<string, unknown> = {};
  for (const [sid, s] of Object.entries(p.steps)) {
    const doses = dosesIn(s.detail);
    steps[sid] = {
      ...s,
      detail: s.detail ? <RichText text={s.detail} /> : undefined,
      content: doses.length ? <div className="dose-rows">{doses.map((d) => <DoseRow key={d} id={d} />)}</div> : undefined,
      answers: s.answers?.map((a) => ({ ...a, detail: a.detail ? <RichText text={a.detail} /> : undefined })),
      items: s.items?.map((t, i) => <RichText key={i} text={t} />),
      list: s.list?.map((t, i) => <RichText key={i} text={t} />),
      note: s.note ? <RichText text={s.note} /> : undefined,
      links: s.links?.length ? s.links.map((l) => <a key={l} className="ios-body akg-link" href={href.card(l)}>Open {getCard(l)?.title ?? l}</a>) : undefined,
    };
  }
  return (
    <div className="pathway">
      {p.title && <p className="ios-headline">{p.title}</p>}
      <AKG.Flowchart steps={steps as never} start={p.start} stages={p.stages} />
    </div>
  );
}

// ---- Blocks ----

const hasText = (xs: Inline[]) => xs.some((x) => x.t !== 'text' || x.v.trim());

type ContainerBlock = Extract<Block, { items: ContainerItem[] }>;

// Onset and duration side by side, fastest first, in a sheet opened from one row (Treatment).
function OnsetSheet({ b }: { b: ContainerBlock }) {
  const rows = onsetRows(b.items, content.data.dose);
  const ids = [...new Set([...b.sources, ...rows.flatMap((r) => r.sources)])];
  return (
    <div className="detail-sheet">
      <p className="ios-footnote secondary">Fastest first.</p>
      <AKG.Table stickyFirstColumn columns={['Treatment', 'Onset', 'Lasts']} rows={rows.map((r) => ({ key: r.i, cells: [r.name, cap(r.onset), cap(r.lasts) || '—'] }))} />
      <SheetSources ids={ids} />
    </div>
  );
}

function OnsetRow({ b }: { b: ContainerBlock }) {
  const sheet = useSheet();
  const title = hasText(b.title) ? <Inlines xs={b.title} /> : 'Compare Onset and Duration';
  return (
    <AKG.List className="onset-row">
      <AKG.ListRow title={title} chevron onClick={() => sheet({ title: 'Onset and Duration', body: <OnsetSheet b={b} /> })} />
    </AKG.List>
  );
}

function Container({ b }: { b: ContainerBlock }) {
  const t: string = b.t;
  const items: ContainerItem[] = b.items;
  if (t === 'onset') return <OnsetRow b={b} />;
  const title = hasText(b.title) ? <Inlines xs={b.title} /> : undefined;
  if (t === 'scale') {
    return (
      <div className="scale-block">
        {title && <p className="ios-subheadline-emphasized">{title}</p>}
        <AKG.ScaleBar segments={items.map((it: ContainerItem) => ({ label: <Inlines xs={it.label} />, range: <Inlines xs={it.inlines} plain /> }))} />
      </div>
    );
  }
  if (t === 'compare') {
    return <AKG.ComparisonGrid title={title} columns={items.map((it) => ({ label: <Inlines xs={it.label} />, content: <Inlines xs={it.inlines} /> }))} />;
  }
  return <AKG.TimePoints label={title} items={items.map((it, i) => <Fragment key={i}>{it.text}</Fragment>)} />;
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  // Doses next to each other share one group of rows.
  const out: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.t === 'insert' && b.kind === 'dose') {
      const ids: string[] = [];
      while (i < blocks.length && blocks[i].t === 'insert' && (blocks[i] as { kind: string }).kind === 'dose') ids.push((blocks[i++] as { id: string }).id);
      i--;
      out.push(<div key={`d${i}`} className="dose-rows">{ids.map((id, j) => <DoseRow key={j} id={id} />)}</div>);
      continue;
    }
    out.push(<BlockView key={i} b={b} />);
  }
  return <>{out}</>;
}

function BlockView({ b }: { b: Block }) {
  if (b.t === 'paragraph') return <p className="ios-body"><Inlines xs={b.inlines} /></p>;
  if (b.t === 'list') return <ul className="ios-body rich-list">{b.items.map((it, j) => <Item key={j} it={it} />)}</ul>;
  if (b.t === 'subheading') return <h3 className="ios-headline subheading">{b.text}</h3>;
  if (b.t === 'steps') {
    return (
      <AKG.StepList>
        {b.items.map((it, j) => <AKG.Step key={j} title={<Inlines xs={it.inlines} />}><div className="step-body"><Blocks blocks={it.blocks} /></div></AKG.Step>)}
      </AKG.StepList>
    );
  }
  if (b.t === 'insert') {
    if (b.kind === 'pathway') return <PathwayBlock id={b.id} />;
    if (b.kind === 'criteria') return <CriteriaBlock id={b.id} />;
    return <p className="ios-body"><Insert kind={b.kind} id={b.id} /></p>;
  }
  if (b.t !== 'table') return <Container b={b as ContainerBlock} />;
  return (
    // The first column stays in place while a wide table scrolls sideways (audit 2026-10-17).
    <AKG.Table
      stickyFirstColumn
      columns={b.header.map((h, j) => <Inlines key={j} xs={h} />)}
      rows={b.rows.map((r, k) => ({ key: k, cells: r.cells.map((c, j) => <Inlines key={j} xs={c} />) }))}
    />
  );
}

export type { ReactNode };
