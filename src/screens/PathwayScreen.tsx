import { content, titleCase } from '../content';
import type { Pathway } from '../content/types';
import { href } from '../router';
import { Screen } from './common';
import { NotFoundScreen } from './Tabs';

// A pathway's own page (owner, 2026-10-19: pathways leave their cards and become pages). The pages will be designed
// from scratch; until then this is an empty page with the pathway's title, as the owner asked.
export function PathwayScreen({ id }: { id: string }) {
  const p = content.data.pathway?.[id] as Pathway | undefined;
  if (!p) return <NotFoundScreen />;
  return (
    <Screen title={titleCase(p.title ?? 'Pathway')} back={{ label: 'Pathways', fallback: href.libraryList('pathways') }}>
      {null}
    </Screen>
  );
}
