import { useEffect, useState } from 'react';
import { AKG } from '../design/akg';
import { cardSources, cardTypeLabel, content, getCard, getSystem, titleCase } from '../content';
import type { Source } from '../content/types';
import { href } from '../router';
import { Blocks, SourceList } from '../ui/Rich';
import { useSheet } from '../ui/SheetHost';
import { NotFound } from './SystemScreen';
import { Screen } from './common';

const RELATED: [string, string][] = [['differential', 'Differential'], ['conditions', 'Conditions'], ['tools', 'Tools'], ['medications', 'Medications']];

export function CardScreen({ id }: { id: string }) {
  const card = getCard(id);
  const sheet = useSheet();
  const [current, setCurrent] = useState<string | undefined>(undefined);
  const sections = card?.sections ?? [];

  // Highlight the section in view in the jump bar.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(`sec-${s.key}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setCurrent(vis.target.id);
    }, { rootMargin: '-120px 0px -60% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!card) return <NotFound />;
  const system = getSystem(card.system);
  const sources = cardSources(card);
  const related = RELATED.filter(([k]) => (card.related?.[k] ?? []).length > 0);

  return (
    <Screen title={card.title} back={{ label: system?.title ?? 'Wards', fallback: href.system(card.system) }}>
      <header className="card-head">
        <p className="ios-subheadline-emphasized secondary">{cardTypeLabel(card)} · {system?.title}</p>
        <h1 className="ios-title-1-emphasized">{card.title}</h1>
        {card.example && <AKG.Callout variant="info">Development sample with placeholder content. Not shown in the published app.</AKG.Callout>}
      </header>
      {sections.length > 2 && (
        <div className="section-bar-wrap">
          <AKG.SectionBar items={sections.map((s) => ({ id: `sec-${s.key}`, label: titleCase(s.title) }))} value={current} />
        </div>
      )}
      {sections.map((s) => (
        <AKG.ContentSection
          key={s.key}
          id={`sec-${s.key}`}
          title={titleCase(s.title)}
          collapsible={s.collapsed}
          summary={s.summary ?? undefined}
          more={s.more.length ? <Blocks blocks={s.more} /> : undefined}
          moreLabel={s.moreTitle ? titleCase(s.moreTitle.replace(/^more\s*/i, 'Show ').trim() || 'Show More Detail') : undefined}
        >
          <Blocks blocks={s.blocks} />
        </AKG.ContentSection>
      ))}
      {related.length > 0 && (
        <AKG.ContentSection id="sec-related" title="Related Cards">
          {related.map(([k, label]) => (
            <AKG.List key={k} header={label}>
              {card.related[k].map((rid) => <AKG.ListRow key={rid} title={getCard(rid)?.title ?? rid} chevron href={href.card(rid)} />)}
            </AKG.List>
          ))}
        </AKG.ContentSection>
      )}
      {sources.length > 0 && (
        <AKG.ContentSection id="sec-sources" title="Sources">
          <AKG.List>
            {sources.map((sid, i) => {
              const s = content.data.source?.[sid] as Source | undefined;
              return <AKG.ListRow key={sid} title={`${i + 1}. ${s?.society ? `${s.society} ${s.year}` : s?.short ?? sid}`} subtitle={s?.title} chevron onClick={() => sheet({ title: 'Source', body: <SourceList ids={[sid]} /> })} />;
            })}
          </AKG.List>
        </AKG.ContentSection>
      )}
    </Screen>
  );
}
