import { describe, expect, it } from 'vitest';
import { severityLadderLines } from './severity.mjs';

describe('severityLadderLines', () => {
  it('flags a run of two or more level bullets written outside a :::scale block', () => {
    expect(severityLadderLines('## Severity\n- Mild: pain only\n- Severe: needs admission\n')).toEqual([2]);
  });
  it('does not flag a ladder inside a :::scale block, or a single level bullet', () => {
    expect(severityLadderLines(':::scale Severity\n- Mild: pain only\n- Severe: needs admission\n:::\n')).toEqual([]);
    expect(severityLadderLines('- Severe: needs admission\n')).toEqual([]);
  });
});
