import { createContext, Fragment, useContext, useState, type ReactNode } from 'react';
import { AKG } from '../design/akg';
import { content, getCard, titleCase, isMarkerSource, pathwaysFor, useCardLoad } from '../content';
import type { Block, Calc, Card, ContainerItem, Criteria, Dose, Inline, ListItem, Regimen, Section, Source, Threshold } from '../content/types';
import { parseInline, TAGS } from '../../scripts/content/inline.mjs';
import { onsetRows } from '../../scripts/content/onset.mjs';
import { slug } from '../../scripts/content/pathway.mjs';
import { href, parseRoute } from '../router';
import { useSheet, type ShowSheet } from './SheetHost';
import { icons } from './icons';
import { MediaFigure } from './Ecg';
import { CoverageBlock } from './Coverage';
import { hasCalculator, openCalculator } from './Calculator';

// "5–10%" without a space; every other unit after a space ("0.1 units/kg/h").
const amountWithUnit = (amount: string | number, unit: string) => (unit === '%' ? `${amount}%` : `${amount} ${unit}`);

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

// One SourcePill per named source, then the markers; all open the same citations (#8, one source style everywhere).
export function SourcePills({ ids, onOpen, expanded }: { ids: string[]; onOpen: () => void; expanded?: boolean }) {
  const named = ids.filter((id) => !isMarkerSource(id));
  const markers: ('practice' | 'verified')[] = [];
  if (ids.some((id) => src(id)?.kind === 'practice')) markers.push('practice');
  if (ids.some((id) => src(id)?.kind === 'reference')) markers.push('verified');
  if (!named.length && !markers.length) return null;
  return (
    <span className="source-pills">
      {named.map((id) => <AKG.SourcePill key={id} aria-expanded={expanded} label={src(id)?.short ?? id} aria-label={`Source: ${src(id)?.short ?? id}`} onClick={onOpen} />)}
      {markers.map((m) => <AKG.SourcePill key={m} aria-expanded={expanded} marker={m} onClick={onOpen} />)}
    </span>
  );
}

// Inside a sheet: the pills open the citations in place (one sheet at a time).
export function SheetSources({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState(false);
  if (!ids.length) return null;
  return (
    <div className="sheet-sources">
      <SourcePills ids={ids} expanded={open} onOpen={() => setOpen(!open)} />
      {open && <><SourceList ids={ids} /><MarkerNotes ids={ids} /></>}
    </div>
  );
}

// ---- Sources per line ----

// The card's quote-mark button shows one SourcePill at the end of every line (off by default; owner, 2026-10-19).
// `section` names the section, quoted with the line in the pill's sheet.
type LineSourcesState = { show: boolean; section?: string };
const LineSourcesCtx = createContext<LineSourcesState>({ show: false });
export function LineSources({ show, section, children }: { show?: boolean; section?: string; children: ReactNode }) {
  const outer = useContext(LineSourcesCtx);
  return <LineSourcesCtx.Provider value={{ show: show ?? outer.show, section: section ?? outer.section }}>{children}</LineSourcesCtx.Provider>;
}

// A line as plain words, for the quote at the top of its sources sheet (nothing in it is tappable).
export function plainText(xs: Inline[]): string {
  return xs.map((x) => {
    if (x.t === 'insert') {
      const item = content.data[x.kind]?.[x.id] as Record<string, unknown> | undefined;
      if (!item) return '';
      if (x.kind === 'threshold') return `${item.value} ${item.unit}`;
      if (x.kind === 'criteria') return String(item.short);
      if (x.kind === 'dose') return String(item.drug_name);
      if (x.kind === 'regimen') return String(item.name);
      if (x.kind === 'calc') return x.label ?? String(item.short);
      return String(item.title ?? item.name ?? '');
    }
    if (x.t === 'link') return x.label ?? getCard(x.id)?.title ?? x.id;
    if (x.t === 'tag') return '';
    return x.v;
  }).join('').replace(/\s+/g, ' ').trim();
}

function openLineSources(sheet: ShowSheet, ids: string[], quote: string, section?: string) {
  sheet({
    title: ids.filter((id) => !isMarkerSource(id)).length === 1 ? 'Source' : 'Sources',
    body: (
      <div className="detail-sheet">
        {quote && <AKG.Panel tone="quote"><p>{section && <span className="secondary">{section} · </span>}{quote}</p></AKG.Panel>}
        <SourceList ids={ids} />
        <MarkerNotes ids={ids} />
      </div>
    ),
  });
}

// One pill per line: its first named source, "+N" for the rest; a marker (stethoscope or check) when none is named.
export function LinePill({ ids, quote }: { ids: string[]; quote: Inline[] | string }) {
  const sheet = useSheet();
  const { show, section } = useContext(LineSourcesCtx);
  if (!show || !ids.length) return null;
  const text = typeof quote === 'string' ? quote : plainText(quote);
  const open = () => openLineSources(sheet, ids, text, section);
  const named = ids.filter((id) => !isMarkerSource(id));
  if (!named.length) {
    const marker = ids.some((id) => src(id)?.kind === 'practice') ? 'practice' : 'verified';
    return <AKG.SourcePill className="line-pill" marker={marker} onClick={open} />;
  }
  const names = ids.map((id) => (isMarkerSource(id) ? (src(id)?.kind === 'practice' ? 'common clinical practice' : 'verified') : src(id)?.short ?? id));
  return (
    <AKG.SourcePill className="line-pill" label={src(named[0])?.short ?? named[0]} more={ids.length > 1 ? ids.length - 1 : undefined} aria-label={`Sources: ${names.join(', ')}`} onClick={open} />
  );
}

// ---- Doses ----

// The dose without the drug's name, e.g. "30 mL IV over 10 minutes".
export function doseValue(d: Dose) {
  return [`${amountWithUnit(d.amount, d.unit)} ${d.route}`, d.rate, d.frequency].filter(Boolean).join(' ');
}
export function doseLine(d: Dose) {
  return `${d.drug_name} ${doseValue(d)}`;
}
const drugTitle = (d: Dose) => (d.brand ? `${d.drug_name} (${d.brand})` : d.drug_name);
const hasBoxedWarning = (d: Dose) => !!d.boxed_warning && d.boxed_warning.toLowerCase() !== 'none';

const cap = (v: ReactNode) => (typeof v === 'string' ? v.charAt(0).toUpperCase() + v.slice(1) : v);

// A hairline-separated section with a small uppercase heading (#7).
function DoseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="dose-section">
      <h3 className="ios-caption-1 dose-section__title">{title}</h3>
      {children}
    </section>
  );
}

function DoseSheet({ id }: { id: string }) {
  const sheet = useSheet();
  const [open, setOpen] = useState(false);
  const d = doseItem(id);
  if (!d) return null;
  const alt = d.alternative ? doseItem(d.alternative.dose) : undefined;
  const onset = [d.onset, d.lasts].filter(Boolean).join(' · ');
  const who = [d.population, d.route].filter(Boolean).join(' · ');
  const facts: [string, string | undefined][] = [
    ['Rate', d.rate],
    ['Repeat', d.repeat],
    [d.onset && d.lasts ? 'Onset · lasts' : d.onset ? 'Onset' : 'Lasts', onset],
    ['Duration', d.duration],
    ['Maximum', d.max],
  ];
  return (
    <div className="detail-sheet dose-sheet">
      <div className="dose-head">
        {who && <p className="ios-subheadline">{who}</p>}
        <p className="ios-title-2-emphasized">{amountWithUnit(d.amount, d.unit)}</p>
        {d.frequency && <p className="ios-subheadline secondary">{d.frequency}</p>}
        <SourcePills ids={d.sources} expanded={open} onOpen={() => setOpen(!open)} />
      </div>
      {open && <div className="dose-cites"><SourceList ids={d.sources} /><MarkerNotes ids={d.sources} /></div>}
      {d.give_when && <DoseSection title="Give when"><p className="ios-body">{d.give_when}</p></DoseSection>}
      {facts.some(([, v]) => v) && (
        <DoseSection title="Administration">
          {facts.filter(([, v]) => v).map(([k, v]) => <AKG.ValueRow key={k} title={k} value={v} />)}
        </DoseSection>
      )}
      {d.adjustments?.length ? (
        <DoseSection title="Adjust">
          {d.adjustments.map((a, i) => <AKG.ValueRow key={i} title={a.when} value={a.change} />)}
        </DoseSection>
      ) : null}
      {alt && (
        <DoseSection title="Alternative">
          <AKG.ValueRow title={alt.drug_name} value={doseValue(alt)} onClick={() => openDose(sheet, d.alternative!.dose)}>
            {d.alternative!.when}
          </AKG.ValueRow>
        </DoseSection>
      )}
      {(d.cautions?.length || d.boxed_warning) ? (
        <DoseSection title="Cautions">
          <ul className="rich-list">
            {d.boxed_warning && <li><strong>Boxed warning</strong> <span>{d.boxed_warning}</span></li>}
            {d.cautions?.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </DoseSection>
      ) : null}
      {d.notes && <DoseSection title="Note"><p className="ios-body">{d.notes}</p></DoseSection>}
      <AKG.List>
        <AKG.ListRow
          title="Check Interactions"
          action
          detail={<span className="external-detail">Medscape<span className="external-mark" role="img" aria-label="Opens in Safari">{icons.arrowUpRight}</span></span>}
          onClick={() => window.open(INTERACTION_CHECKER, '_blank', 'noopener')}
        />
        {d.drug && getCard(d.drug) && <AKG.ListRow title={`Open ${getCard(d.drug)!.title}`} chevron href={href.card(d.drug)} />}
      </AKG.List>
    </div>
  );
}

// Short bar title, the drug as the heading (audit: long names don't fit a sheet's title).
export function openDose(sheet: ShowSheet, id: string) {
  const d = doseItem(id);
  if (!d) return;
  sheet({ title: 'Dose', heading: drugTitle(d), subheading: d.indication, body: <DoseSheet id={id} /> });
}

// One drug per row: its name over its dose; tap for the dose sheet. `warnings` adds warning tags (an emergency's
// Do Now steps); `large` shows the dose at Title 2 size (Timed Mode); `surface="raised"` sets it apart on a tinted box.
export function DoseRow({ id, warnings, large, surface, children }: { id: string; warnings?: string[]; large?: boolean; surface?: 'fill' | 'raised'; children?: ReactNode }) {
  const sheet = useSheet();
  const d = doseItem(id);
  if (!d) return <span className="missing">[missing dose: {id}]</span>;
  const tags = [
    ...(hasBoxedWarning(d) ? [<AKG.Tag key="boxed" variant="critical">Boxed warning</AKG.Tag>] : []),
    ...(warnings ?? []).map((w) => <AKG.Tag key={w} variant="warning">{w}</AKG.Tag>),
  ];
  return (
    <AKG.ValueRow
      className={large ? 'dose-row--large' : undefined}
      surface={surface}
      title={d.drug_name}
      value={large ? <span className="ios-title-2-emphasized">{doseValue(d)}</span> : doseValue(d)}
      tags={tags.length ? <span className="tag-row">{tags}</span> : undefined}
      onClick={() => openDose(sheet, id)}
      aria-label={`${doseLine(d)}${warnings?.length ? `. Warning: ${warnings.join(', ')}` : ''}. Opens dose details.`}
    >
      {children}
    </AKG.ValueRow>
  );
}

/** The dose's alternative, when it has one ("Or calcium chloride 10%", with when to use it), as its own row. */
export function AlternativeRow({ id }: { id: string }) {
  const sheet = useSheet();
  const d = doseItem(id);
  const alt = d?.alternative ? doseItem(d.alternative.dose) : undefined;
  if (!d?.alternative || !alt) return null;
  return (
    <AKG.ValueRow
      title={`Or ${alt.drug_name}`}
      value={doseValue(alt)}
      onClick={() => openDose(sheet, d.alternative!.dose)}
      aria-label={`Or ${doseLine(alt)}${d.alternative.when ? `, ${d.alternative.when}` : ''}. Opens dose details.`}
    >
      {d.alternative.when}
    </AKG.ValueRow>
  );
}

// ---- Regimens ----

// A regimen (docs/DATA-TYPES.md, 3) in a gray box labelled "Regimen": its name and setting, then its options joined by
// "Or". Inside an option, parts given together are joined by "Plus"; a part with several doses is "One of" them. Every
// drug is its own dose row (one drug per row), so the words never carry a dose.
function RegimenBlock({ id }: { id: string }) {
  const r = content.data.regimen?.[id] as Regimen | undefined;
  if (!r) return <span className="missing">[missing regimen: {id}]</span>;
  const ids = (part: string | string[]) => (Array.isArray(part) ? part : [part]);
  return (
    <AKG.Panel tone="plain" label="Regimen" className="regimen">
      <p className="ios-headline"><RichText text={r.name} /><LinePill ids={r.sources} quote={r.name} /></p>
      {r.setting && <p className="ios-subheadline secondary"><RichText text={r.setting} /></p>}
      {r.options.map((o, i) => (
        <div key={i} className="regimen-option">
          {i > 0 && <p className="ios-footnote-emphasized secondary regimen-join">Or</p>}
          {o.label && <p className="ios-subheadline-emphasized"><RichText text={o.label} /></p>}
          {o.when && <p className="ios-subheadline secondary"><RichText text={o.when} /></p>}
          {o.doses.map((part, j) => (
            <Fragment key={j}>
              {j > 0 && <p className="ios-footnote-emphasized secondary regimen-join">Plus</p>}
              {ids(part).length > 1 && <p className="ios-footnote secondary">One of:</p>}
              <div className="dose-rows">{ids(part).map((d) => <DoseRow key={d} id={d} surface="raised" />)}</div>
            </Fragment>
          ))}
        </div>
      ))}
      {r.duration && <p className="ios-body"><strong>Duration:</strong> <RichText text={r.duration} /></p>}
      {r.notes?.map((n, i) => <p key={i} className="ios-subheadline secondary"><RichText text={n} /></p>)}
    </AKG.Panel>
  );
}

// ---- Criteria and cutoffs ----

// A criteria set (e.g. KDIGO AKI staging), shown in place or in a sheet when tapped in text: the "any of" items in an
// indigo Criteria box; a table with `layout: stacked` as tinted bands (yellow, orange, red from its `tones`, severity only),
// any other table as a table; the notes in a brown Note box. One color per kind of information (owner, 2026-10-19).
const TONE = { yellow: 'mild', orange: 'moderate', red: 'severe' } as const;
function CriteriaBody({ c, id }: { c: Criteria; id?: string }) {
  const sheet = useSheet();
  // A score or formula that has an MDCalc page ends its box with that link (a calculator file with the same id).
  const calc = id ? (content.data.calc?.[id] as Calc | undefined) : undefined;
  const stacked = !!(c.rows?.length && c.layout === 'stacked' && c.tones);
  const table = c.rows?.length && !stacked ? (
    <AKG.Table stickyFirstColumn shadedHeader label="Table" columns={(c.columns ?? []).map((h, i) => <RichText key={i} text={h} />)} rows={c.rows.map((r, i) => ({ key: i, cells: r.map((t, j) => <RichText key={j} text={t} />) }))} />
  ) : null;
  return (
    <div className="criteria">
      {stacked && !c.logic && !c.items?.length ? (
        // Colored severity bands carry their own tint: the title is a plain heading, not an empty indigo box.
        <h3 className="ios-headline subheading">{c.title}</h3>
      ) : (
      <AKG.Panel tone="definition" label={calc ? 'Score' : 'Criteria'} title={c.title}>
        {c.logic && <p className="ios-subheadline-emphasized">{c.logic}</p>}
        {c.items?.length ? <ul className="ios-body rich-list">{c.items.map((t, i) => <li key={i}><RichText text={t} /></li>)}</ul> : null}
        {table}
        {calc && <p className="ios-body"><CalcLink c={calc} label={`${calc.short} on MDCalc`} /></p>}
        {calc && id && hasCalculator(id) && <AKG.Button variant="tinted" block onClick={() => openCalculator(sheet, id)}>Calculate</AKG.Button>}
      </AKG.Panel>
      )}
      {stacked ? (
        <AKG.GradeList
          className="staging"
          layout="bands"
          rows={c.rows!.map((r, i) => ({ key: i, grade: <RichText text={/^\d+$/.test(r[0]) ? `${c.columns?.[0]} ${r[0]}` : r[0]} />, tone: TONE[c.tones![i]], values: r.slice(1).map((t, j) => ({ label: <RichText text={c.columns?.[j + 1]} />, value: <RichText text={t} /> })) }))}
        />
      ) : null}
      {c.notes?.length ? (
        <AKG.Panel tone="note" label="Note">
          {c.notes.map((t, i) => <p key={i} className="ios-body"><RichText text={t} /><LinePill ids={c.sources} quote={t} /></p>)}
        </AKG.Panel>
      ) : null}
    </div>
  );
}

function CriteriaBlock({ id }: { id: string }) {
  const c = content.data.criteria?.[id] as Criteria | undefined;
  if (!c) return <span className="missing">[missing criteria: {id}]</span>;
  return <CriteriaBody c={c} id={id} />;
}

// A criteria set in a sheet: the criteria, then its sources.
export function CriteriaSheet({ c, id }: { c: Criteria; id?: string }) {
  return <div className="detail-sheet"><CriteriaBody c={c} id={id} /><SheetSources ids={c.sources} /></div>;
}
export const openCriteria = (sheet: ShowSheet, c: Criteria, id?: string) => sheet({ title: 'Criteria', body: <CriteriaSheet c={c} id={id} /> });

// `plain`: show the value as text, never tappable (in table cells and scale bands, where the row or band says what it means).
// A cutoff is tappable only when its pop-up adds something the line doesn't show: a `note` (owner's rule, 2026-10-19;
// the content check rejects notes that repeat the line).
// A named score or calculator: the words are a link to its MDCalc page, with the same arrow mark as the other links that
// leave the app. It opens in Safari (a Done button returns to Wards) and needs internet; offline the page simply doesn't load.
export function CalcLink({ c, label }: { c: Calc; label?: string }) {
  const text = label ?? c.short;
  return (
    <a className="akg-inline-button calc-link" href={c.url} target="_blank" rel="noopener noreferrer" aria-label={`${text}${c.name.includes(c.short) ? '' : `, ${c.name}`}. Opens MDCalc in Safari, needs internet.`}>
      <span className="akg-inline-button__icon" aria-hidden="true">{icons.arrowUpRight}</span>{text}
    </a>
  );
}

function Insert({ kind, id, plain, label }: { kind: string; id: string; plain?: boolean; label?: string }) {
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
    if (plain || !t.note) return <span className="plain-value">{t.value} {t.unit}</span>;
    return (
      <AKG.TappableValue onClick={() => sheet({ title: 'Cutoff', heading: t.name, body: <div className="detail-sheet"><p className="ios-title-3-emphasized">{t.value} {t.unit}</p><p className="ios-body">{t.note}</p><SheetSources ids={t.sources} /></div> })}>
        {t.value} {t.unit}
      </AKG.TappableValue>
    );
  }
  // A score with an in-app calculator opens it; the sheet ends with the MDCalc link.
  if (kind === 'calc' && (item as unknown as Calc).calculator) {
    const cc = item as unknown as Calc;
    return <AKG.InlineButton icon={icons.plusForwardslashMinus} onClick={() => openCalculator(sheet, id)}>{label ?? cc.short}</AKG.InlineButton>;
  }
  if (kind === 'calc') return <CalcLink c={item as unknown as Calc} label={label} />;
  if (kind === 'criteria') {
    const c = item as unknown as Criteria;
    return <AKG.TappableValue onClick={() => openCriteria(sheet, c, id)}>{c.short}</AKG.TappableValue>;
  }
  return <span>{id}</span>;
}

// A link to a section of the page on screen scrolls there instead of opening the page again (CardScreen listens).
export const JUMP_EVENT = 'wards:jump';
// ---- Card links ----

// A link to another card opens a sheet with the part of it that fits where the link sits (the section the link names,
// else one chosen from the section the link is in), and a row that opens the full card. Plain navigation stays a link
// only inside a pathway box and Related. On the same page, a link to a section scrolls there.
const TREAT_FROM = ['treatment', 'first-steps', 'monitor', 'escalation', 'do-now'];
const TREAT_TARGET = ['treatment', 'dosing', 'dosing-and-protocol', 'indications'];
export function pickSection(card: Card, named?: string | null, from?: string): Section | undefined {
  const by = (keys: string[]) => keys.map((k) => card.sections.find((s) => s.key === k)).find(Boolean);
  if (named) return by([named]);
  if (from && TREAT_FROM.includes(from)) return by(TREAT_TARGET) ?? by(['at-a-glance']);
  if (from === 'diagnosis') return by(['diagnosis']) ?? by(['at-a-glance']);
  return by(['at-a-glance']) ?? card.sections[0];
}

function CardPartSheet({ card, part }: { card: Card; part?: Section }) {
  const { status, retry } = useCardLoad(card.id);
  const live = getCard(card.id) ?? card;
  const sec = live.sections.find((s) => s.key === part?.key);
  return (
    <div className="detail-sheet card-part">
      {status === 'loading' && <p className="ios-subheadline secondary">Loading…</p>}
      {status === 'error' && <AKG.Button variant="tinted" onClick={retry}>Try Again</AKG.Button>}
      {status === 'ready' && sec && <Blocks blocks={sec.blocks} />}
      <AKG.List className="card-part-open">
        <AKG.ListRow title={`Open full ${card.title}`} href={href.card(card.id, part?.key)} />
      </AKG.List>
    </div>
  );
}

function CardLink({ card, section, label }: { card: Card; section?: string | null; label: string }) {
  const sheet = useSheet();
  const from = useContext(AnchorCtx);
  const open = () => {
    const r = parseRoute(location.hash);
    if (section && r.name === 'card' && r.id === card.id) { dispatchEvent(new CustomEvent(JUMP_EVENT, { detail: section })); return; }
    const part = pickSection(card, section, from);
    sheet({ title: 'Card', heading: part ? titleCase(part.title) : card.title, subheading: part ? card.title : undefined, body: <CardPartSheet card={card} part={part} /> });
  };
  return <AKG.InlineButton icon={icons.textDocument} onClick={open}>{label}</AKG.InlineButton>;
}

export function Inlines({ xs, plain }: { xs: Inline[]; plain?: boolean }) {
  return (
    <>
      {xs.map((x, i) => {
        if (x.t === 'insert') return <Insert key={i} kind={x.kind} id={x.id} label={x.label} plain={plain} />;
        if (x.t === 'tag') return <AKG.Tag key={i} className="inline-tag" variant={x.v === 'cannot-miss' ? 'critical' : 'neutral'}>{TAGS[x.v] ?? x.v}</AKG.Tag>;
        if (x.t !== 'link') return x.t === 'strong' ? <strong key={i}>{x.v}</strong> : x.t === 'em' ? <em key={i}>{x.v}</em> : <Fragment key={i}>{x.v}</Fragment>;
        const c = getCard(x.id);
        // A planned card (not written yet; content:check warns) shows as plain words, with no tap target.
        if (!c) return <Fragment key={i}>{x.label ?? x.id}</Fragment>;
        return <CardLink key={i} card={c} section={x.section} label={x.label ?? c.title} />;
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
      <LinePill ids={it.sources} quote={it.inlines} />
      {it.children.length > 0 && <ul>{it.children.map((c, i) => <Item key={i} it={c} />)}</ul>}
    </li>
  );
}

// A card's pathways, one row each, under the card's title and on its Rapids page.
export function PathwayRows({ cardId }: { cardId: string }) {
  const list = pathwaysFor(cardId);
  if (!list.length) return null;
  return (
    <AKG.List className="pathway-row">
      {list.map((h) => (
        <AKG.ListRow
          key={h.id}
          overline="Pathway"
          title={h.title}
          subtitle={h.summary}
          icon={icons.flowchart}
          iconTint="var(--accent)"
          buttonLabel="Open"
          href={href.pathway(h.id)}
        />
      ))}
    </AKG.List>
  );
}

// ---- Blocks ----

// Pathway links land on a subheading or numbered step inside a section: each gets an id from its section and words.
const AnchorCtx = createContext<string | undefined>(undefined);
export function AnchorScope({ section, children }: { section: string; children: ReactNode }) {
  return <AnchorCtx.Provider value={section}>{children}</AnchorCtx.Provider>;
}
const useAnchor = (words: string) => { const sec = useContext(AnchorCtx); return sec ? `a-${sec}-${slug(words)}` : undefined; };
function Subheading({ text }: { text: string }) {
  return <h3 id={useAnchor(text)} className="ios-headline subheading">{text}</h3>;
}
// Numbers for a list of steps: an alternative to the step above ("or. Title") reads "or" and doesn't use up a number,
// so "3. Insulin, DKA" / "or. Insulin, HHS" / "4. Dextrose" shows 3, or, 4.
export function stepNumbers(items: { alt?: boolean }[]): (number | 'or')[] {
  let n = 0;
  return items.map((it, i) => (it.alt && i > 0 ? 'or' : ++n));
}
// StepList numbers its children by cloning them with `number`; here the numbers are given (see stepNumbers).
function StepItem({ it, number }: { it: { inlines: Inline[]; sources: string[]; blocks: Block[]; alt?: boolean }; number?: number | 'or' }) {
  return <AKG.Step id={useAnchor(plainText(it.inlines))} number={number as number} className={number === 'or' ? 'step-alt' : undefined} title={<><Inlines xs={it.inlines} /><LinePill ids={it.sources} quote={it.inlines} /></>}><div className="step-body"><Blocks blocks={it.blocks} /></div></AKG.Step>;
}

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
  if (t === 'note') {
    return (
      <AKG.Panel tone="note" label="Note">
        {items.map((it, i) => <p key={i} className="ios-body"><Inlines xs={it.inlines} /><LinePill ids={it.sources.length ? it.sources : b.sources} quote={it.inlines} /></p>)}
      </AKG.Panel>
    );
  }
  const title = hasText(b.title) ? <Inlines xs={b.title} /> : undefined;
  if (t === 'scale') {
    return (
      <div className="scale-block">
        {title && <p className="ios-subheadline-emphasized">{title}</p>}
        <AKG.GradeList
          layout="bands"
          rows={items.map((it: ContainerItem, i) => ({ key: i, grade: <Inlines xs={it.label} />, values: [{ label: '', value: <><Inlines xs={it.inlines} plain /><LinePill ids={it.sources.length ? it.sources : b.sources} quote={it.text} /></> }] }))}
        />
      </div>
    );
  }
  if (t === 'compare') {
    return <AKG.ComparisonGrid title={title} columns={items.map((it) => ({ label: <Inlines xs={it.label} />, content: <><Inlines xs={it.inlines} /><LinePill ids={it.sources.length ? it.sources : b.sources} quote={it.text} /></> }))} />;
  }
  return <AKG.TimePoints label={title && <>{title}<LinePill ids={b.sources} quote={b.title} /></>} items={items.map((it, i) => <Fragment key={i}>{it.text}</Fragment>)} />;
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
  if (b.t === 'paragraph') return <p className="ios-body"><Inlines xs={b.inlines} /><LinePill ids={b.sources} quote={b.inlines} /></p>;
  if (b.t === 'list') return <ul className="ios-body rich-list">{b.items.map((it, j) => <Item key={j} it={it} />)}</ul>;
  if (b.t === 'subheading') return <Subheading text={b.text} />;
  if (b.t === 'steps') {
    return (
      <div className="steps-bleed">
        <AKG.StepList density="compact" strong>
          {b.items.map((it, j) => <StepItem key={j} it={it} number={stepNumbers(b.items)[j]} />)}
        </AKG.StepList>
      </div>
    );
  }
  if (b.t === 'insert') {
    if (b.kind === 'criteria') return <CriteriaBlock id={b.id} />;
    if (b.kind === 'regimen') return <RegimenBlock id={b.id} />;
    if (b.kind === 'coverage') return <CoverageBlock id={b.id} />;
    if (b.kind === 'media') return <MediaFigure id={b.id} pill={(ids, quote) => <LinePill ids={ids} quote={quote} />} />;
    return <p className="ios-body"><Insert kind={b.kind} id={b.id} /></p>;
  }
  if (b.t !== 'table') return <Container b={b as ContainerBlock} />;
  return (
    // The first column stays in place while a wide table scrolls sideways (audit 2026-10-17). Tables are gray, with
    // their word label (owner, 2026-10-19); a row's pill ends its last cell.
    <AKG.Table
      stickyFirstColumn
      shadedHeader
      label="Table"
      columns={b.header.map((h, j) => <Inlines key={j} xs={h} />)}
      rows={b.rows.map((r, k) => ({
        key: k,
        cells: r.cells.map((c, j) => <Fragment key={j}><Inlines xs={c} plain />{j === r.cells.length - 1 && <LinePill ids={r.sources} quote={r.cells.map((x) => plainText(x)).filter(Boolean).join(': ')} />}</Fragment>),
      }))}
    />
  );
}

export type { ReactNode };
