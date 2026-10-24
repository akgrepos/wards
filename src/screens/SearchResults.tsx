import { AKG } from '../design/akg';
import { cardTypeLabel, emergencyCards, getCard, getSystem, searchCards } from '../content';
import type { Card } from '../content/types';
import { href } from '../router';
import { getRecent, useStored } from '../storage';
import { iconFor } from '../ui/icons';
import { Empty } from './common';

const SUGGESTION_COUNT = 5;
const ACRONYM = /^[A-Za-z]{2,5}$/;

// Suggested searches come from the app's own Rapids pages: each one's capital-letter abbreviation (like AKI), else its title.
function suggestions(): string[] {
  const out: string[] = [];
  for (const c of emergencyCards()) {
    const short = c.aliases.find((a) => ACRONYM.test(a) && a === a.toUpperCase());
    const s = short ?? c.title;
    if (!out.includes(s)) out.push(s);
    if (out.length === SUGGESTION_COUNT) break;
  }
  return out;
}

function CardRow({ c, q }: { c: Card; q: string }) {
  const ic = iconFor(c.system);
  return (
    <AKG.ListRow
      title={<AKG.Highlight text={c.title} query={q} />}
      subtitle={`${cardTypeLabel(c)} · ${getSystem(c.system)?.title ?? ''}`}
      icon={ic.icon}
      iconTint={ic.tint}
      chevron
      href={href.card(c.id)}
    />
  );
}

// Results grouped Rapids (has an emergency page), Topics (everything else), Drugs (medication cards).
// A page with an emergency page appears under Rapids only; empty groups are hidden.
export function SearchResults({ q }: { q: string }) {
  const all = searchCards(q);
  const groups = [
    { title: 'Rapids', cards: all.filter((c) => c.emergency) },
    { title: 'Topics', cards: all.filter((c) => !c.emergency && c.type !== 'medication') },
    { title: 'Drugs', cards: all.filter((c) => !c.emergency && c.type === 'medication') },
  ].filter((g) => g.cards.length);
  if (!groups.length) {
    return <Empty title="No Results" description={`No pages match “${q.trim()}”. Check the spelling or try another term.`} />;
  }
  return (
    <>
      {groups.map((g) => (
        <AKG.List key={g.title} header={g.title}>
          {g.cards.map((c) => <CardRow key={c.id} c={c} q={q} />)}
        </AKG.List>
      ))}
    </>
  );
}

// Nothing typed yet: the last pages opened, then a few suggested searches that fill the field.
export function SearchStart({ onPick }: { onPick: (s: string) => void }) {
  const recent = useStored(getRecent).map((r) => getCard(r.id)).filter((c): c is Card => !!c);
  return (
    <>
      <AKG.List header="Recent">
        {recent.length === 0
          ? <AKG.ListRow title="Nothing Opened Yet" subtitle="The last pages you open appear here." />
          : recent.map((c) => <CardRow key={c.id} c={c} q="" />)}
      </AKG.List>
      <AKG.List header="Suggested Searches">
        {suggestions().map((s) => (
          <AKG.ListRow key={s} title={s} onClick={() => onPick(s)} />
        ))}
      </AKG.List>
    </>
  );
}
