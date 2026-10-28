import type { Inline, ListItem } from '../../src/content/types';
export function bandsOf(text: string): { range: string; text: string }[] | null;
export function labelSplit(text: string): { label: string; rest: string } | null;
export function numberedPrefix(text: string): { n: number; rest: string } | null;
export const MONITOR_WORD: Record<'what' | 'when' | 'action', string>;
export function monitorKind(inlines: Inline[]): { kind: 'what' | 'when' | 'action'; skip: number } | null;
export function isMonitorItem(it: ListItem): boolean;
export function doseOnlyItem(inlines: Inline[]): { label: Inline[]; pills: Inline[] } | null;
export function dosePillCount(inlines: Inline[]): number;
