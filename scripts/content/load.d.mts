export function loadContent(root: string, opts?: { includeExamples?: boolean }): { systems: unknown[]; cards: { file: string }[]; data: Record<string, Record<string, unknown>> };
export function parseBlocks(lines: string[]): unknown[];
