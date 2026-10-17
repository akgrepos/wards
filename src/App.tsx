import { APP_VERSION } from './version';
import { UpdatePrompt } from './UpdatePrompt';
import { useAppearance } from './useAppearance';

export function App() {
  useAppearance();

  return (
    <>
      <main className="screen">
        <h1 className="ios-large-title-emphasized screen__title">Wards</h1>
        <section className="placeholder">
          <p className="ios-title-3-emphasized">No Entries Yet</p>
          <p className="ios-body placeholder__text">Reference entries will appear here once they’re added.</p>
        </section>
        <footer className="ios-footnote screen__footer">Version {APP_VERSION}</footer>
      </main>
      <UpdatePrompt />
    </>
  );
}
