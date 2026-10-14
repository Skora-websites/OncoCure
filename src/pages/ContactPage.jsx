import { useEffect, useState } from 'react';
import { contactPage, consult, cta } from '../data/clinic.js';
import { useClinic } from '../lib/clinicApi.js';
import PageHero from '../components/ui/PageHero.jsx';
import ContactForm from '../components/ui/ContactForm.jsx';
import ConsultationForm from '../components/ui/ConsultationForm.jsx';
import { useSeo } from '../lib/seo.js';
import {
  MapPin,
  PhoneCall,
  EnvelopeSimple,
  Clock,
  WhatsappLogo,
  ArrowUpRight,
  ShieldCheck,
  NavigationArrow,
} from '@phosphor-icons/react';

/**
 * ContactPage — Contact & Appointments page (#/contact).
 *
 * Precision editorial layout:
 * - Left column: Reduced width (lg:col-span-4), compact heightwise with two streamlined cards
 *   (Direct Contact Channels + Operating Hours).
 * - Right column: Expanded width (lg:col-span-8) with increased height (h-full) so the two left cards
 *   fit flush and perfectly beside it.
 * - Full-width interactive Map & Arrival Guide beneath the 2-column grid.
 */
export default function ContactPage() {
  const clinic = useClinic();
  const [formMode, setFormMode] = useState('contact'); // 'contact' | 'consultation'

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useSeo({
    title: `Contact & Appointments — ${clinic.name}`,
    description:
      'Get in touch with Onco Cure Clinic in Greater Noida. Schedule a first consultation or second opinion with medical oncologist Dr. Sahil Bambroo.',
    path: '/contact',
    image: '/images/photo/consult-care.jpg',
  });

  const phones = clinic.contact?.phones || [];
  const whatsappDigits = (clinic.contact?.whatsapp || '919656917798').replace(/\D/g, '');
  const email = clinic.contact?.email || 'oncocureclinic@gmail.com';
  const addressLines = clinic.contact?.addressLines || [
    'A-08, Upper Ground Floor',
    'Omaxe India Trade Centre',
    'Alpha 2, Greater Noida',
  ];
  const mapsUrl = clinic.contact?.mapsUrl || 'https://maps.app.goo.gl/rSbwSjq1cgw98RBg7';
  const hours = clinic.hours || [];

  return (
    <>
      {/* 1. Page Hero: Clean rhythm without unnecessary 100vh void on mobile */}
      <PageHero
        label={contactPage.label}
        title={contactPage.title}
        description={contactPage.intro}
        className="!min-h-0 !pt-28 !pb-12 sm:!pt-36 sm:!pb-16"
      />

      {/* 2. Main Content Section */}
      <section className="relative overflow-hidden border-t border-line bg-paper py-14 sm:py-18 lg:py-24">
        {/* Soft Ambient Radiance in Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-20 h-96 w-96 rounded-full bg-plum-600/5 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 bottom-20 h-96 w-96 rounded-full bg-teal-600/5 blur-3xl"
        />

        <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
          
          {/* Flush 2-Column Split: Compact Left Column (4 cols) & Full-Height Form Card (8 cols) */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-8 xl:gap-10">
                     {/* Left Column: Well-Proportioned Contact & Timings Cards (5 cols) */}
            <div className="flex flex-col justify-between gap-5 sm:gap-6 lg:col-span-5 xl:col-span-5">
              
              {/* Card 1: Direct Contact Channels & Location */}
              <div className="texture-crumple relative overflow-hidden rounded-2xl border border-line/80 bg-cream/95 p-6 sm:p-7 shadow-xs">
                {/* Subtle Top Accent Hairline */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-700 via-teal-600 to-transparent"
                />

                {/* Where to find us */}
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100/80 text-teal-800">
                      <MapPin weight="duotone" className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="label-sm font-semibold text-teal-800 text-[10.5px]">
                        CLINIC LOCATION
                      </span>
                      <h3 className="font-serif text-[1.0625rem] font-normal text-ink">
                        {contactPage.visitLabel}
                      </h3>
                    </div>
                  </div>

                  <address className="mt-3 font-serif text-[1.1rem] leading-[1.45] text-ink not-italic">
                    {addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>

                  <div className="mt-2.5">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-800 transition-colors hover:text-teal-950"
                    >
                      <span>{cta.map}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-line/60" />

                {/* Direct Phone & WhatsApp */}
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-plum-100/80 text-plum-700">
                      <PhoneCall weight="duotone" className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="label-sm font-semibold text-plum-700 text-[10.5px]">
                        PHONE &amp; WHATSAPP
                      </span>
                      <h3 className="font-serif text-[1.0625rem] font-normal text-ink">
                        {contactPage.callLabel}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {phones.map((p) => (
                      <a
                        key={p.label}
                        href={`tel:${p.tel}`}
                        className="group flex items-center justify-between rounded-xl border border-line/70 bg-paper/85 px-3.5 py-2 text-xs sm:text-[0.8125rem] font-semibold text-ink transition-all hover:border-plum-300 hover:bg-white hover:text-plum-800"
                      >
                        <span>{p.display}</span>
                        <span className="text-[11px] text-ink-45 group-hover:text-plum-700 font-mono">
                          Call &rarr;
                        </span>
                      </a>
                    ))}

                    <a
                      href={`https://wa.me/${whatsappDigits}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center justify-between rounded-xl border border-emerald-200/90 bg-emerald-50/70 px-3.5 py-2 text-xs sm:text-[0.8125rem] font-semibold text-emerald-900 transition-all hover:bg-emerald-100 hover:border-emerald-300"
                    >
                      <span className="flex items-center gap-2">
                        <WhatsappLogo weight="fill" className="h-4 w-4 text-emerald-600" />
                        <span>Chat on WhatsApp</span>
                      </span>
                      <span className="text-[11px] text-emerald-700 font-mono">&rarr;</span>
                    </a>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-line/60" />

                {/* Email Correspondence */}
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100/80 text-teal-800">
                      <EnvelopeSimple weight="duotone" className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="label-sm font-semibold text-teal-800 text-[10.5px]">
                        EMAIL DESK
                      </span>
                      <h3 className="font-serif text-[1.0625rem] font-normal text-ink">
                        {contactPage.emailLabel}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <a
                      href={`mailto:${email}`}
                      className="inline-block break-all text-xs sm:text-sm font-medium text-ink transition-colors hover:text-teal-800"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2: Operating Hours */}
              <div className="texture-crumple relative overflow-hidden rounded-2xl border border-line/80 bg-cream/95 p-6 sm:p-7 shadow-xs">
                {/* Subtle Top Accent Hairline */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-plum-600 via-plum-500 to-transparent"
                />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-plum-100/80 text-plum-700">
                      <Clock weight="duotone" className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="label-sm font-semibold text-plum-700 text-[10.5px]">
                        OPERATING HOURS
                      </span>
                      <h3 className="font-serif text-[1.0625rem] font-normal text-ink">
                        {contactPage.hoursLabel}
                      </h3>
                    </div>
                  </div>
                  <span className="label-sm px-2.5 py-0.5 rounded-full bg-plum-100 text-plum-800 text-[10px] font-semibold">
                    MON – SUN
                  </span>
                </div>

                <dl className="mt-4 space-y-2.5">
                  {hours.map((h, idx) => {
                    const tagTone =
                      h.id === 'oncology'
                        ? 'border-plum-200/80 bg-plum-50/80 text-plum-800'
                        : h.id === 'pain'
                        ? 'border-teal-200/80 bg-teal-50/80 text-teal-800'
                        : 'border-amber-200/80 bg-amber-50/80 text-amber-800';

                    return (
                      <div
                        key={h.id || idx}
                        className="rounded-xl border border-line/60 bg-paper/65 px-3.5 py-2.5 transition-colors hover:bg-white"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <dt className="font-serif text-[0.9375rem] font-normal text-ink">
                            {h.label}
                          </dt>
                          <span
                            className={`label-sm rounded-full border px-2 py-0.5 text-[9.5px] ${tagTone}`}
                          >
                            {h.days}
                          </span>
                        </div>
                        <dd className="mt-0.5 text-xs font-medium text-ink-70">
                          {h.time}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>

            </div>

            {/* Right Column: Rebalanced Form Width (7 cols) */}
            <div className="flex flex-col lg:col-span-7 xl:col-span-7">
              <div className="h-full flex flex-col justify-between texture-crumple relative overflow-hidden rounded-2xl border border-line/80 bg-cream/95 p-6 sm:p-8 lg:p-9 xl:p-10 shadow-soft">
                {/* Subtle Top Accent Hairline with Brand Gradient */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-plum-700 via-teal-600 to-transparent"
                />

                {/* Mode Switcher Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-line/70 pb-4">
                  <button
                    type="button"
                    onClick={() => setFormMode('contact')}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
                      formMode === 'contact'
                        ? 'bg-plum-800 text-cream shadow-xs'
                        : 'border border-line bg-paper/70 text-ink-70 hover:border-plum-300 hover:text-ink'
                    }`}
                  >
                    <EnvelopeSimple weight="bold" className="h-3.5 w-3.5" />
                    <span>Send a Message</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormMode('consultation')}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
                      formMode === 'consultation'
                        ? 'bg-teal-800 text-cream shadow-xs'
                        : 'border border-line bg-paper/70 text-ink-70 hover:border-teal-300 hover:text-ink'
                    }`}
                  >
                    <Clock weight="bold" className="h-3.5 w-3.5" />
                    <span>Book Consultation</span>
                  </button>
                </div>

                {/* Form Header */}
                <div className="border-b border-line/70 py-4 sm:py-5">
                  {formMode === 'contact' ? (
                    <>
                      <span className="label-sm inline-flex items-center gap-2 font-semibold text-plum-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-plum-600 animate-pulse" />
                        GENERAL &amp; PATIENT INQUIRY DESK
                      </span>
                      <h2 className="h-serif mt-2 text-[clamp(1.75rem,3.2vw,2.35rem)] leading-[1.12] text-ink">
                        Send us a message
                      </h2>
                      <p className="mt-2 max-w-2xl text-[0.9375rem] leading-[1.7] text-ink-70">
                        Have a question about cancer care, reports review, second opinions, or clinic timings? Fill in the details below and our administrative desk will respond to you promptly.
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="label-sm inline-flex items-center gap-2 font-semibold text-teal-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse" />
                        APPOINTMENT &amp; SECOND OPINION DESK
                      </span>
                      <h2 className="h-serif mt-2 text-[clamp(1.75rem,3.2vw,2.35rem)] leading-[1.12] text-ink">
                        Request a clinical consultation
                      </h2>
                      <p className="mt-2 max-w-2xl text-[0.9375rem] leading-[1.7] text-ink-70">
                        Share your preferred consultation details and our clinic team will contact you back to confirm your appointment slot with Dr. Sahil Bambroo or Dr. Apurva Sadhoo.
                      </p>
                    </>
                  )}
                </div>

                {/* The Form */}
                <div className="grow py-5 sm:py-6">
                  {formMode === 'contact' ? <ContactForm /> : <ConsultationForm />}
                </div>

                {/* Reassurance Chips at Base */}
                <div className="border-t border-line/60 pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-70">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <ShieldCheck weight="duotone" className="h-4 w-4 text-teal-700" />
                      <span>Confidential Clinical Review</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Clock weight="duotone" className="h-4 w-4 text-plum-700" />
                      <span>Same-Week Appointments</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <PhoneCall weight="duotone" className="h-4 w-4 text-teal-700" />
                      <span>Direct Doctor Callback</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 3. Full-Width Interactive Google Map & Arrival Guide */}
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <div className="relative overflow-hidden rounded-2xl border border-line/80 bg-cream/95 shadow-soft">
              {/* Top Bar with Location Status */}
              <div className="flex flex-col gap-3 border-b border-line/80 px-6 py-5 bg-paper/90 backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600" />
                    </span>
                    <span className="label-sm font-semibold text-teal-800">
                      ACCESSIBLE LOCATION · GREATER NOIDA
                    </span>
                  </div>
                  <h3 className="h-serif text-xl sm:text-2xl text-ink mt-1">
                    Find Us at Omaxe India Trade Centre
                  </h3>
                  <p className="text-xs text-ink-70 mt-0.5">
                    Sector Alpha 2 · Ground-floor access, dedicated parking &amp; close to Alpha 1 Metro
                  </p>
                </div>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-teal-800 bg-teal-800 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-cream transition-all duration-300 hover:bg-teal-900 hover:shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              {/* Map Viewport */}
              <div className="relative h-[22rem] w-full sm:h-[26rem] bg-cream-deep">
                <iframe
                  title="Onco Cure Clinic Greater Noida Location"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    clinic.contact?.addressSingle || 'Omaxe India Trade Centre, Alpha 2, Greater Noida'
                  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen=""
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Floating Directions Badge on Desktop */}
                <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden sm:block">
                  <div className="pointer-events-auto rounded-xl border border-line/90 bg-cream/95 p-4 shadow-soft backdrop-blur-md max-w-sm text-xs">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                        <NavigationArrow weight="duotone" className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-ink text-[0.9375rem]">{clinic.name}</p>
                        <p className="text-ink-70 mt-0.5 leading-relaxed text-[11px]">
                          {clinic.contact?.addressSingle}
                        </p>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-2.5 inline-flex items-center gap-1 font-semibold text-teal-800 hover:text-teal-950 transition-colors"
                        >
                          <span>Get Turn-by-Turn Driving Directions</span>
                          <span>&rarr;</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
