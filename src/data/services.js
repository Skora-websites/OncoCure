/**
 * ---------------------------------------------------------------------------
 * SERVICES — the twelve headline services, each with its own detail page
 * ---------------------------------------------------------------------------
 * PROVENANCE
 * ----------
 * `covers` lines are the clinic's OWN wording, taken verbatim from the full
 * service lists in `clinic.js` (`serviceGroupsFull`) — nothing re-worded,
 * nothing invented.
 *
 * `overview` paragraphs are general, plain-language patient-education content
 * written for this site. They describe what the service involves in everyday
 * terms and deliberately make NO outcome claims, statistics or promises; each
 * detail page closes by pointing the reader back to a consultation.
 *
 * `summary` is a one-line condensation of the clinic's own wording.
 *
 * Card imagery is the agreed STOCK placeholder pool (shared with the rest of
 * the site) — cards render a visible placeholder tag until the clinic
 * supplies approved visuals.
 */

export const servicesFull = [
  {
    slug: 'cancer-consultation-evaluation',
    title: 'Cancer Consultation & Evaluation',
    group: 'Oncology Services',
    accent: 'plum',
    image: '/images/photo/svc-consultation.jpg',
    imageAlt: 'An oncologist talking through results with a patient at a consultation.',
    summary:
      'A comprehensive first consultation and evaluation for a new cancer diagnosis, built around your history, reports and concerns.',
    covers: [
      'Comprehensive cancer consultation and evaluation',
      'New cancer diagnosis and treatment planning',
      'Management of solid tumours and haematological malignancies',
      'Follow-up care and cancer surveillance',
    ],
    overview: [
      'A cancer consultation is the starting point of the whole care pathway. It brings together everything that matters — your medical history, your symptoms, your reports and scans, and your own questions and priorities — into one clear picture.',
      'At the first visit you can expect time to talk through your story in full, a careful review of any reports or imaging you bring, and a clinical examination where needed. If some tests are still missing, the next steps are explained before anything is arranged.',
      'The aim of the evaluation is not only to confirm a diagnosis, but to stage it properly and understand its specific features, because treatment is planned around those details. You leave the consultation knowing what is known so far, what is still to be clarified, and what happens next.',
    ],
  },
  {
    slug: 'second-opinion-review',
    title: 'Second-Opinion Review',
    group: 'Oncology Services',
    accent: 'teal',
    image: '/images/photo/svc-second-opinion.jpg',
    imageAlt: 'Two clinicians discussing a case together at a review meeting.',
    summary:
      'An independent review of an existing diagnosis or treatment plan, with every question answered patiently and clearly.',
    covers: [
      'Second-opinion consultation and treatment review',
      'Personalised treatment plans based on cancer type, stage, molecular profile and overall health',
      'Treatment planning for newly diagnosed and recurrent / metastatic cancers',
    ],
    overview: [
      'A second opinion is a routine, expected part of good cancer care. It means a specialist reviews your diagnosis, your reports and the plan you have been offered, and tells you plainly whether they agree and why.',
      'The review looks at the biopsy and pathology, the staging investigations, and the proposed treatment — including whether newer options such as molecular-guided or immune-based approaches are relevant to your case.',
      'Sometimes the second opinion confirms the existing plan, which is reassuring in itself. Sometimes it suggests a refinement, or an option that had not been discussed. Either way, the findings are explained in plain language and shared with your treating team if you wish.',
    ],
  },
  {
    slug: 'personalised-treatment-planning',
    title: 'Personalised Treatment Planning',
    group: 'Oncology Services',
    accent: 'plum',
    image: '/images/photo/svc-treatment-planning.jpg',
    imageAlt: 'A clinician writing out a personalised treatment plan.',
    summary:
      'Treatment plans shaped around your cancer type, stage, molecular profile and overall health — not a standard protocol alone.',
    covers: [
      'Personalised treatment plans based on cancer type, stage, molecular profile and overall health',
      'Multidisciplinary cancer care and coordination with surgical and radiation oncology teams',
      'Genetic and molecular testing guidance, where indicated',
      'Cancer staging and treatment response assessment',
    ],
    overview: [
      'Two people with the same cancer type can need very different treatments. A personalised plan weighs the tumour type and stage, molecular and genetic test results where indicated, age and general health, and what matters most to you.',
      'Planning is also coordinated: medical oncology works alongside surgical and radiation oncology teams, with radiology and pathology input, so that decisions are made with the whole picture in view rather than in isolation.',
      'A plan is never a single fixed decision. It is revisited at defined points — after staging, after each treatment phase, and at response assessments — and adjusted as new information arrives.',
    ],
  },
  {
    slug: 'staging-response-assessment',
    title: 'Staging & Response Assessment',
    group: 'Oncology Services',
    accent: 'teal',
    image: '/images/photo/svc-staging.jpg',
    imageAlt: 'Diagnostic imaging being reviewed for staging and response assessment.',
    summary:
      'Precise staging at diagnosis, and structured assessment of how the disease is responding at every phase of treatment.',
    covers: [
      'Cancer staging and treatment response assessment',
      'Treatment planning for newly diagnosed and recurrent / metastatic cancers',
      'Follow-up care and cancer surveillance',
      'Management of solid tumours and haematological malignancies',
    ],
    overview: [
      'Staging establishes how far a cancer has developed — whether it is confined to where it started, has spread to nearby lymph nodes, or has reached other organs. It is the single most important input to treatment planning.',
      'Response assessment repeats structured checks — imaging, examination, and where relevant blood markers — at defined points during treatment, so that the plan can be continued, adjusted or escalated on evidence rather than assumption.',
      'After treatment ends, the same discipline continues as surveillance: a follow-up schedule tailored to your diagnosis, so that anything new is detected and reviewed early.',
    ],
  },
  {
    slug: 'chemotherapy',
    title: 'Chemotherapy',
    group: 'Cancer Treatments',
    accent: 'plum',
    image: '/images/photo/svc-chemotherapy.jpg',
    imageAlt: 'Chemotherapy being prepared and administered in a day-care unit.',
    summary:
      'Drug treatment that destroys or slows cancer cells — planned, monitored and supported at every cycle.',
    covers: [
      'Chemotherapy',
      'Neoadjuvant and adjuvant systemic therapy',
      'Maintenance therapy',
      'Supportive treatment for cancer- and treatment-related complications',
    ],
    overview: [
      'Chemotherapy uses medicines that kill or slow the growth of cancer cells. It may be given before surgery to shrink a tumour, after surgery to reduce the risk of return, as the main treatment, or alongside other therapies — the timing depends on your specific diagnosis.',
      'Treatment is organised into cycles, with rest periods that let healthy cells recover. Each cycle is planned in advance, and blood counts and overall wellbeing are checked before every round.',
      'Side effects vary by drug and by person, and most are manageable — but they should never simply be endured in silence. Nausea control, infection precautions, nutrition and day-to-day support are part of the treatment, not an afterthought.',
    ],
  },
  {
    slug: 'immunotherapy',
    title: 'Immunotherapy',
    group: 'Cancer Treatments',
    accent: 'teal',
    image: '/images/photo/svc-immunotherapy.jpg',
    imageAlt: 'An intravenous drip set up for an infusion treatment.',
    summary:
      'Treatment that helps your own immune system recognise and fight cancer cells.',
    covers: [
      'Immunotherapy',
      'Personalised treatment plans based on cancer type, stage, molecular profile and overall health',
      'Supportive treatment for cancer- and treatment-related complications',
    ],
    overview: [
      'Immunotherapy is a family of treatments that work differently from chemotherapy: instead of attacking cancer cells directly, they help the immune system recognise cancer cells and respond to them.',
      'The most widely used form is checkpoint inhibitor therapy, given as an infusion on a scheduled cycle. Whether immunotherapy is suitable depends on the cancer type, its stage, and specific markers found on testing of the tumour.',
      'Because the immune system is involved throughout the body, immunotherapy can cause effects that chemotherapy does not — and some of them need prompt attention. Everyone on these medicines is told, in plain words, which symptoms to report and how quickly.',
    ],
  },
  {
    slug: 'targeted-therapy',
    title: 'Targeted Therapy',
    group: 'Cancer Treatments',
    accent: 'plum',
    image: '/images/photo/svc-targeted.jpg',
    imageAlt: 'Laboratory research supporting molecularly targeted therapy.',
    summary:
      'Medicines designed around the specific molecular changes driving an individual cancer.',
    covers: [
      'Targeted therapy',
      'Genetic and molecular testing guidance, where indicated',
      'Personalised treatment plans based on cancer type, stage, molecular profile and overall health',
    ],
    overview: [
      'Targeted therapy acts on the specific molecular changes — mutations, proteins or signals — that drive an individual cancer to grow. Because the target is precise, these medicines can behave very differently from conventional chemotherapy.',
      'Whether a targeted drug applies to you depends on molecular testing of the tumour, which is why testing guidance is part of the planning conversation rather than an optional extra.',
      'Targeted treatment is usually taken continuously rather than in fixed cycles, and its effects are monitored at regular review points. Doses can be adjusted, and partners such as skin, blood-pressure or liver-related effects are watched for specifically.',
    ],
  },
  {
    slug: 'hormonal-endocrine-therapy',
    title: 'Hormonal / Endocrine Therapy',
    group: 'Cancer Treatments',
    accent: 'teal',
    image: '/images/photo/svc-hormonal.jpg',
    imageAlt: 'Tablet medication used in long-term hormonal therapy.',
    summary:
      'Treatment for hormone-sensitive cancers that works by changing the body\'s hormonal environment.',
    covers: [
      'Hormonal / endocrine therapy',
      'Maintenance therapy',
      'Follow-up care and cancer surveillance',
    ],
    overview: [
      'Some cancers — most commonly breast and prostate cancers — grow in response to the body\'s natural hormones. Endocrine therapy works by blocking hormone production or by stopping hormones from acting on cancer cells.',
      'It is usually a long-term, tablet-based treatment taken over years rather than weeks, and it is often combined with other treatments earlier in the pathway.',
      'Because the treatment lasts years, staying comfortable on it matters: effects on bone health, energy and daily life are reviewed at follow-up visits, and the regimen can be adjusted if a particular medicine does not suit you.',
    ],
  },
  {
    slug: 'oral-anti-cancer-therapies',
    title: 'Oral Anti-Cancer Therapies',
    group: 'Cancer Treatments',
    accent: 'plum',
    image: '/images/photo/svc-oral.jpg',
    imageAlt: 'Oral anti-cancer medication as prescribed tablets.',
    summary:
      'Tablet-based cancer treatment, prescribed and monitored with the same rigour as clinic-based therapy.',
    covers: [
      'Oral anti-cancer therapies',
      'Maintenance therapy',
      'Supportive treatment for cancer- and treatment-related complications',
    ],
    overview: [
      'A growing share of modern cancer treatment is taken as tablets at home rather than as infusions in a day-care unit. Oral anti-cancer therapies include targeted tablets, hormonal tablets and certain chemotherapy medicines.',
      'Treatment taken at home still needs the same oversight: correct dosing, a schedule for missed doses, monitoring blood tests, and clear guidance on which effects to report.',
      'A prescription is only the beginning. Each person on oral therapy has a defined review rhythm, and adherence — taking the treatment exactly as planned — is checked supportively at every visit, because it directly shapes how well the treatment works.',
    ],
  },
  {
    slug: 'cancer-pain-symptom-management',
    title: 'Cancer Pain & Symptom Management',
    group: 'Cancer Care & Support',
    accent: 'teal',
    image: '/images/photo/svc-pain.jpg',
    imageAlt: 'A patient\'s hand held gently in a clinician\'s — quiet reassurance.',
    summary:
      'Anesthesia-led care for cancer-related pain, treatment side effects and other symptoms — managed alongside treatment, not after it.',
    covers: [
      'Management of cancer-related pain and other symptoms',
      'Management of chemotherapy and treatment-related side effects',
      'Infection and treatment-related complication management',
      'Anesthesia-led pain assessment and management',
    ],
    overview: [
      'Pain and symptoms deserve attention in their own right, at every stage of the cancer journey — during treatment, between treatments, and in advanced disease. Pain that is taken seriously is pain that can usually be treated.',
      'Care is led jointly with an anesthesia and pain specialist, which means pain is assessed formally, not guessed at, and treatment ranges from medicines to approaches suited to nerve-related or persistent pain.',
      'Symptom management extends beyond pain: nausea, breathlessness, fatigue, sleep, appetite and treatment side effects are all reviewed together, because they interact. The goal is straightforward — that treatment is bearable and daily life stays as full as possible.',
    ],
  },
  {
    slug: 'nutritional-lifestyle-guidance',
    title: 'Nutritional & Lifestyle Guidance',
    group: 'Cancer Care & Support',
    accent: 'plum',
    image: '/images/photo/svc-nutrition.jpg',
    imageAlt: 'Fresh vegetables — practical nutrition during treatment.',
    summary:
      'Practical guidance on food, activity and daily habits during treatment — grounded, not faddish.',
    covers: [
      'Nutritional and lifestyle guidance during cancer treatment',
      'Counselling and guidance for patients and caregivers',
    ],
    overview: [
      'Eating well during cancer treatment is genuinely difficult: appetite changes, taste changes, and treatment itself interferes. Practical, individual guidance matters far more than any single "cancer diet".',
      'The focus is on maintaining weight and strength through treatment, managing eating-related side effects as they arise, and rebuilding activity gradually as recovery allows.',
      'Guidance is also honest about myths. There is no food that cures cancer and no food that feeds it — and extreme restriction during treatment usually does harm. Where specialist input is needed, for example for significant weight loss, a referral is arranged.',
    ],
  },
  {
    slug: 'supportive-palliative-care',
    title: 'Supportive & Palliative Care',
    group: 'Cancer Care & Support',
    accent: 'teal',
    image: '/images/photo/svc-palliative.jpg',
    imageAlt: 'A clinician in a white coat gently holding a patient\'s hand.',
    summary:
      'Supportive and palliative care for advanced cancer — comfort, clarity and dignity for patients and families.',
    covers: [
      'Supportive and palliative care for patients with advanced cancer',
      'Counselling and guidance for patients and caregivers',
      'End-of-life and palliative care planning when appropriate',
      'Survivorship and long-term cancer care',
    ],
    overview: [
      'Palliative care is often misunderstood as care at the very end of life. In practice it means active support of comfort, symptoms and quality of life alongside treatment — and it can begin at any stage of serious illness.',
      'For people living with advanced cancer, the focus shifts to what matters most: controlling pain and other symptoms, staying at home where possible, and having honest, unhurried conversations about choices ahead.',
      'Support extends to families and caregivers, who carry their own load. Counselling, clear guidance, and planning that is discussed in advance rather than in a crisis are all part of this service.',
    ],
  },
];

/** Look up one service by slug (null when unknown — detail pages 404 via this). */
export const serviceBySlug = (slug) =>
  servicesFull.find((s) => s.slug === slug) ?? null;
