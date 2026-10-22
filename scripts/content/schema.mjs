// The content rules from docs/CARD-TYPES.md and docs/DATA-TYPES.md, in a form the checks and the app can use.
// Every card is shown with the same topic page pattern (redesign approved 2026-10-18): At a Glance, the type's own
// sections in a fixed order, More Information (the type's deeper subsections, closed until tapped), Pearls,
// then Related and Sources, which the app adds from the card's front matter and citations.

const S = (key, title, extra = {}) => ({ key, title, ...extra });
const AT_A_GLANCE = S('at-a-glance', 'At a Glance', { required: true });
const FOOTER = [S('more', 'More Information'), S('pearls', 'Pearls')];
const EVIDENCE = S('evidence', 'Evidence');

export const CARD_TYPES = {
  condition: {
    label: 'Condition',
    topic: true,
    sections: [
      AT_A_GLANCE,
      S('severity', 'Severity'),
      S('causes', 'Causes'),
      S('presentation', 'Presentation'),
      S('diagnosis', 'Diagnosis'),
      S('treatment', 'Treatment'),
      S('monitor', 'Monitor'),
      S('escalation', 'Escalation'),
      ...FOOTER,
    ],
    more: [
      S('guidelines-differ', 'Where Guidelines Differ'),
      S('special-populations', 'Special Populations'),
      S('complications', 'Complications'),
      S('after-acute', 'After the Acute Phase'),
      EVIDENCE,
      S('why-order', 'Why the Treatment Order'),
      S('epi-patho', 'Epidemiology and Pathophysiology'),
    ],
  },
  // Owner's choice 2026-10-18: approach pages use the condition page's names where they fit.
  approach: {
    label: 'Approach',
    topic: true,
    sections: [
      AT_A_GLANCE,
      S('definition', 'Definition and Staging'),
      S('first-steps', 'First Steps'),
      S('causes', 'Causes'),
      S('presentation', 'Presentation'),
      S('diagnosis', 'Diagnosis'),
      S('treatment', 'Treatment'),
      S('monitor', 'Monitor'),
      S('escalation', 'Escalation'),
      ...FOOTER,
    ],
    more: [
      S('guidelines-differ', 'Where Guidelines Differ'),
      S('special-populations', 'Special Populations'),
      S('complications', 'Complications'),
      S('after-acute', 'After the Acute Phase'),
      EVIDENCE,
      S('epi-patho', 'Epidemiology and Pathophysiology'),
    ],
  },
  reference: {
    label: 'Reference',
    variants: {
      interpretation: ['at-a-glance', 'normal-values', 'method', 'patterns', 'examples'],
      protocol: ['at-a-glance', 'indications', 'choosing', 'dosing', 'monitoring', 'special-populations'],
      organism: ['at-a-glance', 'sources-risk', 'infections', 'resistance', 'treatment', 'precautions'],
      chart: ['at-a-glance', 'how-to-read', 'chart', 'caveats'],
      communication: ['at-a-glance', 'when', 'framework', 'phrasing', 'legal'],
    },
    sections: [
      AT_A_GLANCE,
      S('normal-values', 'Normal Values'),
      S('method', 'Stepwise Method'),
      S('patterns', 'Patterns and What They Mean'),
      S('examples', 'Worked Examples'),
      S('indications', 'Indications'),
      S('choosing', 'Choosing an Option'),
      S('dosing', 'Dosing and Protocol'),
      S('monitoring', 'Monitoring and Adjustment'),
      S('special-populations', 'Special Populations'),
      S('sources-risk', 'Where It Comes From and Risk Factors'),
      S('infections', 'Infections It Causes'),
      S('resistance', 'Resistance Patterns'),
      S('treatment', 'Treatment Options'),
      S('precautions', 'Infection-Control Precautions'),
      S('how-to-read', 'How to Read the Chart'),
      S('chart', 'Chart'),
      S('caveats', 'Caveats'),
      S('when', 'When It Applies'),
      S('framework', 'Framework'),
      S('phrasing', 'Suggested Phrasing'),
      S('legal', 'Legal and Ethical Points'),
      ...FOOTER,
    ],
    more: [S('microbiology', 'Microbiology'), EVIDENCE],
  },
  procedure: {
    label: 'Procedure',
    sections: [
      AT_A_GLANCE,
      S('indications', 'Indications'),
      S('contraindications', 'Contraindications'),
      S('preparation', 'Preparation'),
      S('technique', 'Technique'),
      S('after', 'After the Procedure'),
      S('complications', 'Complications'),
      S('troubleshooting', 'Troubleshooting'),
      S('note-checklist', 'Procedure Note Checklist'),
      ...FOOTER,
    ],
    more: [EVIDENCE],
  },
  medication: {
    label: 'Medication',
    variants: { class: ['at-a-glance', 'mechanism', 'members', 'class-cautions', 'choosing'] },
    sections: [
      AT_A_GLANCE,
      S('indications', 'Dosing'),
      S('adjustment', 'Dose Adjustment'),
      S('administration', 'Administration'),
      S('contraindications', 'Contraindications and Boxed Warnings'),
      S('adverse-effects', 'Adverse Effects'),
      S('interactions', 'Interactions'),
      S('monitor', 'Monitor'),
      S('mechanism', 'Mechanism and Shared Effects'),
      S('members', 'Members Compared'),
      S('class-cautions', 'Class-Wide Cautions'),
      S('choosing', 'Choosing Within the Class'),
      ...FOOTER,
    ],
    more: [S('pregnancy', 'Pregnancy and Lactation'), S('overdose', 'Overdose and Reversal'), EVIDENCE],
  },
  score: {
    label: 'Score',
    sections: [
      AT_A_GLANCE,
      S('when', 'When to Use'),
      S('calculator', 'Calculator'),
      S('interpretation', 'Interpretation'),
      ...FOOTER,
    ],
    more: [S('limitations', 'Limitations'), EVIDENCE],
  },
  exam: {
    label: 'Physical Exam',
    sections: [
      AT_A_GLANCE,
      S('technique', 'Technique'),
      S('normal', 'Normal Findings'),
      S('abnormal', 'Abnormal Findings'),
      S('scales', 'Grading Scales'),
      S('maneuvers', 'Special Maneuvers'),
      ...FOOTER,
    ],
    more: [EVIDENCE],
  },
  test: {
    label: 'Diagnostic Test',
    sections: [
      AT_A_GLANCE,
      S('when', 'When to Order'),
      S('interpretation', 'Interpretation'),
      S('accuracy', 'Test Accuracy'),
      S('false-results', 'False Positives and False Negatives'),
      S('practical', 'Practical Notes'),
      ...FOOTER,
    ],
    more: [S('measures', 'What It Measures'), EVIDENCE],
  },
};

// Sections every variant has besides its own list.
export const SHARED_SECTIONS = ['more', 'pearls'];

// Every field a dose item can have, so a misspelled field is caught. The sheet shows them in this order.
export const DOSE_FIELDS = [
  'drug', 'drug_name', 'brand', 'indication', 'population', 'route', 'amount', 'unit', 'frequency', 'rate',
  'give_when', 'repeat', 'onset', 'lasts', 'duration', 'max', 'boxed_warning', 'alternative', 'adjustments',
  'cautions', 'notes', 'sources',
];

export const CARD_GROUPS = ['approach', 'condition', 'reference'];

// Data types that cards can insert with {{type:id}}. Each lives in content/data/<type>/<id>.yaml.
export const DATA_TYPES = {
  source: { required: ['kind', 'short', 'title', 'year'], sourced: false },
  // A dose needs a frequency or a rate (e.g. "over 10 minutes"); the dose sheet fields are listed in DOSE_FIELDS.
  dose: { required: ['drug_name', 'indication', 'route', 'amount', 'unit'], sourced: true },
  threshold: { required: ['name', 'value', 'unit'], sourced: true },
  // A focused pathway (docs/DATA-TYPES.md, 9): a levelled flowchart on a grid that supplements its card.
  pathway: { required: ['title', 'card', 'columns', 'start', 'nodes'], sourced: true },
  // A treatment combination for one indication, built from dose items (docs/DATA-TYPES.md, 3).
  regimen: { required: ['name', 'options'], sourced: true },
  // A formal definition or set of criteria: optional "any of" items and/or a table (e.g. stages).
  criteria: { required: ['name', 'title', 'short'], sourced: true },
  // A calculator or score on MDCalc, linked from every sentence that names it (docs/DATA-TYPES.md, 12b). `match` lists the
  // words the content check looks for, so a mention can't be left without its link.
  calc: { required: ['name', 'short', 'url', 'match'], sourced: false },
  // A coverage grid: drugs by organism groups, each cell reliable, variable or none (docs/DATA-TYPES.md, 10).
  coverage: { required: ['title', 'levels', 'columns', 'rows'], sourced: true },
  // An ECG recording or a drawn ECG, shown as a figure (docs/DATA-TYPES.md, 11. Media).
  media: { required: ['kind', 'title', 'alt', 'caption', 'illustrates'], sourced: true },
};

// Every field a regimen and each of its options can have.
export const REGIMEN_FIELDS = ['name', 'indication', 'setting', 'options', 'duration', 'notes', 'sources'];
export const REGIMEN_OPTION_FIELDS = ['label', 'when', 'doses'];

// US units accepted in data items.
export const UNITS = [
  'mg', 'mcg', 'g', 'kg', 'mEq', 'mmol', 'units', 'mL', 'L', 'g/kg', 'mg/kg', 'mcg/kg', 'units/kg', 'mL/kg',
  'mg/h', 'mg/kg/h', 'mmol/kg', 'mcg/min', 'units/min', 'mcg/kg/min', 'units/h', 'units/kg/h', 'mL/h', 'mg/dL', 'g/dL', 'mmol/L', 'mEq/L',
  'mOsm/kg', 'mOsm/L', 'mEq/g', 'mL/kg/h', 'ng/mL', 'pg/mL', 'mcg/mL', 'mm Hg', 'beats/min', 'breaths/min', '%', '°F', 'mL/min', 'mL/min/1.73 m²',
  'cells/µL', 'IU/L', 'U/L', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'points',
];

// Text in card prose that looks like a dose (an amount with a dosing unit). Doses must come from {{dose:…}} inserts.
// Rates such as urine output (mL/kg/h) and concentrations (mEq/L) are not doses.
export const DOSE_IN_TEXT = /\b\d+(?:\.\d+)?\s?(?:mg|mcg|g|mEq|mmol|units?|mL)\b(?!\s*\/\s*(?:L|dL|mL|kg\/min|kg\/h)\b)/;

// Calculator pages live on MDCalc; every calculator item points at one.
export const MDCALC_URL = /^https:\/\/www\.mdcalc\.com\/calc\/\d+\/[a-z0-9-]+$/;
export const CALC_FIELDS = ['name', 'short', 'url', 'match', 'sources', 'calculator'];
// The in-app calculator of a score or formula (docs/DATA-TYPES.md, 7). Formulas themselves are code (src/calculators.ts);
// these are the names a data file may use for them.
export const CALC_FORMULAS = ['osmolality', 'effective-osmolality', 'anion-gap', 'albumin-corrected-anion-gap', 'corrected-sodium', 'winters-expected-pco2'];
