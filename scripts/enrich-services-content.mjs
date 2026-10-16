/**
 * ---------------------------------------------------------------------------
 * enrich-services-content.mjs
 * ---------------------------------------------------------------------------
 * Adds richer content to the EXISTING service detail pages by pushing updates
 * through the same admin API the admin panel uses (POST /api/admin/login,
 * then PUT /api/services/:id). No schema changes, no new services.
 *
 * What it updates per service (all fields already in the Service schema):
 *  - description : multi-paragraph plain-language overview. The detail page
 *                  splits it on blank lines (\n\n) and renders each paragraph.
 *  - covers      : keeps the clinic's existing wording and appends a few
 *                  researched coverage lines.
 *  - metaTitle / metaKeywords / metaDescription : per-service SEO meta that
 *                  the detail page already supports (currently empty).
 *
 * Content provenance: opening paragraphs are the site's own existing overview
 * copy (src/data/services.js); the added paragraphs are general patient
 * education based on American Cancer Society, NCCN patient, Macmillan and
 * WHO/NCI material. No statistics, no outcome claims, no promises.
 *
 * Usage:
 *   node scripts/enrich-services-content.mjs
 *   API_BASE=https://<your-vercel-app>.vercel.app node scripts/enrich-services-content.mjs
 *   API_BASE=http://localhost:5055 ADMIN_USERNAME=admin ADMIN_PASSWORD=admin123 \
 *     node scripts/enrich-services-content.mjs
 */

const API_BASE = (process.env.API_BASE || 'http://localhost:5055').replace(/\/+$/, '');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/** Content for the 12 existing services (keyed by slug). */
const enrichments = {
  'cancer-consultation-evaluation': {
    description: [
      'A cancer consultation is the starting point of the whole care pathway. It brings together everything that matters — your medical history, your symptoms, your reports and scans, and your own questions and priorities — into one clear picture.',
      'At the first visit you can expect time to talk through your story in full, a careful review of any reports or imaging you bring, and a clinical examination where needed. If some tests are still missing, the next steps are explained before anything is arranged.',
      'The aim of the evaluation is not only to confirm a diagnosis, but to stage it properly and understand its specific features, because treatment is planned around those details. You leave the consultation knowing what is known so far, what is still to be clarified, and what happens next.',
      'The clinician will usually ask about your symptoms, medical history, current medicines and any previous procedures, and may perform a relevant examination. Reports are explained in everyday language rather than medical shorthand, so that you can follow the reasoning as well as the conclusion.',
      'A consultation does not automatically mean more tests or treatment are needed. Where further assessment is genuinely useful — reviewing existing imaging, arranging additional tests, or referring to another specialist — the reason is discussed with you first.',
      'To make the visit count, bring copies of pathology and imaging reports, scan films or a disc if you have them, any discharge or surgery summaries, and a current list of medicines and supplements. Writing your questions down beforehand, and bringing a trusted family member, helps you take everything in.',
    ],
    extraCovers: [
      'Review of symptoms, medical history and current medicines',
      'Explanation of reports and a clear plan for the next steps',
    ],
    metaTitle: 'Cancer Consultation & Evaluation in Greater Noida — Onco Cure Clinic',
    metaKeywords:
      'cancer consultation greater noida, new cancer diagnosis, oncology evaluation noida, cancer doctor consultation, first oncologist visit',
    metaDescription:
      'A comprehensive first consultation and evaluation for new cancer diagnoses at Onco Cure Clinic, Greater Noida — history, reports and next steps explained clearly.',
  },

  'second-opinion-review': {
    description: [
      'A second opinion is a routine, expected part of good cancer care. It means a specialist reviews your diagnosis, your reports and the plan you have been offered, and tells you plainly whether they agree and why.',
      'The review looks at the biopsy and pathology, the staging investigations, and the proposed treatment — including whether newer options such as molecular-guided or immune-based approaches are relevant to your case.',
      'Sometimes the second opinion confirms the existing plan, which is reassuring in itself. Sometimes it suggests a refinement, or an option that had not been discussed. Either way, the findings are explained in plain language and shared with your treating team if you wish.',
      'A review of this kind is useful when a diagnosis or stage feels uncertain, when the cancer is uncommon or complex, when several treatment approaches have been discussed, or when you simply want the reasoning explained again before deciding.',
      'The specialist reviews your history and records, then talks the findings and proposed plan through with you. If a conclusion cannot be reached from the current information alone, that limitation is stated honestly, along with what would help clarify it.',
      'Bring pathology and scan reports, scan images in whatever form you have them, operation or discharge summaries, treatment records so far, your medicines list, and the specific questions you want answered. If time-sensitive treatment is already scheduled, discuss the timing of the review with your current team rather than delaying care on your own.',
    ],
    extraCovers: [
      'Review of pathology, imaging and treatment records',
      'Discussion of findings and options in plain language',
    ],
    metaTitle: 'Cancer Second-Opinion Review — Onco Cure Clinic, Greater Noida',
    metaKeywords:
      'cancer second opinion noida, oncology treatment review, cancer diagnosis review greater noida, independent oncologist opinion',
    metaDescription:
      'An independent review of an existing cancer diagnosis or treatment plan at Onco Cure Clinic, Greater Noida — every question answered patiently and clearly.',
  },

  'personalised-treatment-planning': {
    description: [
      'Two people with the same cancer type can need very different treatments. A personalised plan weighs the tumour type and stage, molecular and genetic test results where indicated, age and general health, and what matters most to you.',
      'Planning is also coordinated: medical oncology works alongside surgical and radiation oncology teams, with radiology and pathology input, so that decisions are made with the whole picture in view rather than in isolation.',
      'A plan is never a single fixed decision. It is revisited at defined points — after staging, after each treatment phase, and at response assessments — and adjusted as new information arrives.',
      'The planning discussion covers the proposed approach and its intended purpose, its practical requirements, and its possible risks and side effects. Options are compared honestly, including when the right answer is that more information is needed before recommending a course.',
      'Guidelines inform care, but they do not replace individual discussion. The recommendation in front of you is drawn from the cancer\u2019s specific features, your previous treatment, your other health conditions, your medicines, and your own preferences.',
      'Useful questions to ask include what the plan aims to achieve, how the options compare, whether any further tests or specialist input would change the recommendation, and who to contact between visits if something changes.',
    ],
    extraCovers: [
      'Discussion of options, practical requirements and possible risks',
      'Shared decisions with clear review points over time',
    ],
    metaTitle: 'Personalised Cancer Treatment Planning — Onco Cure Clinic',
    metaKeywords:
      'personalised cancer treatment plan, oncologist greater noida, molecular guided cancer treatment, cancer treatment planning noida',
    metaDescription:
      'Treatment plans shaped around your cancer type, stage, molecular profile and overall health — coordinated with surgical and radiation oncology teams.',
  },

  'staging-response-assessment': {
    description: [
      'Staging establishes how far a cancer has developed — whether it is confined to where it started, has spread to nearby lymph nodes, or has reached other organs. It is the single most important input to treatment planning.',
      'Response assessment repeats structured checks — imaging, examination, and where relevant blood markers — at defined points during treatment, so that the plan can be continued, adjusted or escalated on evidence rather than assumption.',
      'After treatment ends, the same discipline continues as surveillance: a follow-up schedule tailored to your diagnosis, so that anything new is detected and reviewed early.',
      'The tests used depend on the cancer and on the question being asked. Staging may include examination, blood tests, imaging such as CT, PET or MRI, and biopsy of suspected sites where it would change management.',
      'For response assessment, current findings are always read alongside your earlier or baseline studies. Comparing like with like — the same type of scan, reviewed by the same radiology approach — is what makes statements about change reliable rather than guesswork.',
      'Staging is one part of the clinical picture: it supports planning but does not, by itself, decide every treatment. Bring your prior and recent reports and scan images if available, and details of treatments with their dates, because comparison across time is often the most valuable part of the visit.',
    ],
    extraCovers: [
      'Review of symptoms, examination, pathology and imaging',
      'Comparison of current findings with earlier scans',
    ],
    metaTitle: 'Cancer Staging & Response Assessment — Onco Cure Clinic',
    metaKeywords:
      'cancer staging greater noida, treatment response assessment, cancer restaging noida, follow-up surveillance oncology',
    metaDescription:
      'Precise staging at diagnosis and structured assessment of treatment response at every phase, at Onco Cure Clinic, Greater Noida.',
  },

  'chemotherapy': {
    description: [
      'Chemotherapy uses medicines that kill or slow the growth of cancer cells. It may be given before surgery to shrink a tumour, after surgery to reduce the risk of return, as the main treatment, or alongside other therapies — the timing depends on your specific diagnosis.',
      'Treatment is organised into cycles, with rest periods that let healthy cells recover. Each cycle is planned in advance, and blood counts and overall wellbeing are checked before every round.',
      'Side effects vary by drug and by person, and most are manageable — but they should never simply be endured in silence. Nausea control, infection precautions, nutrition and day-to-day support are part of the treatment, not an afterthought.',
      'Most chemotherapy is given as an infusion in a day-care unit, though some medicines are taken by mouth or by injection. The schedule — treatment day, rest days, the number of cycles — is explained before the first dose, along with where to come and whom to call between visits.',
      'Before each cycle, blood counts and other tests are reviewed to confirm it is safe to proceed. Tell the team about every other illness, medicine, vitamin and herbal or dietary supplement you take, including anything you use only occasionally, because some of them interact with chemotherapy.',
      'Possible effects include tiredness, nausea, appetite changes, mouth sores, hair loss, bowel changes and a greater risk of infection. Medicines and practical steps can prevent or ease most of these. Follow the clinic\u2019s instructions about fever and urgent symptoms exactly, and report new or worsening problems promptly rather than waiting for the next visit.',
    ],
    extraCovers: [
      'Pre-cycle blood tests and safety checks',
      'Nausea control, infection precautions and nutrition support',
    ],
    metaTitle: 'Chemotherapy in Greater Noida — Onco Cure Clinic',
    metaKeywords:
      'chemotherapy greater noida, chemotherapy day care noida, adjuvant chemotherapy, neoadjuvant chemotherapy noida, cancer chemotherapy clinic',
    metaDescription:
      'Planned, monitored and supported chemotherapy at Onco Cure Clinic, Greater Noida — cycles, safety checks and side-effect care built in at every round.',
  },

  'immunotherapy': {
    description: [
      'Immunotherapy is a family of treatments that work differently from chemotherapy: instead of attacking cancer cells directly, they help the immune system recognise cancer cells and respond to them.',
      'The most widely used form is checkpoint inhibitor therapy, given as an infusion on a scheduled cycle. Whether immunotherapy is suitable depends on the cancer type, its stage, and specific markers found on testing of the tumour.',
      'Because the immune system is involved throughout the body, immunotherapy can cause effects that chemotherapy does not — and some of them need prompt attention. Everyone on these medicines is told, in plain words, which symptoms to report and how quickly.',
      'Many immunotherapy medicines are given by infusion at the clinic; some are injections or tablets, and the schedule depends on the medicine and the plan. Immunotherapy may be used on its own or alongside other cancer treatments.',
      'Before starting, the team considers the cancer type and its test results, previous treatment, general health, other medicines, and conditions such as autoimmune illness. Monitoring during treatment includes questions about new symptoms, examination, blood tests and scans at defined points.',
      'Possible effects include tiredness, rash, nausea, diarrhoea, cough, or muscle and joint aches. Because immunotherapy can occasionally cause the immune system to affect healthy organs, any new symptom — even a mild one — should be reported promptly. Seek urgent help for severe symptoms such as breathing difficulty.',
    ],
    extraCovers: [
      'Immune checkpoint and other immunotherapy medicines',
      'Prompt review of new or immune-related symptoms',
    ],
    metaTitle: 'Immunotherapy for Cancer — Onco Cure Clinic, Greater Noida',
    metaKeywords:
      'immunotherapy greater noida, checkpoint inhibitor therapy, immune therapy cancer noida, cancer immunotherapy clinic',
    metaDescription:
      'Immunotherapy at Onco Cure Clinic, Greater Noida — treatment that helps your own immune system recognise and fight cancer cells, with careful symptom monitoring.',
  },

  'targeted-therapy': {
    description: [
      'Targeted therapy acts on the specific molecular changes — mutations, proteins or signals — that drive an individual cancer to grow. Because the target is precise, these medicines can behave very differently from conventional chemotherapy.',
      'Whether a targeted drug applies to you depends on molecular testing of the tumour, which is why testing guidance is part of the planning conversation rather than an optional extra.',
      'Targeted treatment is usually taken continuously rather than in fixed cycles, and its effects are monitored at regular review points. Doses can be adjusted, and partners such as skin, blood-pressure or liver-related effects are watched for specifically.',
      'Some targeted medicines are taken by mouth at home; others are given by infusion or injection at the clinic. Schedules vary — a medicine may be taken daily, given at intervals, or arranged in cycles — and the plan explains exactly how to take it.',
      'If you take tablets at home, follow the prescribed dose and timing, and ask in advance what to do about a missed dose, a vomited dose, or difficulty swallowing. Do not change or stop treatment without speaking to the team, and mention every other medicine, vitamin and supplement you use.',
      'Side effects vary with the medicine and its target — they can include skin rash or dryness, changes to hair or nails, diarrhoea, tiredness, or changes in blood tests. Most are manageable with specific measures, including skin care and sun-protection advice. Report new or worsening problems early so the plan can be adjusted rather than interrupted.',
    ],
    extraCovers: [
      'Oral, infusion and injection targeted medicines',
      'Interaction checks for medicines, vitamins and supplements',
    ],
    metaTitle: 'Targeted Therapy for Cancer — Onco Cure Clinic, Greater Noida',
    metaKeywords:
      'targeted therapy greater noida, molecular targeted cancer treatment, biomarker guided therapy noida, cancer targeted medicine clinic',
    metaDescription:
      'Medicines designed around the specific molecular changes driving your cancer, with testing guidance and monitoring at Onco Cure Clinic, Greater Noida.',
  },

  'hormonal-endocrine-therapy': {
    description: [
      'Some cancers — most commonly breast and prostate cancers — grow in response to the body\u2019s natural hormones. Endocrine therapy works by blocking hormone production or by stopping hormones from acting on cancer cells.',
      'It is usually a long-term, tablet-based treatment taken over years rather than weeks, and it is often combined with other treatments earlier in the pathway.',
      'Because the treatment lasts years, staying comfortable on it matters: effects on bone health, energy and daily life are reviewed at follow-up visits, and the regimen can be adjusted if a particular medicine does not suit you.',
      'Most endocrine treatments are tablets or injections, and some plans include a procedure that reduces hormone production. This is a different thing entirely from hormone replacement therapy used for menopause symptoms — the aim here is to change the hormonal environment so that hormone-sensitive cancer cells are less stimulated.',
      'Monitoring during treatment includes visits to review symptoms and how you are taking the medicine, blood tests or scans when appropriate, and checks specific to the medicine — for example bone-health checks. Tell the team about new health problems or new medicines.',
      'Possible effects depend on the treatment and may include hot flushes, night sweats, tiredness, mood or sexual changes, joint discomfort, or bone-density changes. Many of these can be relieved. Keep a note of symptoms and raise them at appointments — or sooner if they worsen — rather than assuming they are something to put up with.',
    ],
    extraCovers: [
      'Tablet-based and injection-based endocrine treatment',
      'Bone health, symptom and adherence reviews',
    ],
    metaTitle: 'Hormonal / Endocrine Therapy — Onco Cure Clinic, Greater Noida',
    metaKeywords:
      'endocrine therapy greater noida, hormonal therapy breast cancer, prostate hormone therapy noida, cancer hormonal treatment clinic',
    metaDescription:
      'Long-term hormonal treatment for hormone-sensitive cancers, monitored for comfort and bone health, at Onco Cure Clinic, Greater Noida.',
  },

  'oral-anti-cancer-therapies': {
    description: [
      'A growing share of modern cancer treatment is taken as tablets at home rather than as infusions in a day-care unit. Oral anti-cancer therapies include targeted tablets, hormonal tablets and certain chemotherapy medicines.',
      'Treatment taken at home still needs the same oversight: correct dosing, a schedule for missed doses, monitoring blood tests, and clear guidance on which effects to report.',
      'A prescription is only the beginning. Each person on oral therapy has a defined review rhythm, and adherence — taking the treatment exactly as planned — is checked supportively at every visit, because it directly shapes how well the treatment works.',
      'Before treatment starts, the team explains how and when to take the medicine, whether it should be taken with food, and what to do if a dose is missed or vomited. Mention every prescription medicine, non-prescription medicine, vitamin, herbal product and supplement you use, since some interact with cancer medicines.',
      'Follow-up appointments and tests, which may include blood tests or scans, help the team review how you are managing treatment and whether the plan needs adjustment. Keeping a simple record of doses and any new symptoms makes these reviews far more productive.',
      'Take the medicine only as instructed: do not change the dose, stop treatment, or crush or split tablets unless the team confirms it is safe. Ask about storage and handling, and about disposal of unused tablets. Contact the care team about side effects or uncertainties rather than making changes independently.',
    ],
    extraCovers: [
      'Missed-dose, vomiting and storage guidance for home treatment',
      'Regular review visits with monitoring blood tests',
    ],
    metaTitle: 'Oral Anti-Cancer Therapies — Onco Cure Clinic, Greater Noida',
    metaKeywords:
      'oral chemotherapy greater noida, cancer tablets noida, targeted oral therapy, home based cancer treatment clinic',
    metaDescription:
      'Tablet-based cancer treatment, prescribed and monitored with the same rigour as clinic-based therapy, at Onco Cure Clinic, Greater Noida.',
  },

  'cancer-pain-symptom-management': {
    description: [
      'Pain and symptoms deserve attention in their own right, at every stage of the cancer journey — during treatment, between treatments, and in advanced disease. Pain that is taken seriously is pain that can usually be treated.',
      'Care is led jointly with an anesthesia and pain specialist, which means pain is assessed formally, not guessed at, and treatment ranges from medicines to approaches suited to nerve-related or persistent pain.',
      'Symptom management extends beyond pain: nausea, breathlessness, fatigue, sleep, appetite and treatment side effects are all reviewed together, because they interact. The goal is straightforward — that treatment is bearable and daily life stays as full as possible.',
      'Assessment begins with listening. The team asks where and when a symptom occurs, what it feels like, what makes it better or worse, and how it affects activity, rest and eating. Current and previous medicines are reviewed, examination or tests are arranged when they would change the plan, and a simple symptom-and-medicine diary often makes the next adjustment easier.',
      'Management is individualised: depending on the cause and your needs, it may include prescribed medicines, treatment of an underlying problem, or supportive approaches such as positioning, relaxation and practical advice. The plan is then reviewed for whether it is actually helping, and for unwanted effects of its own.',
      'You and your family can help most by reporting new or worsening symptoms early, keeping an up-to-date medicine list with timings, and noting what relief each medicine gives. Ask how and when to take each medicine, what side effects to watch for, and whom to contact if symptoms are not controlled — outside appointment hours included.',
    ],
    extraCovers: [
      'Formal assessment with anesthesia and pain specialists',
      'Symptom diary review and family involvement',
    ],
    metaTitle: 'Cancer Pain & Symptom Management — Onco Cure Clinic',
    metaKeywords:
      'cancer pain treatment greater noida, symptom management oncology, palliative pain clinic noida, chemotherapy side effects management',
    metaDescription:
      'Anesthesia-led care for cancer-related pain, treatment side effects and other symptoms — managed alongside treatment, not after it.',
  },

  'nutritional-lifestyle-guidance': {
    description: [
      'Eating well during cancer treatment is genuinely difficult: appetite changes, taste changes, and treatment itself interferes. Practical, individual guidance matters far more than any single "cancer diet".',
      'The focus is on maintaining weight and strength through treatment, managing eating-related side effects as they arise, and rebuilding activity gradually as recovery allows.',
      'Guidance is also honest about myths. There is no food that cures cancer and no food that feeds it — and extreme restriction during treatment usually does harm. Where specialist input is needed, for example for significant weight loss, a referral is arranged.',
      'A nutrition assessment looks at recent changes in weight and appetite, symptoms such as nausea, mouth soreness, constipation or difficulty swallowing, and your usual diet and food preferences. Advice is built around foods you actually eat and household routines you can keep, rather than an imported meal plan.',
      'The plan may include practical meal ideas, changes in food texture or timing, and specific strategies for treatment-related eating problems. Advice is adapted for days when appetite varies, which it will — consistency matters more than perfection.',
      'Lifestyle guidance also covers gentle physical activity, rest and managing stress, tailored to your health and treatment; ask the team what level of activity is right for you. Do not assume a restrictive diet, vitamin, herbal product or supplement is safe during treatment — check first. Caregivers can help by offering preferred foods in smaller portions without pressure, and by reporting ongoing eating difficulties or weight concerns.',
    ],
    extraCovers: [
      'Diet and appetite assessment during treatment',
      'Adaptation to familiar foods and household routines',
    ],
    metaTitle: 'Nutritional & Lifestyle Guidance During Cancer Treatment',
    metaKeywords:
      'cancer nutrition greater noida, diet during chemotherapy, lifestyle guidance cancer patient, food during cancer treatment india',
    metaDescription:
      'Practical guidance on food, activity and daily habits during cancer treatment — grounded, not faddish — at Onco Cure Clinic, Greater Noida.',
  },

  'supportive-palliative-care': {
    description: [
      'Palliative care is often misunderstood as care at the very end of life. In practice it means active support of comfort, symptoms and quality of life alongside treatment — and it can begin at any stage of serious illness.',
      'For people living with advanced cancer, the focus shifts to what matters most: controlling pain and other symptoms, staying at home where possible, and having honest, unhurried conversations about choices ahead.',
      'Support extends to families and caregivers, who carry their own load. Counselling, clear guidance, and planning that is discussed in advance rather than in a crisis are all part of this service.',
      'At a visit, the team asks about physical symptoms, emotional concerns, family or social needs, and what matters most to you. The discussion can include pain, appetite, sleep, anxiety, spiritual concerns and practical difficulties — and the care plan should reflect your needs and preferences, not a template.',
      'Support may include symptom management, emotional support, help with communication between care teams, and practical guidance for caregivers. The mix of professionals and services depends on your situation; the oncology team can explain local options or arrange referrals where needed.',
      'You can ask for supportive or palliative care whenever symptoms, decisions or day-to-day challenges feel difficult — asking does not mean treatment must stop. Bringing a list of concerns and medicines helps make the visit useful, and the plan is reviewed and adjusted as circumstances change.',
    ],
    extraCovers: [
      'Emotional support for patients, families and caregivers',
      'Care planning discussed calmly and in advance',
    ],
    metaTitle: 'Supportive & Palliative Care — Onco Cure Clinic, Greater Noida',
    metaKeywords:
      'palliative care greater noida, advanced cancer support, symptom relief cancer, caregiver counselling noida, end of life care planning',
    metaDescription:
      'Supportive and palliative care for advanced cancer — comfort, clarity and dignity for patients and families, alongside ongoing treatment.',
  },
};

async function login() {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Admin login failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data.token;
}

async function main() {
  console.log(`Target API: ${API_BASE}`);

  // Health check first — fail fast with a useful message
  try {
    const health = await fetch(`${API_BASE}/api/health`).then((r) => r.json());
    console.log(`Storage backend: ${health.storage}`);
  } catch {
    throw new Error(`Could not reach ${API_BASE} — is the server running?`);
  }

  const token = await login();
  console.log('Logged in to admin API.');

  const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const { items } = await fetch(`${API_BASE}/api/services`).then((r) => r.json());
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('No services returned by the API.');
  }

  let updated = 0;
  let skipped = 0;

  for (const svc of items) {
    const content = enrichments[svc.slug];
    if (!content) {
      console.log(`  - SKIP  ${svc.slug} (no enrichment content defined)`);
      skipped += 1;
      continue;
    }

    const covers = [
      ...(Array.isArray(svc.covers) ? svc.covers : []),
      ...content.extraCovers.filter((line) => !(svc.covers || []).includes(line)),
    ];

    const payload = {
      description: content.description.join('\n\n'),
      covers,
      metaTitle: content.metaTitle,
      metaKeywords: content.metaKeywords,
      metaDescription: content.metaDescription,
    };

    const res = await fetch(
      `${API_BASE}/api/services/${encodeURIComponent(svc.id || svc.slug)}`,
      { method: 'PUT', headers: auth, body: JSON.stringify(payload) }
    );
    if (!res.ok) {
      throw new Error(`PUT failed for ${svc.slug} (${res.status}): ${await res.text()}`);
    }
    const body = await res.json();
    console.log(
      `  + OK    ${svc.slug} — ${content.description.length} paragraphs, ${body.covers.length} covers lines`
    );
    updated += 1;
  }

  console.log(`\nDone. Updated ${updated} services, skipped ${skipped}.`);
  if (skipped > 0) {
    console.log('Note: skipped services have no entry in this script — nothing was changed for them.');
  }
}

main().catch((err) => {
  console.error(`\n✗ ${err.message}`);
  process.exit(1);
});
