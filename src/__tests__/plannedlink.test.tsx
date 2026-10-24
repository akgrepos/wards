import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { parseInline } from '../../scripts/content/inline.mjs';
import { Inlines } from '../ui/Rich';

afterEach(cleanup);

describe('planned links', () => {
  it('a link to a card that does not exist yet shows as plain words, with no tap target', () => {
    render(<p><Inlines xs={parseInline('See [[not-written-yet|Future card]] and [[renal-aki|AKI]].')} /></p>);
    expect(screen.queryByRole('link', { name: 'Future card' })).toBeNull();
    expect(screen.getByText(/Future card/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'AKI' })).toBeTruthy();
  });
});
