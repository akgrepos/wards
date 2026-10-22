import type { Content } from '../../src/content/types';
export const COVERAGE_LEVELS: string[];
export function checkCoverage(id: string, g: unknown, content: Pick<Content, 'data'>): string[];
