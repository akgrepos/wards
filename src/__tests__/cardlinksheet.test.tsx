import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { parseInline } from '../../scripts/content/inline.mjs';
import { getCard } from '../content';
import { Inlines } from '../ui/Rich';
import { SheetHost } from '../ui/SheetHost';

afterEach(cleanup);

describe('card link sheet', () => {
  it('is titled with the linked card, never the generic word "Card"', () => {
    const card = getCard('renal-aki')!;
    render(<SheetHost><p><Inlines xs={parseInline('See [[renal-aki|AKI]].')} /></p></SheetHost>);
    fireEvent.click(screen.getByRole('button', { name: 'AKI' }));
    expect(screen.getAllByText(card.title).length).toBeGreaterThan(0);
    expect(screen.queryByText('Card')).toBeNull();
  });
  it('a score named on a card keeps its name, shows an arrow and opens its pop-up', () => {
    render(<p><Inlines xs={parseInline('{{calc:cam-icu}}')} /></p>);
    const b = screen.getByRole('button');
    expect(b.getAttribute('aria-label')).toMatch(/Opens details/);
    expect(b.querySelector('.calc-link__mark svg')).toBeTruthy();
  });
});
