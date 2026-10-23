export function strayInText(text: string, sourceIds?: string[]): string | null;
export function midRowSource(line: string): boolean;
export function checkStraySources(content: { cards: unknown[]; data: Record<string, Record<string, unknown>> }): string[];
