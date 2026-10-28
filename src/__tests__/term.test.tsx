import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { parseInline } from '../../scripts/content/inline.mjs';
import { content, getCard } from '../content';
import { search } from '../content/search';
import { Inlines } from '../ui/Rich';
import { SheetHost } from '../ui/SheetHost';

afterEach(cleanup);

const terms = content.data.term as Record<string, { term: string; definition: string; snippet?: string[]; card?: string }>;

describe('terms', () => {
  it('a tagged mention opens a sheet with the definition', () => {
    render(<SheetHost><p><Inlines xs={[{ t: 'text', v: 'Seen with ' }, { t: 'insert', kind: 'term', id: 'catatonia', label: 'catatonia' }]} /></p></SheetHost>);
    fireEvent.click(screen.getByRole('button', { name: /catatonia/ }));
    expect(screen.getByText(terms.catatonia.definition)).toBeTruthy();
  });
  it('is tagged into the Delirium card text', () => {
    const card = getCard('neuro-delirium')!;
    expect(JSON.stringify(card.sections)).toContain('"kind":"term"');
  });
  it('a link to a card with a snippet shows the snippet and a row that opens the card', () => {
    render(<SheetHost><p><Inlines xs={parseInline('See [[endo-dka|DKA]].')} /></p></SheetHost>);
    fireEvent.click(screen.getByRole('button', { name: 'DKA' }));
    expect(screen.getByText('Key points')).toBeTruthy();
    expect(screen.getByText(terms.dka.snippet![0])).toBeTruthy();
    expect(screen.getByText(`Open full ${getCard('endo-dka')!.title}`)).toBeTruthy();
  });
  it('a link naming a section keeps opening that section', () => {
    render(<SheetHost><p><Inlines xs={parseInline('See [[endo-dka/treatment|DKA treatment]].')} /></p></SheetHost>);
    fireEvent.click(screen.getByRole('button', { name: 'DKA treatment' }));
    expect(screen.queryByText('Key points')).toBeNull();
  });
  it('search finds a term by an alias', () => {
    const hits = search('NCSE', content).groups.find((g) => g.key === 'terms')?.hits ?? [];
    expect(hits.map((h) => h.term)).toContain('nonconvulsive-status-epilepticus');
  });
});
