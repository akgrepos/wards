import { useState, type CSSProperties, type ReactNode } from 'react';
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
import { LIBRARY_LISTS } from './Tabs';

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
export function Home() {
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
