import { intro } from '../data/clinic.js';
import { useClinic } from '../lib/clinicApi.js';
import Section, { SectionIntro, Label } from './ui/Blocks.jsx';
import { RevealBlock, Parallax, StaggerGroup } from './anim/SplitReveal.jsx';
import {
  MapPin,
  PhoneCall,
  EnvelopeSimple,
  Clock,
  Heartbeat,
  CalendarCheck,
  ArrowRight,
  Quotes,
} from '@phosphor-icons/react';

/**
 * ClinicIntro — The Clinic section on the home page.
 *
 * An editorial showcase featuring:
 * 1. Centred serif heading and warm lead narrative.
 * 2. Signature circular photograph with subtle hairline ring border.
 * 3. Rich, cohesive clinical description detailing the dual disciplines of
 *    Medical Oncology and Pain & Symptom Care under one roof.
 * 4. A 6-card interactive clinic timing & contact essentials dashboard.
 *
 * Conforms strictly to DESIGN_RULES.md §1 (Mobile flow: Title → Image → Description).
 */
export default function ClinicIntro() {
  const clinic = useClinic();

  const phones = clinic.contact?.phones || [];
  const primaryTel = phones[0]?.tel || '9656917798';
  const phonesDisplay =
    phones.length > 1
      ? `${phones[0].display} · ${phones[1].display}`
      : phones[0]?.display || '+91 96569 17798';

  const hours = clinic.hours || [];
  const oncHours = hours[0] || {
    days: 'Monday to Saturday',
    time: '6:30 pm – 9:30 pm',
  };
  const painHours = hours[1] || {
    days: 'Monday to Saturday',
    time: '7:30 pm – 8:30 pm',
  };
  const sunHours = hours[2] || {
    days: 'Sunday',
    time: '10:00 am – 1:00 pm',
  };

  return (
    <Section id="about" tone="cream" spacing="normal" className="overflow-hidden">
      {/* Delicate Atmospheric Ambient Radiance */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-plum-600/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-24 h-96 w-96 rounded-full bg-teal-600/5 blur-3xl"
      />

      {/* 1. Section Opener: Label + Heading */}
      <SectionIntro label={intro.eyebrow} title={intro.heading} />

      {/* Main Content Layout */}
      {/* On mobile: Flex column with order-1 for image, order-2 for copy (DESIGN_RULES.md §1) */}
      {/* On lg: 12-column grid with copy left (lg:order-1) and image right (lg:order-2) */}
      <div className="mt-12 flex flex-col gap-10 sm:gap-14 lg:mt-16 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
        
        {/* 2. Circular Photograph (Mobile Order 1, Desktop Order 2) */}
        <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-5">
          <RevealBlock y={30}>
            <div className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-[22rem] lg:max-w-[26rem] xl:max-w-[28rem]">
              <div className="circle-mask aspect-square h-full w-full overflow-hidden rounded-full bg-cream-deep shadow-soft isolate">
                <Parallax strength={20}>
                  <img
                    src="/images/photo/doctor's_office.jpeg"
                    alt="Doctor's office and consultation room at Onco Cure Clinic in Greater Noida."
                    className="aspect-square h-full w-full rounded-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    loading="lazy"
                  />
                </Parallax>
              </div>
              <div
                aria-hidden="true"
                className="circle-mask pointer-events-none absolute -inset-3 aspect-square rounded-full border border-line sm:-inset-4"
              />
            </div>
          </RevealBlock>
        </div>

        {/* 3. Narrative, Ethos & Expanded Description (Mobile Order 2, Desktop Order 1) */}
        <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-7">
          <StaggerGroup className="space-y-6 sm:space-y-7" stagger={0.08}>
            
            {/* Lead Narrative Statement */}
            <div>
              <p className="h-serif text-xl sm:text-2xl lg:text-[1.7rem] leading-snug text-ink">
                {intro.paragraphs[0]}
              </p>
            </div>

            {/* Editorial Ethos Pullquote Card */}
            <div className="texture-crumple relative overflow-hidden rounded-2xl border border-plum-200/70 bg-paper/95 p-5 sm:p-6 shadow-xs">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-2 opacity-15"
              >
                <Quotes weight="fill" className="h-16 w-16 text-plum-800" />
              </div>
              <div className="relative z-10">
                <span className="label-sm flex items-center gap-2 font-semibold text-plum-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-plum-600" />
                  OUR CLINICAL ETHOS
                </span>
                <p className="mt-2.5 font-serif text-[1.0625rem] sm:text-[1.125rem] italic leading-relaxed text-ink">
                  “{intro.paragraphs[1]}”
                </p>
              </div>
            </div>

            {/* Expanded Editorial Clinical Narrative */}
            <div className="space-y-4 text-[0.9375rem] leading-[1.8] text-ink-70">
              <p>
                Oncology and pain care run side by side here as cohesive disciplines: <strong className="font-semibold text-ink">Dr Sahil Bambroo</strong> (M.B.B.S, MD Medicine, DM Medical Oncology) directs the complete cancer pathway from a new diagnosis, molecular evaluation, and precision therapy planning through to follow-up and long-term survivorship care.
              </p>
              <p>
                Alongside the cancer service, <strong className="font-semibold text-ink">Dr Apurva Sadhoo</strong>, Anesthesia &amp; Pain Specialist, provides dedicated clinical attention for cancer-related pain, neuropathic discomfort, and therapy side-effects — ensuring patients maintain physical comfort, dignity, and confidence through every stage of their treatment.
              </p>
              <p>
                The clinic covers the full arc of ambulatory care — in-depth consultations, second opinions, chemotherapy, immunotherapy, targeted and hormonal therapy, with nutrition guidance, caregiver counselling and palliative planning alongside — so most of what a family needs stays unhurried and close to home.
              </p>
            </div>

            {/* Story Link */}
            <div className="pt-1">
              <a
                href="/about"
                className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum-700 transition-colors hover:text-plum-900"
              >
                <span>Explore our background &amp; clinical story</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>

          </StaggerGroup>
        </div>

      </div>

      {/* 4. Clinic Essentials & Hours Dashboard */}
      <RevealBlock className="mt-10 border-t border-line/80 pt-8 sm:mt-16 sm:pt-12 lg:mt-24 lg:pt-16" y={26}>
        <div className="mb-5 flex flex-col gap-1.5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Label tone="ink">CLINIC ACCESS & HOURS</Label>
            <h3 className="h-serif mt-1 text-lg text-ink sm:mt-2 sm:text-2xl">
              Timings & Contact Essentials
            </h3>
          </div>
          <p className="text-[0.6875rem] text-ink-70 sm:text-xs sm:text-right">
            Sector Alpha 2, Greater Noida · Walk-ins & Scheduled Appointments
          </p>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {/* 1. Location */}
          <FactCard
            icon={MapPin}
            tagTone="teal"
            tag="GREATER NOIDA"
            label="Where to find us"
            value={clinic.contact?.addressSingle || 'Alpha 2, Greater Noida'}
            href={clinic.contact?.mapsUrl}
            linkLabel="Get directions"
            note="Ground floor, easy accessible entrance"
          />

          {/* 2. Phone */}
          <FactCard
            icon={PhoneCall}
            tagTone="plum"
            tag="DIRECT HELPLINE"
            label="Call the clinic"
            value={phonesDisplay}
            href={`tel:${primaryTel}`}
            linkLabel="Call now"
            note="Phone assistance during consulting hours"
          />

          {/* 3. Email */}
          <FactCard
            icon={EnvelopeSimple}
            tagTone="teal"
            tag="INQUIRIES"
            label="Write to us"
            value={clinic.contact?.email || 'oncocureclinic@gmail.com'}
            href={`mailto:${clinic.contact?.email || 'oncocureclinic@gmail.com'}`}
            linkLabel="Send an email"
            note="For non-emergency queries & report follow-ups"
          />

          {/* 4. Oncology Hours */}
          <FactCard
            icon={Clock}
            tagTone="plum"
            tag={oncHours.days}
            label="Oncology Hours"
            value={oncHours.time}
            note="Dr Sahil Bambroo · Consultations & Systemic Therapy"
          />

          {/* 5. Pain Hours */}
          <FactCard
            icon={Heartbeat}
            tagTone="teal"
            tag={painHours.days}
            label="Pain Clinic Hours"
            value={painHours.time}
            note="Dr Apurva Sadhoo · Pain Evaluation & Relief"
          />

          {/* 6. Sunday Session */}
          <FactCard
            icon={CalendarCheck}
            tagTone="plum"
            tag={sunHours.days}
            label="Sunday Session"
            value={sunHours.time}
            note="Scheduled consultations & second-opinion reviews"
          />
        </div>
      </RevealBlock>
    </Section>
  );
}

/**
 * FactCard — Tactile archival card for schedule and contact details.
 */
function FactCard({
  icon: Icon,
  tag,
  tagTone = 'plum',
  label,
  value,
  note,
  href,
  linkLabel,
}) {
  const iconColors = {
    plum: 'bg-plum-100/80 text-plum-700',
    teal: 'bg-teal-100/80 text-teal-800',
  };
  const tagColors = {
    plum: 'bg-plum-50/80 text-plum-800 border-plum-200/60',
    teal: 'bg-teal-50/80 text-teal-800 border-teal-200/60',
  };

  return (
    <div className="texture-crumple group relative flex flex-col justify-between rounded-xl border border-line/80 bg-paper/90 p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-plum-300 hover:shadow-soft sm:rounded-2xl sm:p-5">
      <div>
        <div className="flex items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-0">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${iconColors[tagTone] || iconColors.plum}`}
            >
              <Icon weight="duotone" className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h4 className="label font-semibold text-ink-45 sm:hidden">{label}</h4>
          </div>
          {tag ? (
            <span
              className={`label-sm rounded-full border px-2 py-0.5 text-[0.625rem] sm:px-2.5 sm:text-xs ${tagColors[tagTone] || tagColors.plum}`}
            >
              {tag}
            </span>
          ) : null}
        </div>

        <h4 className="label mt-3 hidden font-semibold text-ink-45 sm:block">{label}</h4>
        <p className="mt-1 text-xs font-semibold leading-snug text-ink sm:mt-1.5 sm:text-[0.9375rem] sm:leading-relaxed">
          {value}
        </p>
        {note ? (
          <p className="mt-1 text-[0.6875rem] leading-normal text-ink-70 sm:mt-1.5 sm:text-xs">
            {note}
          </p>
        ) : null}
      </div>

      {href ? (
        <div className="mt-2.5 border-t border-line/60 pt-2 sm:mt-5 sm:pt-3">
          <a
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
            className="group/link inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-plum-700 transition-colors hover:text-plum-900 sm:text-xs"
          >
            <span>{linkLabel}</span>
            <ArrowRight className="h-2.5 w-2.5 transition-transform duration-200 group-hover/link:translate-x-1 sm:h-3 sm:w-3" />
          </a>
        </div>
      ) : null}
    </div>
  );
}
