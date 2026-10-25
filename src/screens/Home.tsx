import { useState } from 'react';
import { AKG } from '../design/akg';
import { cardsInSystem, cardTypeLabel, content, getCard } from '../content';
import type { Card } from '../content/types';
import { href, open } from '../router';
import { clearPageMemory, clearRecent, getRecent, useStored } from '../storage';
import { iconFor, icons } from '../ui/icons';
import { APP_VERSION } from '../version';
import { Screen, ago } from './common';

const cardIcon = (c: Card) => iconFor(c.system);
const kindLabel = (c: Card) => (c.system === 'library' ? cardTypeLabel(c) : 'Topic');
const RECENT_SHOWN = 3;

// Home is Topics: the last pages you opened, then every specialty that has topics as one list, so they all fit on a screen.
export function Home() {
  const recent = useStored(getRecent).filter((r) => getCard(r.id)).slice(0, RECENT_SHOWN);
  const specialties = content.systems.filter((s) => !s.library && cardsInSystem(s.id).length > 0);

  return (
    <Screen title="Topics" trailing={<AKG.ToolbarButton icon={icons.gearshape} aria-label="Settings" onClick={() => open(href.settings())} />}>
      <AKG.List
        header="Recent"
        headerStyle="prominent"
        headerAction={recent.length ? <AKG.Button variant="borderless" onClick={clearRecent}>Clear</AKG.Button> : undefined}
      >
        {recent.length === 0 ? (
          <AKG.ListRow title="Nothing Opened Yet" subtitle="The last pages you open appear here." />
        ) : (
          recent.map((r) => {
            const c = getCard(r.id)!;
            return <AKG.ListRow key={r.id} title={c.title} subtitle={`${kindLabel(c)} · ${ago(r.t)}`} icon={cardIcon(c).icon} iconTint={cardIcon(c).tint} chevron href={href.card(c.id)} />;
          })
        )}
      </AKG.List>

      <AKG.List header="Specialties" headerStyle="prominent">
        {specialties.map((s) => (
          <AKG.ListRow key={s.id} title={s.title} icon={iconFor(s.id).icon} iconTint={iconFor(s.id).tint} chevron href={href.system(s.id)} />
        ))}
      </AKG.List>
    </Screen>
  );
}

// Home › Settings: the version, and clearing what's kept on this phone.
export function SettingsScreen() {
  const [confirm, setConfirm] = useState(false);
  return (
    <Screen title="Settings" back={{ label: 'Topics', fallback: href.home() }}>
      <AKG.List header="About" footer="A personal reference written for its owner. Not medical advice. Cards are checked against their cited sources by an automated clinical review on the date shown and are not individually reviewed by the owner. Check doses against the current label and guideline before use.">
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
