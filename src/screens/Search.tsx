import { useEffect, useMemo, useState } from 'react';
import { AKG } from '../design/akg';
import { content, loadCard } from '../content';
import { search, type GroupKey, type Hit } from '../content/search';
import { goBack, href, parseRoute, rememberQuery, rememberedQuery, requestFlash } from '../router';
import { addSearch, clearSearches, getSearches, useStored } from '../storage';
import { openCalculator } from '../ui/Calculator';
import { icons } from '../ui/icons';
import { useSheet } from '../ui/SheetHost';
import { Empty, Screen } from './common';

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

// How many results a group shows before its Show More row.
const SHOWN = 3;

// Search: card titles and aliases, drugs (and the cards whose doses use them), section headings and calculators, grouped.
// The field sits at the bottom (iOS); Close returns to the previous screen.
export function SearchScreen() {
  const [q, setQ] = useState(rememberedQuery);
  const [expanded, setExpanded] = useState<ReadonlySet<GroupKey>>(new Set());
  const area = useVisibleArea();
  // The keyboard covers the home-indicator strip, so the bar stops reserving room for it (see .search-keyboard).
  const keyboardOpen = !!area && window.innerHeight - area.height > 120;
  const sheet = useSheet();
  const results = useMemo(() => search(q, content), [q]);
  const searches = useStored(getSearches);
  const change = (v: string) => { setQ(v); rememberQuery(v); setExpanded(new Set()); };
  const openTool = (h: Hit) => { loadCard(h.cardId).then(() => openCalculator(sheet, h.tool!), () => {}); };
  const row = (h: Hit) => (
    <AKG.ListRow
      key={h.id}
      className="search-result"
      title={<AKG.Highlight text={h.title} query={q} />}
      subtitle={h.markSubtitle ? <AKG.Highlight text={h.subtitle} query={q} /> : h.subtitle}
      chevron={!h.tool}
      {...(h.tool ? { onClick: () => openTool(h) } : { href: href.card(h.cardId, h.section) })}
    />
  );
  // Opening a result counts as a search; a result inside a card opens it at that section, tinted for a moment.
  const openedResult = (el: HTMLElement) => {
    if (!q.trim() || !el.closest('.search-result')) return;
    addSearch(q);
    const r = parseRoute(el.closest('a')?.getAttribute('href') ?? '');
    if (r.name === 'card' && r.section) requestFlash(r.id, r.section);
  };
  // The page behind stays still, so the bar can't ride along when there's nothing (or little) to scroll.
  useEffect(() => AKG.lockScroll(), []);
  useEffect(() => {
    if (document.activeElement?.id === FOCUS_PROXY_ID) document.getElementById(SEARCH_INPUT_ID)?.focus();
  }, []);
  return (
    <div className={`search-screen${keyboardOpen ? ' search-keyboard' : ''}`} style={area ? { top: area.top, height: area.height } : undefined}>
      <div className="search-scroll">
        <Screen title="Search">
          <div onClickCapture={(e) => openedResult(e.target as HTMLElement)}>
          {!q.trim() ? (
            <AKG.List
              header="Recent Searches"
              headerStyle="prominent"
              headerAction={searches.length ? <AKG.Button variant="borderless" onClick={clearSearches}>Clear</AKG.Button> : undefined}
            >
              {searches.length === 0 ? (
                <AKG.ListRow title="No Recent Searches" subtitle="The searches you type appear here." />
              ) : (
                searches.map((t) => <AKG.ListRow key={t} title={t} onClick={() => change(t)} />)
              )}
            </AKG.List>
          ) : results.groups.length === 0 ? (
            <Empty title="No Results" description={`Nothing in Wards matches “${q.trim()}”. Check the spelling, or try a drug name, a topic, a section heading or a calculator.`} />
          ) : (
            results.oneLetter ? (
              <>
                <AKG.List>{results.groups[0].hits.map(row)}</AKG.List>
                <p className="ios-footnote secondary search-note">Keep typing to search drugs, section headings and calculators.</p>
              </>
            ) : (
              results.groups.map((g) => {
                const open = expanded.has(g.key);
                const more = g.hits.length - SHOWN;
                return (
                  <AKG.List key={g.key} header={g.label}>
                    {(open || more <= 0 ? g.hits : g.hits.slice(0, SHOWN)).map(row)}
                    {!open && more > 0 && (
                      <AKG.ListRow className="search-more" action title={`Show ${more} More`} onClick={() => setExpanded(new Set([...expanded, g.key]))} />
                    )}
                  </AKG.List>
                );
              })
            )
          )}
          </div>
        </Screen>
      </div>
      <AKG.BottomBar className="search-bar">
        <AKG.ToolbarButton icon={icons.xmark} aria-label="Close Search" onClick={() => goBack(href.home())} />
        <AKG.SearchField
          id={SEARCH_INPUT_ID}
          variant="glass"
          placeholder="Search cards, drugs, calculators"
          value={q}
          onChange={(e) => change(e.target.value)}
          enterKeyHint="search"
          onKeyDown={(e) => { if (e.key === 'Enter') addSearch(q); }}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </AKG.BottomBar>
    </div>
  );
}
