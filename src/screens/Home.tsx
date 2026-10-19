import { useState } from 'react';
import { AKG } from '../design/akg';
import { cardTypeLabel, emergencyCards, getCard, getSystem, titleCase } from '../content';
import type { Card } from '../content/types';
import { href, open } from '../router';
import { clearFavorites, clearPageMemory, clearReading, clearRecent, getFavorites, getRapidShortcuts, getReading, getRecent, RAPIDS_MAX, setRapidShortcuts, useStored } from '../storage';
import { useSheet } from '../ui/SheetHost';
import { emergencyIcon } from './Emergency';
import { iconFor, icons } from '../ui/icons';
import { APP_VERSION } from '../version';
import { Screen, ago } from './common';

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

// Home: pick up where you left off. Continue Reading, Rapids (emergency) shortcuts, Favorites and Recent (all kept on this phone).
export function Home() {
  const reading = useStored(getReading);
  const favorites = useStored(getFavorites).map(getCard).filter((c): c is Card => !!c);
  const recent = useStored(getRecent).filter((r) => getCard(r.id));
  const emergencies = useRapidShortcuts();
  const sheet = useSheet();
  const anyEmergency = emergencyCards().length > 0;
  const readCard = reading ? getCard(reading.id) : undefined;
  const sections = readCard?.sections ?? [];
  const at = Math.max(0, sections.findIndex((s) => s.key === reading?.section));

  return (
    <Screen title="Reference" trailing={<AKG.ToolbarButton icon={icons.gearshape} aria-label="Settings" onClick={() => open(href.settings())} />}>
      {readCard && (
        <a className="continue" href={href.card(readCard.id, reading?.section)}>
          <span className="ios-footnote-emphasized secondary eyebrow">Continue Reading</span>
          <span className="ios-headline">{readCard.title}</span>
          {sections[at] && <span className="ios-subheadline secondary">{titleCase(sections[at].title)}</span>}
          {sections.length > 1 && <AKG.ProgressIndicator value={at + 1} max={sections.length} aria-label={`Section ${at + 1} of ${sections.length}`} />}
        </a>
      )}

      <AKG.List
        header="Rapids"
        headerStyle="prominent"
        headerAction={anyEmergency ? <AKG.Button variant="borderless" onClick={() => sheet({ title: 'Rapids Shortcuts', body: <EditRapids /> })}>Edit</AKG.Button> : undefined}
      >
        {!anyEmergency ? (
          <AKG.ListRow title="No Rapids Yet" subtitle="Shortcuts to your four main rapids will appear here." />
        ) : emergencies.length === 0 ? (
          <AKG.ListRow title="No Shortcuts" subtitle="Tap Edit to choose up to four." />
        ) : (
          emergencies.map((c) => <AKG.ListRow key={c.id} title={c.title} subtitle={c.emergency?.hint} icon={emergencyIcon(c).icon} iconTint={emergencyIcon(c).tint} chevron href={href.emergency(c.id)} />)
        )}
      </AKG.List>

      {favorites.length === 0 ? (
        <AKG.List header="Favorites" headerStyle="prominent">
          <AKG.ListRow title="No Favorites Yet" subtitle="Tap the star on a page to add it here." />
        </AKG.List>
      ) : (
        <section className="home-group">
          <div className="akg-list__header akg-list__header--prominent">
            <div className="akg-list__header-title">Favorites</div>
            <div className="akg-list__header-action"><AKG.Button variant="borderless" onClick={() => open(href.favorites())}>See All</AKG.Button></div>
          </div>
          <div className="tiles" role="list">
            {favorites.map((c) => (
              <a key={c.id} role="listitem" className="tile" href={href.card(c.id)}>
                <AKG.IconTile tint={cardIcon(c).tint}>{cardIcon(c).icon}</AKG.IconTile>
                <span className="ios-subheadline-emphasized">{c.title}</span>
                <span className="ios-caption-1 secondary">{kindLabel(c)}</span>
              </a>
            ))}
          </div>
        </section>
      )}

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

// Home › Favorites › See All.
export function FavoritesScreen() {
  const favorites = useStored(getFavorites).map(getCard).filter((c): c is Card => !!c);
  return (
    <Screen title="Favorites" back={{ label: 'Reference', fallback: href.home() }}>
      {favorites.length === 0 ? (
        <div className="empty"><AKG.EmptyState symbol={icons.star} title="No Favorites" description="Tap the star on a page to add it here." /></div>
      ) : (
        <AKG.List footer="To remove a favorite, open it and tap the star.">
          {favorites.map((c) => <AKG.ListRow key={c.id} title={c.title} subtitle={`${kindLabel(c)} · ${getSystem(c.system)?.title ?? ''}`} icon={cardIcon(c).icon} iconTint={cardIcon(c).tint} chevron href={href.card(c.id)} />)}
        </AKG.List>
      )}
    </Screen>
  );
}

// Home › Settings: the version, and clearing what's kept on this phone.
export function SettingsScreen() {
  const [confirm, setConfirm] = useState<'history' | 'favorites' | null>(null);
  return (
    <Screen title="Settings" back={{ label: 'Reference', fallback: href.home() }}>
      <AKG.List header="About">
        <AKG.ListRow title="Version" detail={APP_VERSION} />
      </AKG.List>
      <AKG.List header="On This iPhone" footer="Favorites, Recent, Continue Reading, and where you were on each page are kept only on this iPhone. Nothing is sent anywhere.">
        <AKG.ListRow title="Clear Recent and Continue Reading" destructive onClick={() => setConfirm('history')} />
        <AKG.ListRow title="Clear Favorites" destructive onClick={() => setConfirm('favorites')} />
      </AKG.List>
      <AKG.Alert
        open={confirm != null}
        overlay
        fixed
        title={confirm === 'favorites' ? 'Clear Favorites?' : 'Clear Recent and Continue Reading?'}
        message={confirm === 'favorites' ? 'This can’t be undone.' : 'Pages also forget where you were and which sections you closed. This can’t be undone.'}
        actions={[
          { label: 'Cancel', role: 'cancel', onClick: () => setConfirm(null) },
          { label: 'Clear', role: 'destructive', onClick: () => { if (confirm === 'favorites') clearFavorites(); else { clearRecent(); clearReading(); clearPageMemory(); } setConfirm(null); } },
        ]}
      />
    </Screen>
  );
}
