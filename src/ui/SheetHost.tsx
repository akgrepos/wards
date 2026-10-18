import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AKG } from '../design/akg';

// One sheet at a time (Apple HIG: sheets, not popovers, on iPhone; never stack sheets).
// The sheet covers the screen wherever the page is scrolled, opens at half height and can be dragged to full height.
type SheetContent = { title: string; body: ReactNode } | null;
const Ctx = createContext<(c: SheetContent) => void>(() => {});
export const useSheet = () => useContext(Ctx);

export function SheetHost({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<SheetContent>(null);
  // Each new sheet starts fresh (at the top, half height), even when it replaces one that's open.
  const [n, setN] = useState(0);
  const show = (c: SheetContent) => { setSheet(c); if (c) setN((x) => x + 1); };
  // Following a link inside a sheet goes to another page: close the sheet.
  useEffect(() => {
    const close = () => setSheet(null);
    addEventListener('hashchange', close);
    return () => removeEventListener('hashchange', close);
  }, []);
  return (
    <Ctx.Provider value={show}>
      {children}
      <AKG.Sheet key={n} open={!!sheet} onClose={() => setSheet(null)} title={sheet?.title} detents={['medium', 'large']} fixed cancelLabel="Close">
        <div className="sheet-body">{sheet?.body}</div>
      </AKG.Sheet>
    </Ctx.Provider>
  );
}
