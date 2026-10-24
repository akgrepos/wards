import { AKG } from './design/akg';
import { currentTab, href, open, switchTab, useRoute, type Route } from './router';
import { CardScreen } from './screens/CardScreen';
import { PathwayScreen } from './screens/PathwayScreen';
import { Home, PreviewRibbon, SettingsScreen, useProtoOption } from './screens/Home';
import { FocusProxy, SearchScreen, focusProxy } from './screens/Search';
import { SystemScreen } from './screens/SystemScreen';
import { LibraryList, LibraryTab, NotFoundScreen, TopicsTab } from './screens/Tabs';
import { EmergenciesTab, EmergencyScreen } from './screens/Emergency';
import { TimedAccessory, TimedScreen, TimedSummary } from './screens/Timed';
import { getCard, useCardLoad } from './content';
import { CardGate } from './ui/CardGate';
import { getTimed, useStored } from './storage';
import { pathwayCard } from './content';
import { isRunning } from './timed';
import { useEffect } from 'react';
import { SheetHost } from './ui/SheetHost';
import { icons } from './ui/icons';
import { UpdatePrompt } from './UpdatePrompt';
import { useAppearance } from './useAppearance';

const TABS = [
  { value: 'home', label: 'Home', icon: icons.house },
  { value: 'topics', label: 'Topics', icon: icons.heartTextClipboard },
  { value: 'emergencies', label: 'Rapids', icon: icons.staroflifeFill },
  { value: 'library', label: 'Library', icon: icons.crossCase },
];

function Page({ route }: { route: Route }) {
  const stored = useStored(getTimed);
  switch (route.name) {
    case 'home': return <Home />;
    case 'emergencies': return <EmergenciesTab />;
    case 'topics': return <TopicsTab />;
    case 'library': return <LibraryTab />;
    case 'library-list': return <LibraryList key={route.id} id={route.id} />;
    case 'search': return <SearchScreen />;
    case 'settings': return <SettingsScreen />;
    case 'system': return <SystemScreen key={route.id} id={route.id} />;
    case 'card': return <CardGate key={route.id} id={route.id}><CardScreen id={route.id} section={route.section} anchor={route.anchor} /></CardGate>;
    case 'pathway': return <CardGate key={route.id} id={pathwayCard(route.id)}><PathwayScreen id={route.id} /></CardGate>;
    case 'emergency': return <CardGate key={route.id} id={route.id} back={{ label: 'Rapids', fallback: href.emergencies() }}><EmergencyScreen id={route.id} /></CardGate>;
    case 'timed': return <CardGate id={stored?.card} back={{ label: 'Rapids', fallback: href.emergencies() }}><TimedScreen /></CardGate>;
    default: return <NotFoundScreen />;
  }
}

export function App() {
  useAppearance();
  const route = useRoute();
  const tab = currentTab();
  const protoOption = useProtoOption();
  const noHome = !!import.meta.env.VITE_PREVIEW && protoOption === 5; // PROTOTYPE: option E has no Home tab; Topics is the home route
  const stored = useStored(getTimed);
  // While Timed Mode runs, its timer sits in a bar above the tab bar on every screen (except Timed Mode itself).
  const timedLoad = useCardLoad(stored && getCard(stored.card) ? stored.card : undefined);
  const timed = isRunning(stored) && getCard(stored.card) && timedLoad.status === 'ready' ? stored : null;
  useEffect(() => { document.documentElement.toggleAttribute('data-timed', !!timed); }, [timed]);
  return (
    <SheetHost>
      {import.meta.env.VITE_PREVIEW && <PreviewRibbon />}{/* PROTOTYPE */}
      <Page route={route} />
      {/* The floating tab bar, on every screen except Search (which puts its field at the bottom instead) and
          Timed Mode (full screen). */}
      {route.name !== 'search' && route.name !== 'timed' && (
        <AKG.TabBar
          floating
          accessory={timed ? <TimedAccessory s={timed} /> : undefined}
          items={noHome ? TABS.filter((t) => t.value !== 'home').map((t) => (t.value === 'topics' ? { ...t, value: 'home' } : t)) : TABS}
          value={tab === 'search' ? '' : noHome && tab === 'topics' ? 'home' : tab}
          onChange={(v: string) => switchTab(v as 'home')}
          search
          searchLabel="Search"
          searchSelected={tab === 'search'}
          onSearch={() => { focusProxy(); open(href.search()); }}
          aria-label="Sections"
        />
      )}
      {timedLoad.status === 'ready' && <TimedSummary />}
      <FocusProxy />
      <UpdatePrompt />
    </SheetHost>
  );
}
