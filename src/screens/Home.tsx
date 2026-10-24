import { useState } from 'react';
import { AKG } from '../design/akg';
import { cardTypeLabel, emergencyCards, getCard } from '../content';
import type { Card } from '../content/types';
import { href, open } from '../router';
import { clearPageMemory, clearRecent, getRapidShortcuts, getRecent, RAPIDS_MAX, setRapidShortcuts, useStored } from '../storage';
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

// Home: pick up where you left off. Rapids (emergency) shortcuts and Recent (all kept on this phone).
export function Home() {
  const recent = useStored(getRecent).filter((r) => getCard(r.id));
  const emergencies = useRapidShortcuts();
  const sheet = useSheet();
  const anyEmergency = emergencyCards().length > 0;

  return (
    <Screen title="Reference" trailing={<AKG.ToolbarButton icon={icons.gearshape} aria-label="Settings" onClick={() => open(href.settings())} />}>
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
