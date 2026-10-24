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
  it('an MDCalc link keeps its name, opens outside the app and shows an arrow', () => {
    render(<p><Inlines xs={parseInline('{{calc:4at}}')} /></p>);
    const a = screen.getByRole('link');
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('aria-label')).toMatch(/MDCalc/);
    expect(a.querySelector('.calc-link__mark svg')).toBeTruthy();
  });
});
