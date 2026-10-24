// PROTOTYPE: three Search layouts, chosen with ?option=A|B|C in the address. Throwaway; never merged.
import { AKG } from '../design/akg';
import { cardTypeLabel, content, emergencyCards, getCard, getSystem, searchCards } from '../content';
import type { Card } from '../content/types';
import { href } from '../router';
import { getRecent, useStored } from '../storage';
import { iconFor, icons } from '../ui/icons';
import { Empty } from './common';

export const sketchOption = (): string | null => {
  const o = new URLSearchParams(window.location.search).get('option')?.toUpperCase();
  return o === 'A' || o === 'B' || o === 'C' ? o : null;
};

const NAMES: Record<string, [string, string]> = {
  A: ['Recents first', 'Last pages and a few suggested searches when empty; results grouped Rapids, Topics, Drugs.'],
  B: ['Browse shortcuts', 'Empty state is a launcher: tiles for Rapids, Drugs, Calculators, Library, then specialties.'],
  C: ['Grouped by kind', 'Typing shows a chip row to narrow (All, Rapids, Topics, Drugs); recents and suggestions below when empty.'],
};

const SUGGESTED = ['hyperK', 'AKI', 'DKA', 'sepsis', 'AFib'];
// PROTOTYPE: fake type test; real ranking would come from the search code.
const isDrug = (c: Card) => c.type === 'medication';
const isRapid = (c: Card) => !!c.emergency;

function Row({ c, q }: { c: Card; q: string }) {
  const ic = iconFor(c.system);
  return (
    <AKG.ListRow
      title={<AKG.Highlight text={c.title} query={q} />}
      subtitle={`${cardTypeLabel(c)} · ${getSystem(c.system)?.title ?? ''}`}
      icon={ic.icon} iconTint={ic.tint} chevron href={href.card(c.id)}
    />
  );
}

function Grouped({ q, only }: { q: string; only?: string }) {
  const all = searchCards(q);
  const groups = [
    { key: 'Rapids', cards: all.filter(isRapid) },
    { key: 'Topics', cards: all.filter((c) => !isDrug(c)) },
    { key: 'Drugs', cards: all.filter(isDrug) },
  ].filter((g) => g.cards.length && (!only || only === 'All' || only === g.key));
  if (!groups.length) return <Empty title="No Results" description={`No pages match “${q.trim()}”. Try a drug name, abbreviation or common term.`} />;
  return <>{groups.map((g) => <AKG.List key={g.key} header={g.key}>{g.cards.map((c) => <Row key={g.key + c.id} c={c} q={q} />)}</AKG.List>)}</>;
}

function Recents() {
  const recent = useStored(getRecent).filter((r) => getCard(r.id)).slice(0, 4);
  return (
    <AKG.List header="Recent">
      {recent.length === 0
        ? <AKG.ListRow title="Nothing Opened Yet" subtitle="The last pages you open appear here." />
        : recent.map((r) => <Row key={r.id} c={getCard(r.id)!} q="" />)}
    </AKG.List>
  );
}

function Suggested({ onPick }: { onPick: (s: string) => void }) {
  return (
    <AKG.List header="Suggested Searches">
      {SUGGESTED.map((s) => <AKG.ListRow key={s} title={s} icon={icons.arrowUpRight} chevron onClick={() => onPick(s)} />)}
    </AKG.List>
  );
}

function Tiles({ items }: { items: { title: string; icon: keyof typeof icons; tint: string; href: string }[] }) {
  return (
    <div className="home-grid">
      {items.map((t) => (
        <a key={t.title} className="home-cell" href={t.href}>
          <AKG.IconTile tint={t.tint}>{icons[t.icon]}</AKG.IconTile>
          <span className="home-cell__title ios-callout-emphasized">{t.title}</span>
        </a>
      ))}
    </div>
  );
}

const SHORTCUTS = [
  { title: 'Rapids', icon: 'staroflifeFill' as const, tint: 'var(--system-red)', href: href.emergencies() },
  { title: 'Drugs', icon: 'pills' as const, tint: 'var(--system-blue)', href: href.library() },
  { title: 'Calculators', icon: 'plusForwardslashMinus' as const, tint: 'var(--system-orange)', href: href.library() },
  { title: 'Library', icon: 'book' as const, tint: 'var(--system-gray)', href: href.library() },
];

export function SketchLabel({ opt }: { opt: string }) {
  return (
    <p className="ios-footnote secondary search-hint" data-prototype>
      <strong>Option {opt}: {NAMES[opt][0]}.</strong> {NAMES[opt][1]}
    </p>
  );
}

export function SketchBody({ opt, q, setQ, chip, setChip }: { opt: string; q: string; setQ: (s: string) => void; chip: string; setChip: (s: string) => void }) {
  const typing = !!q.trim();
  if (opt === 'A') {
    return typing ? <Grouped q={q} /> : <><Recents /><Suggested onPick={setQ} /></>;
  }
  if (opt === 'B') {
    if (typing) return <Grouped q={q} />;
    const specialties = content.systems.filter((s) => !s.library);
    return (
      <>
        <section className="home-section">
          <div className="akg-list__header akg-list__header--prominent"><h2 className="akg-list__header-title">Browse</h2></div>
          <Tiles items={SHORTCUTS} />
        </section>
        <AKG.List header="Rapids">
          {emergencyCards().slice(0, 4).map((c) => <Row key={c.id} c={c} q="" />)}
        </AKG.List>
        <AKG.List header="Specialties">
          {specialties.slice(0, 6).map((s) => <AKG.ListRow key={s.id} title={s.title} icon={iconFor(s.id).icon} iconTint={iconFor(s.id).tint} chevron href={href.system(s.id)} />)}
        </AKG.List>
      </>
    );
  }
  // C: chips narrow the results; empty state shows recents as plain rows plus suggested searches as buttons.
  const chips = ['All', 'Rapids', 'Topics', 'Drugs'];
  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--space-2)', padding: '0 var(--space-4) var(--space-3)', flexWrap: 'wrap' }}>
        {chips.map((c) => (
          <AKG.Button key={c} variant={chip === c ? 'prominent' : 'tinted'} onClick={() => setChip(c)}>{c}</AKG.Button>
        ))}
      </div>
      {typing ? <Grouped q={q} only={chip} /> : <><Recents /><Suggested onPick={setQ} /></>}
    </>
  );
}
