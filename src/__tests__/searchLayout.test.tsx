import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SEARCH_OPEN_CLASS, dragMovesPage, isKeyboardOpen, lockPage, readVisibleArea, useDragGuard } from '../searchLayout';

afterEach(() => { cleanup(); document.documentElement.className = ''; });

describe('search layout', () => {
  it('reads the visible area rounded, and nothing without visualViewport', () => {
    expect(readVisibleArea({ offsetTop: 0.4, height: 503.6 })).toEqual({ top: 0, height: 504 });
    expect(readVisibleArea(null)).toBeNull();
  });

  it('calls the keyboard open only when it takes a big part of the window', () => {
    expect(isKeyboardOpen({ top: 0, height: 500 }, 852)).toBe(true);
    expect(isKeyboardOpen({ top: 0, height: 800 }, 852)).toBe(false);
    expect(isKeyboardOpen(null, 852)).toBe(false);
  });

  it('pins the page while Search is open and releases it on close', () => {
    const undo = lockPage();
    expect(document.documentElement.classList.contains(SEARCH_OPEN_CLASS)).toBe(true);
    undo();
    expect(document.documentElement.classList.contains(SEARCH_OPEN_CLASS)).toBe(false);
  });

  it('lets only the results list scroll', () => {
    document.body.innerHTML = '<div id="box"><div class="search-scroll"><p id="row">r</p></div><div id="bar"><input id="f"></div></div>';
    expect(dragMovesPage(document.getElementById('row'))).toBe(false);
    expect(dragMovesPage(document.getElementById('f'))).toBe(true);
    expect(dragMovesPage(document.getElementById('bar'))).toBe(true);
    expect(dragMovesPage(document.getElementById('box'))).toBe(true);
  });

  it('cancels a drag that starts on the bar but not one on the list', () => {
    function Probe() {
      const ref = { current: null as HTMLElement | null };
      useDragGuard(ref);
      return <div ref={(el) => { ref.current = el; }}><div className="search-scroll"><i data-testid="row" /></div><b data-testid="bar" /></div>;
    }
    const { getByTestId } = render(<Probe />);
    const move = (el: Element) => { const e = new Event('touchmove', { bubbles: true, cancelable: true }); act(() => { el.dispatchEvent(e); }); return e.defaultPrevented; };
    expect(move(getByTestId('bar'))).toBe(true);
    expect(move(getByTestId('row'))).toBe(false);
    vi.restoreAllMocks();
  });
});
