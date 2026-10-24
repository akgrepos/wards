import { useEffect, useState } from 'react';
import { AKG } from '../design/akg';
import { goBack, href, rememberQuery, rememberedQuery } from '../router';
import { icons } from '../ui/icons';
import { Screen } from './common';
import { SearchResults, SearchStart } from './SearchResults';

export const SEARCH_INPUT_ID = 'search-input';
export const FOCUS_PROXY_ID = 'search-focus-proxy';

// iOS only opens the keyboard for a field focused during the tap itself. The search button focuses this hidden
// field during its tap; the search screen then moves focus to its own field, and the keyboard stays up.
export function FocusProxy() {
  return <input id={FOCUS_PROXY_ID} className="focus-proxy" aria-hidden="true" tabIndex={-1} readOnly />;
}
export const focusProxy = () => document.getElementById(FOCUS_PROXY_ID)?.focus();

// The part of the screen not covered by the keyboard. iOS shrinks the visible area instead of the page, and scrolls
// the page to show a focused field, so the search screen follows the visible area itself.
function useVisibleArea() {
  const read = () => {
    const vv = window.visualViewport;
    return vv ? { top: Math.round(vv.offsetTop), height: Math.round(vv.height) } : null;
  };
  const [area, setArea] = useState(read);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setArea(read());
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => { vv.removeEventListener('resize', update); vv.removeEventListener('scroll', update); };
  }, []);
  return area;
}

// Search: titles and aliases of every page. The field sits at the bottom (iOS); Close returns to the previous screen.
export function SearchScreen() {
  const [q, setQ] = useState(rememberedQuery);
  const area = useVisibleArea();
  const change =(v: string) => { setQ(v); rememberQuery(v); };
  // The page behind stays still, so the bar can't ride along when there's nothing (or little) to scroll.
  useEffect(() => AKG.lockScroll(), []);
  useEffect(() => {
    if (document.activeElement?.id === FOCUS_PROXY_ID) document.getElementById(SEARCH_INPUT_ID)?.focus();
  }, []);
  return (
    <div className="search-screen" style={area ? { top: area.top, height: area.height } : undefined}>
      <div className="search-scroll">
        <Screen title="Search">
          {q.trim() ? <SearchResults q={q} /> : <SearchStart onPick={change} />}
        </Screen>
      </div>
      <AKG.BottomBar className="search-bar">
        <AKG.ToolbarButton icon={icons.xmark} aria-label="Close Search" onClick={() => goBack(href.home())} />
        <AKG.SearchField
          id={SEARCH_INPUT_ID}
          variant="glass"
          placeholder="Search Wards"
          value={q}
          onChange={(e) => change(e.target.value)}
          enterKeyHint="search"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </AKG.BottomBar>
    </div>
  );
}
