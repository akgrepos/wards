export function checkContent(content: { systems: { id: string }[]; cards: unknown[]; data: Record<string, Record<string, unknown>> }): string[];
export function checkWarnings(content: { systems?: unknown[]; cards: unknown[]; data: Record<string, Record<string, unknown>> }, options?: { today?: Date }): string[];
