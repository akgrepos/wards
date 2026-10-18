// The content rules from docs/CARD-TYPES.md and docs/DATA-TYPES.md, in a form the checks and the app can use.
// Each card type lists its sections in their fixed order. `collapsed` sections start closed with a one-line summary.

const S = (key, title, extra = {}) => ({ key, title, ...extra });
const FOOTER = [S('pearls', 'Pearls and pitfalls')];

export const CARD_TYPES = {
  condition: {
    label: 'Condition',
    sections: [
      S('key-points', 'Key points', { required: true }),
      S('definition', 'Definition and classification'),
      S('epidemiology', 'Epidemiology and risk factors', { collapsed: true }),
      S('pathophysiology', 'Pathophysiology', { collapsed: true }),
      S('presentation', 'Clinical presentation'),
      S('differential', 'Differential diagnosis'),
      S('diagnosis', 'Diagnostic evaluation'),
      S('risk', 'Risk stratification'),
      S('management', 'Management'),
      S('monitoring', 'Monitoring'),
      S('complications', 'Complications'),
      S('specialists', 'Specialist involvement'),
      S('transitions', 'Transitions of care'),
      ...FOOTER,
    ],
  },
  approach: {
    label: 'Approach',
    sections: [
      S('key-points', 'Key points', { required: true }),
      S('definition', 'Definition'),
      S('immediate', 'Immediate assessment'),
      S('differential', 'Differential diagnosis'),
      S('history', 'Focused history'),
      S('exam', 'Focused examination'),
      S('diagnosis', 'Diagnostic evaluation'),
      S('pathway', 'Pathway'),
      S('orders', 'Common initial orders'),
      S('initial-management', 'Initial management'),
      S('specialists', 'Specialist involvement'),
      ...FOOTER,
    ],
  },
  reference: {
    label: 'Reference',
    variants: {
      interpretation: ['key-points', 'normal-values', 'method', 'patterns', 'examples'],
      protocol: ['key-points', 'indications', 'choosing', 'dosing', 'monitoring', 'special-populations'],
      organism: ['key-points', 'microbiology', 'sources-risk', 'infections', 'resistance', 'treatment', 'precautions'],
      chart: ['key-points', 'how-to-read', 'chart', 'caveats'],
      communication: ['key-points', 'when', 'framework', 'phrasing', 'legal'],
    },
    sections: [
      S('key-points', 'Key points', { required: true }),
      S('normal-values', 'Normal values'),
      S('method', 'Stepwise method'),
      S('patterns', 'Patterns and what they mean'),
      S('examples', 'Worked examples'),
      S('indications', 'Indications'),
      S('choosing', 'Choosing an option'),
      S('dosing', 'Dosing and protocol'),
      S('monitoring', 'Monitoring and adjustment'),
      S('special-populations', 'Special populations'),
      S('microbiology', 'Microbiology', { collapsed: true }),
      S('sources-risk', 'Where it comes from and risk factors'),
      S('infections', 'Infections it causes'),
      S('resistance', 'Resistance patterns'),
      S('treatment', 'Treatment options'),
      S('precautions', 'Infection-control precautions'),
      S('how-to-read', 'How to read the chart'),
      S('chart', 'Chart'),
      S('caveats', 'Caveats'),
      S('when', 'When it applies'),
      S('framework', 'Framework'),
      S('phrasing', 'Suggested phrasing'),
      S('legal', 'Legal and ethical points'),
      ...FOOTER,
    ],
  },
  procedure: {
    label: 'Procedure',
    sections: [
      S('key-points', 'Key points', { required: true }),
      S('indications', 'Indications'),
      S('contraindications', 'Contraindications'),
      S('preparation', 'Preparation'),
      S('technique', 'Technique'),
      S('after', 'After the procedure'),
      S('complications', 'Complications'),
      S('troubleshooting', 'Troubleshooting'),
      S('note-checklist', 'Procedure note checklist'),
      ...FOOTER,
    ],
  },
  medication: {
    label: 'Medication',
    variants: { class: ['key-points', 'mechanism', 'members', 'class-cautions', 'choosing'] },
    sections: [
      S('key-points', 'Key points', { required: true }),
      S('indications', 'Indications and dosing'),
      S('adjustment', 'Dose adjustment'),
      S('administration', 'Administration'),
      S('contraindications', 'Contraindications and boxed warnings'),
      S('adverse-effects', 'Adverse effects'),
      S('interactions', 'Interactions'),
      S('monitoring', 'Monitoring'),
      S('pregnancy', 'Pregnancy and lactation'),
      S('overdose', 'Overdose and reversal'),
      S('mechanism', 'Mechanism and shared effects'),
      S('members', 'Members compared'),
      S('class-cautions', 'Class-wide cautions'),
      S('choosing', 'Choosing within the class'),
      ...FOOTER,
    ],
  },
  score: {
    label: 'Score',
    sections: [
      S('key-points', 'Key points', { required: true }),
      S('when', 'When to use'),
      S('calculator', 'Calculator'),
      S('interpretation', 'Interpretation'),
      S('limitations', 'Limitations'),
      ...FOOTER,
    ],
  },
  exam: {
    label: 'Physical exam',
    sections: [
      S('key-points', 'Key points', { required: true }),
      S('technique', 'Technique'),
      S('normal', 'Normal findings'),
      S('abnormal', 'Abnormal findings'),
      S('scales', 'Grading scales'),
      S('maneuvers', 'Special maneuvers'),
      ...FOOTER,
    ],
  },
  test: {
    label: 'Diagnostic test',
    sections: [
      S('key-points', 'Key points', { required: true }),
      S('measures', 'What it measures', { collapsed: true }),
      S('when', 'When to order'),
      S('interpretation', 'Interpretation'),
      S('accuracy', 'Test accuracy'),
      S('false-results', 'False positives and false negatives'),
      S('practical', 'Practical notes'),
      ...FOOTER,
    ],
  },
};

export const CARD_GROUPS = ['approach', 'condition', 'reference'];

// Data types that cards can insert with {{type:id}}. Each lives in content/data/<type>/<id>.yaml.
export const DATA_TYPES = {
  source: { required: ['kind', 'short', 'title', 'year'], sourced: false },
  dose: { required: ['drug_name', 'indication', 'route', 'amount', 'unit', 'frequency'], sourced: true },
  threshold: { required: ['name', 'value', 'unit', 'meaning'], sourced: true },
  pathway: { required: ['start', 'steps'], sourced: true },
  // A formal definition or set of criteria: optional "any of" items and/or a table (e.g. stages).
  criteria: { required: ['name', 'short'], sourced: true },
};

// US units accepted in data items.
export const UNITS = [
  'mg', 'mcg', 'g', 'kg', 'mEq', 'mmol', 'units', 'mL', 'L', 'g/kg', 'mg/kg', 'mcg/kg', 'units/kg', 'mL/kg',
  'mg/h', 'mcg/min', 'mcg/kg/min', 'units/h', 'units/kg/h', 'mL/h', 'mg/dL', 'g/dL', 'mmol/L', 'mEq/L',
  'mOsm/kg', 'ng/mL', 'pg/mL', 'mcg/mL', 'mm Hg', 'beats/min', 'breaths/min', '%', '°F', 'mL/min', 'mL/min/1.73 m²',
  'cells/µL', 'IU/L', 'U/L', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'points',
];

// Text in card prose that looks like a dose (an amount with a dosing unit). Doses must come from {{dose:…}} inserts.
// Rates such as urine output (mL/kg/h) and concentrations (mEq/L) are not doses.
export const DOSE_IN_TEXT = /\b\d+(?:\.\d+)?\s?(?:mg|mcg|g|mEq|mmol|units?|mL)\b(?!\s*\/\s*(?:L|dL|mL|kg\/min|kg\/h)\b)/;
