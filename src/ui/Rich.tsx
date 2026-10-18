import { Fragment, type ReactNode } from 'react';
import { AKG } from '../design/akg';
import { content, getCard, insertSources } from '../content';
import type { Block, Dose, Inline, ListItem, Pathway, Source, Threshold } from '../content/types';
import { parseInline } from '../../scripts/content/inline.mjs';
import { href } from '../router';
import { useSheet } from './SheetHost';

const src = (id: string) => content.data.source?.[id] as Source | undefined;

export function SourceList({ ids }: { ids: string[] }) {
  return (
    <div className="source-list">
      {ids.map((id) => {
        const s = src(id);
        if (!s) return null;
        return (
          <div key={id} className="source-item">
            <p className="ios-headline">{s.society ? `${s.society} ${s.year}` : `${s.short}`}</p>
            <p className="ios-subheadline secondary">{s.citation ?? s.title}</p>
            {s.url && <a className="ios-subheadline accent-link" href={s.url} target="_blank" rel="noreferrer">Open Source</a>}
          </div>
        );
      })}
    </div>
  );
}

// The grey pill at the end of a sourced line.
export function Pill({ ids }: { ids: string[] }) {
  const sheet = useSheet();
  if (!ids.length) return null;
  const first = src(ids[0]);
  return (
    <AKG.SourcePill
      label={first?.short ?? ids[0]}
      more={ids.length > 1 ? ids.length - 1 : undefined}
      onClick={() => sheet({ title: ids.length > 1 ? 'Sources' : 'Source', body: <SourceList ids={ids} /> })}
    />
  );
}

export function doseLine(d: Dose) {
  return `${d.drug_name} ${d.amount} ${d.unit} ${d.route} ${d.frequency}`;
}

function DoseDetail({ d }: { d: Dose }) {
  return (
    <div className="detail-sheet">
      <p className="ios-title-3-emphasized">{doseLine(d)}</p>
      {d.brand && <p className="ios-subheadline secondary">{d.drug_name} ({d.brand})</p>}
      <AKG.List>
        <AKG.ListRow title="Indication" subtitle={d.indication} />
        {d.population && <AKG.ListRow title="Population" subtitle={d.population} />}
        {d.duration && <AKG.ListRow title="Duration" subtitle={d.duration} />}
        {d.max && <AKG.ListRow title="Maximum" subtitle={d.max} />}
      </AKG.List>
      {d.adjustments?.length ? (
        <AKG.List header="Adjustments">
          {d.adjustments.map((a, i) => <AKG.ListRow key={i} title={a.when} subtitle={a.change} />)}
        </AKG.List>
      ) : null}
      {d.notes && <p className="ios-body">{d.notes}</p>}
      {d.drug && getCard(d.drug) && <a className="ios-body accent-link" href={href.card(d.drug)}>Open {getCard(d.drug)!.title}</a>}
      <p className="ios-footnote-emphasized secondary">Sources</p>
      <SourceList ids={d.sources} />
    </div>
  );
}

function Insert({ kind, id }: { kind: string; id: string }) {
  const sheet = useSheet();
  const item = content.data[kind]?.[id];
  if (!item) return <span className="missing">[missing {kind}: {id}]</span>;
  if (kind === 'dose') {
    const d = item as unknown as Dose;
    return <AKG.TappableValue onClick={() => sheet({ title: 'Dose', body: <DoseDetail d={d} /> })}>{doseLine(d)}</AKG.TappableValue>;
  }
  if (kind === 'threshold') {
    const t = item as unknown as Threshold;
    return (
      <AKG.TappableValue onClick={() => sheet({ title: t.name, body: <div className="detail-sheet"><p className="ios-title-3-emphasized">{t.value} {t.unit}</p><p className="ios-body">{t.meaning}</p><p className="ios-footnote-emphasized secondary">Sources</p><SourceList ids={t.sources} /></div> })}>
        {t.value} {t.unit}
      </AKG.TappableValue>
    );
  }
  return <span>{id}</span>;
}

export function Inlines({ xs }: { xs: Inline[] }) {
  return (
    <>
      {xs.map((x, i) => {
        if (x.t === 'insert') return <Insert key={i} kind={x.kind} id={x.id} />;
        if (x.t !== 'link') return x.t === 'strong' ? <strong key={i}>{x.v}</strong> : x.t === 'em' ? <em key={i}>{x.v}</em> : <Fragment key={i}>{x.v}</Fragment>;
        const c = getCard(x.id);
        return <a key={i} className="card-link" href={href.card(x.id)}>{x.label ?? c?.title ?? x.id}</a>;
      })}
    </>
  );
}

// Plain text with inserts and links (used inside flowcharts).
export const RichText = ({ text }: { text?: string }) => (text ? <Inlines xs={parseInline(text)} /> : null);

function Item({ it }: { it: ListItem }) {
  return (
    <li>
      <Inlines xs={it.inlines} />
      <Pill ids={it.sources} />
      {it.children.length > 0 && <ul>{it.children.map((c, i) => <Item key={i} it={c} />)}</ul>}
    </li>
  );
}

function PathwayBlock({ id }: { id: string }) {
  const p = content.data.pathway?.[id] as Pathway | undefined;
  if (!p) return null;
  const steps: Record<string, unknown> = {};
  for (const [sid, s] of Object.entries(p.steps)) {
    steps[sid] = {
      ...s,
      detail: s.detail ? <RichText text={s.detail} /> : undefined,
      answers: s.answers?.map((a) => ({ ...a, detail: a.detail ? <RichText text={a.detail} /> : undefined })),
      items: s.items?.map((t, i) => <RichText key={i} text={t} />),
      list: s.list?.map((t, i) => <RichText key={i} text={t} />),
      note: s.note ? <RichText text={s.note} /> : undefined,
      links: s.links?.length ? s.links.map((l) => <a key={l} className="ios-body accent-link" href={href.card(l)}>Open {getCard(l)?.title ?? l}</a>) : undefined,
    };
  }
  return (
    <div className="pathway">
      {p.title && <p className="ios-headline">{p.title} <Pill ids={p.sources} /></p>}
      <AKG.Flowchart steps={steps as never} start={p.start} stages={p.stages} />
    </div>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === 'paragraph') return <p key={i} className="ios-body"><Inlines xs={b.inlines} /><Pill ids={b.sources} /></p>;
        if (b.t === 'list') return <ul key={i} className="ios-body rich-list">{b.items.map((it, j) => <Item key={j} it={it} />)}</ul>;
        if (b.t === 'subheading') return <h3 key={i} className="ios-headline subheading">{b.text}</h3>;
        if (b.t === 'insert') {
          if (b.kind === 'pathway') return <PathwayBlock key={i} id={b.id} />;
          return <p key={i} className="ios-body"><Insert kind={b.kind} id={b.id} /><Pill ids={insertSources(b.kind, b.id)} /></p>;
        }
        return (
          <AKG.Table
            key={i}
            columns={b.header.map((h, j) => <Inlines key={j} xs={h} />)}
            rows={b.rows.map((r) => r.cells.map((c, k) => <><Inlines xs={c} />{k === r.cells.length - 1 && <Pill ids={r.sources} />}</>))}
          />
        );
      })}
    </>
  );
}

export type { ReactNode };
