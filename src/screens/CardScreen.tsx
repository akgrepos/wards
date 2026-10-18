import { useEffect, useRef, useState } from 'react';
import { AKG } from '../design/akg';
import { cardSources, cardTypeLabel, content, getCard, getSystem, titleCase } from '../content';
import type { Source } from '../content/types';
import { forgetSection, href } from '../router';
import { addRecent, getFavorites, setReading, toggleFavorite, useStored } from '../storage';
import { Blocks, Pill, RichText, SourceList } from '../ui/Rich';
import { useSheet } from '../ui/SheetHost';
import { icons } from '../ui/icons';
import { Screen } from './common';
import { NotFoundScreen } from './Tabs';

const RELATED: [string, string][] = [['differential', 'Differential'], ['conditions', 'Conditions'], ['tools', 'Tools'], ['medications', 'Medications']];

export function CardScreen({ id, section }: { id: string; section?: string }) {
  const card = getCard(id);
  const favorite = useStored(getFavorites).includes(id);
  const sheet = useSheet();
  const [current, setCurrent] = useState<string | undefined>(undefined);
  // Collapsible sections that are open. Jumping to a collapsed section from the section bar opens it.
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sections = card?.sections ?? [];
  const setOpen = (key: string, on: boolean) => setOpened((o) => { const n = new Set(o); if (on) n.add(key); else n.delete(key); return n; });
  const jump = (id: string) => {
    const s = sections.find((x) => `sec-${x.key}` === id);
    if (s?.collapsed) setOpen(s.key, true);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  // Opened at a section (Continue Reading, a pathway): open it if collapsed and scroll to it, once.
  useEffect(() => {
    if (!card) return;
    addRecent(id);
    const s = section && sections.find((x) => x.key === section);
    if (!s) return;
    forgetSection(id);
    if (s.collapsed) setOpen(s.key, true);
    let tries = 0;
    const go = () => {
      const el = document.getElementById(`sec-${s.key}`);
      if (el) el.scrollIntoView({ block: 'start' });
      else if (tries++ < 20) setTimeout(go, 50);
    };
    setTimeout(go, 60);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Topics remember the section on screen, for Continue Reading on Home.
  useEffect(() => {
    if (card && card.system !== 'library' && current) setReading(id, current.replace(/^sec-/, ''));
  }, [id, current]); // eslint-disable-line react-hooks/exhaustive-deps

  // Highlight the section being read in the jump bar: the last one whose heading has reached the bar.
  useEffect(() => {
    const update = () => {
      const els = sections.map((s) => document.getElementById(`sec-${s.key}`)).filter(Boolean) as HTMLElement[];
      const line = (els[0] ? parseFloat(getComputedStyle(els[0]).scrollMarginTop) : 110) + 8;
      let cur: string | undefined;
      for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el.id;
      setCurrent(cur ?? els[0]?.id);
    };
    update();
    addEventListener('scroll', update, { passive: true });
    return () => removeEventListener('scroll', update);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!card) return <NotFoundScreen />;
  const system = getSystem(card.system);
  const sources = cardSources(card);
  const related = RELATED.filter(([k]) => (card.related?.[k] ?? []).length > 0);

  return (
    <Screen
      title={card.title}
      titleRef={titleRef}
      back={{ label: system?.title ?? 'Topics', fallback: href.system(card.system) }}
      trailing={
        <AKG.ToolbarButton
          icon={favorite ? icons.starFill : icons.star}
          aria-label={favorite ? 'Remove from Favorites' : 'Add to Favorites'}
          aria-pressed={favorite}
          onClick={() => toggleFavorite(id)}
        />
      }
      head={
        <header className="card-head">
          <p className="ios-subheadline-emphasized secondary">{cardTypeLabel(card)} · {system?.title}</p>
          <h1 ref={titleRef} className="ios-title-1-emphasized">{card.title}</h1>
          {card.example && <AKG.Callout variant="info">Development sample with placeholder content. Not shown in the published app.</AKG.Callout>}
        </header>
      }
    >
      {sections.length > 2 && (
        <div className="section-bar-wrap">
          <AKG.SectionBar items={sections.map((s) => ({ id: `sec-${s.key}`, label: titleCase(s.title) }))} value={current} onSelect={jump} />
        </div>
      )}
      {sections.map((s) => (
        <AKG.ContentSection
          key={s.key}
          id={`sec-${s.key}`}
          title={titleCase(s.title)}
          collapsible={s.collapsed}
          expanded={s.collapsed ? opened.has(s.key) : undefined}
          onExpandedChange={(on: boolean) => setOpen(s.key, on)}
          summary={s.summary ? <><RichText text={s.summary} /><Pill ids={s.summarySources} /></> : undefined}
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
