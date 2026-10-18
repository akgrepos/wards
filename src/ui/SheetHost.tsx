import { createContext, useContext, useState, type ReactNode } from 'react';
import { AKG } from '../design/akg';

// One sheet at a time (Apple HIG: sheets, not popovers, on iPhone; never stack sheets).
type SheetContent = { title: string; body: ReactNode } | null;
const Ctx = createContext<(c: SheetContent) => void>(() => {});
export const useSheet = () => useContext(Ctx);

export function SheetHost({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<SheetContent>(null);
  return (
    <Ctx.Provider value={setSheet}>
      {children}
      <AKG.Sheet open={!!sheet} onClose={() => setSheet(null)} title={sheet?.title} detent="medium" cancelLabel="Close">
        <div className="sheet-body">{sheet?.body}</div>
      </AKG.Sheet>
    </Ctx.Provider>
  );
}
