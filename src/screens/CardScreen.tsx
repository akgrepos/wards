import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AKG } from '../design/akg';
import { blockSources, cardSources, cardTypeLabel, content, getCard, getSystem, titleCase } from '../content';
import type { Card, Source } from '../content/types';
import { forgetSection, href, isReturning, parseRoute, restoreScroll } from '../router';
import { addRecent, getCardScroll, getFavorites, setCardScroll, setReading, toggleFavorite, useStored } from '../storage';
import { Blocks, Inlines, JUMP_EVENT, SectionSources, SourceList } from '../ui/Rich';
import { useSheet } from '../ui/SheetHost';
import { icons } from '../ui/icons';
import { Screen } from './common';
import { NotFoundScreen } from './Tabs';

const RELATED: [string, string][] = [['differential', 'Differential'], ['conditions', 'Conditions'], ['tools', 'Tools'], ['medications', 'Medications']];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const reviewedLabel = (d: string) => `Reviewed ${MONTHS[Number(d.slice(5, 7)) - 1]} ${d.slice(0, 4)}`;

// Each More Information subsection is remembered under its own name.
const subKey = (key: string) => `more:${key}`;

// What the Contents menu lists, in page order: the card's sections, then Related and Sources when the page has them.
export function pageEntries(card: Card): { key: string; title: string }[] {
  const out = card.sections.map((s) => ({ key: s.key, title: titleCase(s.title) }));
  if (RELATED.some(([k]) => (card.related?.[k] ?? []).length)) out.push({ key: 'related', title: 'Related' });
  if (cardSources(card).length) out.push({ key: 'sources', title: 'Sources' });
  return out;
}

export function CardScreen({ id, section }: { id: string; section?: string }) {
  const card = getCard(id);
  const favorite = useStored(getFavorites).includes(id);
  const sheet = useSheet();
  // Which sections are open, kept on this phone per page (all open at first; More Information's subsections closed).
  const state = AKG.useSectionState(card ? `card:${id}` : null);
  const [current, setCurrent] = useState<string | undefined>(undefined);
  const [menu, setMenu] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const sections = card?.sections ?? [];
  const entries = card ? pageEntries(card) : [];
  const collapsible = sections.map((s) => s.key);
  const subs = sections.flatMap((s) => s.subsections.map((x) => subKey(x.key)));
  const anyOpen = collapsible.some((k) => state.isOpen(k, true)) || subs.some((k) => state.isOpen(k, false));

  const pending = useRef<{ el: string; smooth: boolean } | null>(null);
  const scrollToPending = () => {
    const p = pending.current;
    const node = p && document.getElementById(p.el);
    if (!p || !node || node.offsetParent === null) return false;
    node.scrollIntoView({ behavior: p.smooth ? 'smooth' : 'auto', block: 'start' });
    pending.current = null;
    return true;
  };
  // After a render that opened the target's section, scroll before the browser paints.
  useLayoutEffect(() => { scrollToPending(); });

  // Open whatever holds a section or subsection, then scroll to it.
  const jump = (target: string, smooth = true) => {
    let el = `sec-${target}`;
    const top = sections.find((s) => s.key === target);
    const parent = sections.find((s) => s.subsections.some((x) => x.key === target));
    if (top && !state.isOpen(top.key, true)) state.setOpen(top.key, true);
    if (parent) { state.setAll([parent.key, subKey(target)], true); el = `sub-${target}`; }
    if (!top && !parent && target !== 'related' && target !== 'sources') return false;
    // Scroll as soon as the target is laid out and visible: before the next paint when possible (the layout effect
    // below), so a page opened at a section never shows its top first; otherwise on the next frames.
    pending.current = { el, smooth };
    let tries = 0;
    const go = () => {
      if (pending.current?.el !== el) return;
      if (!scrollToPending() && tries++ < 20) setTimeout(go, 50);
    };
    if (!scrollToPending()) requestAnimationFrame(go);
    return true;
  };

  // Opened at a section (#/card/<id>/<section>: Continue Reading, a pathway, a link): jump there, once, before the
  // first paint (no flash of the page's top). Otherwise a page opened anew returns to where it was last read; Back and
  // Forward restore their own place.
  useLayoutEffect(() => {
    if (!card) return;
    addRecent(id);
    if (section) {
      forgetSection(id);
      jump(section, false);
      return;
    }
    const y = getCardScroll(id);
    // Try now, before the first paint; keep trying while a long page finishes laying out.
    if (!isReturning() && y) { scrollTo(0, y); if (Math.abs(scrollY - y) > 2) restoreScroll(y); }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // A link to a section of this page (e.g. "the first-line tests in Diagnosis") scrolls there.
  useEffect(() => {
    const on = (e: Event) => jump((e as CustomEvent<string>).detail);
    addEventListener(JUMP_EVENT, on);
    return () => removeEventListener(JUMP_EVENT, on);
  });

  // Remember where the page is scrolled to (after it has settled, and only while this page is the one on screen).
  useEffect(() => {
    if (!card) return;
    let ready = false;
    let timer = 0;
    const settle = window.setTimeout(() => { ready = true; }, 800);
    const onScroll = () => {
      if (!ready || timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        const r = parseRoute(location.hash);
        if (r.name === 'card' && r.id === id) setCardScroll(id, scrollY);
      }, 250);
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(settle); clearTimeout(timer); removeEventListener('scroll', onScroll); };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Topics remember the section on screen, for Continue Reading on Home.
  useEffect(() => {
    // Past the last section (Related, Sources), the reader is at the end of the last one.
    const at = current === 'related' || current === 'sources' ? sections[sections.length - 1]?.key : current;
    if (card && card.system !== 'library' && at) setReading(id, at);
  }, [id, current]); // eslint-disable-line react-hooks/exhaustive-deps

  // The section being read (checked in the Contents menu): the last one whose heading has reached the top bar.
  useEffect(() => {
    const update = () => {
      const els = entries.map((e) => document.getElementById(`sec-${e.key}`)).filter(Boolean) as HTMLElement[];
      const line = (els[0] ? parseFloat(getComputedStyle(els[0]).scrollMarginTop) || 62 : 62) + 8;
      let cur: string | undefined;
      for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el.id;
      setCurrent((cur ?? els[0]?.id)?.replace(/^sec-/, ''));
    };
    update();
    addEventListener('scroll', update, { passive: true });
    return () => removeEventListener('scroll', update);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // The Contents menu takes focus when it opens and gives it back to its button when it closes.
  const closeMenu = () => { setMenu(false); document.getElementById('contents-button')?.focus(); };
  AKG.useEscape(menu, closeMenu);
  useEffect(() => { if (menu) menuRef.current?.querySelector<HTMLElement>('.akg-menu')?.focus(); }, [menu]);

  if (!card) return <NotFoundScreen />;
  const system = getSystem(card.system);
  const sources = cardSources(card);
  const related = RELATED.filter(([k]) => (card.related?.[k] ?? []).length > 0);

  const menuItems = [
    ...entries.map((e) => ({ label: e.title, checked: current === e.key, onSelect: () => { setMenu(false); jump(e.key); } })),
    { type: 'separator' as const },
    anyOpen
      ? { label: 'Collapse All', icon: icons.chevronUpChevronDown, onSelect: () => { setMenu(false); state.setAll([...collapsible, ...subs], false); } }
      : { label: 'Expand All', icon: icons.chevronUpChevronDown, onSelect: () => { setMenu(false); state.setAll(collapsible, true); } },
  ];

  return (
    <Screen
      title={card.title}
      titleRef={titleRef}
      back={{ label: system?.title ?? 'Topics', fallback: href.system(card.system) }}
      trailing={
        <AKG.ToolbarGroup>
          <AKG.ToolbarButton
            id="contents-button"
            icon={icons.listBullet}
            aria-label="Contents"
            aria-haspopup="menu"
            aria-expanded={menu}
            onClick={() => (menu ? closeMenu() : setMenu(true))}
          />
          <AKG.ToolbarButton
            icon={favorite ? icons.starFill : icons.star}
            aria-label={favorite ? 'Remove from Favorites' : 'Add to Favorites'}
            aria-pressed={favorite}
            onClick={() => toggleFavorite(id)}
          />
          {/* Phase 4: a bolt button here opens the topic's emergency pop-up, shown only when the topic has one. */}
        </AKG.ToolbarGroup>
      }
      head={
        <header className="card-head">
          <div className="card-tags">
            <AKG.Tag>{cardTypeLabel(card)}</AKG.Tag>
            {system && <AKG.Tag>{system.title}</AKG.Tag>}
          </div>
          <h1 ref={titleRef} className="ios-large-title-emphasized">{card.title}</h1>
          {card.definition && <p className="ios-callout secondary"><Inlines xs={card.definition.inlines} /></p>}
          {/* No "Based on" line (owner, 2026-10-18): each section's source line and All Sources name the guidelines. */}
          {card.reviewed && <p className="ios-caption-1 secondary">{reviewedLabel(card.reviewed)}</p>}
          {card.example && <AKG.Callout variant="info">Development sample with placeholder content. Not shown in the published app.</AKG.Callout>}
        </header>
      }
    >
      {menu && (
        <div className="contents-layer" onClick={closeMenu}>
          <div className="contents-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <AKG.Menu aria-label="Contents" items={menuItems} onClose={closeMenu} />
          </div>
        </div>
      )}
      {sections.map((s) =>
        s.key === 'more' ? (
          <AKG.ContentSection
            key={s.key}
            id="sec-more"
            variant="card"
            inset={false}
            title={titleCase(s.title)}
            collapsible
            expanded={state.isOpen(s.key, true)}
            onExpandedChange={(on: boolean) => state.setOpen(s.key, on)}
          >
            <div className="more-list">
              {s.subsections.map((x) => (
                <AKG.ContentSection
                  key={x.key}
                  id={`sub-${x.key}`}
                  className="more-item"
                  title={x.title}
                  summary={x.description ?? undefined}
                  collapsible
                  expanded={state.isOpen(subKey(x.key), false)}
                  onExpandedChange={(on: boolean) => state.setOpen(subKey(x.key), on)}
                >
                  <Blocks blocks={x.blocks} />
                  <SectionSources ids={blockSources(x.blocks)} forLabel={x.title} />
                </AKG.ContentSection>
              ))}
            </div>
          </AKG.ContentSection>
        ) : (
          <AKG.ContentSection
            key={s.key}
            id={`sec-${s.key}`}
            variant="card"
            title={titleCase(s.title)}
            collapsible
            expanded={state.isOpen(s.key, true)}
            onExpandedChange={(on: boolean) => state.setOpen(s.key, on)}
            footer={blockSources(s.blocks).length ? <SectionSources ids={blockSources(s.blocks)} forLabel={titleCase(s.title)} /> : undefined}
          >
            <Blocks blocks={s.blocks} />
          </AKG.ContentSection>
        ),
      )}
      {related.length > 0 && (
        <AKG.ContentSection id="sec-related" title="Related">
          {related.map(([k, label]) => (
            <AKG.List key={k} header={related.length > 1 ? label : undefined}>
              {card.related[k].map((rid) => <AKG.ListRow key={rid} title={getCard(rid)?.title ?? rid} chevron href={href.card(rid)} />)}
            </AKG.List>
          ))}
        </AKG.ContentSection>
      )}
      {sources.length > 0 && (
        <AKG.ContentSection id="sec-sources" title="Sources">
          <AKG.List>
            <AKG.ListRow
              title="All Sources"
              detail={String(sources.length)}
              chevron
              onClick={() => sheet({ title: 'Sources', heading: card.title, body: <AllSources ids={sources} /> })}
            />
          </AKG.List>
        </AKG.ContentSection>
      )}
    </Screen>
  );
}

// Every source on the page, numbered in order of first use.
function AllSources({ ids }: { ids: string[] }) {
  return (
    <ol className="all-sources">
      {ids.map((sid) => (content.data.source?.[sid] as Source | undefined) && <li key={sid}><SourceList ids={[sid]} /></li>)}
    </ol>
  );
}
