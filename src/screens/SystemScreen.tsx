import { AKG } from '../design/akg';
import { cardsInSystem, cardTypeLabel, getSystem } from '../content';
import { href } from '../router';
import { Screen } from './common';

const GROUPS: [string, string][] = [['approach', 'Approach'], ['condition', 'Conditions'], ['reference', 'Reference']];

export function SystemScreen({ id }: { id: string }) {
  const system = getSystem(id);
  if (!system) return <NotFound />;
  const cards = cardsInSystem(id);
  return (
    <Screen title={system.title} back={{ label: 'Wards', fallback: href.home() }}>
      <h1 className="ios-large-title-emphasized page-title">{system.title}</h1>
      {cards.length === 0 ? (
        <div className="empty"><AKG.EmptyState title="No Cards Yet" description="Cards for this section will appear here once they’re added." /></div>
      ) : (
        GROUPS.map(([g, label]) => {
          const list = cards.filter((c) => c.group === g);
          if (!list.length) return null;
          return (
            <AKG.List key={g} header={label}>
              {list.map((c) => (
                <AKG.ListRow key={c.id} title={c.title} subtitle={g === 'reference' ? cardTypeLabel(c) : undefined} chevron href={href.card(c.id)} />
              ))}
            </AKG.List>
          );
        })
      )}
    </Screen>
  );
}

export function NotFound() {
  return (
    <Screen title="Not Found" back={{ label: 'Wards', fallback: href.home() }}>
      <div className="empty"><AKG.EmptyState title="Page Not Found" description="This card may have moved or been renamed." /></div>
    </Screen>
  );
}
