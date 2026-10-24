import { useEffect, useState } from 'react';
import { AKG } from '../design/akg';
import { cardTypeLabel, getCard, getSystem, searchCards } from '../content';
import type { Card } from '../content/types';
import { goBack, href, rememberQuery, rememberedQuery } from '../router';
import { getRecent, useStored } from '../storage';
import { icons } from '../ui/icons';
import { Empty, Screen, ago } from './common';

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

// Suggested searches: real titles and aliases of pages in the app.
const SUGGESTIONS = ['hyperK', 'AKI', 'AFib', 'CAP', 'GI bleed', 'delirium'];
const RECENT_SHOWN = 3;

const subtitle = (c: Card) => `${cardTypeLabel(c)} · ${getSystem(c.system)?.title ?? ''}`;

// Search: titles and aliases of every page. The field sits at the bottom (iOS); Close returns to the previous screen.
export function SearchScreen() {
  const [q, setQ] = useState(rememberedQuery);
  const area = useVisibleArea();
  const results = searchCards(q);
  const recent = useStored(getRecent).filter((r) => getCard(r.id)).slice(0, RECENT_SHOWN);
  const groups = [
    { header: 'Rapids', cards: results.filter((c) => c.emergency) },
    { header: 'Topics', cards: results.filter((c) => c.type !== 'medication') },
    { header: 'Drugs', cards: results.filter((c) => c.type === 'medication') },
  ].filter((g) => g.cards.length > 0);
  const change = (v: string) => { setQ(v); rememberQuery(v); };
  // The page behind stays still, so the bar can't ride along when there's nothing (or little) to scroll.
  useEffect(() => AKG.lockScroll(), []);
  useEffect(() => {
    if (document.activeElement?.id === FOCUS_PROXY_ID) document.getElementById(SEARCH_INPUT_ID)?.focus();
  }, []);
  return (
    <div className="search-screen" style={area ? { top: area.top, height: area.height } : undefined}>
      <div className="search-scroll">
        <Screen title="Search">
          {!q.trim() ? (
            <>
              {recent.length > 0 && (
                <AKG.List header="Recent">
                  {recent.map((r) => {
                    const c = getCard(r.id)!;
                    return <AKG.ListRow key={r.id} title={c.title} subtitle={`${subtitle(c)} · ${ago(r.t)}`} chevron href={href.card(c.id)} />;
                  })}
                </AKG.List>
              )}
              <section className="search-try">
                <div className="akg-list__header akg-list__header--default"><h2 className="akg-list__header-title">Try</h2></div>
                <div className="search-chips">
                  {SUGGESTIONS.map((t) => <AKG.Button key={t} variant="tinted" size="large" onClick={() => change(t)}>{t}</AKG.Button>)}
                </div>
              </section>
              <p className="ios-footnote secondary search-hint">Search by name, abbreviation or common term.</p>
            </>
          ) : results.length === 0 ? (
            <Empty title="No Results" description={`No pages match “${q.trim()}”. Check the spelling or try another term.`} />
          ) : (
            <>
              {groups.map((g) => (
                <AKG.List key={g.header} header={g.header}>
                  {g.cards.map((c) => (
                    <AKG.ListRow
                      key={c.id}
                      title={<AKG.Highlight text={c.title} query={q} />}
                      subtitle={g.header === 'Rapids' ? `Rapids · ${getSystem(c.system)?.title ?? ''}` : subtitle(c)}
                      chevron
                      href={g.header === 'Rapids' ? href.emergency(c.id) : href.card(c.id)}
                    />
                  ))}
                </AKG.List>
              ))}
            </>
          )}
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
