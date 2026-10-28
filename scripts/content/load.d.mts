export function loadContent(root: string, opts?: { includeExamples?: boolean; tag?: boolean }): { systems: unknown[]; cards: { file: string }[]; data: Record<string, Record<string, unknown>>; unchecked: string[] };
export function parseBlocks(lines: string[]): unknown[];
