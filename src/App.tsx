import { AKG } from './design/akg';
import { currentTab, href, open, switchTab, useRoute, type Route } from './router';
import { CardScreen } from './screens/CardScreen';
import { FavoritesScreen, Home, SettingsScreen } from './screens/Home';
import { FocusProxy, SearchScreen, focusProxy } from './screens/Search';
import { SystemScreen } from './screens/SystemScreen';
import { EmergenciesTab, LibraryList, LibraryTab, NotFoundScreen, TopicsTab } from './screens/Tabs';
import { SheetHost } from './ui/SheetHost';
import { icons } from './ui/icons';
import { UpdatePrompt } from './UpdatePrompt';
import { useAppearance } from './useAppearance';

const TABS = [
  { value: 'home', label: 'Home', icon: icons.home },
  { value: 'emergencies', label: 'Rapids', icon: icons.bolt },
  { value: 'topics', label: 'Topics', icon: icons.book },
  { value: 'library', label: 'Library', icon: icons.books },
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
    case 'favorites': return <FavoritesScreen />;
    case 'system': return <SystemScreen key={route.id} id={route.id} />;
    case 'card': return <CardScreen key={route.id} id={route.id} section={route.section} />;
    default: return <NotFoundScreen />;
  }
}

export function App() {
  useAppearance();
  const route = useRoute();
  const tab = currentTab();
  return (
    <SheetHost>
      <Page route={route} />
      {/* The floating tab bar, on every screen except Search (which puts its field at the bottom instead). */}
      {route.name !== 'search' && (
        <AKG.TabBar
          floating
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
      <FocusProxy />
      <UpdatePrompt />
    </SheetHost>
  );
}
