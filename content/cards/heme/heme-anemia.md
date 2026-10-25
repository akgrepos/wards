---
id: heme-anemia
type: topic
system: heme
title: "Anemia"
aliases: [anemia, low hemoglobin, low hematocrit, low Hb, microcytic anemia, normocytic anemia, macrocytic anemia, MCV, reticulocyte count, retic, reticulocyte production index, iron deficiency, iron deficiency anemia, IDA, ferritin, transferrin saturation, TSAT, TIBC, anemia of chronic disease, anemia of inflammation, B12 deficiency, vitamin B12, folate deficiency, megaloblastic anemia, pernicious anemia, hemolysis, hemolytic anemia, LDH, haptoglobin, Coombs, DAT, schistocytes, TTP, thrombotic thrombocytopenic purpura, TMA, HUS, ADAMTS13, PLASMIC, transfusion, blood transfusion, packed red blood cells, PRBC, restrictive transfusion, IV iron, Injectafer, Monoferric, Feraheme, ferric carboxymaltose, ferumoxytol, ferric derisomaltose, ferrous sulfate, pancytopenia, thalassemia, Mentzer index, hospital-acquired anemia, anemia in hospitalized adults]
definition: "Hemoglobin below 13.0 g/dL in men and 12.0 g/dL in nonpregnant women, evaluated in the hospitalized adult by red cell size (MCV) and reticulocyte response to find bleeding, hemolysis, marrow failure or a deficiency. ^[who-anemia-2024]"
based_on: [who-anemia-2024, aabb-rbc-2023, ash-iron-deficiency-dx-2026, aga-ida-2020, kdigo-anemia-ckd-2026, isth-ttp-2025, bsh-b12-folate-2014]
checked: { date: 2026-10-22, by: opus, scope: "doses and numbers", fingerprint: "cf84e8b5b68dce6f", carried: "2026-10-25: Format sweep (bullets split, tables to bullets or scale, society names out of text). Numbers, doses, drugs and sources unchanged." }
related:
  differential: [gi-upper-gi-bleeding, renal-aki, cardio-adhf]
  conditions: [heme-anticoagulation-management, cardio-nste-acs]
  tools: []
---
## At a Glance
- Anemia is hemoglobin <13.0 g/dL in men and <12.0 g/dL in nonpregnant women. Split it by MCV, then by the reticulocyte response. ^[who-anemia-2024, common-practice]
- Rule out what cannot wait first: active bleeding ([[gi-upper-gi-bleeding]]), hemolysis, thrombotic microangiopathy (TTP), marrow failure. ^[common-practice]
- Draw iron studies, B12, folate, reticulocytes, LDH and haptoglobin before the first transfusion. The sample is confounded afterward. ^[common-practice]
- Iron deficiency: ^[ash-iron-deficiency-dx-2026, aga-ida-2020]
  - Ferritin {{threshold:ferritin-iron-deficiency}} ^[ash-iron-deficiency-dx-2026, aga-ida-2020]
  - With inflammation, ferritin below 100 ng/mL or transferrin saturation below 20% ^[ash-iron-deficiency-dx-2026, aga-ida-2020]
  - Find the source of loss, then replace iron (IV when oral fails, is not tolerated, or loss continues) ^[ash-iron-deficiency-dx-2026, aga-ida-2020]
- Transfusion: ^[aabb-rbc-2023, common-practice]
  - Transfuse a stable hospitalized adult at hemoglobin {{threshold:transfusion-hb-restrictive}}, {{threshold:transfusion-hb-cardiovascular}} with cardiovascular disease ^[aabb-rbc-2023, common-practice]
  - One unit, then reassess ^[aabb-rbc-2023, common-practice]
  - Hemorrhage, shock or symptoms are transfused on clinical grounds ^[aabb-rbc-2023, common-practice]
- Call hematology the same day for hemolysis, two or more low cell lines, blasts, or schistocytes with thrombocytopenia (same hour). ^[common-practice, isth-ttp-2025]

## Definition and Staging
{{criteria:anemia-severity}}

- Hemoglobin lags acute blood loss. A normal value does not exclude bleeding in the first hours. ^[common-practice]
- Volume resuscitation, pregnancy and splenomegaly dilute hemoglobin. ^[common-practice]
- MCV: below 80 fL microcytic, 80–100 fL normocytic, above 100 fL macrocytic. ^[common-practice]
- Mixed causes can give a normal MCV, and a raised RDW suggests mixing. ^[common-practice]
- Reticulocyte response: correct the reticulocyte percentage for the hematocrit and for early release (the {{calc:rpi|reticulocyte production index}}). ^[common-practice]
- A production index below 2 means an inadequate marrow response, above 2 to 3 an appropriate response to hemolysis or blood loss. ^[common-practice]
- Hospital-acquired anemia is common: repeated phlebotomy, inflammation and dilution. Limit unnecessary draws and use small-volume tubes. ^[common-practice]

## First Steps
1. Stability and bleeding
   - Pulse, blood pressure, orthostatic change. ^[common-practice]
   - Melena or hematochezia, hematemesis, hematuria. ^[common-practice]
   - Expanding hematoma or flank or abdominal pain (retroperitoneal bleeding). ^[common-practice]
   - Bleeding with instability: two large-bore IVs, type and screen, resuscitate and transfuse on clinical grounds. See [[gi-upper-gi-bleeding]]. ^[acg-ugib-2021, common-practice]
2. Draw before transfusing
   - CBC with indices and RDW, review the peripheral smear yourself, reticulocyte count. ^[common-practice]
   - Ferritin, iron, TIBC (transferrin saturation), B12, folate. ^[ash-iron-deficiency-dx-2026, bsh-b12-folate-2014]
   - LDH, haptoglobin, total and indirect bilirubin, direct antiglobulin test (DAT) when hemolysis is possible. ^[common-practice]
   - Creatinine and TSH. Liver tests when macrocytic. ^[common-practice]
3. Hemolysis and microangiopathy flags
   - Flags: thrombocytopenia, schistocytes, raised LDH, raised indirect bilirubin, fever, confusion, kidney injury. ^[isth-ttp-2025, common-practice]
   - Treat as TTP until proven otherwise. See Escalation. ^[isth-ttp-2025, common-practice]
4. Medication and exposure review
   - New drugs: linezolid, methotrexate, chemotherapy, zidovudine, azathioprine, ribavirin. ^[common-practice]
   - Also β-lactams (immune hemolysis) and oxidants such as dapsone in G6PD deficiency. ^[common-practice]
   - Anticoagulants and antiplatelets: see [[heme-anticoagulation-management]]. ^[common-practice]
5. Transfusion decision
   - See Treatment: the thresholds below do not apply to bleeding, shock or active ischemia. ^[aabb-rbc-2023]

## Causes
- **Blood loss:** [!cannot-miss] ^[common-practice]
  - Gastrointestinal bleeding ([[gi-upper-gi-bleeding]]), retroperitoneal or surgical bleeding, trauma ^[common-practice]
  - Menstrual or genitourinary loss, repeated phlebotomy ^[common-practice]
- **Decreased production:** [!most-common] ^[common-practice, ash-iron-deficiency-dx-2026]
  - Anemia of inflammation or chronic disease (infection, cancer, autoimmune disease) ^[common-practice, ash-iron-deficiency-dx-2026]
  - Iron deficiency, chronic kidney disease, endocrine disease (hypothyroidism) ^[common-practice, ash-iron-deficiency-dx-2026]
- **Marrow failure and infiltration:** [!cannot-miss] ^[common-practice]
  - Aplastic anemia, myelodysplastic syndrome, leukemia, lymphoma, myeloma, metastases, myelofibrosis ^[common-practice]
  - Drug, toxin or radiation effect ^[common-practice]
- **Impaired maturation:** ^[bsh-b12-folate-2014, common-practice]
  - B12 or folate deficiency (pernicious anemia, metformin, proton pump inhibitor, bariatric surgery, alcohol, nitrous oxide) ^[bsh-b12-folate-2014, common-practice]
  - Copper deficiency ^[bsh-b12-folate-2014, common-practice]
  - Sideroblastic anemia (alcohol, lead, isoniazid) ^[bsh-b12-folate-2014, common-practice]
- **Hemolysis:** [!cannot-miss] ^[common-practice, isth-ttp-2025]
  - Autoimmune (warm, cold, drug-induced) ^[common-practice, isth-ttp-2025]
  - Thrombotic microangiopathy (TTP, hemolytic uremic syndrome, DIC, HELLP, malignant hypertension) ^[common-practice, isth-ttp-2025]
  - Mechanical heart valve, G6PD deficiency, paroxysmal nocturnal hemoglobinuria, sickle cell disease ^[common-practice, isth-ttp-2025]
  - Infection (malaria, Babesia, Clostridium) ^[common-practice, isth-ttp-2025]
- **Hemoglobinopathy:** thalassemia trait and other microcytic variants. ^[common-practice]
- **Dilution or sequestration:** volume resuscitation, splenomegaly. ^[common-practice]

## Presentation
#### Focused history
- Tempo and symptoms: fatigue, dyspnea, angina, syncope, palpitations. ^[common-practice]
- Clues to cause: pica or restless legs (iron deficiency), jaundice or dark urine (hemolysis), neuropathy or glossitis (B12). ^[common-practice]
- Blood loss: melena, hematochezia, menstrual history, hematuria, recent surgery, frequent phlebotomy. ^[common-practice]
- Diet and absorption: vegetarian or vegan diet, alcohol, celiac disease. ^[bsh-b12-folate-2014, aga-ida-2020]
- Also bariatric surgery, inflammatory bowel disease, proton pump inhibitor or metformin use. ^[bsh-b12-folate-2014, aga-ida-2020]
- Medications, exposures, family history of anemia or gallstones, and prior blood counts to date the onset. ^[common-practice]

#### Focused examination
- Hemodynamics: orthostatic change, tachycardia, murmur. ^[common-practice]
- Pallor, jaundice, glossitis, koilonychia, petechiae, bruising. ^[common-practice]
- Splenomegaly or lymphadenopathy (lymphoma, hemolysis, hypersplenism). Abdominal and rectal examination with stool guaiac for melena. ^[common-practice]
- Neurologic: confusion or focal deficit with thrombocytopenia suggests TTP. Posterior column loss suggests B12 deficiency. ^[isth-ttp-2025, bsh-b12-folate-2014]

## Diagnosis
#### First-line tests
- CBC with indices, reticulocyte count and a smear read by the clinician or hematology. Compare with prior counts. ^[common-practice]
- Iron studies (ferritin, iron, TIBC, transferrin saturation). B12 and folate, creatinine and TSH. ^[ash-iron-deficiency-dx-2026, bsh-b12-folate-2014]
- LDH, haptoglobin, indirect bilirubin and DAT if reticulocytes are raised, the smear is abnormal, or bilirubin or LDH are raised. ^[common-practice]

#### Pattern by MCV and reticulocytes
- **Microcytic (<80 fL):** ^[common-practice, ash-iron-deficiency-dx-2026]
  - Likely causes: iron deficiency, anemia of inflammation (sometimes), thalassemia trait (RBC count ↑, ferritin =), sideroblastic anemia ^[common-practice, ash-iron-deficiency-dx-2026]
  - Next step: ferritin and transferrin saturation. Hemoglobin electrophoresis if iron studies are normal ^[common-practice, ash-iron-deficiency-dx-2026]
- **Normocytic, reticulocytes ↓:** ^[common-practice]
  - Likely causes: anemia of inflammation, CKD, early iron deficiency, marrow failure, endocrine disease, mixed deficiency ^[common-practice]
  - Next step: iron studies, creatinine, TSH, smear. Hematology if other cell lines are ↓ ^[common-practice]
- **Normocytic, reticulocytes ↑:** ^[common-practice]
  - Likely causes: hemolysis, recent bleeding, treatment response ^[common-practice]
  - Next step: LDH, haptoglobin, bilirubin, DAT, smear. Look for bleeding ^[common-practice]
- **Macrocytic (>100 fL):** ^[bsh-b12-folate-2014, common-practice]
  - Likely causes: B12 or folate deficiency, alcohol, liver disease, hypothyroidism, medications, myelodysplastic syndrome, reticulocytosis ^[bsh-b12-folate-2014, common-practice]
  - Next step: B12 (with methylmalonic acid if borderline), folate, TSH, liver tests, smear ^[bsh-b12-folate-2014, common-practice]

- Microcytosis with a high red cell count and normal ferritin: thalassemia trait. ^[common-practice]
- The {{calc:mentzer|Mentzer index}} (MCV ÷ RBC count) helps separate thalassemia trait from iron deficiency. ^[common-practice]

#### Iron studies
- Iron deficiency: ferritin {{threshold:ferritin-iron-deficiency}} in adults, with or without anemia. ^[ash-iron-deficiency-dx-2026]
- The 2026 cutoff is ≤50 ng/mL with heavy menstrual bleeding or in pregnancy with anemia. ^[ash-iron-deficiency-dx-2026]
- With inflammation (infection, cancer, inflammatory bowel disease) ferritin rises as an acute-phase reactant: measure ferritin and transferrin saturation. ^[ash-iron-deficiency-dx-2026]
- Consider iron deficiency at ferritin {{threshold:ferritin-inflammation}}. Either criterion suffices (conditional, very low certainty). ^[ash-iron-deficiency-dx-2026]
- Anemia of inflammation: low iron and low transferrin saturation with low-to-normal TIBC and normal or high ferritin. The two can coexist. ^[ash-iron-deficiency-dx-2026, common-practice]
- Interpret transferrin saturation (iron ÷ TIBC) below 20% as limited iron availability. ^[ash-iron-deficiency-dx-2026, common-practice]
- Draw it fasting, without iron or multivitamins beforehand. Iron and TIBC fluctuate and are unreliable shortly after transfusion or iron. ^[ash-iron-deficiency-dx-2026, common-practice]

- **Ferritin:** ^[ash-iron-deficiency-dx-2026]
  - Iron deficiency: ↓ ^[ash-iron-deficiency-dx-2026]
  - Anemia of inflammation: = or ↑ ^[ash-iron-deficiency-dx-2026]
  - Both: <100 ng/mL, or TSAT <20% ^[ash-iron-deficiency-dx-2026]
- **Transferrin saturation:** ^[ash-iron-deficiency-dx-2026]
  - Iron deficiency: ↓ ^[ash-iron-deficiency-dx-2026]
  - Anemia of inflammation: ↓ ^[ash-iron-deficiency-dx-2026]
  - Both: ↓ ^[ash-iron-deficiency-dx-2026]
- **TIBC:** ^[common-practice]
  - Iron deficiency: ↑ ^[common-practice]
  - Anemia of inflammation: = or ↓ ^[common-practice]
  - Both: = or ↓ ^[common-practice]
- **MCV:** ^[common-practice]
  - Iron deficiency: = or ↓ ^[common-practice]
  - Anemia of inflammation: = or ↓ ^[common-practice]
  - Both: ↕ ^[common-practice]

#### Find the source of iron deficiency
- Asymptomatic men and postmenopausal women with iron deficiency anemia: bidirectional endoscopy (upper endoscopy and colonoscopy, strong). ^[aga-ida-2020]
- Premenopausal women: bidirectional endoscopy is suggested over iron alone (conditional), weighing menstrual loss and preference. ^[aga-ida-2020]
- Celiac serology (tissue transglutaminase IgA), with duodenal biopsy if positive. Noninvasive Helicobacter pylori testing, treating if positive. ^[aga-ida-2020, common-practice]
- Inpatient: do not delay iron replacement for endoscopy. Coordinate timing with gastroenterology. ^[common-practice]

#### Vitamin B12 and folate
- B12 below 200 pg/mL is deficient. ^[bsh-b12-folate-2014, common-practice]
- 200–300 pg/mL is borderline: confirm with methylmalonic acid (raised in B12 deficiency, normal in folate deficiency). ^[bsh-b12-folate-2014, common-practice]
- Strong clinical features (neuropathy, megaloblastosis) with a normal level: treat without delay. ^[bsh-b12-folate-2014]
- Pernicious anemia: anti-intrinsic factor antibody. ^[bsh-b12-folate-2014]
- Hypersegmented neutrophils and macro-ovalocytes support megaloblastic anemia. ^[common-practice]
- Severe B12 deficiency can mimic hemolytic anemia and thrombotic microangiopathy (raised LDH, schistocytes, low platelets). ^[common-practice]
- Check B12 before attributing the picture to hemolysis. ^[common-practice]

#### Hemolysis
- **Reticulocytes:** ^[common-practice]
  - Hemolysis: ↑ (not in early or marrow-suppressed cases) ^[common-practice]
  - Notes: a ↓ count does not exclude AIHA ^[common-practice]
- **LDH:** ^[common-practice]
  - Hemolysis: ↑ ^[common-practice]
  - Notes: also ↑ in tissue injury and malignancy ^[common-practice]
- **Haptoglobin:** ^[common-practice]
  - Hemolysis: ↓ ^[common-practice]
  - Notes: acute-phase reactant. ↑ by inflammation. ↓ in cirrhosis ^[common-practice]
- **Indirect bilirubin:** ^[common-practice]
  - Hemolysis: ↑ ^[common-practice]
  - Notes: check total and direct ^[common-practice]
- **Smear:** ^[common-practice, isth-ttp-2025]
  - Hemolysis: spherocytes, schistocytes, bite cells, agglutination ^[common-practice, isth-ttp-2025]
  - Notes: schistocytes with ↓ platelets: TMA ^[common-practice, isth-ttp-2025]
- **DAT (Coombs):** ^[common-practice]
  - Hemolysis: positive means immune hemolysis ^[common-practice]
  - Notes: negative with schistocytes: TMA ^[common-practice]

- Second-line tests: ^[common-practice]
  - G6PD level (unreliable during or just after hemolysis) ^[common-practice]
  - Flow cytometry for paroxysmal nocturnal hemoglobinuria ^[common-practice]
  - Hemoglobin electrophoresis, cold agglutinin titer, urine hemosiderin ^[common-practice]

#### Thrombotic microangiopathy
- Anemia with schistocytes and thrombocytopenia and a negative DAT: draw ADAMTS13 activity and inhibitor before plasma exchange or any blood product. ^[isth-ttp-dx-2020, bendapudi-plasmic-2017]
- Estimate pretest probability with the {{calc:plasmic|PLASMIC score}} or clinical assessment. ^[isth-ttp-dx-2020, bendapudi-plasmic-2017]
- A high score (6–7) predicts severe ADAMTS13 deficiency. Do not wait for the result to start treatment. ^[bendapudi-plasmic-2017, isth-ttp-dx-2020]
- Other causes to exclude: DIC (coagulation tests), malignant hypertension, HELLP, STEC hemolytic uremic syndrome (bloody diarrhea), drugs. ^[common-practice]

#### Marrow evaluation
- Pancytopenia, bicytopenia, blasts or teardrop cells on the smear, or unexplained macrocytosis: hematology. ^[common-practice]
- Hematology does bone marrow biopsy, flow cytometry and cytogenetics. ^[common-practice]

## Treatment
#### Common initial orders
- Type and screen if bleeding or likely to be transfused. Pre-transfusion labs above. ^[common-practice]
- Stop or avoid causes: NSAIDs and unneeded antiplatelets or anticoagulants, offending drugs. Reduce phlebotomy. ^[common-practice]
- Treat the cause: infection, kidney disease, deficiency. Anemia of inflammation improves as the illness resolves. ^[common-practice]
- Telemetry and troponin if symptomatic with anemia and cardiac risk. ^[common-practice]

#### Transfusion
- Stable hospitalized adults: transfuse at hemoglobin {{threshold:transfusion-hb-restrictive}}. A restrictive strategy is as safe as a liberal one. ^[aabb-rbc-2023]
- Preexisting cardiovascular disease or orthopedic surgery: {{threshold:transfusion-hb-cardiovascular}}. ^[aabb-rbc-2023]
- Cardiac surgery: 7.5 g/dL. Hematology or oncology: 7 g/dL (conditional). ^[aabb-rbc-2023]
- Transfuse irrespective of the number for hemorrhage, shock, or symptoms from anemia. ^[common-practice, aabb-rbc-2023]
- Symptoms from anemia: angina, ischemic ECG changes, heart failure, hypotension, or orthostasis not due to volume depletion. ^[common-practice, aabb-rbc-2023]
- Give one unit, then recheck hemoglobin and symptoms before another. Expected rise is about 1 g/dL per unit in an average adult. ^[common-practice]
- Do not transfuse to treat iron, B12 or folate deficiency in a stable patient. Replace the deficient nutrient. ^[common-practice]
- Acute myocardial infarction with anemia: see [[cardio-nste-acs]]. ^[mint-2023]
- A randomized trial found no significant difference between a restrictive and a liberal strategy. ^[mint-2023]
- The confidence interval does not exclude benefit of a liberal strategy. ^[mint-2023]
- TTP: avoid platelet transfusion unless life-threatening bleeding. ^[common-practice]
- Warm autoimmune hemolytic anemia: transfuse only for life-threatening anemia, with the blood bank informed (crossmatch is difficult). ^[common-practice]

#### Iron replacement
1. Oral iron
   - First line for iron deficiency anemia in a stable patient who absorbs oral iron. ^[stoffel-iron-2017, common-practice]
   - Once daily or every other day (alternate-day single doses raised fractional and total absorption in iron-depleted women). ^[stoffel-iron-2017, common-practice]

   {{dose:ferrous-sulfate-ida}}

   - Expect a reticulocyte rise in about a week and a hemoglobin rise of about 1 g/dL in 2 to 4 weeks. ^[common-practice]
   - No rise means ongoing loss, malabsorption, poor adherence, or another cause. ^[common-practice]
2. IV iron
   - Use when: ^[common-practice, kdigo-anemia-ckd-2026]
     - Oral iron fails or is not tolerated, or loss is ongoing ^[common-practice, kdigo-anemia-ckd-2026]
     - Absorption is poor (celiac disease, bariatric surgery, active inflammatory bowel disease, inflammation, proton pump inhibitor) ^[common-practice, kdigo-anemia-ckd-2026]
     - Rapid repletion is needed (severe symptoms, perioperative, heart failure, CKD) ^[common-practice, kdigo-anemia-ckd-2026]
   - One of: ^[label-injectafer-2026, label-monoferric-2025, label-feraheme-2026]

   {{dose:ferric-carboxymaltose-ida}}

   {{dose:ferric-derisomaltose-ida}}

   {{dose:ferumoxytol-ida}}

   - Hold or defer in active bacteremia or sepsis. Iron sucrose has a label indication in CKD only. ^[kdigo-anemia-ckd-2026, label-venofer-2026, common-practice]
   - Iron dextran (INFeD) has a boxed warning for anaphylaxis. ^[label-infed-2025, common-practice]
- It needs a test dose before the first therapeutic dose. Prefer another IV iron when available. ^[label-infed-2025, common-practice]
   - Ferric carboxymaltose: check phosphate before repeat courses in at-risk patients (boxed warning for hypophosphatemia, 2026). ^[label-injectafer-2026]
   - Every IV iron product: infuse with resuscitation capability, observe at least 30 minutes after the infusion. ^[label-injectafer-2026, label-monoferric-2025, label-feraheme-2026]

:::note
- Ferritin and transferrin saturation are unreliable for about 4 weeks after IV iron. Recheck iron studies after that interval. ^[common-practice]
:::

#### Vitamin B12 and folate
- Start B12 first or with folate. Give IM for neurologic symptoms, severe deficiency or malabsorption. ^[bsh-b12-folate-2014, stabler-b12-2013]

{{dose:cyanocobalamin-im}}

- Mild deficiency without neurologic symptoms, tolerating oral therapy: ^[stabler-b12-2013]

{{dose:cyanocobalamin-po}}

- Folate deficiency after B12 is treated or excluded: ^[bsh-b12-folate-2014]

{{dose:folic-acid-po}}

- Check potassium in the first days of treating severe megaloblastic anemia. Hypokalemia can develop. ^[common-practice]

#### Hemolysis and microangiopathy
- Hemolysis: treat the cause (stop the drug, treat infection, remove the trigger). Give daily folic acid in chronic hemolysis. ^[common-practice]
- Warm autoimmune hemolytic anemia: glucocorticoids first line, with hematology. ^[common-practice]
- Suspected TTP (high pretest probability): plasma exchange and glucocorticoids without waiting for ADAMTS13 (steroids with exchange: strong). ^[isth-ttp-dx-2020, isth-ttp-2020, isth-ttp-2025]
- Caplacizumab and rituximab are suggested (conditional), per hematology. ^[isth-ttp-dx-2020, isth-ttp-2020, isth-ttp-2025]
- Do not give plasma infusion in place of exchange for immune TTP unless exchange is delayed. Do not transfuse platelets for thrombocytopenia alone. ^[common-practice]

#### Erythropoiesis-stimulating agents
- Not for the usual inpatient anemia of inflammation or acute illness. In CKD they are specialist-directed (see More Information). ^[kdigo-anemia-ckd-2026, common-practice]

## Monitor
- Hemoglobin: ^[common-practice]
  - After each unit before giving another ^[common-practice]
  - Every 6 to 8 hours while bleeding is suspected, otherwise daily ^[common-practice]
  - Reassess symptoms after each unit ^[common-practice]
- Oral iron: reticulocytes at about 1 week, hemoglobin in 2 to 4 weeks, ferritin and transferrin saturation at 8 to 12 weeks. ^[common-practice]
- IV iron: ^[label-injectafer-2026, common-practice]
  - Observe 30 minutes after each dose ^[label-injectafer-2026, common-practice]
  - Phosphate before repeat ferric carboxymaltose courses in at-risk patients ^[label-injectafer-2026, common-practice]
  - Iron studies at least 4 weeks later ^[label-injectafer-2026, common-practice]
- B12 treatment: reticulocytosis in 3 to 7 days, hemoglobin normalizes in about 8 weeks. Potassium in the first days. ^[common-practice]
- Expected hemolysis course: LDH, bilirubin and reticulocytes track treatment. Platelets and creatinine daily in TTP. ^[isth-ttp-2020, common-practice]
- Hospital-acquired anemia: limit phlebotomy, small-volume tubes, batch draws. ^[common-practice]

## Escalation
- Same hour (TTP or other microangiopathy): anemia with schistocytes, thrombocytopenia, and raised LDH. ^[isth-ttp-dx-2020, isth-ttp-2020]
- Start plasma exchange and steroids while ADAMTS13 returns. ^[isth-ttp-dx-2020, isth-ttp-2020]
- Same day (hematology): ^[common-practice]
  - Hemolysis with positive DAT or unknown cause ^[common-practice]
  - Pancytopenia or bicytopenia, blasts, unexplained macrocytosis with normal B12 and folate ^[common-practice]
  - Suspected paroxysmal nocturnal hemoglobinuria or hemoglobinopathy ^[common-practice]
  - Transfusion-dependent anemia without a cause, patient who declines transfusion ^[common-practice]
- Gastroenterology: iron deficiency anemia without a source, melena or hematochezia. See [[gi-upper-gi-bleeding]]. ^[aga-ida-2020, acg-ugib-2021]
- Nephrology: anemia with reduced {{calc:ckd-epi|eGFR}} or dialysis. ESA decisions. ^[kdigo-anemia-ckd-2026]
- ICU: instability, transfusion for hemorrhagic shock, plasma exchange. ^[common-practice]

## More Information
### Where Guidelines Differ: Ferritin cutoffs for iron deficiency
:::compare Ferritin cutoffs
- ASH 2026: ≤30 ng/mL in adults, ≤50 ng/mL with heavy menstrual bleeding or in pregnancy with anemia. ^[ash-iron-deficiency-dx-2026]
- AGA 2020: ferritin below 45 ng/mL (over 15 ng/mL) for gastrointestinal evaluation. ^[aga-ida-2020]
- KDIGO 2026: severe iron deficiency at ferritin below 45 ng/mL in chronic kidney disease. ^[kdigo-anemia-ckd-2026]
:::

- ASH with inflammation: ferritin below 100 ng/mL or transferrin saturation below 20% (either). ^[ash-iron-deficiency-dx-2026]

### Special Populations: Chronic kidney disease, heart failure
- Chronic kidney disease: anemia is hemoglobin <13 g/dL (men) or <12 g/dL (women). ^[kdigo-anemia-ckd-2026]
- Hemodialysis: start IV iron if ferritin ≤500 ng/mL and transferrin saturation ≤30%. ^[kdigo-anemia-ckd-2026]
- Hemodialysis: withhold at ferritin above 700 ng/mL or transferrin saturation ≥40%, and suspend during active infection. ^[kdigo-anemia-ckd-2026]
- Not on dialysis: start iron if ferritin <100 ng/mL and transferrin saturation <40%, or ferritin 100–300 ng/mL and transferrin saturation <25%. ^[kdigo-anemia-ckd-2026]
- Not on dialysis: oral or IV by patient preference. ^[kdigo-anemia-ckd-2026]
- ESA: ^[kdigo-anemia-ckd-2026]
  - Consider only after other causes are corrected and at hemoglobin about 9–10 g/dL on dialysis (about 8.5–10 g/dL without) ^[kdigo-anemia-ckd-2026]
  - Do not aim for ≥11.5 g/dL ^[kdigo-anemia-ckd-2026]
  - Stop in stroke or thrombosis ^[kdigo-anemia-ckd-2026]
- Heart failure with reduced ejection fraction and iron deficiency: IV iron improves symptoms. See [[cardio-adhf]]. ^[aha-acc-hfsa-hf-2022, esc-hf-2026]
- Iron deficiency here means ferritin <100 ng/mL, or 100–299 ng/mL with transferrin saturation <20%. ^[aha-acc-hfsa-hf-2022, esc-hf-2026]
- Older adults: anemia of unexplained cause is common. Still look for a source and check B12. ^[common-practice]

### After the Acute Phase: Discharge and follow-up
- Discharge with the cause documented, the iron regimen and duration, B12 plan and who rechecks the CBC. ^[common-practice]
- Iron deficiency without a found source: outpatient endoscopy. ^[aga-ida-2020]
- Anemia unresolved by 4 weeks of treatment: reassess the diagnosis and refer to hematology. ^[common-practice]

### Evidence: Transfusion trials
- AABB 2023 pooled trials of restrictive (7–8 g/dL) versus liberal (9–10 g/dL) thresholds. ^[aabb-rbc-2023]
- No difference in mortality or functional outcomes in most hospitalized adults. ^[aabb-rbc-2023]
- MINT (2023): in acute myocardial infarction with anemia, a restrictive (7–8 g/dL) and a liberal (<10 g/dL) strategy were compared. ^[mint-2023]
- No significant difference in death or recurrent infarction at 30 days. ^[mint-2023]

## Pearls
- Hemoglobin lags acute loss. Trust the vital signs and the source, not a single normal value. ^[common-practice]
- Send iron studies, B12, folate and reticulocytes before the first unit. ^[common-practice]
- A normal ferritin does not exclude iron deficiency during inflammation. Use transferrin saturation and the higher cutoff. ^[ash-iron-deficiency-dx-2026]
- Schistocytes with thrombocytopenia are TTP until proven otherwise. Do not wait for ADAMTS13. ^[isth-ttp-dx-2020]
- B12 before folate. ^[bsh-b12-folate-2014]
- One unit, then reassess. The number alone is not the indication in bleeding. ^[aabb-rbc-2023, common-practice]
