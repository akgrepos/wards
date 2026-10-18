import { useRoute } from './router';
import { CardScreen } from './screens/CardScreen';
import { Home } from './screens/Home';
import { SystemScreen } from './screens/SystemScreen';
import { SheetHost } from './ui/SheetHost';
import { UpdatePrompt } from './UpdatePrompt';
import { useAppearance } from './useAppearance';

export function App() {
  useAppearance();
  const route = useRoute();
  return (
    <SheetHost>
      {route.name === 'home' && <Home />}
      {route.name === 'system' && <SystemScreen id={route.id} />}
      {route.name === 'card' && <CardScreen key={route.id} id={route.id} />}
      <UpdatePrompt />
    </SheetHost>
  );
}
