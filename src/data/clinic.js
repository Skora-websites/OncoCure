/**
 * ---------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH
 * ---------------------------------------------------------------------------
 * Every piece of clinic copy, contact detail, doctor profile and service line
 * on the home page is defined here, so the content can be reviewed and replaced
 * without touching any component.
 *
 * PROVENANCE
 * ----------
 * Facts (names, degrees, roles, address, phone, email, timings) and the
 * narrative copy come from material supplied by the clinic. Where something has
 * not been supplied, it is written as an explicitly marked placeholder.
 *
 * We do not publish invented qualifications, medical claims, testimonials,
 * survival statistics or outcome figures.
 *
 * The doctor portraits are the clinic's own photographs of Dr Bambroo and
 * Dr Sadhoo (public/images/photo/).
 */

/** True when a string is one of our marked placeholders. */
export const isPlaceholder = (value) =>
  typeof value === 'string' && value.includes('[placeholder]');

export const PLACEHOLDER_NOTE =
  'Content marked as a placeholder awaits the clinic’s approved wording.';

export const clinic = {
  name: 'Onco Cure Clinic',
  shortName: 'Onco Cure',
  tagline: 'Care · Compassion · Cure',
  category: 'Oncology and Pain Clinic',
  city: 'Greater Noida',

  meta: {
    title: 'Onco Cure Clinic — Specialist Cancer Care in Greater Noida',
    description:
      'Onco Cure Clinic is a patient-centred cancer care clinic in Greater Noida, led by Medical Oncologist Dr Sahil Bambroo, offering compassionate, personalised and evidence-based oncology care.',
  },

  contact: {
    addressLines: [
      'A-08, Upper Ground Floor',
      'Omaxe India Trade Centre',
      'Alpha 2, Greater Noida',
    ],
    addressSingle:
      'A-08, Upper Ground Floor, Omaxe India Trade Centre, Alpha 2, Greater Noida',
    email: 'oncocureclinic@gmail.com',
    phones: [
      { label: '9656917798', tel: '+919656917798', display: '+91 96569 17798' },
      { label: '8750052773', tel: '+918750052773', display: '+91 87500 52773' },
    ],
    primaryPhone: '+91 96569 17798',
    whatsapp: '+919656917798',
    /** Short link supplied by the clinic. */
    mapsUrl: 'https://maps.app.goo.gl/rSbwSjq1cgw98RBg7',
  },

  /** Consulting hours exactly as supplied. Oncology, pain and Sunday sessions. */
  hours: [
    {
      id: 'oncology',
      label: 'Oncology',
      days: 'Monday to Saturday',
      time: '6:30 pm – 9:30 pm',
    },
    {
      id: 'pain',
      label: 'Pain Clinic',
      days: 'Monday to Saturday',
      time: '7:30 pm – 8:30 pm',
    },
    {
      id: 'sunday',
      label: 'Oncology & Pain',
      days: 'Sunday',
      time: '10:00 am – 1:00 pm',
    },
  ],

  /** Keyed logo artwork. See scripts/extract-brand-assets.js */
  logo: {
    mark: '/images/brand/logo-mark.png',
    full: '/images/brand/logo-full.png',
    signboard: '/images/brand/signboard.jpg',
  },
};

/**
 * The two consultants.
 *
 * `focusAreas` are the clinic's own stated clinical interests. Anything not
 * supplied stays a marked placeholder.
 *
 * `photo` is the clinic's own portrait of each doctor. `photoPos` is the
 * object-position for the circular crops (the portraits are tall), tuned per
 * photo so the face sits well inside the circle.
 */
export const doctors = [
  {
    id: 'sahil-bambroo',
    name: 'Dr Sahil Bambroo',
    role: 'Medical Oncologist',
    roleLine: 'Physician and Cancer Specialist',
    credentials: ['M.B.B.S', 'MD (Medicine)', 'DM (Medical Oncology)'],
    affiliation: 'Manipal Hospitals, Dwarka & Ghaziabad',
    focusAreas: [
      'Solid tumours and haematological malignancies',
      'Treatment planning and second-opinion review',
    ],
    bio: 'Leads the clinic’s oncology service, covering the complete pathway from a new cancer diagnosis and treatment planning through to follow-up and survivorship care.',
    accent: 'plum',
    photo: '/images/photo/drsahil.jpg',
    photoAlt: 'Dr Sahil Bambroo, Medical Oncologist at Onco Cure Clinic.',
    photoPos: '50% 20%',
    photoNote: 'Official portrait supplied by the clinic.',
  },
  {
    id: 'apurva-sadhoo',
    name: 'Dr Apurva Sadhoo',
    role: 'Anesthesia & Pain Specialist',
    roleLine: 'Pain Physician',
    credentials: ['M.B.B.S', 'MD (Anesthesia)'],
    affiliation: null,
    focusAreas: [
      'Cancer-related pain and symptom control',
      'Anesthesia-led pain assessment and management',
    ],
    bio: 'Looks after pain and symptom concerns at Onco Cure, supporting patients through treatment-related side effects and the day-to-day challenges of living with cancer.',
    accent: 'teal',
    photo: '/images/photo/drapoorva.jpeg',
    photoAlt: 'Dr Apurva Sadhoo, Anesthesia and Pain Specialist at Onco Cure Clinic.',
    photoPos: '50% 8%',
    photoNote: 'Official portrait supplied by the clinic.',
  },
];

/** Hero copy. Kept to the template's essentials: a headline and an action. */
export const hero = {
  /** Small serif name heading the sticky left column, as in the reference. */
  name: 'Onco Cure Clinic',
  headline: [
    { text: 'Compassionate cancer care, ' },
    { text: 'close to home', accent: true },
  ],
  /** Short description, set left beneath the headline as the template does. */
  description:
    'A patient-centred cancer care clinic in Greater Noida — compassionate, personalised and evidence-based oncology care, led by a medical oncologist.',
  /** The circular badge that sits astride the arch. Length is tuned to fill the ring. */
  badge: 'BOOK A CONSULTATION · CALL · WHATSAPP · ',
};

/** Clinic introduction for the home page's "The Clinic" section. */
export const intro = {
  eyebrow: 'The Clinic',
  heading: 'Care for the person, not only the disease',
  paragraphs: [
    'Onco Cure Clinic is a patient-centred cancer care clinic in Greater Noida, led by Medical Oncologist Dr Sahil Bambroo.',
    'We believe cancer care is not only about treating the disease, but about supporting the person through every step of the journey — with empathy, transparency and dignity.',
    'Oncology and pain care run side by side here: Dr Sahil Bambroo (M.B.B.S, MD Medicine, DM Medical Oncology) leads the cancer service from a new diagnosis and treatment planning through to follow-up and survivorship, while Dr Apurva Sadhoo, Anesthesia & Pain Specialist, looks after cancer-related pain and symptom control.',
    'The clinic covers the full arc of care — cancer consultation and second opinions, chemotherapy, immunotherapy, targeted and hormonal therapy, with nutrition guidance, caregiver counselling and palliative planning alongside — so most of what a family needs stays close to home.',
  ],
};

/**
 * The clinic's scope of work, condensed into three groups for the home page.
 *
 * The clinic supplied the full lists; the exact items below are the clinic's
 * own wording, trimmed to the headline eight per group so the pills stay
 * scannable. The complete lists live in `serviceGroupsFull` below for the
 * Services page, which is not part of this build.
 */
export const serviceGroups = [
  {
    id: 'oncology-services',
    title: 'Oncology Services',
    accent: 'plum',
    items: [
      'Cancer consultation',
      'Diagnosis & treatment planning',
      'Second-opinion review',
      'Solid tumours & blood cancers',
      'Staging & response assessment',
      'Multidisciplinary coordination',
      'Molecular testing guidance',
      'Follow-up & surveillance',
    ],
  },
  {
    id: 'cancer-treatments',
    title: 'Cancer Treatments',
    accent: 'teal',
    items: [
      'Chemotherapy',
      'Immunotherapy',
      'Targeted therapy',
      'Hormonal / endocrine therapy',
      'Oral anti-cancer therapies',
      'Maintenance therapy',
      'Neoadjuvant & adjuvant therapy',
      'Recurrent & metastatic cancers',
    ],
  },
  {
    id: 'cancer-care-support',
    title: 'Cancer Care & Support',
    accent: 'plum',
    items: [
      'Treatment side effects',
      'Cancer-related pain',
      'Symptom management',
      'Nutritional & lifestyle guidance',
      'Infection & complication care',
      'Patient & caregiver counselling',
      'Palliative care planning',
      'End-of-life care planning',
    ],
  },
];

/**
 * The clinic's complete service lists, reproduced in full. Kept here so the
 * wording is preserved for the Services page without having to re-supply it.
 */
export const serviceGroupsFull = [
  {
    id: 'oncology-services-full',
    title: 'Oncology Services',
    items: [
      'Comprehensive cancer consultation and evaluation',
      'New cancer diagnosis and treatment planning',
      'Second-opinion consultation and treatment review',
      'Personalised treatment plans based on cancer type, stage, molecular profile and overall health',
      'Management of solid tumours and haematological malignancies',
      'Cancer staging and treatment response assessment',
      'Multidisciplinary cancer care and coordination with surgical and radiation oncology teams',
      'Genetic and molecular testing guidance, where indicated',
      'Treatment planning for newly diagnosed and recurrent / metastatic cancers',
      'Follow-up care and cancer surveillance',
      'Survivorship and long-term cancer care',
      'Supportive and palliative care for patients with advanced cancer',
    ],
  },
  {
    id: 'cancer-treatments-full',
    title: 'Cancer Treatments',
    items: [
      'Chemotherapy',
      'Immunotherapy',
      'Targeted therapy',
      'Hormonal / endocrine therapy',
      'Oral anti-cancer therapies',
      'Maintenance therapy',
      'Neoadjuvant and adjuvant systemic therapy',
      'Treatment of recurrent and metastatic cancers',
      'Supportive treatment for cancer- and treatment-related complications',
    ],
  },
  {
    id: 'cancer-care-support-full',
    title: 'Cancer Care & Support',
    items: [
      'Management of chemotherapy and treatment-related side effects',
      'Management of cancer-related pain and other symptoms',
      'Nutritional and lifestyle guidance during cancer treatment',
      'Infection and treatment-related complication management',
      'Counselling and guidance for patients and caregivers',
      'End-of-life and palliative care planning when appropriate',
    ],
  },
];

/**
 * The six headline areas, condensed from the full service list above.
 * Each row links to the relevant part of the detailed list below it.
 */
export const services = [
  {
    id: 'consultation',
    title: 'Cancer Consultation & Evaluation',
    text: 'Comprehensive consultation and evaluation for a new cancer diagnosis, alongside second-opinion review of an existing treatment plan.',
    accent: 'plum',
  },
  {
    id: 'planning',
    title: 'Personalised Treatment Planning',
    text: 'Treatment plans shaped around cancer type, stage, molecular profile and overall health, coordinated with surgical and radiation oncology teams.',
    accent: 'teal',
  },
  {
    id: 'treatments',
    title: 'Systemic Cancer Treatments',
    text: 'Chemotherapy, immunotherapy, targeted therapy, hormonal and oral anti-cancer therapies, including neoadjuvant and adjuvant treatment.',
    accent: 'plum',
  },
  {
    id: 'pain-symptoms',
    title: 'Pain & Symptom Management',
    text: 'Anesthesia-led care for cancer-related pain, treatment side effects and other symptoms, with supportive treatment throughout therapy.',
    accent: 'teal',
  },
  {
    id: 'support',
    title: 'Supportive & Palliative Care',
    text: 'Supportive and palliative care for advanced cancer, including counselling for patients and caregivers and end-of-life planning when appropriate.',
    accent: 'plum',
  },
  {
    id: 'followup',
    title: 'Follow-up & Survivorship Care',
    text: 'Ongoing follow-up, cancer surveillance, treatment response assessment and long-term survivorship care.',
    accent: 'teal',
  },
];

/**
 * Trust points for "Why Onco Cure Clinic".
 *
 * Each point is grounded in something the clinic has actually stated: a
 * qualification, a service line, a stated philosophy or a published schedule.
 * Deliberately free of success rates, patient counts and outcome claims.
 */
export const reasons = [
  {
    id: 'consultant-led',
    title: 'Consultant-led oncology care',
    text:
      'Your consultation is led by a Medical Oncologist with MBBS, MD and DM qualifications, working to evidence-based practice.',
  },
  {
    id: 'personalised',
    title: 'Treatment planned around you',
    text:
      'Plans are personalised to cancer type, stage, molecular profile and overall health — not to a standard protocol alone.',
  },
  {
    id: 'multidisciplinary',
    title: 'Coordinated multidisciplinary care',
    text:
      'Onco Cure coordinates with surgical and radiation oncology teams, so treatment decisions are made with the wider picture in view.',
  },
  {
    id: 'whole-person',
    title: 'Support for the whole journey',
    text:
      'From diagnosis and treatment through follow-up, survivorship and palliative care — with pain, symptoms and caregiver support included.',
  },
];

/** "Our Approach" storytelling section. */
export const approach = {
  eyebrow: 'Our Approach',
  heading: 'Care that is personal, clear and specialist-led',
  lead:
    'A cancer diagnosis affects far more than the body. It changes routines, plans and the peace of mind of an entire family. Our approach is built around that reality.',
  points: [
    {
      id: 'listen',
      title: 'We begin by listening',
      text:
        'Every consultation opens with your story — what you have been through, what worries you most, and what you would like to get back to. The clinical plan follows the conversation, not the other way round.',
    },
    {
      id: 'explain',
      title: 'We explain, in plain language',
      text:
        'You will receive a clear account of your diagnosis, the options available and what each one involves. We leave room for questions, and we encourage you to take the time you need before deciding anything.',
    },
    {
      id: 'evidence',
      title: 'Evidence-based, individually applied',
      text:
        'Our approach is grounded in evidence-based oncology care — applied to your particular cancer type, stage, molecular profile and general health rather than applied generically.',
    },
    {
      id: 'dignity',
      title: 'Empathy, transparency and dignity',
      text:
        'We believe cancer care is not only about treating the disease, but about supporting the person through every step of the journey — with empathy, transparency and dignity.',
    },
  ],
  quote: {
    text: 'Cancer care is not only about treating the disease, but supporting the person.',
    attribution: 'Onco Cure Clinic philosophy',
  },
};

/**
 * Testimonials — the arc-carousel section (src/components/Testimonials.jsx).
 *
 * PROVENANCE: the clinic has NOT supplied any patient testimonials, so every
 * entry below is an explicitly marked placeholder — realistic layout copy so
 * the section can be reviewed, but clearly labelled as awaiting approved
 * wording. Replace each entry with the clinic's own wording and real attributions
 * before launch; nothing here may be published as-is.
 */
export const testimonials = {
  eyebrow: 'Patient Voices',
  heading: 'In their own words',
  intro:
    'A few words from the people we have cared for. Every entry below is placeholder content awaiting the clinic’s approved wording.',
  note: 'Placeholder testimonials — awaiting approved wording from the clinic.',
  /** Seconds between auto-advances; hover pauses the carousel. */
  interval: 3.4,
  items: [
    {
      id: 't1',
      quote:
        'The doctor listened to everything we were worried about and explained the plan in words we could actually follow.',
      name: 'Patient name',
      designation: 'Placeholder · Breast cancer care',
    },
    {
      id: 't2',
      quote:
        'Coming to the clinic close to home made treatment weeks so much easier on our whole family.',
      name: 'Patient name',
      designation: 'Placeholder · Supportive care',
    },
    {
      id: 't3',
      quote:
        'My pain was finally taken seriously and managed alongside my treatment, not after it.',
      name: 'Patient name',
      designation: 'Placeholder · Pain management',
    },
    {
      id: 't4',
      quote:
        'Every question we brought to the second-opinion review was answered patiently and clearly.',
      name: 'Patient name',
      designation: 'Placeholder · Second opinion',
    },
    {
      id: 't5',
      quote:
        'We always knew what was happening next, and why — that made a difficult time easier to face.',
      name: 'Patient name',
      designation: 'Placeholder · Follow-up care',
    },
    {
      id: 't6',
      quote:
        'The team treated us as people first, patients second. That is something we will not forget.',
      name: 'Patient name',
      designation: 'Placeholder · Caregiver',
    },
  ],
};

/**
 * InlineCta — the reusable mid-page call-to-action band.
 * Rendered by <InlineCta /> (src/components/ui/InlineCta.jsx), which can be
 * dropped into any section with different copy via its props.
 */
export const inlineCta = {
  label: 'Take the Next Step',
  title: 'Have questions',
  titleContinuation: 'about',
  accent: 'your care?',
  description:
    'Speak with our team about your diagnosis, treatment options, or a second opinion.',
  href: '#contact',
  linkLabel: 'Book an Appointment',
  image: '/images/photo/care-hands.jpg',
  imageAlt: 'A patient’s hand held gently in a clinician’s — quiet reassurance.',
  tone: 'paper',
};

/** Closing call to action. */
export const closing = {
  eyebrow: 'Book a Consultation',
  heading: 'Let’s talk about what comes next',
  body:
    'Consultations can be arranged by phone or WhatsApp. If you are unsure whether your concern falls under oncology or pain, please call and we will guide you.',
  note:
    'Please bring any previous reports, prescriptions and scan images if they are available.',
};

/** Footer. */
export const footer = {
  blurb:
    'Onco Cure Clinic is a patient-centred cancer care clinic in Greater Noida, dedicated to providing compassionate, personalised and evidence-based oncology care.',
  navLabel: 'All pages are now connected.',
  disclaimer:
    'This website provides general information only and is not a substitute for professional medical advice, diagnosis or treatment. Always consult your physician or healthcare provider before making any decision about your care.',
  copyright: `© ${new Date().getFullYear()} Onco Cure Clinic. All rights reserved.`,
};

/** Navigation labels. Rendered as text only; routing arrives in a later stage. */
export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'contact', label: 'Contact Us' },
];

/**
 * Calls to action.
 * `nav` is the compact label in the top bar; everything else uses the full
 * phrase.
 */
export const cta = {
  nav: 'Consult',
  booking: 'Book a Consultation',
  call: 'Call the Clinic',
  whatsapp: 'WhatsApp',
  map: 'Get Directions',
};

/**
 * Consultation request — wording for the overlay and the contact page form.
 * The form itself is intentionally inert for this stage: no booking backend
 * exists yet, so submissions go nowhere and the submit action says so.
 */
export const consult = {
  label: 'Request a Consultation',
  title: 'Tell us about your concern',
  intro:
    'Share a few details and our team will call you back to arrange a suitable time. Nothing below is submitted anywhere yet — the form is a preview.',
  fields: {
    name: { label: 'Full name', placeholder: 'Your name' },
    phone: { label: 'Phone', placeholder: '+91 ·····' },
    email: { label: 'Email', placeholder: 'you@example.com' },
    concern: { label: 'Concern', placeholder: 'Select a concern' },
    message: { label: 'Message', placeholder: 'Briefly describe your concern, diagnosis or reports (optional)' },
  },
  concerns: [
    'Cancer consultation / new diagnosis',
    'Second opinion',
    'Chemotherapy / cancer treatment',
    'Cancer-related pain',
    'Pain management',
    'Reports review',
    'Other',
  ],
  submit: 'Request a Call Back',
  inertNote:
    'Preview only — this form is not connected to the clinic yet. Please call or WhatsApp us to book.',
  privacy:
    'Please do not share sensitive medical details until a consultation is confirmed.',
};

/**
 * About Us page copy (src/pages/AboutPage.jsx).
 *
 * PROVENANCE
 * ----------
 * Narrative copy follows the approved About mockup and the clinic's own
 * existing wording. Dr Bambroo's profile is taken verbatim-in-substance from
 * the CV material the clinic supplied.
 *
 * The impact figures are EXPLICITLY MARKED PLACEHOLDERS: the clinic has not
 * verified any patient totals or years-in-practice figures, so they carry a
 * visible placeholder note in the UI (same policy as the testimonials).
 */
export const aboutPage = {
  label: 'About Onco Cure',
  title: 'Care built around',
  titleAccent: 'the patient.',
  intro:
    'Personalised, evidence-based cancer care with clarity, compassion and continuity.',
  heroCta: 'Our approach',
  heroImage: '/images/photo/about-consult.jpg',
  heroImageAlt:
    'A clinician warmly going through reports with a patient — the everyday welcome at the clinic.',

  story: {
    label: 'Our Story',
    title: 'A patient-centred cancer care clinic in Greater Noida.',
    body: 'Onco Cure Clinic was founded on a simple belief — that every patient deserves expert care, clear guidance and a supportive environment throughout their cancer journey. We combine clinical expertise with a compassionate approach to help you make informed decisions at every step.',
    /** CV seam: the community-oncology work behind the founding belief. */
    clinical:
      'Dr Bambroo has been closely associated with community oncology — serving people through outreach OPDs at peripheral centres in NCR and across the country, and starting medical oncology services and daycare chemotherapy units at centres including ESIC Hospital, Okhla, Delhi.',
    cta: 'Meet our specialists',
    image: '/images/photo/about-building.jpg',
    imageAlt:
      'The modern clinic building seen from the approach road — care close to home in Greater Noida.',
  },

  values: {
    label: 'What Guides Us',
    title: 'Our values in care',
    items: [
      {
        id: 'patient-first',
        icon: 'people',
        title: 'Patient-first',
        text: 'Your comfort, privacy and well-being are at the centre of everything we do.',
      },
      {
        id: 'evidence-based',
        icon: 'shield',
        title: 'Evidence-based care',
        text: 'We follow the latest medical guidelines and proven practices.',
      },
      {
        id: 'clear-communication',
        icon: 'chat',
        title: 'Clear communication',
        text: 'We take time to explain options and answer your questions.',
      },
      {
        id: 'compassionate-support',
        icon: 'heart',
        title: 'Compassionate support',
        text: 'We stand by you through every stage of your journey.',
      },
    ],
  },

  journey: {
    label: 'Our Approach',
    title: 'Personalised care at',
    titleAccent: 'every step.',
    lead: 'We take a holistic and coordinated approach to cancer care, combining medical expertise, advanced treatment options and ongoing support to help you through your journey.',
    /** CV seam: how Dr Bambroo actually works, per the supplied material. */
    clinical:
      'Dr Bambroo pays attention to every detail and personalises every treatment plan, giving each patient time to address their concerns and arrive at shared decisions after thorough discussion. He collaborates closely with surgical and radiation oncologists, radiologists and pathologists to understand the complexities of every case before planning treatment.',
    steps: [
      {
        id: 'consultation',
        icon: 'stethoscope',
        title: 'Consultation and evaluation',
        text: 'A detailed discussion of your medical history, concerns and goals.',
      },
      {
        id: 'plan',
        icon: 'file',
        title: 'Personalised treatment plan',
        text: 'A plan tailored to your diagnosis, lifestyle and individual needs.',
      },
      {
        id: 'treatment',
        icon: 'gear',
        title: 'Treatment and monitoring',
        text: 'Evidence-based therapies with regular assessment and support.',
      },
      {
        id: 'follow-up',
        icon: 'hands',
        title: 'Ongoing support and follow-up',
        text: 'Continuous guidance to help you move forward with confidence.',
      },
    ],
  },

  impact: {
    label: 'Our Impact',
    title: 'Care that makes a difference.',
    body: 'Every number represents a person, a story and a journey towards better health.',
    /** CV seam: academic work surfacing as impact, per the supplied material. */
    clinical:
      'Behind the numbers is an academic practice — mentorship of DM and DrNB trainees, residents, undergraduates and nursing professionals, and an editorial board membership with the International Journal of Molecular and Immuno-Oncology.',
    note: 'Patient totals and years of experience are placeholders awaiting the clinic’s verified figures.',
    figures: [
      {
        id: 'patients',
        icon: 'people',
        value: '1000+',
        caption: 'Patients treated',
        placeholder: true,
      },
      {
        id: 'years',
        icon: 'ribbon',
        value: '15+',
        caption: 'Years of clinical experience',
        placeholder: true,
      },
      {
        id: 'roof',
        icon: 'clipboard',
        value: 'One roof',
        caption: 'Comprehensive care — oncology and pain',
        placeholder: false,
      },
    ],
  },

  team: {
    label: 'Our Team',
    title: 'Meet the specialists guiding',
    titleAccent: 'your care.',
    body: 'Our team brings together experience, expertise and a shared commitment to patient-centred care. We work closely with you to ensure the best possible treatment and support throughout your journey.',
    cta: 'Book a Consultation',
    /** Elevation card: the short editorial picture of each doctor. */
    sahilCard: {
      line: 'Compassion, humility and patient advocacy at the core of every consult — with time taken for each patient’s concerns, and treatment decisions shared after a full discussion.',
      focusLabel: 'Expertise',
      focus: [
        'Breast, lung & gastrointestinal cancers',
        'Haematological malignancies',
        'Immunotherapy & targeted therapy',
      ],
    },
    profileHeadings: {
      about: 'About',
      expertise: 'Field of Expertise',
      membership: 'Fellowship & Membership',
      languages: 'Languages Spoken',
      awards: 'Awards & Achievements',
      publication: 'Publication',
    },
    /**
     * Dr Sahil Bambroo — from the CV material supplied by the clinic.
     * Nothing here is invented; the lists are the clinic's own wording.
     * `training` is the card's opening (training + scope of practice); the
     * rest of the CV narrative is redistributed to other About sections
     * (`story.clinical`, `approach.clinical`) so no section repeats another.
     */
    sahil: {
      training:
        'A medical oncologist trained at the Amrita School of Medicine, Amrita Institute of Medical Sciences, Kochi, with MD in General Medicine and DM in Medical Oncology — experienced across academic institutions, government organisations and peripheral centres, and well versed in the management of solid cancers and haematological malignancies.',
      paragraphs: [
        'Dr Sahil Bambroo is a highly trained and experienced medical oncologist. He completed his MD in General Medicine before specialising with a DM in Medical Oncology from the Amrita School of Medicine, Amrita Institute of Medical Sciences, Kochi. He has extensive experience in medical oncology across academic institutions, government organisations and peripheral centres, and is well versed in the management of solid cancers — breast, head and neck, lung, gastrointestinal and genito-urinary — as well as haematological disorders and malignancies. He started medical oncology services and daycare chemotherapy units at certain centres, including the Daycare Chemotherapy Unit at ESIC Hospital, Okhla, Delhi, and has been closely associated with community oncology through outreach OPDs across NCR and the country.',
        'Compassion, humility and patient advocacy are at the core of his practice. He closely monitors each patient and helps them navigate the complex and at times overwhelming path of cancer treatment. He pays attention to every detail, personalises every treatment plan by giving time to each patient’s concerns, and makes shared decisions after thorough discussions. He collaborates closely with his peers — surgical and radiation oncologists, radiologists and pathologists — to understand the complexities of every case before arriving at conclusions and planning treatment.',
        'His academic contributions include mentorship of DM and DrNB trainees, medical residents, undergraduates, nursing and allied professionals. He is a member of national and international organisations dealing with cancer care and is an editorial board member for the International Journal of Molecular and Immuno-Oncology. He has authored scientific papers for national and international publications, has spoken at medical conferences, and is actively involved in cancer awareness and prevention programmes.',
      ],
      expertise: [
        'Breast Cancer, Gynaecological Malignancies',
        'Lung Cancer',
        'Haematological Malignancies',
        'Gastrointestinal & Hepatobiliary Cancers',
        'Genitourinary & Prostate Cancers',
        'Preventive Oncology',
        'Community Level Cancer Detection & Treatment',
        'Molecular Profiling of Cancers',
        'Immunotherapy & Targeted Therapy in the Treatment of Cancers',
      ],
      membership: [
        'Delhi Medical Council — Reg No. 75935',
        'Travancore Cochin Medical Council — Reg No. 74646',
        'European Society of Medical Oncology — Member ID 408023',
        'European Society of Digestive Oncology',
        'American Society of Clinical Oncology',
        'Indian Society of Neuro-Oncology',
        'Member, API, Kerala Chapter',
      ],
      languages: ['Kashmiri', 'Hindi', 'English', 'Malayalam', 'Kannada'],
      awards: [
        'Observership, Henry Ford Health System, Detroit, Michigan, USA — May 2018',
        'Second prize, Quiz — ONCOLOGY 2018, Multidisciplinary management of common cancers (28–30 September 2018)',
        'Second prize, Poster — Analysis of EGFR 18, 19 and EGFR vIII over-expression in GBM and its prognostic significance, ISNOCON 2018, AIIMS Delhi (5–8 April 2018)',
        '‘Aswath Ram Jaya Nazir’ award for securing the highest marks in Preventive and Social Medicine — 2009',
        'Certificate of Merit in Science and Social Science, HSC — CBSE 2003',
      ],
      publication:
        'Adherence to Antiemesis Guidelines in a Day Care Chemotherapy Unit: Experience from a Tertiary Care Centre — Indian Journal of Applied Research, Volume 9, Issue 12, December 2019.',
    },
  },
};

/**
 * Contact Us page copy.
 * The map panel is a deliberate placeholder: the clinic has not supplied an
 * embed agreement, so we link out to Google Maps instead of embedding one.
 */
export const contactPage = {
  label: 'Contact Us',
  title: 'We are here to help',
  intro:
    'Call, WhatsApp or visit the clinic in Alpha 2, Greater Noida. For consultations, the fastest way to reach us is by phone during clinic hours.',
  visitLabel: 'Visit the Clinic',
  callLabel: 'Call & WhatsApp',
  emailLabel: 'Email',
  hoursLabel: 'Consulting Hours',
  mapNote: 'Interactive map arrives in a later stage — use Get Directions below.',
  formHeading: 'Request a consultation',
};
