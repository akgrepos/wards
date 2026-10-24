import { createContext, useContext, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { AKG } from '../design/akg';
import { cardsInSystem, cardTypeLabel, content, emergencyCards, getCard } from '../content';
import type { Card } from '../content/types';
import { href, open } from '../router';
import { clearPageMemory, clearRecent, getRapidShortcuts, getRecent, RAPIDS_MAX, setRapidShortcuts, useStored } from '../storage';
import { useSheet } from '../ui/SheetHost';
import { iconFor, icons } from '../ui/icons';
import { APP_VERSION } from '../version';
import { Screen, ago } from './common';
import { INTERACTION_CHECKER } from '../ui/Rich';
import { LIBRARY_LISTS, TopicsTab } from './Tabs';

const cardIcon = (c: Card) => iconFor(c.system);

// Home's Rapids shortcuts: the ones chosen with Edit (up to four, in the order chosen), or the first four.
function useRapidShortcuts(): Card[] {
  const chosen = useStored(getRapidShortcuts);
  const all = emergencyCards();
  if (!chosen) return all.slice(0, RAPIDS_MAX);
  return chosen.map(getCard).filter((c): c is Card => !!c?.emergency);
}

// Edit: pick which emergencies Home shows (a checkmark list; HIG: choose from a list in a sheet).
function EditRapids() {
  const shown = useRapidShortcuts().map((c) => c.id);
  const all = emergencyCards();
  const toggle = (id: string) => setRapidShortcuts(shown.includes(id) ? shown.filter((x) => x !== id) : [...shown, id]);
  return (
    <div className="detail-sheet">
      <AKG.List footer={`Choose up to ${RAPIDS_MAX}. They appear on Home in the order you choose them.`}>
        {all.map((c) => (
          <AKG.ListRow
            key={c.id}
            title={c.title}
            subtitle={c.emergency?.hint}
            checked={shown.includes(c.id)}
            disabled={!shown.includes(c.id) && shown.length >= RAPIDS_MAX}
            onClick={() => toggle(c.id)}
          />
        ))}
      </AKG.List>
    </div>
  );
}
const kindLabel = (c: Card) => (c.system === 'library' ? cardTypeLabel(c) : 'Topic');

// A section title in the List header style, so Home's grids read like the lists around them.
function HomeSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="home-section">
      <div className="akg-list__header akg-list__header--prominent">
        <h2 className="akg-list__header-title">{title}</h2>
        {action && <div className="akg-list__header-action">{action}</div>}
      </div>
      {children}
    </section>
  );
}

const hasCards = (type: string) => content.cards.some((c) => c.type === type);

// Home: one tap to the right part of the app. Rapids chips, the specialties as a grid, the library tools, then Recent.
function HomeGrid() {
  const recent = useStored(getRecent).filter((r) => getCard(r.id));
  const emergencies = useRapidShortcuts();
  const sheet = useSheet();
  const anyEmergency = emergencyCards().length > 0;
  const specialties = content.systems.filter((s) => !s.library && cardsInSystem(s.id).length > 0);
  const tools = [
    { id: 'pathways', show: true },
    { id: 'medications', show: hasCards('medication') },
    { id: 'labs', show: hasCards('test') },
  ].filter((t) => t.show);

  return (
    <Screen title="Reference" trailing={<AKG.ToolbarButton icon={icons.gearshape} aria-label="Settings" onClick={() => open(href.settings())} />}>
      <Switcher /> {/* PROTOTYPE */}
      <HomeSection
        title="Rapids"
        action={anyEmergency ? <AKG.Button variant="borderless" onClick={() => sheet({ title: 'Rapids Shortcuts', body: <EditRapids /> })}>Edit</AKG.Button> : undefined}
      >
        {!anyEmergency ? (
          <p className="home-empty">Shortcuts to your main rapids will appear here.</p>
        ) : emergencies.length === 0 ? (
          <p className="home-empty">Tap Edit to choose up to four.</p>
        ) : (
          <div className="home-chips">
            {emergencies.map((c) => (
              <a key={c.id} className="home-chip" href={href.emergency(c.id)}>
                <span className="home-chip__icon">{icons.staroflifeFill}</span>
                {c.title}
              </a>
            ))}
          </div>
        )}
      </HomeSection>

      <HomeSection title="Specialties" action={<AKG.Button variant="borderless" onClick={() => open(href.topics())}>{`See All ${content.systems.filter((s) => !s.library).length}`}</AKG.Button>}>
        <div className="home-grid">
          {specialties.map((s) => (
            <a key={s.id} className="home-cell" href={href.system(s.id)}>
              <AKG.IconTile tint={iconFor(s.id).tint}>{iconFor(s.id).icon}</AKG.IconTile>
              <span className="home-cell__title">{s.title}</span>
            </a>
          ))}
        </div>
      </HomeSection>

      <HomeSection title="Library">
        <div className="home-tools" style={{ '--n': tools.length + 1 } as CSSProperties}>
          {tools.map((t) => (
            <a key={t.id} className="home-tool" href={href.libraryList(t.id)}>
              <span className="home-tool__icon" style={{ color: LIBRARY_LISTS[t.id].tint }}>{icons[LIBRARY_LISTS[t.id].icon]}</span>
              {LIBRARY_LISTS[t.id].title}
            </a>
          ))}
          {/* A website: opens in Safari and needs internet. */}
          <a className="home-tool" href={INTERACTION_CHECKER} target="_blank" rel="noopener">
            <span className="home-tool__icon" style={{ color: 'var(--system-orange)' }}>{icons.arrowLeftArrowRight}</span>
            <span>Interactions <span className="home-tool__mark" role="img" aria-label="Opens in Safari">{icons.arrowUpRight}</span></span>
          </a>
        </div>
      </HomeSection>

      <AKG.List
        header="Recent"
        headerStyle="prominent"
        headerAction={recent.length ? <AKG.Button variant="borderless" onClick={clearRecent}>Clear</AKG.Button> : undefined}
      >
        {recent.length === 0 ? (
          <AKG.ListRow title="Nothing Opened Yet" subtitle="The last five pages you open appear here." />
        ) : (
          recent.map((r) => {
            const c = getCard(r.id)!;
            return <AKG.ListRow key={r.id} title={c.title} subtitle={`${kindLabel(c)} · ${ago(r.t)}`} icon={cardIcon(c).icon} iconTint={cardIcon(c).tint} chevron href={href.card(c.id)} />;
          })
        )}
      </AKG.List>
    </Screen>
  );
}

// PROTOTYPE: throwaway home options, chosen by ?home=1..4 in the address (none = the specialty grid). Remove before the real build.
export const RecentList = () => {
  const recent = useStored(getRecent).filter((r) => getCard(r.id));
  return (
    <AKG.List header="Recent" headerStyle="prominent" headerAction={recent.length ? <AKG.Button variant="borderless" onClick={clearRecent}>Clear</AKG.Button> : undefined}>
      {recent.length === 0 ? <AKG.ListRow title="Nothing Opened Yet" subtitle="The last five pages you open appear here." /> : recent.map((r) => {
        const c = getCard(r.id)!;
        return <AKG.ListRow key={r.id} title={c.title} subtitle={`${kindLabel(c)} · ${ago(r.t)}`} icon={cardIcon(c).icon} iconTint={cardIcon(c).tint} chevron href={href.card(c.id)} />;
      })}
    </AKG.List>
  );
};
const RapidChips = () => {
  const emergencies = useRapidShortcuts();
  const sheet = useSheet();
  return (
    <HomeSection title="Rapids" action={<AKG.Button variant="borderless" onClick={() => sheet({ title: 'Rapids Shortcuts', body: <EditRapids /> })}>Edit</AKG.Button>}>
      <div className="home-chips">
        {emergencies.map((c) => <a key={c.id} className="home-chip" href={href.emergency(c.id)}><span className="home-chip__icon">{icons.staroflifeFill}</span>{c.title}</a>)}
      </div>
    </HomeSection>
  );
};
// PROTOTYPE: the chosen option, shared with the preview ribbon.
const PROTO_NAMES: Record<number, string> = { 1: 'By task, four big buttons', 2: 'One list of specialties', 3: 'Search first', 4: 'Specialty grid', 5: 'Topics first, no Home tab' };
let protoOption = Number(new URLSearchParams(window.location.search).get('home')) || 4;
export const useProtoOption = () => useSyncExternalStore((l) => { protoListeners.add(l); return () => { protoListeners.delete(l); }; }, () => protoOption); // PROTOTYPE
const protoListeners = new Set<() => void>();
const setProtoOption = (n: number) => { protoOption = n; protoListeners.forEach((l) => l()); };
export function PreviewRibbon() { // PROTOTYPE
  const n = useSyncExternalStore((l) => { protoListeners.add(l); return () => { protoListeners.delete(l); }; }, () => protoOption);
  return <div className="preview-ribbon" role="note">PREVIEW · Option {"ABCDE"[n - 1]}: {PROTO_NAMES[n]}</div>;
}
const ProtoCtx = createContext<{ n: number; set: (n: number) => void }>({ n: 4, set: () => {} }); // PROTOTYPE
// PROTOTYPE: tap 1 to 4 to flip between the sketches.
export const Switcher = () => {
  const { n, set } = useContext(ProtoCtx);
  return (
    <div style={{ padding: 'var(--space-8) var(--space-16)' }}>
      <AKG.SegmentedControl options={[{ value: 1, label: 'A Task' }, { value: 2, label: 'B List' }, { value: 3, label: 'C Search' }, { value: 4, label: 'D Grid' }, { value: 5, label: 'E Topics' }]} value={n} onChange={(v) => set(Number(v))} />
    </div>
  );
};
const gear = <AKG.ToolbarButton icon={icons.gearshape} aria-label="Settings" onClick={() => open(href.settings())} />;

// Option 1: by task. Four big buttons.
function HomeTasks() {
  const big = [
    { t: 'Something Is Wrong Now', s: 'Rapids', i: icons.staroflifeFill, c: 'var(--system-red)', h: href.emergencies() },
    { t: 'Look Up a Drug', s: 'Medications', i: icons.pills, c: 'var(--system-orange)', h: href.libraryList('medications') },
    { t: 'Work Up a Problem', s: 'Topics and pathways', i: icons.heartTextClipboard, c: 'var(--system-pink)', h: href.topics() },
    { t: 'Check a Lab or Test', s: 'Labs and tests', i: icons.testtube2, c: 'var(--system-purple)', h: href.libraryList('labs') },
  ];
  return (
    <Screen title="Reference" trailing={gear}>
      <Switcher />
      <div className="home-grid" style={{ marginTop: 'var(--space-8)' }}>
        {big.map((b) => (
          <a key={b.t} className="home-cell" href={b.h} style={{ minHeight: '8rem' }}>
            <AKG.IconTile tint={b.c}>{b.i}</AKG.IconTile>
            <span className="home-cell__title">{b.t}<br /><span style={{ fontWeight: 400, color: 'var(--label-secondary)' }}>{b.s}</span></span>
          </a>
        ))}
      </div>
      <RecentList />
    </Screen>
  );
}

// Option 2: one list, like Topics.
function HomeList() {
  const specialties = content.systems.filter((s) => !s.library && cardsInSystem(s.id).length > 0);
  return (
    <Screen title="Reference" trailing={gear}>
      <Switcher />
      <RapidChips />
      <AKG.List header="Specialties" headerStyle="prominent">
        {specialties.map((s) => <AKG.ListRow key={s.id} title={s.title} icon={iconFor(s.id).icon} iconTint={iconFor(s.id).tint} subtitle={`${cardsInSystem(s.id).length} topics`} chevron href={href.system(s.id)} />)}
      </AKG.List>
      <RecentList />
    </Screen>
  );
}

// Option 3: search first. (The field opens the Search tab; the tab-bar search button stays.)
function HomeSearch() {
  return (
    <Screen title="Reference" trailing={gear}>
      <Switcher />
      <div style={{ padding: 'var(--space-8) var(--space-16)' }}>
        <AKG.SearchField placeholder="Search topics, drugs, labs" onFocus={() => open(href.search())} />
      </div>
      <RapidChips />
      <RecentList />
    </Screen>
  );
}

export function Home() {
  const [n, setN] = useState(protoOption);
  const set = (v: number) => { setN(v); setProtoOption(v); };
  return (
    <ProtoCtx.Provider value={{ n, set }}>
      {n === 5 ? <TopicsTab top={<Switcher />} bottom={<RecentList />} /> : n === 1 ? <HomeTasks /> : n === 2 ? <HomeList /> : n === 3 ? <HomeSearch /> : <HomeGrid />}
    </ProtoCtx.Provider>
  );
}

// Home › Settings: the version, and clearing what's kept on this phone.
export function SettingsScreen() {
  const [confirm, setConfirm] = useState(false);
  return (
    <Screen title="Settings" back={{ label: 'Reference', fallback: href.home() }}>
      <AKG.List header="About">
        <AKG.ListRow title="Version" detail={APP_VERSION} />
      </AKG.List>
      <AKG.List header="On This iPhone" footer="Recent and where you were on each page are kept only on this iPhone. Nothing is sent anywhere.">
        <AKG.ListRow title="Clear Recent and Page Memory" destructive onClick={() => setConfirm(true)} />
      </AKG.List>
      <AKG.Alert
        open={confirm}
        overlay
        fixed
        title="Clear Recent and Page Memory?"
        message="Pages also forget where you were and which sections you closed. This can’t be undone."
        actions={[
          { label: 'Cancel', role: 'cancel', onClick: () => setConfirm(false) },
          { label: 'Clear', role: 'destructive', onClick: () => { clearRecent(); clearPageMemory(); setConfirm(false); } },
        ]}
      />
    </Screen>
  );
}
