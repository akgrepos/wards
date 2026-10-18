import { AKG } from '../design/akg';
import { cardTypeLabel, getSystem, systemGroups } from '../content';
import { href } from '../router';
import { Empty, Screen } from './common';
import { NotFoundScreen } from './Tabs';

export function SystemScreen({ id }: { id: string }) {
  const system = getSystem(id);
  if (!system) return <NotFoundScreen />;
  const groups = systemGroups(id);
  const library = !!system.library;
  return (
    <Screen title={system.title} back={library ? { label: 'Library', fallback: href.library() } : { label: 'Topics', fallback: href.topics() }}>
      {groups.length === 0 ? (
        <Empty title="No Topics Yet" description="Topics for this system will appear here once they’re added." />
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
