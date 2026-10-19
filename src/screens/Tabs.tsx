import { useState, type ReactNode } from 'react';
import { AKG } from '../design/akg';
import { cardTypeLabel, cardsInSystem, content, getCard, pathwayHomes } from '../content';
import type { Card, Criteria } from '../content/types';
import { href, switchTab } from '../router';
import { INTERACTION_CHECKER, openCriteria } from '../ui/Rich';
import { useSheet } from '../ui/SheetHost';
import { iconFor, icons } from '../ui/icons';
import { Empty, Screen } from './common';

// Topics tab: the systems. Systems with topics come first; the rest show as "Coming Soon" until written.
const SOON_SHOWN = 3;
export function TopicsTab() {
  const [all, setAll] = useState(false);
  const systems = content.systems.filter((s) => !s.library);
  const count = (id: string) => cardsInSystem(id).length;
  const ready = systems.filter((s) => count(s.id) > 0);
  const soon = systems.filter((s) => count(s.id) === 0);
  const shown = all ? soon : soon.slice(0, SOON_SHOWN);
  return (
    <Screen title="Topics">
      <AKG.List header="Systems">
        {ready.map((s) => (
          <AKG.ListRow key={s.id} title={s.title} icon={iconFor(s.id).icon} iconTint={iconFor(s.id).tint} subtitle={count(s.id) === 1 ? '1 topic' : `${count(s.id)} topics`} chevron href={href.system(s.id)} />
        ))}
        {shown.map((s) => (
          <AKG.ListRow key={s.id} className="soon" title={s.title} icon={iconFor(s.id).icon} iconTint={iconFor(s.id).tint} detail="Coming Soon" disabled />
        ))}
        {soon.length > SOON_SHOWN && (
          <AKG.ListRow title={all ? 'Show Fewer' : `Show All ${systems.length} Systems`} action onClick={() => setAll(!all)} />
        )}
      </AKG.List>
    </Screen>
  );
}

// Library tab: tools and reference used across topics.
export const LIBRARY_LISTS: Record<string, { title: string; icon: keyof typeof icons; tint: string; subtitle: string; empty: string }> = {
  scores: { title: 'Scores and Calculators', icon: 'plusForwardslashMinus', tint: 'var(--system-indigo)', subtitle: 'Risk scores and bedside calculators', empty: 'Scores and calculators will appear here once they’re added.' },
  criteria: { title: 'Criteria and Staging', icon: 'checklist', tint: 'var(--system-indigo)', subtitle: 'Diagnostic criteria and staging systems', empty: 'Criteria and staging systems will appear here once they’re added.' },
  medications: { title: 'Medications', icon: 'pills', tint: 'var(--system-orange)', subtitle: 'Doses, adjustments, warnings', empty: 'Medications will appear here once they’re added.' },
  pathways: { title: 'Pathways', icon: 'flowchart', tint: 'var(--accent)', subtitle: 'Step-by-step pathways, each on its own page', empty: 'Pathways will appear here once they’re added.' },
  labs: { title: 'Labs and Tests', icon: 'testtube2', tint: 'var(--system-purple)', subtitle: 'Interpretation, cutoffs, accuracy', empty: 'Labs and tests will appear here once they’re added.' },
};

const libRow = (id: string) => {
  const l = LIBRARY_LISTS[id];
  return <AKG.ListRow key={id} title={l.title} subtitle={l.subtitle} icon={icons[l.icon]} iconTint={l.tint} chevron href={href.libraryList(id)} />;
};

export function LibraryTab() {
  return (
    <Screen title="Library">
      <AKG.List header="Tools">
        {libRow('scores')}
        {libRow('criteria')}
        {/* A website: opens in Safari and needs internet. */}
        <AKG.ListRow
          title="Medscape Drug Interaction Checker"
          subtitle="Opens in Safari · needs internet"
          icon={icons.arrowLeftArrowRight}
          iconTint="var(--system-orange)"
          detail={<span className="external-mark" role="img" aria-label="Opens in Safari">{icons.arrowUpRight}</span>}
          onClick={() => window.open(INTERACTION_CHECKER, '_blank', 'noopener')}
        />
      </AKG.List>
      <AKG.List header="Reference">
        {libRow('medications')}
        {libRow('pathways')}
        {libRow('labs')}
      </AKG.List>
    </Screen>
  );
}

const ofType = (type: string) => content.cards.filter((c) => c.type === type).sort((a, b) => a.title.localeCompare(b.title));

// Library › one list.
export function LibraryList({ id }: { id: string }) {
  const sheet = useSheet();
  const list = LIBRARY_LISTS[id];
  if (!list) return <NotFoundScreen />;
  const cardRows = (cards: Card[]) => cards.map((c) => <AKG.ListRow key={c.id} title={c.title} subtitle={cardTypeLabel(c)} chevron href={href.card(c.id)} />);
  let rows: ReactNode[] = [];
  if (id === 'scores') rows = cardRows(ofType('score'));
  if (id === 'medications') rows = cardRows(ofType('medication'));
  if (id === 'labs') rows = cardRows(ofType('test'));
  if (id === 'criteria') {
    rows = Object.entries(content.data.criteria ?? {})
      .sort(([, a], [, b]) => (a as Criteria).name.localeCompare((b as Criteria).name))
      .map(([cid, c]) => <AKG.ListRow key={cid} title={(c as Criteria).name} chevron onClick={() => openCriteria(sheet, c as Criteria)} />);
  }
  if (id === 'pathways') {
    rows = pathwayHomes().map((p) => <AKG.ListRow key={p.id} title={p.title} subtitle={`In ${getCard(p.card.id)?.title}`} chevron href={href.pathway(p.id)} />);
  }
  return (
    <Screen title={list.title} back={{ label: 'Library', fallback: href.library() }}>
      {rows.length === 0 ? <Empty title="Nothing Here Yet" description={list.empty} /> : <AKG.List>{rows}</AKG.List>}
    </Screen>
  );
}

// An address that doesn't match any page, or a card that was renamed or removed.
export function NotFoundScreen() {
  return (
    <Screen title="Not Found" back={{ label: 'Reference', fallback: href.home() }}>
      <Empty
        title="Page Not Found"
        description="This page may have moved or been renamed."
        actions={<AKG.Button variant="prominent" onClick={() => switchTab('home')}>Go to Home</AKG.Button>}
      />
    </Screen>
  );
}
