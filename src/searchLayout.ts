import { useEffect, useState } from 'react';

// Search is one fixed box that follows the part of the screen the keyboard leaves free. iOS ignores `overflow: hidden`
// on the page, so the page itself is pinned (see html.search-open in base.css), stray scrolling is undone, and a drag that
// starts anywhere but the results list is cancelled.

export const SEARCH_OPEN_CLASS = 'search-open';
export const SCROLL_CLASS = 'search-scroll';

export type VisibleArea = { top: number; height: number };

/** The visible part of the screen, rounded so tiny fractions don't re-render. Null where visualViewport doesn't exist. */
export function readVisibleArea(vv: Pick<VisualViewport, 'offsetTop' | 'height'> | null | undefined): VisibleArea | null {
  return vv ? { top: Math.round(vv.offsetTop), height: Math.round(vv.height) } : null;
}

/** The keyboard is up when the visible area is much shorter than the window (the address bar alone never gets that far). */
export function isKeyboardOpen(area: VisibleArea | null, windowHeight: number): boolean {
  return !!area && windowHeight - area.height > 120;
}

/** A drag may only scroll the results list; anything else (bar, field, empty space) must not move the page. */
export function dragMovesPage(target: EventTarget | null): boolean {
  return !(target instanceof Element && target.closest(`.${SCROLL_CLASS}`));
}

/** Pins the page while Search is open. Returns the undo. */
export function lockPage(root: HTMLElement = document.documentElement): () => void {
  root.classList.add(SEARCH_OPEN_CLASS);
  return () => root.classList.remove(SEARCH_OPEN_CLASS);
}

/** Follows the visible area; whenever iOS scrolls or shifts the page to show the field, puts it straight back. */
export function useVisibleArea(): VisibleArea | null {
  const [area, setArea] = useState(() => readVisibleArea(window.visualViewport));
  useEffect(() => {
    const vv = window.visualViewport;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
        const next = readVisibleArea(window.visualViewport);
        setArea((a) => (a && next && a.top === next.top && a.height === next.height ? a : next));
      });
    };
    vv?.addEventListener('resize', update);
    vv?.addEventListener('scroll', update);
    window.addEventListener('scroll', update, { passive: true });
    document.addEventListener('focusin', update);
    return () => {
      cancelAnimationFrame(frame);
      vv?.removeEventListener('resize', update);
      vv?.removeEventListener('scroll', update);
      window.removeEventListener('scroll', update);
      document.removeEventListener('focusin', update);
    };
  }, []);
  return area;
}

/** Cancels drags that begin outside the results list. Needs a non-passive listener, which React's own props can't give. */
export function useDragGuard(box: { current: HTMLElement | null }) {
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const guard = (e: TouchEvent) => { if (e.cancelable && dragMovesPage(e.target)) e.preventDefault(); };
    el.addEventListener('touchmove', guard, { passive: false });
    return () => el.removeEventListener('touchmove', guard);
  }, [box]);
}
