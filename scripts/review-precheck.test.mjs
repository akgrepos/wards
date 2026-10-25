import { describe, it, expect } from 'vitest'
import { quantities, markersIn, claimOf, highAlertReasons, aliasWords, dataText, numberMismatches } from './review-precheck.mjs'

describe('review:precheck', () => {
  it('reads numbers with their units, including ranges', () => {
    expect(quantities('K⁺ 3.5–5.0 mEq/L, then 10 mg')).toEqual([
      { values: [3.5, 5], unit: 'mEq/L', shown: '3.5–5.0 mEq/L' },
      { values: [10], unit: 'mg', shown: '10 mg' },
    ])
  })
  it('reads citation markers, several per line allowed', () => {
    expect(markersIn('Give it. ^[ada-hyperglycemic-crises-2024, label-kcl-injection-2026]')).toEqual(['ada-hyperglycemic-crises-2024', 'label-kcl-injection-2026'])
    expect(markersIn('No marker here')).toEqual([])
  })
  it('keeps number lines and drops headings, fences, inserts and step numbers', () => {
    expect(claimOf('## Treatment 2')).toBeNull()
    expect(claimOf(':::note')).toBeNull()
    expect(claimOf('{{dose:kcl-dka-maintenance}}')).toBeNull()
    expect(claimOf('- Mild DKA: SC insulin every 1–2 hours ^[ada-x-2024]')).toEqual({ text: 'Mild DKA: SC insulin every 1–2 hours', sources: ['ada-x-2024'] })
    expect(claimOf('2. Potassium (first if K⁺ <3.5)')).toEqual({ text: 'Potassium (first if K⁺ <3.5)', sources: [] })
    expect(claimOf('- Bicarbonate only for pH <7.0. ^[a]')?.text).toBe('Bicarbonate only for pH <7.0.')
    expect(claimOf('- Stop the drug and reassess.')).toBeNull()
  })
  it('tags high-alert drugs, unverified dose files and inserts', () => {
    expect(highAlertReasons('Start heparin at once')).toEqual(['names heparin'])
    expect(highAlertReasons('Recheck K⁺ in 2 hours', [])).toEqual(['names K⁺'])
    expect(highAlertReasons('Recheck K⁺ in 2 hours', [])).toHaveLength(1)
    expect(highAlertReasons('Ceftriaxone 1 g daily', [])).toEqual([])
    expect(highAlertReasons('Take the pill', [{ read: 'not-verified' }])).toEqual(['a dose insert on this line is not verified'])
    expect(highAlertReasons('Give enoxaparin 40 mg', [], ['enoxaparin'])).toEqual(['names enoxaparin', 'names enoxaparin, whose dose file is not verified'])
  })
  it('names a dose file by its drug, and treats potassium symbols as potassium', () => {
    expect(aliasWords({ drug: 'potassium-chloride' })).toEqual(['potassium', 'chloride', 'k⁺', 'k+', 'kcl'])
    expect(aliasWords({ drug: 'apixaban' })).toEqual(['apixaban'])
    expect(aliasWords({})).toEqual([])
  })
  it('flattens a data file to text, leaving out its verification and sources', () => {
    const text = dataText({ amount: '5', unit: 'mg', cautions: ['Do not underdose'], sources: ['x'], verification: { read: 'full-text' } })
    expect(text).toBe('5 | mg | Do not underdose')
  })
  it('flags a dose that disagrees with the dose file, and passes one that agrees', () => {
    const apixaban = { file: 'content/data/dose/apixaban-af.yaml', amount: 5, unit: 'mg' }
    expect(numberMismatches('Apixaban 10 mg twice daily', [apixaban])).toMatchObject({ compared: 1 })
    expect(numberMismatches('Apixaban 10 mg twice daily', [apixaban]).problems).toHaveLength(1)
    expect(numberMismatches('Apixaban 5 mg twice daily', [apixaban]).problems).toHaveLength(0)
  })
  it('compares a range against a range, and ignores units the file does not use', () => {
    const kcl = { file: 'content/data/dose/kcl.yaml', amount: '20–30', unit: 'mEq' }
    expect(numberMismatches('Give 20–30 mEq per liter', [kcl]).problems).toHaveLength(0)
    expect(numberMismatches('Give 40 mEq per liter', [kcl]).problems).toHaveLength(1)
    expect(numberMismatches('Recheck in 2 hours', [kcl])).toEqual({ problems: [], compared: 0 })
  })
  it('does not compare percentages, which can be concentrations or rates of patients', () => {
    const dextrose = { file: 'content/data/dose/dextrose-dka.yaml', amount: '5–10', unit: '%' }
    expect(numberMismatches('Hypoglycemia in 16–28% of patients', [dextrose])).toEqual({ problems: [], compared: 0 })
  })
})
