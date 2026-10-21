import { AKG } from './design/akg';
import { currentTab, href, open, switchTab, useRoute, type Route } from './router';
import { CardScreen } from './screens/CardScreen';
import { PathwayScreen } from './screens/PathwayScreen';
import { Home, SettingsScreen } from './screens/Home';
import { FocusProxy, SearchScreen, focusProxy } from './screens/Search';
import { SystemScreen } from './screens/SystemScreen';
import { LibraryList, LibraryTab, NotFoundScreen, TopicsTab } from './screens/Tabs';
import { EmergenciesTab, EmergencyScreen } from './screens/Emergency';
import { TimedAccessory, TimedScreen, TimedSummary } from './screens/Timed';
import { getCard } from './content';
import { getTimed, useStored } from './storage';
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
  switch (route.name) {
    case 'home': return <Home />;
    case 'emergencies': return <EmergenciesTab />;
    case 'topics': return <TopicsTab />;
    case 'library': return <LibraryTab />;
    case 'library-list': return <LibraryList key={route.id} id={route.id} />;
    case 'search': return <SearchScreen />;
    case 'settings': return <SettingsScreen />;
    case 'system': return <SystemScreen key={route.id} id={route.id} />;
    case 'card': return <CardScreen key={route.id} id={route.id} section={route.section} anchor={route.anchor} />;
    case 'pathway': return <PathwayScreen key={route.id} id={route.id} />;
    case 'emergency': return <EmergencyScreen key={route.id} id={route.id} />;
    case 'timed': return <TimedScreen />;
    default: return <NotFoundScreen />;
  }
}

export function App() {
  useAppearance();
  const route = useRoute();
  const tab = currentTab();
  const stored = useStored(getTimed);
  // While Timed Mode runs, its timer sits in a bar above the tab bar on every screen (except Timed Mode itself).
  const timed = isRunning(stored) && getCard(stored.card) ? stored : null;
  useEffect(() => { document.documentElement.toggleAttribute('data-timed', !!timed); }, [timed]);
  return (
    <SheetHost>
      <Page route={route} />
      {/* The floating tab bar, on every screen except Search (which puts its field at the bottom instead) and
          Timed Mode (full screen). */}
      {route.name !== 'search' && route.name !== 'timed' && (
        <AKG.TabBar
          floating
          accessory={timed ? <TimedAccessory s={timed} /> : undefined}
          items={TABS}
          value={tab === 'search' ? '' : tab}
          onChange={(v: string) => switchTab(v as 'home')}
          search
          searchLabel="Search"
          searchSelected={tab === 'search'}
          onSearch={() => { focusProxy(); open(href.search()); }}
          aria-label="Sections"
        />
      )}
      <TimedSummary />
      <FocusProxy />
      <UpdatePrompt />
    </SheetHost>
  );
}
