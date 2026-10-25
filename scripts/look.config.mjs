// Settings for `npm run look` (scripts/look.mjs). Add a page by adding one line to ROUTES.
// A route is { name, hash, steps? }. hash is the part after the address, e.g. '#/card/renal-aki'.
// storage (optional) is saved lists to set before looking, e.g. { 'wards:searches': ['AKI'] }.
// steps (optional) are taps to do after the page opens: { click: 'button text' } waits for a button with that text

export const ROUTES = [
  { name: 'topics-home', hash: '#/' },
  { name: 'specialty-list', hash: '#/system/renal' },
  { name: 'condition-aki', hash: '#/card/renal-aki' },
  { name: 'condition-aki-first-steps', hash: '#/card/renal-aki/first-steps' },
  { name: 'condition-aki-diagnosis', hash: '#/card/renal-aki/diagnosis' },
  { name: 'condition-aki-link-sheet', hash: '#/card/renal-aki', steps: [{ click: 'Hyperkalemia' }] },
  { name: 'medication-ceftriaxone', hash: '#/card/ceftriaxone' },
  { name: 'dose-sheet-drug-warnings', hash: '#/card/ceftriaxone', steps: [{ click: 'Pneumonia, cellulitis' }] },
  { name: 'rapids-list', hash: '#/emergencies' },
  { name: 'rapids-dka', hash: '#/emergency/endo-dka' },
  { name: 'rapids-dka-timed', hash: '#/emergency/endo-dka', steps: [{ click: 'Start Timed Mode' }] },
  { name: 'pathway-aki-cause', hash: '#/pathway/aki-cause-workup' },
  { name: 'search', hash: '#/search' },
  { name: 'search-recent', hash: '#/search', storage: { 'wards:searches': ['hyperK', 'AKI', 'GI bleed'] } },
  { name: 'search-typed', hash: '#/search', storage: { 'wards:searches': ['hyperK'] }, steps: [{ click: 'hyperK' }] },
  // Search results: a recent search is tapped to type it.
  { name: 'search-drug', hash: '#/search', storage: { 'wards:searches': ['ceftriaxone'] }, steps: [{ click: 'ceftriaxone' }] },
  { name: 'search-sections', hash: '#/search', storage: { 'wards:searches': ['antibiotic'] }, steps: [{ click: 'antibiotic' }] },
  { name: 'search-more', hash: '#/search', storage: { 'wards:searches': ['treatment'] }, steps: [{ click: 'treatment' }, { click: 'Show' }] },
  { name: 'search-tools', hash: '#/search', storage: { 'wards:searches': ['wells'] }, steps: [{ click: 'wells' }] },
  { name: 'search-none', hash: '#/search', storage: { 'wards:searches': ['cefalexin'] }, steps: [{ click: 'cefalexin' }] },
  { name: 'library', hash: '#/library' },
  { name: 'settings', hash: '#/settings' },
]

// Phone size: iPhone 15 (390x844 CSS points at 3x).
export const DEVICE = { width: 390, height: 844, scale: 3 }

// The smallest tap target (CSS points). Apple's Human Interface Guidelines say 44.
export const MIN_TAP = 44

// Things the style checks should let through. Keep this short and give each entry a reason.
export const ALLOW = {
  // Interactive elements allowed to be under 44 points: CSS selectors.
  smallTap: [
    '.akg-search-field__clear', // the standard iOS clear (x) inside the design-system search field; the field itself is the large target
  ],
  // Small tap targets found on 2026-10-24 when this check was added. They are printed on every run but do not fail it,
  // so new problems still do. The owner decides whether to enlarge them; remove an entry when it is fixed.
  knownSmallTap: [
    '.akg-toolbar-button--grouped', // Contents, Zoom In/Out: 36x36
    '.card-link', // inline "Hyperkalemia"-style link in a sentence: 17 high
    '.calc-link', // inline MDCalc link in a sentence (same tap area as .card-link)
    '.akg-source-pill', // source markers: 9 to 14 high
    '.akg-button--choice', // pathway decision buttons: 26 to 37 high
    '.akg-value-row--interactive', // pathway tappable rows: 30 to 40 high
    '.akg-button--borderless', // End Timed Mode: 34 high
    '.akg-tappable-value', // dotted terms inside sentences
    '.akg-sheet__grabber', // sheet drag handle (design system part): 4 high; the whole sheet header also drags
  ],
  // Text colors allowed besides the design-token colors (any CSS color string, compared as red/green/blue).
  colors: [
    // 'rgb(255, 255, 255)', // why
  ],
  // Font-family strings allowed besides the design-token fonts (matched by whole string).
  fonts: [
    // 'Georgia', // why
  ],
}

// Text that must never appear in the built files.
export const FORBIDDEN_IN_BUILD = ['PROTOTYPE', 'PREVIEW ·']
