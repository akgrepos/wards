export const MEDIA_KINDS: string[];
export const MEDIA_FIELDS: string[];
export const MARK_KINDS: Record<string, string[]>;
export function samples(text: string): number[];
export function checkMedia(id: string, item: Record<string, unknown>, ctx: { data: Record<string, Record<string, any> | undefined> }): string[];
