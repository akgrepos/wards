---
id: renal-acid-base
type: reference
variant: interpretation
system: renal
title: "Acid-Base Interpretation"
aliases: [acid-base, acid base, ABG, arterial blood gas, VBG, blood gas, BMP, metabolic acidosis, metabolic alkalosis, respiratory acidosis, respiratory alkalosis, mixed acid-base, anion gap, AG, delta gap, delta-delta, delta ratio, Winter's formula, Winters, compensation, osmolar gap, osmolal gap, non-gap acidosis, hyperchloremic acidosis, NAGMA, HAGMA, bicarbonate, HCO3, PaCO2, pH, acidemia, alkalemia, Henderson-Hasselbalch]
reviewed: 2026-10-21
related:
  conditions: [endo-dka, renal-aki, crit-hypoxemic-respiratory-failure, pulm-copd-exacerbation]
  tools: [renal-iv-fluids]
---
## At a Glance
- Go in order: check the data, pH, primary disorder, expected compensation, {{calc:anion-gap|anion gap}} (albumin-corrected), delta ratio, then the cause. ^[berend-acid-base-2014, seifter-acid-base-2014]
- Compensation limits the pH change and rarely returns pH fully to normal (chronic respiratory alkalosis can). A measurement outside the expected range means a second disorder. ^[adrogue-madias-secondary-2010]
- A normal pH does not exclude a disorder: a normal pH with abnormal PaCO₂ or HCO₃⁻ is usually a mixed disorder. ^[berend-acid-base-2014]
- High-AG acidosis: look for ketoacids, lactate, kidney failure, toxic alcohols and salicylate. Non-gap acidosis: gastrointestinal bicarbonate loss, renal tubular acidosis, chloride load. ^[kraut-madias-metabolic-acidosis-2010]
- Treat the cause first. Bicarbonate is reserved for specific settings (see When to treat). ^[kraut-madias-metabolic-acidosis-2010, bicaricu2-2025]

## Normal Values
| Variable | Arterial | Notes |
|---|---|---|
| pH | 7.35–7.45 | Acidemia <7.35. Alkalemia >7.45 ^[berend-acid-base-2014] |
| PaCO₂ | 35–45 mm Hg | Mean 40 mm Hg ^[berend-acid-base-2014] |
| HCO₃⁻ | 22–26 mEq/L | Mean 24 mEq/L. The serum BMP value (total CO₂) runs about 1–2 mEq/L higher than the gas-calculated value ^[berend-acid-base-2014, common-practice] |
| Serum AG | about 8–12 mEq/L | Without K⁺. The normal range depends on the analyzer ^[kraut-anion-gap-2007] |
| Albumin | 4.0 g/dL | Reference for correcting the gap ^[figge-albumin-1998] |

- Venous gas: pH about 0.03 lower and PaCO₂ about 3–8 mm Hg higher than arterial. Adequate for pH and HCO₃⁻ in most patients, not for oxygenation or for judging PaCO₂ in shock. ^[common-practice]
- Check the data are consistent with the Henderson equation: [H⁺] (nEq/L) = 24 × PaCO₂ ÷ HCO₃⁻. pH 7.40 corresponds to 40 nEq/L, 7.30 to 50 and 7.50 to 32. A mismatch means a mislabeled or non-simultaneous sample. ^[berend-acid-base-2014]

## Stepwise Method
1. Check the data
   - Gas and chemistry drawn together. Calculated [H⁺] matches the pH (Normal Values above). ^[berend-acid-base-2014]
   - Use the gas HCO₃⁻ for compensation and the BMP total CO₂ for the gap, from samples drawn together. ^[common-practice]

2. Name the pH
   - pH <7.35 acidemia. >7.45 alkalemia. A normal pH can still hide opposing disorders. ^[berend-acid-base-2014]

3. Find the primary disorder
   - The primary disorder is the change that explains the pH: low HCO₃⁻ or high PaCO₂ in acidemia. High HCO₃⁻ or low PaCO₂ in alkalemia. ^[berend-acid-base-2014]

   | pH | HCO₃⁻ | PaCO₂ | Primary disorder |
   |---|---|---|---|
   | Low | Low | Low (compensating) | Metabolic acidosis ^[berend-acid-base-2014] |
   | Low | High (compensating) | High | Respiratory acidosis ^[berend-acid-base-2014] |
   | High | High | High (compensating) | Metabolic alkalosis ^[berend-acid-base-2014] |
   | High | Low (compensating) | Low | Respiratory alkalosis ^[berend-acid-base-2014] |

4. Check the compensation
   - Compare the measured value with the expected one. Outside the range means an additional disorder. ^[adrogue-madias-secondary-2010]
   - Metabolic acidosis, {{calc:winters-formula|Winter's formula}}: expected PaCO₂ = 1.5 × HCO₃⁻ + 8 (± 2). Measured PaCO₂ above the range: concurrent respiratory acidosis. Below: concurrent respiratory alkalosis. ^[albert-metabolic-acidosis-1967, adrogue-madias-secondary-2010]

   | Primary disorder | Expected compensation |
   |---|---|
   | Metabolic acidosis | PaCO₂ falls 1.2 mm Hg per 1 mEq/L fall in HCO₃⁻ ^[adrogue-madias-secondary-2010] |
   | Metabolic alkalosis | PaCO₂ rises 0.7 mm Hg per 1 mEq/L rise in HCO₃⁻ ^[adrogue-madias-secondary-2010] |
   | Acute respiratory acidosis | HCO₃⁻ rises 1 mEq/L per 10 mm Hg rise in PaCO₂ ^[adrogue-madias-secondary-2010] |
   | Chronic respiratory acidosis (days) | HCO₃⁻ rises 3.5 mEq/L per 10 mm Hg rise in PaCO₂ ^[adrogue-madias-secondary-2010] |
   | Acute respiratory alkalosis | HCO₃⁻ falls 2 mEq/L per 10 mm Hg fall in PaCO₂ ^[adrogue-madias-secondary-2010] |
   | Chronic respiratory alkalosis | HCO₃⁻ falls 4 mEq/L per 10 mm Hg fall in PaCO₂ ^[adrogue-madias-secondary-2010] |

   - Allow about ±3 mEq/L (HCO₃⁻) or ±5 mm Hg (PaCO₂) around the expected value. Outside that range, look for a second disorder. ^[adrogue-madias-secondary-2010]
   - Chronic renal compensation takes about 3–5 days for hypercapnia and 2–3 days for hypocapnia. A value between the acute and chronic expectations suggests acute-on-chronic disease. The chronic hypercapnia rule holds up to a PaCO₂ of about 70 mm Hg. ^[adrogue-madias-secondary-2010]

5. Calculate the gap in every metabolic acidosis
   - {{calc:anion-gap|Anion gap}} = Na⁺ − (Cl⁻ + HCO₃⁻). Add 2.5 mEq/L for each 1 g/dL that albumin is below 4.0 g/dL. A gap above about 12 mEq/L is high. ^[kraut-anion-gap-2007, figge-albumin-1998]
   - Hypoalbuminemia hides a high gap. The corrected gap exposes it. ^[kraut-anion-gap-2007, figge-albumin-1998]
   - Falsely low gap: hypoalbuminemia, IgG paraproteins (myeloma), lithium toxicity, hypercalcemia, hypermagnesemia, bromide (reads as chloride). ^[kraut-anion-gap-2007]
   - Calculate it in metabolic alkalosis too: alkalemia raises the gap by a few mEq/L (more albumin charge, more lactate). ^[kraut-anion-gap-2007]

6. Compare the change in gap with the change in bicarbonate (high-gap acidosis)
   - Delta ratio = (AG − 12) ÷ (24 − HCO₃⁻). The gap rises about as much as bicarbonate falls when the only process is a high-gap acid. ^[rastegar-delta-ratio-2007]

   | Delta ratio | Suggests |
   |---|---|
   | <0.4 | Non-gap acidosis alone ^[common-practice] |
   | 0.4–1 | High-gap plus non-gap acidosis (also seen in kidney disease). Ketoacidosis often sits near 1 ^[rastegar-delta-ratio-2007, common-practice] |
   | 1–2 | Pure high-gap acidosis ^[rastegar-delta-ratio-2007] |
   | >2 | High-gap acidosis plus metabolic alkalosis, or pre-existing high HCO₃⁻ (chronic respiratory acidosis) ^[rastegar-delta-ratio-2007] |

   - The ratio varies widely between patients (lactic acidosis often runs about 1.6, ketoacidosis near 1 or below because ketoanions are lost in urine). Treat it as a prompt to look, not a diagnosis. ^[rastegar-delta-ratio-2007]

7. Add the osmolal gap when no cause is clear
   - Osmolal gap = measured osmolality − {{calc:serum-osmolality|calculated osmolality}} (2 × Na⁺ + glucose ÷ 18 + BUN ÷ 2.8). A gap above about 10 mOsm/kg with a high-gap acidosis suggests a toxic alcohol. ^[kraut-kurtz-toxic-alcohols-2008]
   - Also raised by ethanol, isopropanol, ketoacidosis, lactic acidosis and kidney failure. A normal gap does not exclude a toxic alcohol that has already been metabolized. ^[kraut-kurtz-toxic-alcohols-2008]

8. Match the pattern to the patient
   - Use the clinical context and the table below. Recheck the gas after treatment. ^[common-practice]

## Patterns and What They Mean
| Pattern | Causes | Next step |
|---|---|---|
| High-gap metabolic acidosis | Ketoacidosis (diabetic, alcoholic, starvation). Lactic acidosis. Kidney failure (uremia). Toxic alcohols (methanol, ethylene glycol, propylene glycol). Salicylate. 5-oxoproline (chronic acetaminophen, malnutrition). D-lactate (short bowel) ^[kraut-madias-metabolic-acidosis-2010, kraut-madias-lactic-acidosis-2014, kraut-kurtz-toxic-alcohols-2008] | β-hydroxybutyrate and glucose ([[endo-dka| DKA]]). Lactate. Creatinine ([[renal-aki | AKI]]). Osmolal gap. Salicylate level ^[kraut-madias-metabolic-acidosis-2010, kraut-kurtz-toxic-alcohols-2008] |
| Non-gap (hyperchloremic) metabolic acidosis | Gastrointestinal bicarbonate loss (diarrhea, ileostomy, pancreatic or biliary drainage). Renal tubular acidosis. Large-volume saline ([[renal-iv-fluids | IV fluids]]). Acetazolamide and topiramate. Recovery phase of DKA (ketoanion loss). Ureteral diversion. Early kidney disease ^[kraut-madias-metabolic-acidosis-2010] | Urine AG (below). Potassium. Stool and medication history ^[kraut-madias-metabolic-acidosis-2010] |
| Metabolic alkalosis, chloride-responsive (urine Cl⁻ <20 mEq/L) | Vomiting or nasogastric suction. Remote diuretic use. Recovery from hypercapnia. Chloride-poor intake ^[galla-metabolic-alkalosis-2000] | Isotonic saline with potassium repletion ^[galla-metabolic-alkalosis-2000] |
| Metabolic alkalosis, chloride-resistant (urine Cl⁻ >20 mEq/L) | Current diuretic use. Primary hyperaldosteronism, Cushing syndrome, renal artery stenosis (hypertension, hypokalemia). Severe potassium depletion. Bartter and Gitelman syndromes. Alkali loads (bicarbonate, citrate, milk-alkali) ^[galla-metabolic-alkalosis-2000] | Renin, aldosterone and cortisol if hypertensive. Stop the offending agent. Replete potassium ^[galla-metabolic-alkalosis-2000] |
| Respiratory acidosis | Hypoventilation: COPD, asthma (late), obesity hypoventilation, opioids and sedatives, neuromuscular weakness, chest wall disease, severe pulmonary edema or pneumonia ^[epstein-respiratory-acidosis-2001] | Alveolar-arterial gradient (below): normal suggests extrapulmonary hypoventilation, raised suggests lung disease ^[epstein-respiratory-acidosis-2001, common-practice] |
| Respiratory alkalosis | Hypoxemia, pulmonary embolism, pneumonia, pain or anxiety, sepsis, salicylate, pregnancy, liver disease, central nervous system disease, mechanical ventilation settings ^[seifter-acid-base-2014, common-practice] | Look for hypoxemia and the cause ([[crit-hypoxemic-respiratory-failure|hypoxemia]]) ^[common-practice] |
| Mixed disorder | Compensation outside the expected range. Normal pH with abnormal PaCO₂ or HCO₃⁻. Delta ratio <0.4 or >2 ^[adrogue-madias-secondary-2010, rastegar-delta-ratio-2007] | Name each process, then treat each cause ^[berend-acid-base-2014] |

#### Tools for the next step
- Non-gap acidosis: {{calc:urine-anion-gap|urine anion gap}} = (urine Na⁺ + K⁺) − urine Cl⁻. Negative: gastrointestinal bicarbonate loss with intact renal ammonium excretion. Positive: low renal ammonium excretion (distal or type 4 renal tubular acidosis, chronic kidney disease). ^[kraut-madias-metabolic-acidosis-2010]
- Unreliable with volume depletion (low urine Na⁺), bicarbonaturia, ketonuria or other unmeasured urine anions. ^[kraut-madias-metabolic-acidosis-2010]
- Respiratory acidosis: the {{calc:aa-gradient|A-a gradient}} (normal in pure hypoventilation, raised with lung disease). ^[epstein-respiratory-acidosis-2001, common-practice]

#### Common mixed patterns
- Vomiting with diabetic ketoacidosis or uremia: normal or near-normal pH, high gap, delta ratio >2. ^[rastegar-delta-ratio-2007]
- Salicylate: respiratory alkalosis (direct respiratory stimulation) plus high-gap acidosis, often with a near-normal pH. ^[palmer-salicylate-2020, common-practice]
- Sepsis: lactic acidosis plus respiratory alkalosis (drive from sepsis itself) is common. ^[kraut-madias-lactic-acidosis-2014, common-practice]
- COPD on a loop diuretic: chronic respiratory acidosis plus metabolic alkalosis (HCO₃⁻ higher than the chronic expectation). ^[adrogue-madias-secondary-2010, common-practice]

#### When to treat
- Metabolic acidosis: treat the cause first (insulin and fluids in DKA, perfusion in lactic acidosis, antidotes or dialysis for toxic alcohols). ^[kraut-madias-metabolic-acidosis-2010, kraut-kurtz-toxic-alcohols-2008]
- Bicarbonate: DKA only if pH <7.0 (see [[endo-dka|DKA]]). ^[ada-hyperglycemic-crises-2024]
- ICU, severe acidemia (pH ≤7.20) with moderate–severe AKI: bicarbonate to a pH ≥7.30 did not reduce 90-day mortality. Less kidney replacement therapy was a secondary finding (see [[renal-aki|AKI]]). ^[bicaricu2-2025, bicar-icu-2018]
- Septic shock with pH ≤7.2 and AKIN stage 2–3: bicarbonate suggested (conditional, very low certainty). Not suggested for hemodynamic support in hypoperfusion-induced lactic acidemia. ^[ssc-sepsis-2026]
- Specific indications: salicylate toxicity (serum and urine alkalinization), sodium-channel-blocker toxicity, and severe non-gap acidosis from bicarbonate loss. ^[palmer-salicylate-2020, kraut-madias-metabolic-acidosis-2010, common-practice]
- Elsewhere bicarbonate has no proven benefit in acute lactic or other organic acidoses and can cause hypernatremia, volume overload, hypocalcemia, hypokalemia and a rise in PaCO₂ (needs ventilation to clear it). ^[kraut-madias-lactic-acidosis-2014, kraut-madias-metabolic-acidosis-2010]
- Chronic non-gap acidosis (renal tubular acidosis, chronic kidney disease): oral alkali therapy improves cellular function with few complications. ^[kraut-madias-metabolic-acidosis-2010]
- Metabolic alkalosis: ^[galla-metabolic-alkalosis-2000]
  - Stop the cause ^[galla-metabolic-alkalosis-2000]
  - Give isotonic saline and potassium when chloride-responsive ^[galla-metabolic-alkalosis-2000]
  - Chloride-resistant causes need endocrine or renal evaluation ^[galla-metabolic-alkalosis-2000]
- Respiratory acidosis: ^[ers-ats-niv-2017, bts-oxygen-2017]
  - Ventilatory support when pH is low or mentation falls ^[ers-ats-niv-2017, bts-oxygen-2017]
  - Noninvasive ventilation for COPD exacerbation with pH ≤7.35 ([[pulm-copd-exacerbation|COPD exacerbation]]) ^[ers-ats-niv-2017, bts-oxygen-2017]
  - Controlled oxygen in hypercapnic-risk patients (88–92%) ^[ers-ats-niv-2017, bts-oxygen-2017]
- Respiratory alkalosis: treat the cause. Reassure when from anxiety. ^[common-practice]

## Worked Examples
| Gas and chemistry | Interpretation |
|---|---|
| pH 7.18, PaCO₂ 22, HCO₃⁻ 8. Na⁺ 138, Cl⁻ 100 | Metabolic acidosis. Expected PaCO₂ 1.5 × 8 + 8 = 20 (18–22): appropriate. AG 30. Delta ratio (30 − 12) ÷ (24 − 8) = 1.1: pure high-gap acidosis. Check β-hydroxybutyrate, lactate, creatinine ^[albert-metabolic-acidosis-1967, rastegar-delta-ratio-2007] |
| pH 7.28, PaCO₂ 26, HCO₃⁻ 12. Na⁺ 136, Cl⁻ 112 | Metabolic acidosis. Expected PaCO₂ 26 (24–28): appropriate. AG 12: normal, so non-gap. Diarrhea or renal tubular acidosis. The urine gap decides ^[albert-metabolic-acidosis-1967, kraut-madias-metabolic-acidosis-2010] |
| pH 7.52, PaCO₂ 50, HCO₃⁻ 40. Na⁺ 138, Cl⁻ 84 | Metabolic alkalosis. Expected PaCO₂ 40 + 0.7 × 16 = 51: appropriate. Vomiting or diuretics. Urine Cl⁻ <20 mEq/L means chloride-responsive ^[adrogue-madias-secondary-2010, galla-metabolic-alkalosis-2000] |
| pH 7.27, PaCO₂ 70, HCO₃⁻ 31. Na⁺ 140, Cl⁻ 98 | Respiratory acidosis. PaCO₂ rise of 30: expected HCO₃⁻ 27 (24–30) if acute, 34.5 (31.5–37.5) if chronic. Measured 31 is in neither range: acute-on-chronic hypercapnia, as in a COPD exacerbation ^[adrogue-madias-secondary-2010] |
| pH 7.42, PaCO₂ 24, HCO₃⁻ 15. Na⁺ 140, Cl⁻ 100 | Normal pH, so mixed. AG 25 with HCO₃⁻ 15: high-gap acidosis. Expected PaCO₂ 1.5 × 15 + 8 = 30.5 (28.5–32.5). Measured 24 is below: concurrent respiratory alkalosis. Think salicylate or sepsis ^[albert-metabolic-acidosis-1967, palmer-salicylate-2020] |

## More Information
### Evidence: Bicarbonate in critically ill adults
- BICAR-ICU (severe metabolic acidemia, pH ≤7.20): 28-day mortality not different overall. Fewer deaths in the AKI stratum, which prompted BICARICU-2. ^[bicar-icu-2018]
- SODa-BIC (vasopressor-dependent shock, pH <7.30, placebo-controlled, n=500): no reduction in 30-day major adverse kidney events (40.2% vs 39.4%). In-hospital mortality 25.4% vs 24.0%. ^[soda-bic-2026]
- BICARICU-2 (pH ≤7.20 and moderate–severe AKI, n=627 analyzed): 90-day mortality 62.1% with bicarbonate vs 61.7% without. ^[bicaricu2-2025]

## Pearls
- Always calculate compensation before naming a single disorder. ^[adrogue-madias-secondary-2010]
- Albumin-correct the gap: a "normal" gap in hypoalbuminemia can hide lactic acidosis or ketoacidosis. ^[kraut-anion-gap-2007, figge-albumin-1998]
- Delta ratio and compensation formulas are guides with wide scatter, not diagnoses. ^[rastegar-delta-ratio-2007, adrogue-madias-secondary-2010]
- Chloride-responsive alkalosis has urine Cl⁻ <20 mEq/L. On current diuretics urine Cl⁻ is unreliable. ^[galla-metabolic-alkalosis-2000]
- A normal pH with abnormal PaCO₂ or HCO₃⁻ is a mixed disorder until proven otherwise. ^[berend-acid-base-2014]
