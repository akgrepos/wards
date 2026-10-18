import { AKG } from '../design/akg';
import { cardTypeLabel, getSystem, systemGroups } from '../content';
import { href } from '../router';
import { Screen } from './common';

export function SystemScreen({ id }: { id: string }) {
  const system = getSystem(id);
  if (!system) return <NotFound />;
  const groups = systemGroups(id);
  return (
    <Screen title={system.title} back={{ label: 'Wards', fallback: href.home() }}>
      {groups.length === 0 ? (
        <div className="empty"><AKG.EmptyState title="No Cards Yet" description="Cards for this section will appear here once they’re added." /></div>
      ) : (
        groups.map((g) => (
          <AKG.List key={g.title} header={g.title}>
            {g.cards.map((c) => (
              <AKG.ListRow key={c.id} title={c.title} subtitle={g.title === 'Reference' ? cardTypeLabel(c) : undefined} chevron href={href.card(c.id)} />
            ))}
          </AKG.List>
        ))
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
