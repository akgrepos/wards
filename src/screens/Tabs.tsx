import { useMemo, useState, type ReactNode } from 'react';
import { AKG } from '../design/akg';
import { cardTypeLabel, content, norm, pathwayHomes } from '../content';
import type { Card, Term } from '../content/types';
import { href, switchTab } from '../router';
import { INTERACTION_CHECKER, openTerm } from '../ui/Rich';
import { useSheet } from '../ui/SheetHost';
import { icons } from '../ui/icons';
import { Empty, Screen } from './common';

// Library tab: tools and reference used across topics.
export const LIBRARY_LISTS: Record<string, { title: string; icon: keyof typeof icons; tint: string; subtitle: string; empty: string }> = {
  medications: { title: 'Medications', icon: 'pills', tint: 'var(--system-orange)', subtitle: 'Doses, adjustments, warnings', empty: 'Medications will appear here once they’re added.' },
  pathways: { title: 'Pathways', icon: 'flowchart', tint: 'var(--accent)', subtitle: 'Short flowcharts for workups and treatment', empty: 'Pathways will appear here once they’re added.' },
  glossary: { title: 'Glossary', icon: 'book', tint: 'var(--system-indigo)', subtitle: 'Terms and what they mean', empty: 'Terms will appear here once they’re added.' },
  labs: { title: 'Labs and Tests', icon: 'testtube2', tint: 'var(--system-purple)', subtitle: 'Interpretation, cutoffs, accuracy', empty: 'Labs and tests will appear here once they’re added.' },
};

const ofType = (type: string) => content.cards.filter((c) => c.type === type).sort((a, b) => a.title.localeCompare(b.title));

const libRow = (id: string) => {
  const l = LIBRARY_LISTS[id];
  return <AKG.ListRow key={id} title={l.title} subtitle={l.subtitle} icon={icons[l.icon]} iconTint={l.tint} chevron href={href.libraryList(id)} />;
};

const termEntries = () => Object.entries((content.data.term ?? {}) as Record<string, Term>);
const termCount = () => termEntries().length;
const listCount = (id: string) => ofType(id === 'medications' ? 'medication' : 'test').length;

export function LibraryTab() {
  return (
    <Screen title="Library">
      <AKG.List header="Tools">
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
        {/* Medications and Labs stay hidden until they have cards. */}
        {libRow('pathways')}
        {termCount() > 0 && libRow('glossary')}
        {listCount('medications') > 0 && libRow('medications')}
        {listCount('labs') > 0 && libRow('labs')}
      </AKG.List>
    </Screen>
  );
}

// Library › one list.
export function LibraryList({ id }: { id: string }) {
  const list = LIBRARY_LISTS[id];
  // Removed pages (Scores, Criteria and Staging) fall back to the Library itself.
  if (!list) return <LibraryTab />;
  if (id === 'glossary') return <Glossary />;
  const cardRows = (cards: Card[]) => cards.map((c) => <AKG.ListRow key={c.id} title={c.title} subtitle={cardTypeLabel(c)} chevron href={href.card(c.id)} />);
  let rows: ReactNode[] = [];
  if (id === 'medications') rows = cardRows(ofType('medication'));
  if (id === 'labs') rows = cardRows(ofType('test'));
  if (id === 'pathways') {
    rows = pathwayHomes().map((p) => <AKG.ListRow key={p.id} title={`${p.card.title}: ${p.title}`} subtitle={p.summary} chevron href={href.pathway(p.id)} />);
  }
  return (
    <Screen title={list.title} back={{ label: 'Library', fallback: href.library() }}>
      {rows.length === 0 ? <Empty title="Nothing Here Yet" description={list.empty} /> : <AKG.List>{rows}</AKG.List>}
    </Screen>
  );
}

// Library › Glossary: every term the app defines, A to Z inside each system, with a field that narrows the list.
// Generated from the term files (content/data/term/); nothing here is written by hand.
function Glossary() {
  const sheet = useSheet();
  const [q, setQ] = useState('');
  const groups = useMemo(() => {
    const words = norm(q).split(' ').filter(Boolean);
    const all = termEntries().filter(([, t]) => {
      const names = ' ' + [t.term, ...(t.aliases ?? [])].map(norm).join(' ');
      return words.every((w) => names.includes(' ' + w));
    });
    return content.systems
      .map((s) => ({ title: s.title, terms: all.filter(([, t]) => t.group === s.id).sort((a, b) => a[1].term.localeCompare(b[1].term)) }))
      .filter((g) => g.terms.length);
  }, [q]);
  const list = LIBRARY_LISTS.glossary;
  return (
    <Screen title={list.title} back={{ label: 'Library', fallback: href.library() }}>
      <AKG.SearchField placeholder="Search terms" value={q} onChange={(e) => setQ(e.target.value)} autoCapitalize="none" autoCorrect="off" spellCheck={false} />
      {groups.length === 0 ? (
        <Empty title={q.trim() ? 'No Results' : 'Nothing Here Yet'} description={q.trim() ? `No term matches “${q.trim()}”.` : list.empty} />
      ) : groups.map((g) => (
        <AKG.List key={g.title} header={g.title}>
          {g.terms.map(([id, t]) => (
            <AKG.ListRow key={id} title={t.term.charAt(0).toUpperCase() + t.term.slice(1)} subtitle={t.definition} onClick={() => openTerm(sheet, id)} />
          ))}
        </AKG.List>
      ))}
    </Screen>
  );
}

// An address that doesn't match any page, or a card that was renamed or removed.
export function NotFoundScreen() {
  return (
    <Screen title="Not Found" back={{ label: 'Topics', fallback: href.home() }}>
      <Empty
        title="Page Not Found"
        description="This page may have moved or been renamed."
        actions={<AKG.Button variant="prominent" onClick={() => switchTab('home')}>Go to Topics</AKG.Button>}
      />
    </Screen>
  );
}
