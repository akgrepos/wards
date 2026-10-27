import { describe, expect, it } from 'vitest';
import { loadContent } from '../../scripts/content/load.mjs';
import { checkContent, checkWarnings } from '../../scripts/content/check.mjs';
import { parseBlocks } from '../../scripts/content/load.mjs';
import { hasSemicolon } from '../../scripts/content/semicolons.mjs';
import { midRowSource } from '../../scripts/content/stray-sources.mjs';

const real = loadContent(process.cwd(), { includeExamples: true }) as never as Parameters<typeof checkContent>[0];
type AnyCard = Record<string, unknown>;

function withCard(md: string, extra: AnyCard = {}) {
  const blocks = (lines: string) => parseBlocks(lines.split('\n'));
  const base = JSON.parse(JSON.stringify(real));
  const card = {
    file: 'test.md', id: 'test-card', type: 'topic', variant: null, system: 'renal', group: 'condition', subsection: 'Test Disorders',
    title: 'Test', aliases: [], related: {}, example: true, unknownSections: [], unknownSubsections: [],
    definition: null, basedOn: [], checked: null,
    sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: blocks(md), subsections: [] }],
    ...extra,
  };
  base.cards.push(card);
  return checkContent(base);
}
function withDose(fields: Record<string, unknown>) {
  const base = JSON.parse(JSON.stringify(real));
  base.data.dose['test-dose'] = { drug: 'ceftriaxone', drug_name: 'Testdrug', indication: 'Test', route: 'IV', amount: 1, unit: 'mg', frequency: 'once', sources: ['example-guideline-a'], verification: { read: 'not-verified', date: '2026-10-23' }, _file: 'test.yaml', ...fields };
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
    // A pill is the one way a dose goes inside a sentence.
    expect(withCard(kp('- Give {{dose:example-drug-standard|pill}} now ^[example-guideline-a]'))).toEqual([]);
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
  it('needs a definition on topic pages', () => {
    const e = withCard(kp(''), { example: false }).join();
    expect(e).toMatch(/one-line "definition"/);
  });
  it('allows ### only inside More Information', () => {
    expect(withCard(kp(''), { unknownSubsections: ['At a Glance › Extra'] }).join()).toMatch(/not a More Information subsection/);
  });
  it('checks the dose sheet fields', () => {
    expect(withDose({ frequency: undefined })).toMatch(/needs a "frequency" or a "rate"/);
    expect(withDose({ frequency: undefined, rate: 'over 10 minutes' })).toBe('');
    expect(withDose({ boxed: 'x' })).toMatch(/unknown dose field "boxed"/);
    expect(withDose({ drug: undefined })).toMatch(/missing "drug"/);
    expect(withDose({ drug: 'nosuchdrug' })).toMatch(/drug "nosuchdrug" does not exist/);
    expect(withDose({ alternative: { dose: 'no-such-dose' } })).toMatch(/alternative dose "no-such-dose" does not exist/);
    expect(withDose({ cautions: 'one string' })).toMatch(/cautions must be a list/);
  });
  it('keeps the indication of a medication card dose short, with long wording in indication_detail', () => {
    const base = JSON.parse(JSON.stringify(real));
    base.data.dose['ceftriaxone-iv'].indication = 'x'.repeat(80);
    expect(checkContent(base).join('\n')).toMatch(/ceftriaxone-iv[\s\S]*keep it to 70 characters/);
    base.data.dose['ceftriaxone-iv'].indication = 'Short title';
    base.data.dose['ceftriaxone-iv'].indication_detail = '';
    expect(checkContent(base).join('\n')).toMatch(/indication_detail must be text/);
  });
  it('requires a verification note on every dose', () => {
    expect(withDose({ verification: undefined })).toMatch(/no "verification" note[\s\S]*docs\/DATA-TYPES\.md/);
    expect(withDose({ verification: { read: 'skimmed', date: '2026-10-23' } })).toMatch(/"read" must be one of/);
    expect(withDose({ verification: { read: 'full-text', date: '2026-10-23' } })).toMatch(/needs the "source"/);
    expect(withDose({ verification: { read: 'full-text', source: 'example-guideline-a', date: '23 Oct' } })).toMatch(/YYYY-MM-DD/);
    expect(withDose({ verification: { read: 'full-text', source: 'example-trial-b', date: '2026-10-23' } })).toMatch(/must be one of the item's own sources/);
    expect(withDose({ verification: { read: 'fda-label', source: 'example-guideline-a', date: '2026-10-23' } })).toMatch(/prescribing-information label/);
    expect(withDose({ verification: { read: 'common-practice', date: '2026-10-23' } })).toMatch(/common-practice source/);
    expect(withDose({ verification: { read: 'full-text', source: 'example-guideline-a', date: '2026-10-23' } })).toBe('');
    expect(withDose({ sources: ['example-guideline-a', 'common-practice'], verification: { read: 'common-practice', date: '2026-10-23' } })).toBe('');
  });
  it('requires a verification note on every in-app calculator', () => {
    const base = JSON.parse(JSON.stringify(real));
    delete base.data.calc['anion-gap'].verification;
    expect(checkContent(base).join(' ')).toMatch(/anion-gap.yaml: has no "verification" note/);
  });
});

describe('tappable cutoffs', () => {
  function withNote(note: string | undefined, md: string, field = 'note') {
    const base = JSON.parse(JSON.stringify(real));
    base.data.threshold['test-cut'] = { name: 'Potassium needing an urgent ECG', value: '≥6.0', unit: 'mEq/L', sources: ['example-guideline-a'], _file: 'test-cut.yaml', ...(note === undefined ? {} : { [field]: note }) };
    base.cards.push({
      file: 'test.md', id: 'test-card', type: 'topic', variant: null, system: 'renal', group: 'condition', subsection: 'Test Disorders',
      title: 'Test', aliases: [], related: {}, example: true, unknownSections: [], unknownSubsections: [], definition: null, basedOn: [], checked: null,
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
  it('keeps sub-bullets nested under their lead-in inside a numbered step, at any indent', () => {
    for (const pad of ['  ', '   ', '    ']) {
      const [steps] = parseBlocks(['1. Treat', `${pad}- SIADH:`, `${pad}  - Restrict fluids`, `${pad}  - Stop drugs`, `${pad}- Heart failure: loop diuretic`]) as unknown as { items: { blocks: { items: { children: unknown[] }[] }[] }[] }[];
      const list = steps.items[0].blocks[0];
      expect(list.items.map((i) => i.children.length)).toEqual([2, 0]);
    }
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
      file: 'test.md', id: 'test-card', type: 'topic', variant: null, system: 'renal', group: 'condition', subsection: 'Test Disorders',
      title: 'Test', aliases: [], related: {}, example: true, unknownSections: [], unknownSubsections: [], definition: null, basedOn: [], checked: null,
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

describe('consistency rules', () => {
  const clone = () => JSON.parse(JSON.stringify(real));
  const warnings = (base: ReturnType<typeof clone>, today?: Date) => checkWarnings(base, { today }).join('\n');
  const addCard = (extra: AnyCard, md = kp('')) => {
    const base = clone();
    base.cards.push({
      file: 'test.md', id: 'test-card', type: 'topic', variant: null, system: 'renal', group: 'condition', subsection: 'Electrolyte Disorders',
      title: 'Test', aliases: [], related: {}, example: false, unknownSections: [], unknownSubsections: [], definition: null, basedOn: [], checked: null,
      sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: parseBlocks(md.split('\n')), subsections: [] }], ...extra,
    });
    return base;
  };
  const errorsOf = (base: ReturnType<typeof clone>) => checkContent(base).join('\n');

  it('rejects an alias used by two cards (case does not matter)', () => {
    expect(errorsOf(addCard({ aliases: ['AKI'] }))).toMatch(/duplicate alias: "AKI" is also an alias of renal-aki/);
    expect(errorsOf(addCard({ aliases: ['a-unique-word'] }))).not.toMatch(/duplicate alias/);
  });
  it('warns about alias bloat', () => {
    expect(warnings(addCard({ aliases: Array.from({ length: 31 }, (_, i) => `word${i}`) }))).toMatch(/alias bloat: 31 aliases/);
  });
  it('warns about a source nothing cites', () => {
    const base = clone();
    base.data.source['orphan-source'] = { kind: 'guideline', short: 'X', title: 'X', year: 2020, _file: 'orphan.yaml' };
    expect(warnings(base)).toMatch(/unused source: "orphan-source"/);
  });
  it('allows tags only in Causes and bans a category that repeats the tag', () => {
    expect(errorsOf(addCard({}, kp('- **Cause** [!cannot-miss]: text ^[example-guideline-a]')))).toMatch(/tags rule: "At a Glance" uses/);
    const causes = (line: string) => addCard({ sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: parseBlocks(kp('').split('\n')), subsections: [] }, { key: 'causes', title: 'Causes', blocks: parseBlocks(line.split('\n')), subsections: [] }] });
    expect(errorsOf(causes('- **Infection:** [!most-common] pneumonia. ^[example-guideline-a]'))).not.toMatch(/tags rule/);
    expect(errorsOf(causes('- **Cannot miss:** [!cannot-miss] PE. ^[example-guideline-a]'))).toMatch(/category "Cannot miss" repeats a tag/);
  });
  it('checks a subsection against its system\'s allowed names', () => {
    expect(errorsOf(addCard({ subsection: 'Electrolyte Disorders' }))).not.toMatch(/subsection vocabulary/);
    expect(errorsOf(addCard({ subsection: 'Electrolytes' }))).toMatch(/subsection vocabulary: "Electrolytes" is not an allowed subsection of "renal"/);
    expect(errorsOf(addCard({ system: 'liver' }))).toMatch(/subsection vocabulary: system "liver" has no "subsections" list/);
  });
  it('caps tables at four columns, with a listed exception', () => {
    const wide = '| A | B | C | D | E |\n|---|---|---|---|---|\n| 1 | 2 | 3 | 4 | 5 | ^[example-guideline-a]';
    expect(errorsOf(addCard({}, kp(wide)))).toMatch(/table width: "At a Glance" has a 5-column table/);
    expect(errorsOf(addCard({}, kp('| A | B |\n|---|---|\n| 1 | 2 | ^[example-guideline-a]')))).not.toMatch(/table width/);
  });
  it('allows a planned link and warns about it; related links must be reciprocal (an error)', () => {
    const planned = addCard({}, kp('- See [[not-written-yet]]. ^[example-guideline-a]'));
    expect(errorsOf(planned)).not.toMatch(/unknown card/);
    expect(warnings(planned)).toMatch(/planned links: \[\[not-written-yet\]\]/);
    expect(errorsOf(addCard({ related: { see: ['renal-aki'] } }))).toMatch(/test.md: related rule, renal-aki/);
  });
  it('warns when checked is over 12 months old', () => {
    const base = addCard({ checked: { date: '2025-01-15', by: 'owner', scope: 'owner review' } });
    expect(warnings(base, new Date('2026-01-14'))).not.toMatch(/months old/);
    expect(warnings(base, new Date('2026-02-01'))).toMatch(/checked 2025-01-15 is over 12 months old/);
  });
  it('needs a checked stamp unless the draft is listed in unchecked.txt', () => {
    const stamp = { date: '2026-10-24', by: 'opus', scope: 'doses and numbers' };
    const withList = (extra: AnyCard, unchecked: string[] = []) => { const b = addCard(extra); b.unchecked = [...b.unchecked, ...unchecked]; return errorsOf(b); };
    expect(withList({})).toMatch(/test.md: has no "checked" stamp/);
    expect(withList({}, ['test-card'])).not.toMatch(/"checked" stamp/);
    expect(withList({ checked: stamp })).not.toMatch(/checked/);
    expect(withList({ checked: stamp }, ['test-card'])).toMatch(/listed in content\/unchecked.txt/);
    expect(withList({ checked: { ...stamp, by: 'someone' } })).toMatch(/"by" must be one of opus, owner/);
    expect(withList({ checked: { ...stamp, date: '24 Oct' } })).toMatch(/checked needs a date/);
    expect(withList({ checked: { ...stamp, scope: null } })).toMatch(/needs a short "scope"/);
  });
  it('every real card has a checked stamp or is listed as a draft', () => {
    const unchecked = (real as unknown as { unchecked: string[] }).unchecked;
    const missing = real.cards.filter((c) => { const k = c as unknown as AnyCard; return !k.example && !k.checked && !unchecked.includes(k.id as string); });
    expect(missing).toEqual([]);
  });
  it('warns when a Do Now dose is missing from Treatment', () => {
    const base = addCard({
      emergency: { hint: 'Test', blocks: parseBlocks(['1. Give it', '', '   {{dose:example-drug-standard}}']) },
      sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: parseBlocks(kp('').split('\n')), subsections: [] }, { key: 'treatment', title: 'Treatment', blocks: parseBlocks(['- Supportive care. ^[example-guideline-a]']), subsections: [] }],
    });
    expect(warnings(base)).toMatch(/Do Now dose not in Treatment: example-drug-standard/);
    base.cards.at(-1).sections[1].blocks = parseBlocks(['{{dose:example-drug-standard}}']);
    expect(warnings(base)).not.toMatch(/Do Now dose/);
  });
});

describe('no semicolons', () => {
  const clone = () => JSON.parse(JSON.stringify(real));
  const withLine = (line: string) => {
    const base = clone();
    base.cards.push({
      file: 'test.md', id: 'test-card', type: 'topic', variant: null, system: 'renal', group: 'condition', subsection: 'Electrolyte Disorders',
      title: 'Test', aliases: [], related: {}, example: false, unknownSections: [], unknownSubsections: [], definition: null, basedOn: [], checked: null,
      sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: parseBlocks(kp(line).split('\n')), subsections: [] }],
    });
    return checkContent(base).join('\n');
  };
  it('rejects a semicolon in card text', () => {
    expect(withLine('- First clause; second clause ^[example-guideline-a]')).toMatch(/semicolon rule/);
  });
  it('allows entities such as &amp;', () => {
    expect(withLine('- Salt &amp; water ^[example-guideline-a]')).not.toMatch(/semicolon rule/);
  });
  it('rejects a semicolon in a data item but not in a citation', () => {
    const base = clone();
    base.data.dose['example-drug-standard'].notes = 'One thing; another thing';
    expect(checkContent(base).join('\n')).toMatch(/semicolon rule/);
    const ok = clone();
    const [id] = Object.keys(ok.data.source);
    ok.data.source[id].citation = 'Author A. Title. J Test. 2020;12:34.';
    expect(checkContent(ok).join('\n')).not.toMatch(/semicolon rule/);
  });
  it('ignores web addresses', () => {
    expect(hasSemicolon('https://example.com/a;b')).toBe(false);
    expect(hasSemicolon('a; b')).toBe(true);
  });
});

describe('no source text shown', () => {
  const withBlocks = (md: string) => {
    const base = JSON.parse(JSON.stringify(real));
    base.cards.push({
      file: 'test.md', id: 'test-card', type: 'topic', variant: null, system: 'renal', group: 'condition', subsection: 'Electrolyte Disorders',
      title: 'Test', aliases: [], related: {}, example: false, unknownSections: [], unknownSubsections: [], definition: null, basedOn: [], checked: null,
      sections: [{ key: 'at-a-glance', title: 'At a Glance', blocks: parseBlocks(md.split('\n')), subsections: [] }],
    });
    return checkContent(base).join('\n');
  };
  it('rejects a source between the cells of a table row', () => {
    expect(withBlocks('| A | B |\n|---|---|\n| one ^[example-guideline-a] | two ^[example-guideline-a] |')).toMatch(/source text shown/);
  });
  it('rejects a source in the middle of a bullet', () => {
    expect(withBlocks('- First part ^[example-guideline-a]. Second part. ^[example-guideline-a]')).toMatch(/source text shown/);
  });
  it('allows one source at the end of a table row and of a bullet', () => {
    const out = withBlocks('| A | B |\n|---|---|\n| one | two ^[example-guideline-a] |\n\n- Bullet. ^[example-guideline-a]');
    expect(out).not.toMatch(/source text shown/);
  });
  it('detects a mid-row marker in raw markdown', () => {
    expect(midRowSource('| a ^[x-y] | b ^[x-y] |')).toBe(true);
    expect(midRowSource('| a | b ^[x-y] |')).toBe(false);
  });
  it('finds no source text in the real content', () => {
    expect(checkContent(JSON.parse(JSON.stringify(real))).filter((e: string) => /source text shown/.test(e))).toEqual([]);
  });
});

describe('drug records', () => {
  const copy = () => JSON.parse(JSON.stringify(real));
  const errors = (base: ReturnType<typeof copy>) => checkContent(base).join('\n');

  it('the real ceftriaxone record passes and has doses pointing to it', () => {
    expect(errors(copy())).toBe('');
    const base = copy();
    expect(base.data.drug.ceftriaxone.boxed_warning).toBe('None');
    expect((Object.values(base.data.dose) as { drug?: string }[]).some((d) => d.drug === 'ceftriaxone')).toBe(true);
  });
  it('rejects a dose whose drug is not a drug record', () => {
    const base = copy();
    base.data.dose['ceftriaxone-iv'].drug = 'no-such-drug';
    expect(errors(base)).toMatch(/ceftriaxone-iv[\s\S]*drug "no-such-drug" does not exist/);
  });
  it('a dose may leave drug out', () => {
    expect(withDose({})).toBe('');
    expect(withDose({ drug: 'ceftriaxone' })).toBe('');
  });
  it('checks the record: fields, a source on every warning, a label source, no typed doses', () => {
    const base = copy();
    const d = base.data.drug.ceftriaxone;
    d.surprise = 1;
    d.cautions = [{ text: 'No source here', sources: [] }, { text: 'Bad source', sources: ['no-such-source'] }, 'plain string', { text: 'Give 5 mg first', sources: ['label-ceftriaxone-2026'] }];
    d.boxed_warning = { text: 'Serious', sources: [] };
    d.label_source = 'aaaai-drug-allergy-2022';
    d.sources = ['label-ceftriaxone-2026'];
    const out = errors(base);
    expect(out).toMatch(/unknown drug field "surprise"/);
    expect(out).toMatch(/caution 1 has no sources/);
    expect(out).toMatch(/caution 2 cites unknown source "no-such-source"/);
    expect(out).toMatch(/caution 3 must be \{ text, sources \}/);
    expect(out).toMatch(/caution 4 has a dose typed as text/);
    expect(out).toMatch(/boxed_warning[\s\S]* has no sources/);
    expect(out).toMatch(/must be a prescribing-information source/);
    expect(out).toMatch(/sources must include the label/);
  });
  it('requires the main fields', () => {
    const base = copy();
    delete base.data.drug.ceftriaxone.kidney_liver;
    delete base.data.drug.ceftriaxone.boxed_warning;
    expect(errors(base)).toMatch(/missing "boxed_warning"[\s\S]*missing "kidney_liver"|missing "kidney_liver"[\s\S]*missing "boxed_warning"/);
  });
  it('warns on a drug record no dose uses, and not on the real one', () => {
    const base = copy();
    expect(checkWarnings(base).join('\n')).not.toMatch(/unused drug record/);
    base.data.drug.orphan = { ...base.data.drug.ceftriaxone, _file: 'content/data/drug/orphan.yaml' };
    expect(checkWarnings(base).join('\n')).toMatch(/orphan\.yaml: unused drug record: no dose has "drug: orphan"/);
  });
});
