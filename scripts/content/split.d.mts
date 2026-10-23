export function splitContent(content: { systems: unknown[]; cards: { file: string }[]; data: Record<string, Record<string, unknown>> }): {
  index: unknown;
  cards: Record<string, unknown>;
  files: string[];
};
