import { closing, cta } from '../data/clinic.js';
import { useClinic } from '../lib/clinicApi.js';
import Section from './ui/Blocks.jsx';
import { RevealBlock } from './anim/SplitReveal.jsx';
import CircleBadge from './anim/CircleBadge.jsx';
import { openConsult } from '../lib/consultBus.js';

/**
 * ClosingCta — an architected, high-impact sanctuary card that closes the page
 * with emotional warmth, clear clinical reassurance, and compelling interactive animations.
 */
export default function ClosingCta() {
  const clinic = useClinic();
  const primaryPhone = clinic.contact.phones?.[0]?.tel || clinic.contact.primaryPhone || '+919656917798';
  const displayPhone = clinic.contact.phones?.[0]?.display || clinic.contact.primaryPhone || '+91 96569 17798';
  const whatsappDigits = (clinic.contact.whatsapp || '919656917798').replace(/\D/g, '');

  return (
    <Section id="contact" tone="cream" spacing="tall">
      <div className="relative mx-auto max-w-5xl">
        {/* Architectural Sanctuary Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-plum-900/15 bg-gradient-to-b from-paper via-paper to-cream-deep/80 p-7 shadow-soft sm:rounded-[3.25rem] sm:p-12 lg:p-16 text-center">
          
          {/* Ambient Glowing Atmosphere Orbs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-plum-500/15 blur-3xl animate-pulse-glow"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl animate-pulse-glow"
            style={{ animationDelay: '2.5s' }}
          />

          {/* Delicate Concentric Celestial Watermark Rings */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-plum-900/5 sm:h-[36rem] sm:w-[36rem]"
          >
            <div className="absolute inset-8 rounded-full border border-teal-800/5" />
            <div className="absolute inset-20 rounded-full border border-plum-900/5" />
          </div>

          {/* Header & Interactive Rotating Badge */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Spinning Circle Badge with subtle radiant aura */}
            <RevealBlock y={20} className="relative flex justify-center">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-3 rounded-full bg-gradient-to-tr from-plum-500/15 to-teal-500/15 blur-md"
                />
                <CircleBadge
                  text="CALL · WHATSAPP · GREATER NOIDA · "
                  href={`tel:${primaryPhone}`}
                  ariaLabel={`Call the clinic on ${displayPhone}`}
                  size={116}
                  duration={24}
                  tone="light"
                />
              </div>
            </RevealBlock>

            {/* Live Status indicator pill */}
            <RevealBlock delay={0.08} y={15} className="mt-7">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-teal-700/25 bg-teal-50/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal-900 shadow-2xs backdrop-blur-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600" />
                </span>
                <span>Prioritised Care · Same-Week Consultations</span>
              </div>
            </RevealBlock>

            {/* Eyebrow Label */}
            <RevealBlock delay={0.12} y={15} className="mt-5">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-plum-700">
                {closing.eyebrow}
              </span>
            </RevealBlock>

            {/* Display Title */}
            <RevealBlock delay={0.16} y={20}>
              <h2 className="mt-3 font-serif text-[clamp(2.2rem,5vw,3.8rem)] font-normal leading-[1.08] tracking-tight text-ink max-w-3xl">
                Let’s talk about what{' '}
                <span className="relative inline-block bg-gradient-to-r from-plum-800 via-plum-600 to-teal-700 bg-clip-text text-transparent font-serif italic">
                  comes next
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-plum-500 via-teal-500 to-transparent"
                  />
                </span>
              </h2>
            </RevealBlock>

            {/* Narrative Body */}
            <RevealBlock delay={0.2} y={15}>
              <p className="mx-auto mt-5 max-w-2xl text-[0.9375rem] leading-[1.75] text-ink-70 sm:text-base">
                {closing.body}
              </p>
            </RevealBlock>

            {/* High-Impact Animated Action Row */}
            <RevealBlock
              delay={0.25}
              y={20}
              className="mt-9 flex w-full flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4"
            >
              {/* Primary Consultation Trigger (Glow + Shimmer Beam) */}
              <button
                type="button"
                onClick={openConsult}
                className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-plum-800 via-plum-700 to-plum-900 px-9 py-4.5 text-xs font-bold uppercase tracking-[0.2em] text-cream shadow-[0_10px_25px_rgba(74,20,112,0.28)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_16px_36px_rgba(74,20,112,0.42)] active:scale-95"
              >
                {/* Sweeping Shimmer Beam */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"
                />

                <span className="relative z-10 flex items-center gap-2.5">
                  <svg
                    className="h-4 w-4 text-plum-200 transition-transform duration-300 group-hover:rotate-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {cta.booking}
                </span>
                <span
                  aria-hidden="true"
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </button>

              {/* Direct Phone Call Button */}
              <a
                href={`tel:${primaryPhone}`}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full border border-ink/20 bg-paper/90 px-8 py-4.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink shadow-2xs backdrop-blur-xs transition-all duration-500 hover:border-ink hover:bg-ink hover:text-cream hover:shadow-md active:scale-95"
              >
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{cta.call}</span>
              </a>

              {/* Direct WhatsApp Quick Chat */}
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full border border-teal-700/25 bg-teal-50/70 px-7 py-4.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-900 transition-all duration-500 hover:border-teal-700 hover:bg-teal-800 hover:text-cream hover:shadow-md active:scale-95"
              >
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.053-1.026-.073-.243-.078-.557-.189-.958-.363-1.684-.73-2.775-2.472-2.859-2.585-.084-.112-.685-.912-.685-1.739 0-.828.431-1.233.585-1.401.154-.168.337-.21.45-.21.112 0 .225.002.323.007.104.005.244-.04.382.292.144.346.491 1.2.534 1.287.043.088.072.19.014.305-.058.115-.087.187-.173.288-.087.101-.183.226-.262.304-.087.086-.177.18-.076.354.101.174.449.741.963 1.199.662.59 1.221.774 1.394.86.174.086.275.072.376-.044.102-.115.434-.506.549-.679.116-.173.232-.144.389-.086.158.058 1.001.472 1.174.558.173.086.289.13.332.202.043.072.043.418-.101.823z" />
                </svg>
                <span>{cta.whatsapp}</span>
              </a>
            </RevealBlock>

            {/* Trust Proof Reassurance Micro-Grid */}
            <RevealBlock delay={0.3} y={20} className="w-full">
              <div className="mt-12 grid grid-cols-1 gap-4 border-t border-line/70 pt-8 sm:grid-cols-3 sm:gap-6 text-left sm:text-center">
                <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-plum-100 text-plum-700">
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-bold text-ink">Thorough Report Review</p>
                    <p className="text-[11px] text-ink-70">Complete review of prior scans & tests</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-bold text-ink">Senior Oncologist Direct</p>
                    <p className="text-[11px] text-ink-70">DM Medical Oncology leadership</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-plum-100 text-plum-700">
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-bold text-ink">Unhurried Time</p>
                    <p className="text-[11px] text-ink-70">Dedicated space for patient & family</p>
                  </div>
                </div>
              </div>
            </RevealBlock>

            {/* Preparation Note */}
            <RevealBlock delay={0.34} y={15} className="mt-6">
              <p className="text-xs text-ink-45">
                {closing.note}
              </p>
            </RevealBlock>
          </div>
        </div>
      </div>
    </Section>
  );
}
