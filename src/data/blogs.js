/**
 * ---------------------------------------------------------------------------
 * BLOGS — patient-education articles (placeholder-ready)
 * ---------------------------------------------------------------------------
 * PROVENANCE & POLICY
 * -------------------
 * Content is general, plain-language patient education written for this site
 * from established oncology knowledge. It deliberately contains NO outcome
 * claims, statistics, survival figures or promises, and every article closes
 * by pointing the reader to their care team.
 *
 * Article imagery is STOCK placeholder photography (the same agreed pool as
 * elsewhere on the site) — `imageNote` says so, and the cards render a visible
 * placeholder tag until the clinic supplies approved visuals.
 */

export const blogCategories = [
  'Understanding Cancer',
  'Treatment & Therapies',
  'Living Well',
  'Pain & Symptom Care',
  'Prevention & Screening',
];

export const blogs = [
  {
    slug: 'what-happens-at-a-first-oncology-consultation',
    title: 'What happens at a first oncology consultation',
    category: 'Understanding Cancer',
    date: '2026-09-18',
    readMinutes: 6,
    image: '/images/photo/about-consult.jpg',
    imageAlt:
      'A clinician going through reports with a patient during a consultation.',
    excerpt:
      'Walking into a first appointment with an oncologist is easier when you know what the visit is for — and what to bring.',
    body: [
      {
        heading: 'The visit is a conversation first',
        paragraphs: [
          'A first oncology consultation is not a treatment appointment. Its purpose is to build the full picture: your medical history, your symptoms, what tests have already been done, and — just as important — what you are worried about and what you want to understand.',
          'Expect to talk, in your own words, about when things started and how they have progressed. Nothing is too small to mention; details that feel minor to you are often clinically meaningful.',
        ],
      },
      {
        heading: 'What to bring',
        paragraphs: [
          'Bring every report, scan image and prescription you have, even ones that seem irrelevant or old. Bring a family member or friend if you can — a second pair of ears hears things the first pair misses. And bring your written questions; there is no such thing as too many.',
          'If reports are in a different language or format, mention this when booking so nothing is delayed on the day.',
        ],
      },
      {
        heading: 'What you should leave with',
        paragraphs: [
          'By the end of a good first consultation you should know: what is known so far about your condition, what is still uncertain, which tests come next and why, and roughly what the path forward looks like.',
          'If any of that is unclear, it is entirely appropriate to say so and ask for it to be explained again, in plain language. A consultation that ends in confusion has not finished its job.',
        ],
      },
    ],
    closing:
      'If you are preparing for a first consultation, our team can guide you on what to bring and what to expect. Call or WhatsApp the clinic.',
  },
  {
    slug: 'getting-a-second-opinion-is-normal',
    title: 'Getting a second opinion is normal — and wise',
    category: 'Understanding Cancer',
    date: '2026-09-04',
    readMinutes: 5,
    image: '/images/photo/consult-two.jpg',
    imageAlt: 'Two clinicians reviewing a case together.',
    excerpt:
      'Seeking another specialist\'s view of your diagnosis or treatment plan is routine practice in good cancer care, not a betrayal of your doctor.',
    body: [
      {
        heading: 'Why second opinions are standard practice',
        paragraphs: [
          'Cancer treatment decisions are complex and consequential, and medicine expects them to be checked. Oncologists themselves seek second opinions on difficult cases — that is exactly what tumour boards and multidisciplinary meetings are.',
          'A second opinion reviews your pathology, staging and proposed plan independently, and confirms or refines it. Most often it confirms the plan, which brings real peace of mind. Sometimes it adds an option that had not been discussed.',
        ],
      },
      {
        heading: 'How to do it well',
        paragraphs: [
          'Collect your complete records first — biopsy reports, imaging, blood results and the treatment plan. A review is only as good as the information it is based on.',
          'Be open with both doctors. Most treating physicians welcome a second review; if yours reacts badly to the request, that is useful information in itself.',
        ],
      },
      {
        heading: 'What a second opinion is not',
        paragraphs: [
          'It is not a test of loyalty, and it does not obligate you to change anything. The decision about where and how you are treated always remains yours, made with clear information.',
        ],
      },
    ],
    closing:
      'The clinic offers second-opinion consultation and treatment review. Bring your reports — every question will be answered patiently.',
  },
  {
    slug: 'how-chemotherapy-cycles-work',
    title: 'How chemotherapy cycles actually work',
    category: 'Treatment & Therapies',
    date: '2026-08-21',
    readMinutes: 7,
    image: '/images/photo/lab-research.jpg',
    imageAlt: 'A treatment preparation area in a clinical setting.',
    excerpt:
      'Cycles, rest weeks and pre-cycle blood checks all have a logic. Understanding the rhythm makes the weeks easier to live with.',
    body: [
      {
        heading: 'Why treatment comes in cycles',
        paragraphs: [
          'Chemotherapy drugs harm rapidly dividing cells — cancer cells, but also healthy ones such as bone marrow and the lining of the mouth and gut. Treatment is therefore given in cycles: a treatment day or days, then a rest period during which healthy cells recover.',
          'The cycle length depends on the drugs, and the total number of cycles depends on the goal — curing, controlling, or easing symptoms.',
        ],
      },
      {
        heading: 'The checks before every cycle',
        paragraphs: [
          'Before each cycle, blood counts are checked to confirm the body has recovered enough to proceed. If counts are low, treatment is deferred a few days — this is normal and safe, not a setback, even though it is disappointing on the day.',
          'Weight, side effects and overall wellbeing are reviewed at the same time, and doses can be adjusted accordingly.',
        ],
      },
      {
        heading: 'Living between cycles',
        paragraphs: [
          'Most people have a pattern: harder days immediately after treatment, then recovery. Learning your own pattern lets you plan rest, work and family life around it.',
          'Report fever, chills or new symptoms during a rest week immediately — a phone call is always better than waiting it out.',
        ],
      },
    ],
    closing:
      'Questions about an upcoming treatment plan? Our team will walk you through it cycle by cycle before anything begins.',
  },
  {
    slug: 'immunotherapy-vs-chemotherapy',
    title: 'Immunotherapy and chemotherapy are not the same thing',
    category: 'Treatment & Therapies',
    date: '2026-08-07',
    readMinutes: 6,
    image: '/images/photo/consult-care.jpg',
    imageAlt: 'A consultation in progress at the clinic.',
    excerpt:
      'Both are systemic cancer treatments, but they work on entirely different principles — which changes what to expect and what to watch for.',
    body: [
      {
        heading: 'Two different ideas',
        paragraphs: [
          'Chemotherapy attacks dividing cells directly, cancer cells included. Immunotherapy instead removes the brakes that cancers put on the immune system, allowing the body\'s own defences to act.',
          'This difference matters practically. Immunotherapy is given on a schedule like chemotherapy, but its effects can appear differently and sometimes later, and response is assessed on a specific review rhythm.',
        ],
      },
      {
        heading: 'Suitability depends on testing',
        paragraphs: [
          'Immunotherapy is not universally applicable. Its use depends on cancer type, stage and specific markers on tumour testing. This is why molecular and biomarker testing has become a routine part of treatment planning rather than a special step.',
        ],
      },
      {
        heading: 'What to watch for',
        paragraphs: [
          'Because the immune system acts throughout the body, immunotherapy can occasionally inflame healthy organs — skin, gut, lungs, glands and others. Most effects are manageable when caught early, which is why everyone starting these medicines learns exactly which symptoms to report and how fast to report them.',
          'Never assume a new symptom is "just part of treatment" — call the treating team.',
        ],
      },
    ],
    closing:
      'Whether immunotherapy has a role in your treatment is a testing-and-planning question. We will explain your specific situation in plain language.',
  },
  {
    slug: 'cancer-pain-is-treatable',
    title: 'Cancer pain is treatable — please do not endure it',
    category: 'Pain & Symptom Care',
    date: '2026-07-24',
    readMinutes: 5,
    image: '/images/photo/calm-leaf.jpg',
    imageAlt: 'A calm, still-life detail photographed at the clinic.',
    excerpt:
      'Pain that is taken seriously is pain that can usually be treated. Enduring it silently helps no one.',
    body: [
      {
        heading: 'A quiet, common problem',
        paragraphs: [
          'Many people with cancer treat pain as something to be endured — a badge of stoicism, or a fear that pain means the disease is worsening. Both beliefs get in the way of care. Pain deserves treatment in its own right, at every stage of the journey.',
        ],
      },
      {
        heading: 'Pain is assessed, not guessed',
        paragraphs: [
          'Modern pain care starts with a formal assessment: where the pain is, what it feels like, when it comes, what eases it. Different pains — bone, nerve, pressure, treatment-related — respond to different approaches.',
          'Care is often led with an anesthesia and pain specialist, which brings approaches beyond routine painkillers when they are needed.',
        ],
      },
      {
        heading: 'Speak early, not late',
        paragraphs: [
          'Pain is far easier to control before it becomes severe. Tell the team at the first sign, keep a simple note of when it comes, and be honest about what you are actually taking rather than what was prescribed.',
          'There is no prize for endurance. There is a great deal to gain from comfort.',
        ],
      },
    ],
    closing:
      'Pain or symptoms that need attention? Our anesthesia-led pain service assesses and manages cancer-related pain alongside treatment, not after it.',
  },
  {
    slug: 'eating-well-during-treatment',
    title: 'Eating well during treatment — what actually matters',
    category: 'Living Well',
    date: '2026-07-10',
    readMinutes: 6,
    image: '/images/photo/care-hands.jpg',
    imageAlt: 'A quiet moment of care — a patient\'s hand held gently.',
    excerpt:
      'Appetite changes and taste changes are near-universal during treatment. Practical adjustments beat any special "cancer diet".',
    body: [
      {
        heading: 'First, the myths',
        paragraphs: [
          'There is no food that cures cancer, and no food that secretly feeds it. Extreme restriction during treatment usually does harm. Sugar does not drive cancer the way the internet suggests, but overall balance does matter.',
        ],
      },
      {
        heading: 'The real goals',
        paragraphs: [
          'During treatment the goals are simple: maintain weight, maintain strength, stay hydrated, and keep eating enough — even if the menu is monotonous for a while. Weight loss that creeps up is one of the most under-reported problems in cancer care.',
          'When taste changes or nausea interfere, small frequent meals, food at room temperature, and eating by the clock rather than by appetite all help more than any supplement.',
        ],
      },
      {
        heading: 'When to ask for help',
        paragraphs: [
          'Tell the team early about trouble swallowing, persistent vomiting, diarrhoea or rapid weight loss — these are treatable and should not be written off as "just treatment". Significant weight loss deserves a formal nutrition referral.',
        ],
      },
    ],
    closing:
      'Nutritional and lifestyle guidance is part of our supportive care. Bring your questions — and your honest appetite diary, if you keep one.',
  },
  {
    slug: 'what-is-cancer-staging',
    title: 'Cancer staging, explained without jargon',
    category: 'Understanding Cancer',
    date: '2026-06-26',
    readMinutes: 6,
    image: '/images/photo/hero-consult.jpg',
    imageAlt: 'A specialist explaining results to a patient.',
    excerpt:
      'Staging is the single most important input to a treatment plan. Here is what the numbers and letters actually mean.',
    body: [
      {
        heading: 'What staging measures',
        paragraphs: [
          'Staging describes how far a cancer has developed: whether it is confined to where it started, has reached nearby lymph nodes, or has spread to other organs. Most solid cancers are staged I through IV, refined by the TNM system — tumour size, node involvement, metastasis.',
          'Staging is not a grade of hope. It is an engineering input: each stage maps to treatment approaches with the best established results for that situation.',
        ],
      },
      {
        heading: 'Why tests repeat',
        paragraphs: [
          'Staging is a snapshot at a point in time. Scans are repeated during treatment not because something is suspected to be wrong, but because response assessment — measuring what changed — is how plans are continued, adjusted or completed on evidence.',
        ],
      },
      {
        heading: 'Ask for the picture in words',
        paragraphs: [
          'You are entitled to know your stage and what it means in plain language. Ask where the disease is, what the staging tests showed, and how the stage shapes the plan being proposed. A good team answers this without prompting.',
        ],
      },
    ],
    closing:
      'Staging and response assessment are core services at the clinic — and they are always explained in words you can follow.',
  },
  {
    slug: 'cancer-screening-basics',
    title: 'Screening basics: which checks, and when',
    category: 'Prevention & Screening',
    date: '2026-06-12',
    readMinutes: 5,
    image: '/images/photo/clinic-still.jpg',
    imageAlt: 'The clinic interior, calm and ordered.',
    excerpt:
      'A plain summary of the routine checks for common cancers, and why "age-appropriate screening" is worth a conversation.',
    body: [
      {
        heading: 'What screening means',
        paragraphs: [
          'Screening looks for cancer — or its precursors — in people who have no symptoms. It works for some cancers and not others; a good test must be both sensitive and safe enough to justify using it in healthy people.',
        ],
      },
      {
        heading: 'The established checks',
        paragraphs: [
          'For common cancers, established screening includes breast examination and mammography for women in the recommended age groups, cervical screening tests, bowel screening, and oral cavity examination — particularly relevant given tobacco habits in India.',
          'Exactly which check applies to you, and at what age and interval, depends on age, family history and risk factors. That is a conversation, not a form.',
        ],
      },
      {
        heading: 'When symptoms exist, it is not screening',
        paragraphs: [
          'A lump, bleeding, unexplained weight loss or a persistent change that lasts weeks is a symptom, not a screening question — it needs prompt evaluation, not a wait for the next screening round.',
        ],
      },
    ],
    closing:
      'Unsure which screening applies to you or a family member? Ask us — prevention and early detection are part of the clinic\'s work.',
  },
  {
    slug: 'supporting-a-family-member',
    title: 'Supporting a family member through treatment',
    category: 'Living Well',
    date: '2026-05-29',
    readMinutes: 6,
    image: '/images/photo/reception-plants.jpg',
    imageAlt: 'A quiet corner of the clinic with plants.',
    excerpt:
      'Caregivers carry their own load. Practical ways to help — and permission to look after yourself too.',
    body: [
      {
        heading: 'The useful things',
        paragraphs: [
          'The most useful caregiver contributions are unglamorous: keeping a list of medicines, driving to appointments, writing down the doctor\'s answers, noticing whether food is actually being eaten.',
          'Come into consultations when invited. A second pair of ears, and someone to ask the question the patient hesitated to ask, is genuinely valuable.',
        ],
      },
      {
        heading: 'The things to avoid',
        paragraphs: [
          'Avoid rescuing by stealth — hiding information "to protect" the patient almost always backfires. Avoid miracle cures from well-meaning relatives; bring any remedy or supplement to the treating team instead of deciding silently.',
        ],
      },
      {
        heading: 'Care for the caregiver',
        paragraphs: [
          'Caregiving is a long road and burnout helps nobody. Share the tasks, take real breaks, and ask the clinic about counselling — support for families is part of care, not an indulgence.',
        ],
      },
    ],
    closing:
      'Counselling and guidance for patients and caregivers is available at the clinic. You do not have to carry this alone.',
  },
  {
    slug: 'oral-cancer-treatment-at-home',
    title: 'Tablet-based cancer treatment: the essentials',
    category: 'Treatment & Therapies',
    date: '2026-05-15',
    readMinutes: 5,
    image: '/images/photo/doctor-writing.png',
    imageAlt: 'A clinician writing up a treatment plan.',
    excerpt:
      'More cancer treatment now happens at home, as tablets. The freedom is real — so is the discipline it asks of you.',
    body: [
      {
        heading: 'A growing share of treatment',
        paragraphs: [
          'Targeted tablets, hormonal tablets and some chemotherapy medicines are now taken at home rather than infused in a day-care unit. The convenience is genuine, and so is the responsibility: there is no nurse checking each dose.',
        ],
      },
      {
        heading: 'The discipline that matters',
        paragraphs: [
          'Take the treatment exactly as prescribed — same time, right conditions, never double-dosing after a missed tablet. Keep the schedule for monitoring blood tests even when you feel well; much of what these medicines do is only visible in bloodwork.',
        ],
      },
      {
        heading: 'Keep the dialogue open',
        paragraphs: [
          'Side effects are the main reason people quietly stop taking treatment. Do not stop silently — almost every side effect has an answer, from dose adjustment to supportive medication. Tell the team first.',
        ],
      },
    ],
    closing:
      'Starting or already on oral anti-cancer therapy? Our team structures your monitoring schedule and stays reachable between visits.',
  },
  {
    slug: 'fatigue-during-cancer-treatment',
    title: 'Fatigue during treatment is real — and manageable',
    category: 'Pain & Symptom Care',
    date: '2026-05-01',
    readMinutes: 5,
    image: '/images/photo/consult-bed.jpg',
    imageAlt: 'A quiet treatment room prepared for a patient.',
    excerpt:
      'Cancer-related fatigue is not ordinary tiredness and does not fix itself with a good night\'s sleep — but it can be worked with.',
    body: [
      {
        heading: 'Not ordinary tiredness',
        paragraphs: [
          'Treatment-related fatigue is a heavy, whole-body exhaustion that rest does not simply clear. It is one of the most common experiences during cancer treatment, and one of the least reported — people assume it must simply be endured.',
        ],
      },
      {
        heading: 'What helps',
        paragraphs: [
          'Counter-intuitively, gentle regular activity — walking, light movement — helps fatigue more than bed rest. So do good sleep routines, adequate hydration, and treating the contributors: anaemia, poor sleep, pain, low mood and thyroid or nutritional issues are all checkable.',
        ],
      },
      {
        heading: 'Say it out loud',
        paragraphs: [
          'Report fatigue at reviews the way you would report pain. Its causes are worth investigating, its management is part of supportive care, and pretending to cope hides information your team needs.',
        ],
      },
    ],
    closing:
      'Fatigue, sleep and daily function are reviewed as part of symptom management at the clinic. Mention them — they count.',
  },
];

/** Look up one blog post by slug (null when unknown). */
export const blogBySlug = (slug) => blogs.find((b) => b.slug === slug) ?? null;

/** Short display date ("18 Sep 2026") derived from the ISO date. */
export const blogDateDisplay = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
