import type { ContainerItem, Dose } from '../../src/content/types';
export type OnsetRow = { i: number; name: string; onset: string; lasts: string; dose?: string; sources: string[] };
export function onsetMinutes(text: string | undefined): number | null;
export function onsetRows(items: ContainerItem[], doses: Record<string, Dose> | undefined): OnsetRow[];
