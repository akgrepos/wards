import { describe, expect, it } from 'vitest';
import { loadContent } from '../../scripts/content/load.mjs';
import { checkContent } from '../../scripts/content/check.mjs';
import { parseBlocks } from '../../scripts/content/load.mjs';

const real = loadContent(process.cwd(), { includeExamples: true }) as never as Parameters<typeof checkContent>[0];
type AnyCard = Record<string, unknown>;

function withCard(md: string, extra: AnyCard = {}) {
  const blocks = (lines: string) => parseBlocks(lines.split('\n'));
  const base = JSON.parse(JSON.stringify(real));
  const card = {
    file: 'test.md', id: 'test-card', type: 'condition', variant: null, system: 'renal', group: 'condition', subsection: 'Test Disorders',
    title: 'Test', aliases: [], related: {}, example: true, unknownSections: [], unknownSubsections: [],
    definition: null, basedOn: [], reviewed: null,
    sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: blocks(md), subsections: [] }],
    ...extra,
  };
  base.cards.push(card);
  return checkContent(base);
}
function withDose(fields: Record<string, unknown>) {
  const base = JSON.parse(JSON.stringify(real));
  base.data.dose['test-dose'] = { drug_name: 'Testdrug', indication: 'Test', route: 'IV', amount: 1, unit: 'mg', frequency: 'once', sources: ['example-guideline-a'], _file: 'test.yaml', ...fields };
  return checkContent(base).join('\n');
}
const kp = (extra: string) => `- One ^[example-guideline-a]\n- Two ^[example-guideline-a]\n- Three ^[example-guideline-a]\n${extra}`;

function withRegimen(fields: Record<string, unknown>) {
  const base = JSON.parse(JSON.stringify(real));
  base.data.regimen ??= {};
  base.data.regimen['test-regimen'] = { name: 'Test', options: [{ doses: ['example-drug-standard'] }], sources: ['example-guideline-a'], _file: 'test.yaml', ...fields };
  return checkContent(base).join('\n');
}

describe('content checks', () => {
  it('all content passes', () => {
    expect(checkContent(real)).toEqual([]);
  });
  it('rejects a dose typed as text', () => {
    expect(withCard(kp('- Give 40 mg daily ^[example-guideline-a]')).join()).toMatch(/dose typed as text/);
  });
  it('allows concentrations like mmol/L', () => {
    expect(withCard(kp('- Level above 6.5 mmol/L ^[example-guideline-a]'))).toEqual([]);
  });
  it('rejects a line without a source', () => {
    expect(withCard(kp('- An unsourced claim')).join()).toMatch(/has no source/);
  });
  it('rejects an unknown source and an unknown insert', () => {
    const e = withCard(kp('- Text {{threshold:nope}} ^[no-such-source]')).join();
    expect(e).toMatch(/unknown source "no-such-source"/);
    expect(e).toMatch(/unknown threshold "nope"/);
  });
  it('requires 3–6 bullets in At a Glance', () => {
    expect(withCard('- Only one ^[example-guideline-a]').join()).toMatch(/3–6 bullets/);
  });
  it('puts every dose on a line of its own, never inside a sentence', () => {
    expect(withCard(kp('- Give {{dose:example-drug-standard}} now ^[example-guideline-a]')).join()).toMatch(/on a line of its own/);
    expect(withCard(kp('\n{{dose:example-drug-standard}}'))).toEqual([]);
  });
  it('checks regimens: known doses, known fields, no typed doses, inserted on a line of its own', () => {
    expect(withRegimen({})).toBe('');
    expect(withRegimen({ options: [{ doses: [['example-drug-standard', 'nope']] }] })).toMatch(/unknown dose "nope"/);
    expect(withRegimen({ options: [] })).toMatch(/at least one option/);
    expect(withRegimen({ options: [{ label: 'A' }] })).toMatch(/needs "doses"/);
    expect(withRegimen({ colour: 'red' })).toMatch(/unknown regimen field "colour"/);
    expect(withRegimen({ duration: 'Give 500 mg for 5 days' })).toMatch(/dose typed as text/);
    expect(withRegimen({ sources: [] })).toMatch(/has no sources/);
  });
  it('checks scale, comparison and time blocks', () => {
    expect(withCard(kp(':::scale Grades\n- Mild: low ^[example-guideline-a]\n:::')).join()).toMatch(/needs 2–5 items/);
    expect(withCard(kp(':::compare Q\n- A: yes ^[example-guideline-a]\n- B ^[example-guideline-a]\n:::')).join()).toMatch(/"Label: text"/);
    expect(withCard(kp(':::times Recheck\n- 1 h\n:::')).join()).toMatch(/has no source/);
    expect(withCard(kp(':::chart X\n- a\n:::')).join()).toMatch(/unknown block/);
  });
  it('lets a sub-bullet use its parent line’s source', () => {
    expect(withCard(kp('- Lead-in: ^[example-guideline-a]\n  - Sub-item')).join()).not.toMatch(/has no source/);
    expect(withCard(kp('- Lead-in:\n  - Sub-item')).join()).toMatch(/has no source/);
  });
  it('checks section links and tags', () => {
    expect(withCard(kp('- See [[renal-aki/diagnosis|Diagnosis]]. ^[example-guideline-a]')).join()).not.toMatch(/unknown section/);
    expect(withCard(kp('- See [[renal-aki/nowhere|it]]. ^[example-guideline-a]')).join()).toMatch(/unknown section "nowhere"/);
    expect(withCard(kp('- **Cause** [!cannot-miss]: text ^[example-guideline-a]')).join()).not.toMatch(/unknown tag/);
    expect(withCard(kp('- **Cause** [!urgent]: text ^[example-guideline-a]')).join()).toMatch(/unknown tag/);
  });
  it('checks onset comparisons', () => {
    const ok = ':::onset Compare\n- {{dose:calcium-gluconate-hyperkalemia}}\n- Dialysis: Immediate | Variable ^[example-guideline-a]\n:::';
    expect(withCard(kp(ok)).join()).toBe('');
    expect(withCard(kp(':::onset Compare\n- {{dose:dextrose-50-hyperkalemia}}\n- Dialysis: Immediate ^[example-guideline-a]\n:::')).join()).toMatch(/needs an "onset"/);
    expect(withCard(kp(':::onset Compare\n- {{dose:calcium-gluconate-hyperkalemia}}\n- Dialysis: soon ^[example-guideline-a]\n:::')).join()).toMatch(/each :::onset item/);
    expect(withCard(kp(':::onset Compare\n- {{dose:calcium-gluconate-hyperkalemia}}\n- Dialysis: Immediate\n:::')).join()).toMatch(/has no source/);
  });
  it('needs a definition and a reviewed date on topic pages', () => {
    const e = withCard(kp(''), { example: false }).join();
    expect(e).toMatch(/one-line "definition"/);
    expect(e).toMatch(/"reviewed" date/);
  });
  it('allows ### only inside More Information', () => {
    expect(withCard(kp(''), { unknownSubsections: ['At a Glance › Extra'] }).join()).toMatch(/not a More Information subsection/);
  });
  it('checks the dose sheet fields', () => {
    expect(withDose({ frequency: undefined })).toMatch(/needs a "frequency" or a "rate"/);
    expect(withDose({ frequency: undefined, rate: 'over 10 minutes' })).toBe('');
    expect(withDose({ boxed: 'x' })).toMatch(/unknown dose field "boxed"/);
    expect(withDose({ alternative: { dose: 'no-such-dose' } })).toMatch(/alternative dose "no-such-dose" does not exist/);
    expect(withDose({ cautions: 'one string' })).toMatch(/cautions must be a list/);
  });
});

describe('tappable cutoffs', () => {
  function withNote(note: string | undefined, md: string, field = 'note') {
    const base = JSON.parse(JSON.stringify(real));
    base.data.threshold['test-cut'] = { name: 'Potassium needing an urgent ECG', value: '≥6.0', unit: 'mEq/L', sources: ['example-guideline-a'], _file: 'test-cut.yaml', ...(note === undefined ? {} : { [field]: note }) };
    base.cards.push({
      file: 'test.md', id: 'test-card', type: 'condition', variant: null, system: 'renal', group: 'condition', subsection: 'Test Disorders',
      title: 'Test', aliases: [], related: {}, example: true, unknownSections: [], unknownSubsections: [], definition: null, basedOn: [], reviewed: null,
      sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: parseBlocks(kp(md).split('\n')), subsections: [] }],
    });
    return checkContent(base).join('\n');
  }
  it('allows a note that adds what the line does not say', () => {
    expect(withNote('Only in individual high-risk circumstances.', '- STAT 12-lead ECG at {{threshold:test-cut}}. ^[example-guideline-a]')).toBe('');
    expect(withNote(undefined, '| A | B |\n|---|---|\n| K | {{threshold:test-cut}} ^[example-guideline-a] |')).toBe('');
  });
  it('rejects a note that repeats the line, its value, or is only used where values are plain', () => {
    expect(withNote('All hospitalized patients at or above this level need an urgent 12-lead ECG.', '- STAT 12-lead ECG at {{threshold:test-cut}}. ^[example-guideline-a]')).toMatch(/note mostly repeats/);
    expect(withNote('Potassium 6.0 mEq/L or higher.', '- Check at {{threshold:test-cut}}. ^[example-guideline-a]')).toMatch(/note repeats the value/);
    expect(withNote('Suggests a different population entirely.', '| A | B |\n|---|---|\n| K | {{threshold:test-cut}} ^[example-guideline-a] |')).toMatch(/only appears in tables or scales/);
    expect(withNote('Something new.', '- At {{threshold:test-cut}}. ^[example-guideline-a]', 'meaning')).toMatch(/"meaning" is now "note"/);
  });
});

describe('card format', () => {
  it('reads numbered steps with their own content, and containers', () => {
    const b = parseBlocks(['1. Stabilize', '   - Calcium first. ^[s]', '', '   {{dose:x}}', '2. Shift', '', ':::times Recheck ^[s]', '- 1 h', '- 2 h', ':::']) as { t: string; items: { blocks?: { t: string }[]; text?: string }[] }[];
    expect(b.map((x) => x.t)).toEqual(['steps', 'times']);
    expect(b[0].items[0].blocks!.map((x) => x.t)).toEqual(['list', 'insert']);
    expect(b[1].items.map((x) => x.text)).toEqual(['1 h', '2 h']);
  });
  it('the migrated cards use the new sections', () => {
    const hk = real.cards.find((c) => (c as { id: string }).id === 'renal-hyperkalemia') as unknown as { sections: { key: string; subsections: { key: string }[] }[] };
    expect(hk.sections.map((s) => s.key)).toEqual(['at-a-glance', 'severity', 'causes', 'presentation', 'diagnosis', 'treatment', 'monitor', 'escalation', 'more', 'pearls']);
    expect(hk.sections.find((s) => s.key === 'more')!.subsections.map((s) => s.key)).toEqual(['guidelines-differ', 'special-populations', 'complications', 'after-acute', 'epi-patho']);
    const aki = real.cards.find((c) => (c as { id: string }).id === 'renal-aki') as unknown as { sections: { key: string }[] };
    expect(aki.sections.map((s) => s.key)).toEqual(['at-a-glance', 'definition', 'first-steps', 'causes', 'presentation', 'diagnosis', 'treatment', 'escalation', 'more', 'pearls']);
  });
});

describe('emergency (Do Now) sections', () => {
  const steps = (md: string) => parseBlocks(md.split('\n'));
  const OK = [
    '1. Stabilize',
    '   - If: ECG changes ^[example-guideline-a]',
    '   - Check: Glucose first. ^[example-guideline-a]',
    '',
    '   {{dose:example-drug-standard}}',
    '',
    '   - Warning: Hypoglycemia ^[example-guideline-a]',
    '2. Remove',
    '   - Dialysis if refractory. ^[example-guideline-a]',
  ].join('\n');
  function withEmergency(md: string, extra: AnyCard = {}, hint: string | null = 'Stabilize, then remove') {
    const base = JSON.parse(JSON.stringify(real));
    base.cards.push({
      file: 'test.md', id: 'test-card', type: 'condition', variant: null, system: 'renal', group: 'condition', subsection: 'Test Disorders',
      title: 'Test', aliases: [], related: {}, example: true, unknownSections: [], unknownSubsections: [], definition: null, basedOn: [], reviewed: null,
      sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: steps(kp('')), subsections: [] }],
      emergency: { hint, blocks: steps(md) },
      ...extra,
    });
    return checkContent(base).join('\n');
  }
  it('accepts steps with a condition, checks, doses, warnings and notes', () => {
    expect(withEmergency(OK)).toBe('');
  });
  it('the Hyperkalemia emergency follows the format and AKI has none', () => {
    const hk = real.cards.find((c) => (c as { id: string }).id === 'renal-hyperkalemia') as unknown as { emergency: { hint: string; blocks: { t: string }[] } };
    expect(hk.emergency.hint).toBeTruthy();
    expect(hk.emergency.blocks.map((b) => b.t)).toEqual(['steps', 'note']);
    const aki = real.cards.find((c) => (c as { id: string }).id === 'renal-aki') as unknown as { emergency: unknown };
    expect(aki.emergency).toBeNull();
  });
  it('needs a short hint and a topic card', () => {
    expect(withEmergency(OK, {}, null)).toMatch(/needs "emergency_hint"/);
    expect(withEmergency(OK, {}, 'x'.repeat(51))).toMatch(/over 50 characters/);
    expect(withEmergency(OK, { type: 'procedure', group: 'reference', subsection: null, sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: steps(kp('')), subsections: [] }] })).toMatch(/can't have an emergency/);
    expect(withEmergency(OK, { emergency: null, emergencyHintOnly: true })).toMatch(/only for a topic with a "## Do Now"/);
  });
  it('rejects lines without sources, typed doses and doses inside sentences', () => {
    expect(withEmergency(OK + '\n   - An unsourced line')).toMatch(/has no source/);
    expect(withEmergency(OK + '\n   - Give 40 mg now ^[example-guideline-a]')).toMatch(/dose typed as text/);
    expect(withEmergency(OK + '\n   - Give {{dose:example-drug-standard}} now ^[example-guideline-a]')).toMatch(/on a line of its own/);
  });
  it('rejects what doesn’t follow the Do Now format', () => {
    expect(withEmergency('- Not steps ^[example-guideline-a]')).toMatch(/starts with numbered steps/);
    expect(withEmergency('1. Only one\n   - A line. ^[example-guideline-a]')).toMatch(/needs 2–8 steps/);
    expect(withEmergency(OK + '\n   - If: Late condition ^[example-guideline-a]')).toMatch(/"If:" line comes first/);
    expect(withEmergency(OK + '\n   - Warning: A warning that is far too long ^[example-guideline-a]')).toMatch(/one to three words/);
    expect(withEmergency(OK + '\n3. Empty')).toMatch(/has nothing to do/);
    expect(withEmergency(OK + '\n\n- A loose bullet ^[example-guideline-a]')).toMatch(/only :::note boxes/);
  });
  it('checks the recheck times Timed Mode lists under Due Next', () => {
    const times = (head: string, items = '- 1 h') => withEmergency(OK, { sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: steps(kp(`:::times${head} Recheck ^[example-guideline-a]\n${items}\n:::`)), subsections: [] }] });
    expect(times('{after=first check="K⁺"}')).toBe('');
    expect(times('{after=example-drug-standard check=Glucose unit=min}', '- 30')).toBe('');
    expect(times('{after=no-such-dose check=Glucose}')).toMatch(/must be "first" or a dose in this topic's Do Now/);
    expect(times('{after=first}')).toMatch(/needs after= .* and check=/);
    expect(times('{after=first check=K}', '- soon')).toMatch(/every time needs a number and a unit/);
    expect(times('{after=first check=K color=red}')).toMatch(/unknown :::times setting "color"/);
  });
});

describe('MDCalc links', () => {
  const withCalc = (fields: Record<string, unknown>, id = 'test-calc') => {
    const base = JSON.parse(JSON.stringify(real));
    base.data.calc ??= {};
    base.data.calc[id] = { name: 'Test score', short: 'TESTSCORE', url: 'https://www.mdcalc.com/calc/1/test-score', match: ['TESTSCORE'], _file: 'test.yaml', ...fields };
    return checkContent(base).join('\n');
  };
  it('a score named in a card without its link is rejected', () => {
    expect(withCard(kp('- Use CURB-65 to choose the site of care. ^[example-guideline-a]')).join('\n')).toMatch(/names "CURB-65", a calculator; write \{\{calc:curb-65\}\}/);
  });
  it('accepts the link, with or without different words', () => {
    expect(withCard(kp('- Use {{calc:curb-65}} to choose the site of care. ^[example-guideline-a]')).join('\n')).not.toMatch(/calculator/);
    expect(withCard(kp('- {{calc:anion-gap|Anion gap}} is high. ^[example-guideline-a]')).join('\n')).not.toMatch(/calculator/);
  });
  it('does not mistake qSOFA for SOFA or NEWS2 for NEWS', () => {
    expect(withCard(kp('- {{calc:qsofa}}, {{calc:news2}} and {{calc:sofa}} differ. ^[example-guideline-a]')).join('\n')).not.toMatch(/calculator/);
  });
  it('rejects a link to an unknown calculator and one on a line of its own', () => {
    expect(withCard(kp('- See {{calc:no-such-score}}. ^[example-guideline-a]')).join('\n')).toMatch(/unknown calc "no-such-score"/);
    expect(withCard(kp('{{calc:curb-65}}')).join('\n')).toMatch(/inside a sentence/);
  });
  it('a calculator item needs an MDCalc address and match words', () => {
    expect(withCalc({ url: 'https://example.com/calc/1/x' })).toMatch(/MDCalc calculator page/);
    expect(withCalc({ match: [] })).toMatch(/match/);
    expect(withCalc({ url: 'https://www.mdcalc.com/calc/324/curb-65-score-pneumonia-severity' })).toMatch(/same url as calculator/);
    expect(withCalc({ match: ['curb-65'] })).toMatch(/also a match word/);
    expect(withCalc({ colour: 'blue' })).toMatch(/unknown calculator field/);
  });
});
