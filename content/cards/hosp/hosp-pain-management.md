---
id: hosp-pain-management
type: reference
variant: protocol
system: hosp
title: "Acute Pain"
aliases: [pain management, acute pain, analgesia, multimodal analgesia, opioid conversion, opioid equivalents, equianalgesic, morphine milligram equivalents, MME, opioid rotation, opioid switching, opioid-naive, opioid-tolerant, PCA, patient-controlled analgesia, morphine, hydromorphone, Dilaudid, oxycodone, fentanyl, methadone, ketorolac, Toradol, acetaminophen, Tylenol, ibuprofen, celecoxib, NSAID, naloxone, Narcan, opioid-induced constipation, bowel regimen, senna, MiraLAX, methylnaltrexone, respiratory depression, sedation scale, POSS, breakthrough pain, postoperative pain, cross-tolerance]
checked: { date: 2026-10-22, by: opus, scope: "doses and numbers", fingerprint: "eb1af3c7e0e5d57e", carried: "2026-10-25: 2026-10-25: Shared drug record for methadone added (opioid withdrawal card). Card wording, doses and citations unchanged." }
contents_sub: [dosing]
related:
  conditions: [neuro-delirium, renal-aki, gi-upper-gi-bleeding, heme-anticoagulation-management, psych-acute-agitation, psych-opioid-withdrawal, psych-oud]
---
## At a Glance
- Treat pain multimodally: scheduled acetaminophen, an NSAID when safe, and nonpharmacologic measures. Add opioids only when needed, at the lowest effective dose. ^[chou-postop-pain-2016, cdc-opioid-2022]
- Prefer oral to IV opioids when the patient can take them, and avoid IM. Use IV PCA when parenteral dosing is needed and the patient can operate it. ^[chou-postop-pain-2016]
- Opioid-naive: start an immediate-release opioid at a low dose, never extended-release, and reassess sedation and respiratory rate with each dose. ^[cdc-opioid-2022, chou-postop-pain-2016]
- Opioid-tolerant patients: continue the baseline opioid and add analgesia on top. Do not abruptly stop. ^[dickerson-opioid-tolerant-2024, cdc-opioid-2022]
- Converting between opioids: total the 24-hour dose, convert with an equivalence table, then individualize: ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025, label-hydromorphone-injection-2026]
  - 2022 guidance and labels dose the new opioid lower for incomplete cross-tolerance. ^[cdc-opioid-2022, label-hydromorphone-injection-2026]
  - Cancer-pain consensus advises against an automatic cut. ^[mascc-asco-opioid-conversion-2025]
- Kidney or liver impairment, older age, sleep apnea and co-prescribed sedatives raise the risk of respiratory depression: ^[cdc-opioid-2022, ags-beers-2023, common-practice]
  - Use lower doses, longer intervals and closer monitoring. ^[cdc-opioid-2022, ags-beers-2023, common-practice]
  - Start a bowel regimen with the first dose and offer naloxone at discharge. ^[cdc-opioid-2022, common-practice]

## Indications
- Treat pain to a function-oriented goal (breathing deeply, coughing, walking, sleeping), not a score of zero. ^[chou-postop-pain-2016, cdc-opioid-2022]
- Assess with a validated tool (for example a numeric rating scale), at rest and with movement, and reassess after each intervention. ^[chou-postop-pain-2016]
- Ask before prescribing: ^[chou-postop-pain-2016, dickerson-opioid-tolerant-2024, cdc-opioid-2022]
  - Prior opioid use and daily dose.
  - Opioid use disorder or buprenorphine or methadone treatment.
  - Sleep apnea, kidney and liver function, other sedatives, and prior reactions.

:::scale Pain severity
- Mild: First choice is acetaminophen, plus an NSAID if safe, plus nonpharmacologic measures. Add local or topical options. ^[chou-postop-pain-2016]
- Moderate: First choice is scheduled acetaminophen and NSAID. Add a short-acting oral opioid as needed. ^[chou-postop-pain-2016, cdc-opioid-2022]
- Severe: First choice is a multimodal regimen plus a short-acting opioid, IV if oral is not possible. Escalate with regional or neuraxial techniques, PCA, pain or palliative care consult. ^[chou-postop-pain-2016]
:::

#### When an opioid is not the answer
- Acute pain: nonopioid therapies are at least as effective as opioids for many types of acute pain. ^[cdc-opioid-2022]
- Look for a cause that needs a different treatment: ^[common-practice]
  - New or worsening pain after surgery or a procedure (bleeding, perforation, compartment syndrome, infection).
  - Pain out of proportion on examination.
- Uncontrolled pain, constipation and urinary retention can cause delirium, and so can opioids. See [[neuro-delirium|Delirium]]. ^[nice-delirium-2023, ags-beers-2023]

## Choosing an Option
:::compare Oral vs IV opioid
- Oral: Preferred when the gut works and the patient can swallow. Steadier effect. Fewer adverse events from peaks. ^[chou-postop-pain-2016]
- IV: For severe pain needing rapid titration, or no enteral route. Switch to oral as soon as possible. ^[chou-postop-pain-2016, mascc-asco-opioid-conversion-2025]
:::

- **Nonopioid options:** ^[chou-postop-pain-2016, label-celecoxib-2024]
  - Scheduled acetaminophen is first. Add an NSAID unless contraindicated.
  - Celecoxib has less gastrointestinal bleeding risk than non-selective NSAIDs.
- **Ketorolac:** gives strong short-term analgesia but carries high gastrointestinal bleeding and kidney risk. Limit to 5 days and avoid in older adults. ^[label-ketorolac-injection-2024, ags-beers-2023]
- **Gabapentinoids:** ^[chou-postop-pain-2016, ags-beers-2023, label-gabapentin-2026]
  - 2016 postoperative guidance suggests considering gabapentin or pregabalin within multimodal analgesia. ^[chou-postop-pain-2016]
  - Geriatric guidance advises avoiding them with opioids except to reduce the opioid dose. ^[ags-beers-2023]
  - Both need a dose reduction at {{calc:cockcroft-gault}} <60. ^[label-gabapentin-2026]
- **Ketamine and IV lidocaine:** ^[chou-postop-pain-2016, common-practice]
  - Off-label for analgesia. 2016 postoperative guidance suggests considering them in selected surgical patients.
  - Initiate with the pain or anesthesia service.
- **Which opioid:** ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
  - Morphine is the reference opioid, but its active metabolites accumulate in kidney failure. ^[label-morphine-injection-2026, mascc-asco-opioid-conversion-2025]
  - Hydromorphone and oxycodone are common alternatives. Oral hydromorphone is about 5 times as potent as oral morphine. ^[cdc-opioid-2022, label-hydromorphone-oral-2026]
  - Significant kidney dysfunction: consider fentanyl, buprenorphine or methadone. ^[mascc-asco-opioid-conversion-2025]
  - Significant liver disease: consider hydromorphone or morphine (weakest-consensus statement). ^[mascc-asco-opioid-conversion-2025]
  - Avoid meperidine (neurotoxic metabolite) and codeine (variable CYP2D6 activation). ^[ags-beers-2023, label-tramadol-2026, mascc-asco-opioid-conversion-2025]
  - Tramadol needs a dose reduction at {{calc:cockcroft-gault}} <30 and a lower maximum. ^[ags-beers-2023, label-tramadol-2026, mascc-asco-opioid-conversion-2025]
  - Tramadol can cause serotonin syndrome (alone or with serotonergic drugs), seizures at recommended doses and hyponatremia. ^[label-tramadol-2026]
  - Avoid combination products so each component can be titrated, and so acetaminophen is counted once. ^[cdc-opioid-2022, common-practice]
- **Fentanyl and methadone:** used when morphine, hydromorphone and oxycodone are unsuitable. ^[mascc-asco-opioid-conversion-2025, label-methadone-2026]
  - Fentanyl has a short duration and is given IV.
  - Methadone has a long, variable half-life and {{calc:qtc}} prolongation.
  - Start methadone only with an experienced prescriber or pain or palliative care.

## Dosing and Protocol
#### Nonopioid analgesics
- Acetaminophen, oral: ^[label-acetaminophen-iv-2026, chou-postop-pain-2016]

{{dose:acetaminophen-po-pain}}

- Acetaminophen, IV (when oral is not possible): ^[label-acetaminophen-iv-2026]

{{dose:acetaminophen-iv-pain}}

- Ibuprofen: ^[label-ibuprofen-tablets-2025, chou-postop-pain-2016]

{{dose:ibuprofen-po-pain}}

- Celecoxib: ^[label-celecoxib-2024, chou-postop-pain-2016]

{{dose:celecoxib-acute-pain}}

- Ketorolac, short course only: ^[label-ketorolac-injection-2024, label-ketorolac-tablets-2024]

{{dose:ketorolac-iv-pain}}

- NSAIDs raise the risk of gastrointestinal bleeding, acute kidney injury, hypertension and heart failure. ^[label-ketorolac-injection-2024, ags-beers-2023, common-practice]
- Avoid NSAIDs in active bleeding, at {{calc:cockcroft-gault}} <30 and with anticoagulants unless the benefit is clear. See [[renal-aki|AKI]] and [[gi-upper-gi-bleeding|Upper GI Bleeding]]. ^[label-ketorolac-injection-2024, ags-beers-2023, common-practice]

#### Opioid-naive: starting doses
- An opioid-naive patient has not been taking opioids around the clock. The opioid-tolerant threshold is below. ^[cdc-opioid-2022, common-practice]
- Immediate-release only, lowest effective dose, shortest duration. Reassess before each dose. ^[cdc-opioid-2022]
- Oral morphine: ^[cdc-opioid-2022, label-morphine-tablets-2026]

{{dose:morphine-po-naive}}

- Oral hydromorphone: ^[label-hydromorphone-oral-2026]

{{dose:hydromorphone-po-naive}}

- Oral oxycodone: ^[label-oxycodone-2026]

{{dose:oxycodone-po-naive}}

- IV morphine: ^[label-morphine-injection-2026, common-practice]

{{dose:morphine-iv-naive}}

- IV hydromorphone: ^[label-hydromorphone-injection-2026]

{{dose:hydromorphone-iv-naive}}

- The 2022 opioid-prescribing guidance starting range is about 5–10 MME per dose, or 20–30 MME a day. ^[cdc-opioid-2022]
- Use product labeling as the starting point and calibrate for kidney and liver function. ^[cdc-opioid-2022]
- Uncontrolled after a dose and no sedation: reassess in 10–15 minutes IV or 1–2 hours oral, then repeat or increase the dose by 25–50%. ^[common-practice]
- Excess sedation or respiratory depression: hold the opioid, stimulate, support ventilation, give naloxone if needed (see Opioid adverse effects). ^[label-naloxone-2025, common-practice]

#### Patient-controlled analgesia (PCA)
- Use IV PCA when parenteral analgesia is needed and the patient is alert enough to use the button. Never by proxy (family or staff pressing the button). ^[chou-postop-pain-2016, common-practice]
- In opioid-naive adults, do not routinely add a basal (continuous) infusion. ^[chou-postop-pain-2016]
- Set the demand dose, lockout interval and hourly limit per the hospital's PCA protocol with pharmacy. ^[common-practice]
- Use a higher-risk protocol with lower limits for older adults, sleep apnea, obesity and impaired sedation. ^[common-practice]
- Opioid-tolerant patients need their baseline requirement continued (orally, or as a basal infusion), with settings from the pain or palliative care service. ^[dickerson-opioid-tolerant-2024, common-practice]
- Monitor sedation and respiratory status, with continuous pulse oximetry. Add capnography if on supplemental oxygen. ^[chou-postop-pain-2016, apsf-respiratory-depression-2011]

#### Opioid-tolerant patients and breakthrough pain
- Tolerance (FDA definition in extended-release opioid labeling), for at least 1 week: ^[label-ms-contin-2026, cdc-opioid-2022]
  - About 60 MME or more a day.
  - Or the label's listed equivalents of oxycodone, hydromorphone, oxymorphone, hydrocodone or transdermal fentanyl.
- Continue the baseline opioid (or its equivalent by another route), and add short-acting opioids and nonopioid analgesics for the new pain. ^[dickerson-opioid-tolerant-2024, cdc-opioid-2022]
- Omitting the baseline opioid risks withdrawal and worse pain. ^[dickerson-opioid-tolerant-2024, cdc-opioid-2022]
- Breakthrough: 10–15% of the 24-hour morphine-equivalent dose as an immediate-release opioid (preferably the same drug), titrated to a 30–50% pain reduction. ^[mascc-asco-opioid-conversion-2025]
- Patients on buprenorphine for opioid use disorder: usually continue it and add short-acting full agonists as needed. ^[kohan-buprenorphine-2021, dickerson-opioid-tolerant-2024]
- Ask addiction medicine or the pain service about splitting the buprenorphine dose. ^[kohan-buprenorphine-2021, dickerson-opioid-tolerant-2024]
- Patients on methadone for opioid use disorder: continue the verified daily dose and treat acute pain with additional full agonist and multimodal therapy. ^[dickerson-opioid-tolerant-2024, common-practice]
- Do not use an MME total to dose opioid use disorder treatment. ^[cdc-opioid-2022]

#### Converting between opioids
:::note Conversion tables estimate. They do not dose. ^[cdc-opioid-2022]
Equivalence figures are population estimates. In the list, opioids are oral unless stated. The MME factor is morphine milligram equivalents per mg, and the ratio is from cancer-pain consensus. Check with the {{calc:opiate-conversion}} or {{calc:morphine-milligram-equivalents}}, then individualize.
:::

1. Total the opioid taken over 24 hours (scheduled plus PRN), by route. ^[mascc-asco-opioid-conversion-2025]
2. Convert to oral morphine equivalents (MME) with the list below. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
3. Convert from MME to the new drug and route. ^[mascc-asco-opioid-conversion-2025]
4. Reduce the calculated dose of the new opioid for incomplete cross-tolerance. ^[cdc-opioid-2022, label-hydromorphone-injection-2026, mascc-asco-opioid-conversion-2025, common-practice]
   - 2022 opioid-prescribing guidance says it is typically dosed substantially lower. ^[cdc-opioid-2022]
   - The injectable hydromorphone label halves it. ^[label-hydromorphone-injection-2026]
   - 25–50% is common practice, with less or no reduction when pain is severe and uncontrolled and more in older adults or with organ dysfunction. ^[common-practice]
   - Cancer-pain consensus did not endorse an automatic reduction and treats its ratios as the safe starting dose. ^[mascc-asco-opioid-conversion-2025]
5. Divide into scheduled doses and add a breakthrough dose (10–15% of the daily total). ^[mascc-asco-opioid-conversion-2025]
6. Reassess in 24 hours and adjust to pain, sedation and function. ^[mascc-asco-opioid-conversion-2025]

- **Morphine:** MME factor 1. Reference. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
- **Oxycodone:** MME factor 1.5. Morphine to oxycodone 1.5:1. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
- **Hydromorphone:** MME factor 5. Morphine to hydromorphone 5:1. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
- **Hydrocodone:** MME factor 1. Hydrocodone to morphine 1:1. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
- **Oxymorphone:** MME factor 3. Morphine to oxymorphone 3:1. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
- **Tapentadol:** MME factor 0.4. Tapentadol to morphine 3:1. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
- **Tramadol:** MME factor 0.2. Tramadol to morphine 10:1. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
- **Codeine:** MME factor 0.15. Codeine to hydrocodone 8:1. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
- **Methadone:** MME factor 4.7 (not for switching). No consensus ratio. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
- **Fentanyl patch (per mcg/hr):** MME factor 2.4 (not for switching). No consensus ratio. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]

- Parenteral and oral routes: ^[label-morphine-tablets-2026, label-hydromorphone-oral-2026, mascc-asco-opioid-conversion-2025, common-practice]
  - Subcutaneous and IV doses are equal ^[label-morphine-tablets-2026, label-hydromorphone-oral-2026, mascc-asco-opioid-conversion-2025, common-practice]
  - IV-to-oral morphine is about 1:3 (the oral label allows 1:3 to 1:6) ^[label-morphine-tablets-2026, label-hydromorphone-oral-2026, mascc-asco-opioid-conversion-2025, common-practice]
  - Hydromorphone figures vary across references (about 1:2 to 1:5, oral bioavailability is about one-quarter), so convert conservatively ^[label-morphine-tablets-2026, label-hydromorphone-oral-2026, mascc-asco-opioid-conversion-2025, common-practice]
  - The cancer-pain consensus table gives no IV-to-oral morphine or hydromorphone ratio ^[label-morphine-tablets-2026, label-hydromorphone-oral-2026, mascc-asco-opioid-conversion-2025, common-practice]
- Fentanyl patches take 18–24 hours to reach effect, are affected by fever and heat, and are not for opioid-naive patients or acute pain. ^[common-practice]
- Methadone: ^[label-methadone-2026, mascc-asco-opioid-conversion-2025]
  - The conversion is nonlinear and the ratio depends on the prior dose (the label gives a table by morphine-equivalent dose).
  - The label warns that deaths have occurred in opioid-tolerant patients during conversion to methadone, so it is safer to underestimate.
  - Start only with an experienced prescriber, divide the daily dose 2–3 times, and titrate no faster than every 3–5 days.
- Rotating for side effects and uncontrolled pain: reduce the new dose as in step 4 when pain is controlled. ^[mascc-asco-opioid-conversion-2025, common-practice]
- When the reason is uncontrolled pain, a smaller or no reduction may be appropriate. ^[mascc-asco-opioid-conversion-2025, common-practice]

#### Opioid adverse effects
- **Respiratory depression:** sedation precedes it. Stop the opioid, stimulate, give oxygen and support ventilation. ^[common-practice, apsf-respiratory-depression-2011]
- Naloxone for inpatient respiratory depression: small increments so analgesia is not fully reversed: ^[label-naloxone-2025]

{{dose:naloxone-opioid-depression-low}}

- Overdose with respiratory failure: ^[label-naloxone-2025]

{{dose:naloxone-overdose}}

- Naloxone lasts less long than most opioids, so watch for renarcotization and repeat. Use caution in opioid-tolerant patients (withdrawal, severe pain). ^[label-naloxone-2025, common-practice]
- **Constipation:** nearly universal. Start a stimulant laxative with the first opioid dose and add an osmotic laxative if needed. ^[cdc-opioid-2022, common-practice]

{{dose:senna-opioid-constipation}}

{{dose:peg3350-opioid-constipation}}

- Failed laxatives, no obstruction: peripherally acting μ-opioid receptor antagonist. ^[label-relistor-2024]

{{dose:methylnaltrexone-sc-oic}}

- **Nausea:** tolerance develops within days. Use scheduled antiemetics if it persists, and rule out constipation or obstruction. ^[common-practice]
- **Pruritus:** μ-receptor mediated, not histamine, so antihistamines help little unless allergic. Consider rotating the opioid. ^[common-practice]
- **Myoclonus, delirium or hyperalgesia on high doses:** reduce the dose or rotate the opioid. Hydrate and involve pain or palliative care. ^[mascc-asco-opioid-conversion-2025, common-practice]
- **Sedatives:** avoid co-prescribing benzodiazepines (geriatric criteria: avoid). Reduce other sedatives and gabapentinoids when starting opioids. ^[ags-beers-2023, cdc-opioid-2022]

## Monitoring and Adjustment
- Assess sedation and respiratory rate before each dose, then within an hour of the first doses, and at regular intervals while on IV opioids or PCA. ^[chou-postop-pain-2016, apsf-respiratory-depression-2011, common-practice]
- Use a sedation scale (for example the Pasero Opioid-induced Sedation Scale or {{calc:rass}}). ^[chou-postop-pain-2016, apsf-respiratory-depression-2011, common-practice]
- Continuous pulse oximetry for patients on parenteral opioids or at high risk. Add capnography when on supplemental oxygen (oximetry can miss hypoventilation). ^[apsf-respiratory-depression-2011]
- Sedation first, then respiratory depression: a patient who is difficult to arouse needs the opioid held, not another dose. ^[common-practice]
- Reassess pain and function after each dose or change. ^[common-practice, mascc-asco-opioid-conversion-2025]
- If pain persists despite escalating doses, revisit the diagnosis and consider hyperalgesia, neuropathic pain, withdrawal or anxiety. ^[common-practice, mascc-asco-opioid-conversion-2025]
- Inadequate relief with no side effects: increase the dose 25–50% (up to 100% if severe). ^[common-practice]
- Partial relief: repeat the same dose. ^[common-practice]
- Side effects with no relief: rotate. ^[common-practice]
- Check bowel function daily, and kidney function if on an NSAID. ^[common-practice]
- At discharge: ^[cdc-opioid-2022]
  - Prescribe the smallest quantity needed (for acute pain, a few days or less is often enough).
  - Review the prescription monitoring program.
  - Offer naloxone.
- Plan the taper of any new scheduled opioid. For patients on long-term opioids, return to the prehospital dose or lower with the usual prescriber. ^[cdc-opioid-2022, dickerson-opioid-tolerant-2024]

## Special Populations
#### Kidney impairment
- Avoid morphine (active metabolites accumulate). Cancer-pain consensus favors fentanyl, buprenorphine or methadone. ^[mascc-asco-opioid-conversion-2025, label-hydromorphone-oral-2026, label-morphine-injection-2026, label-oxycodone-2026]
- Hydromorphone at one-fourth to one-half of the usual starting dose is a common alternative. Oxycodone clearance also falls, so start lower. ^[mascc-asco-opioid-conversion-2025, label-hydromorphone-oral-2026, label-morphine-injection-2026, label-oxycodone-2026]
- NSAIDs: avoid at {{calc:cockcroft-gault}} <30. Ketorolac is contraindicated in advanced renal impairment. ^[ags-beers-2023, label-ketorolac-injection-2024]
- Gabapentin and pregabalin: reduce the dose at {{calc:cockcroft-gault}} <60. ^[ags-beers-2023, label-gabapentin-2026]
- Tramadol: dose interval and maximum fall at {{calc:cockcroft-gault}} <30. ^[label-tramadol-2026, ags-beers-2023]
- Acetaminophen is acceptable at the usual doses. The IV label advises caution at {{calc:cockcroft-gault}} ≤30. ^[label-acetaminophen-iv-2026]

#### Liver disease
- Prefer hydromorphone or morphine, at reduced starting doses and longer intervals. Assess with {{calc:child-pugh}}. ^[mascc-asco-opioid-conversion-2025, label-hydromorphone-oral-2026, cdc-opioid-2022]
- Acetaminophen is not contraindicated: use the lower daily maximum (see the dose sheet), also with alcohol use disorder or malnutrition. ^[label-acetaminophen-iv-2026, common-practice]
- NSAIDs: avoid in cirrhosis (bleeding, kidney injury). Celecoxib needs a 50% dose reduction in moderate impairment. ^[label-celecoxib-2024, common-practice]
- Opioids can precipitate hepatic encephalopathy: use the lowest dose and monitor mental status. ^[cdc-opioid-2022, common-practice]

#### Older adults
- Start at the low end, extend intervals, and monitor for delirium and falls. ^[ags-beers-2023, cdc-opioid-2022]
- Opioids are avoided in patients with delirium or fall history except for severe acute pain. ^[ags-beers-2023, cdc-opioid-2022]
- Avoid meperidine and ketorolac, and avoid benzodiazepines with opioids. ^[ags-beers-2023]

#### Sleep apnea, obesity and respiratory disease
- Higher risk of respiratory depression: ^[cdc-opioid-2022, apsf-respiratory-depression-2011, common-practice]
  - Use lower doses and avoid basal PCA infusions.
  - Use continuous oximetry (with capnography if on oxygen).
  - Minimize sedatives and use multimodal and regional options.

#### Chronic and cancer pain
- This card covers acute pain in hospital. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
- For long-term opioid prescribing in chronic pain, see the 2022 opioid-prescribing guidance. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
- For cancer-related pain and opioid rotation in cancer, see the cancer-pain conversion guidance and the adult cancer pain guideline, and involve palliative care. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]

## More Information
### Evidence: Guidelines read and limits
- CDC 2022 is the main US source for opioid prescribing, MME factors and cautions. ^[cdc-opioid-2022]
- Its MME table is an estimate and the guideline says not to use it to dose a switch. ^[cdc-opioid-2022]
- MASCC-ASCO 2025 (84 statements, 58 reached consensus) is for adults with cancer. ^[mascc-asco-opioid-conversion-2025]
- Its ratio table has no methadone, transdermal fentanyl, buprenorphine or IV-to-oral morphine ratio. ^[mascc-asco-opioid-conversion-2025]
- It did not endorse a routine cross-tolerance reduction. ^[mascc-asco-opioid-conversion-2025]
- Chou 2016 (APS/ASRA/ASA) is the main US postoperative pain guideline. The 2012 ASA acute pain guideline is older. ^[chou-postop-pain-2016]

## Pearls
- Convert to the new opioid from the total daily dose, then cut for cross-tolerance. Never trust one table without looking at the patient. ^[cdc-opioid-2022, mascc-asco-opioid-conversion-2025]
- Oral hydromorphone is about 5 times as potent as oral morphine. Confusing the two drugs causes dosing errors. ^[cdc-opioid-2022, common-practice]
- Sedation comes before respiratory depression: treat the sedation. ^[common-practice, apsf-respiratory-depression-2011]
- Start a bowel regimen with the first opioid dose. ^[cdc-opioid-2022, common-practice]
- Do not stop the baseline opioid of an opioid-tolerant patient because new pain needs treatment. ^[dickerson-opioid-tolerant-2024]
