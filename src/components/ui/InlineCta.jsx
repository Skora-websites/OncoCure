import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { RevealBlock } from '../anim/SplitReveal.jsx';

/**
 * Mini feature icons for the reassurance pills.
 * Crisp hairline line-art, scaled for compact pill badges.
 */
const featureGlyphs = {
  chat: (
    <>
      <path d="M19.5 11.7c0 3.2-3.3 5.8-7.4 5.8-.9 0-1.7-.1-2.4-.3l-3.6 1.7 1.1-2.8c-1.4-1-2.2-2.6-2.2-4.4 0-3.2 3.3-5.8 7.4-5.8s7.1 2.6 7.1 5.8Z" />
      <circle cx="9" cy="11.7" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12.4" cy="11.7" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="11.7" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  file: (
    <>
      <path d="M7.2 3.8h6L17.8 8v12.2H7.2z" />
      <path d="M13.2 3.8V8h4.6" />
      <path d="M9.6 12.4h5.4M9.6 15.4h5.4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.4 5.6 5.8v5.2c0 3.9 2.6 7 6.4 8.2 3.8-1.2 6.4-4.3 6.4-8.2V5.8L12 3.4Z" />
      <path d="m9.2 11.7 2.1 2.1 4-4.2" />
    </>
  ),
};

function FeatureGlyph({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      {featureGlyphs[name] ?? featureGlyphs.chat}
    </svg>
  );
}

/**
 * InlineCta — a self-contained trackfield / racetrack stadium card that can be
 * embedded inside any page or section.
 *
 * Left: compact glowing status pill, chic two-tone display headline, concise
 * guidance copy, and a single horizontal row of attractive interactive feature
 * pills.
 *
 * Right: circular photograph encircled by synchronized counter-rotating orbit
 * rings, radar pulse rings, and the magnetic "Book an Appointment" disc.
 */
export default function InlineCta({
  label = 'Take the Next Step',
  title = 'Have questions',
  titleContinuation = 'about',
  accent = 'your care?',
  description = 'Speak with our team about your diagnosis, treatment options, or a second opinion.',
  href = '#contact',
  onAction = null,
  linkLabel = 'Book an Appointment',
  image = '/images/photo/care-hands.jpg',
  imageAlt = 'A calm detail photographed for the care band.',
  tone = 'paper',
  className = '',
  features = [
    { id: 'guidance', icon: 'chat', text: 'Get expert guidance' },
    { id: 'options', icon: 'file', text: 'Discuss treatment options' },
    { id: 'concerns', icon: 'shield', text: 'Clarify your concerns' },
  ],
}) {
  const outerRingRef = useRef(null);
  const innerRingRef = useRef(null);

  // Synchronized counter-rotating orbit rings
  useEffect(() => {
    const outer = outerRingRef.current;
    const inner = innerRingRef.current;
    if (!outer || !inner) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const master = gsap.timeline({ repeat: -1 });
    master.to(outer, { rotation: 360, duration: 32, ease: 'none' }, 0);
    master.to(inner, { rotation: -360, duration: 32, ease: 'none' }, 0);

    return () => {
      master.kill();
      gsap.set([outer, inner], { clearProps: 'rotation,transform' });
    };
  }, []);

  const tones = {
    paper: 'bg-paper',
    cream: 'bg-cream',
    lavender: 'bg-lavender',
    mist: 'bg-mist',
  };

  const hasQuestionMark = accent.endsWith('?');
  const accentText = hasQuestionMark ? accent.slice(0, -1) : accent;

  return (
    <aside
      className={`relative mx-auto w-full max-w-6xl ${className}`}
      aria-labelledby="inline-cta-heading"
    >
      {/* The Trackfield Stadium Card with generous padding */}
      <div
        className={`texture-crumple relative w-full overflow-hidden rounded-[2.5rem] sm:rounded-[3.25rem] lg:rounded-full border border-line ${
          tones[tone] ?? tones.paper
        } px-5 py-9 sm:px-12 sm:py-12 lg:px-18 lg:py-12 shadow-soft transition-all duration-500 hover:shadow-xl hover:border-plum-300/80`}
      >
        {/* Subtle Ambient Glow Orbs inside the Trackfield Card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-plum-500/10 blur-3xl animate-pulse-glow"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl animate-pulse-glow"
          style={{ animationDelay: '3s' }}
        />

        {/* Interior Row Layout with generous spacing */}
        <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_19.5rem] lg:gap-14">
          
          {/* Left: Compact, Chic Editorial Copy + Horizontal Feature Pills */}
          <div className="text-center lg:text-left">
            {/* Live Status Pill */}
            <RevealBlock y={12}>
              <div className="inline-flex items-center gap-2 rounded-full border border-plum-300/70 bg-plum-50/90 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-plum-900 shadow-2xs backdrop-blur-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-plum-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-plum-600" />
                </span>
                <span>{label}</span>
              </div>
            </RevealBlock>

            {/* Display Heading — Crisp, Punchy & Expressive with non-clipped ? */}
            <RevealBlock delay={0.06} y={14}>
              <h2
                id="inline-cta-heading"
                className="mt-2 font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] font-normal leading-[1.1] tracking-tight text-ink"
              >
                {title}{' '}
                <span className="font-serif italic font-light text-ink-70">
                  {titleContinuation}
                </span>{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-plum-700 via-plum-600 to-teal-700 bg-clip-text text-transparent font-serif italic pr-0.5 inline-block">
                    {accentText}
                  </span>
                  {hasQuestionMark && (
                    <span className="font-serif italic text-teal-700 inline-block pr-2.5">
                      ?
                    </span>
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-plum-500 via-teal-500 to-transparent"
                  />
                </span>
              </h2>
            </RevealBlock>

            {/* Concise Narrative */}
            <RevealBlock delay={0.1} y={12}>
              <p className="mx-auto mt-2 max-w-lg text-[0.875rem] leading-[1.6] text-ink-70 sm:text-[0.9375rem] lg:mx-0">
                {description}
              </p>
            </RevealBlock>

            {/* Compact, Highly Attractive Feature Pills (Horizontal Row) */}
            <RevealBlock delay={0.15} y={12}>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 lg:justify-start">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="group/pill inline-flex items-center gap-2 rounded-full border border-line/80 bg-paper/95 px-3 py-1.5 shadow-2xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-plum-400 hover:bg-white hover:shadow-xs"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lavender to-plum-100 text-plum-700 shadow-2xs transition-transform duration-300 group-hover/pill:scale-110 group-hover/pill:rotate-6">
                      <FeatureGlyph name={feature.icon} />
                    </span>
                    <span className="text-[12px] font-semibold text-ink transition-colors group-hover/pill:text-plum-950">
                      {feature.text}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-teal-500/70 transition-transform duration-300 group-hover/pill:scale-150"
                    />
                  </div>
                ))}
              </div>
            </RevealBlock>
          </div>

          {/* Right: Visual Centerpiece with Dual Orbit Rings & Action Disc */}
          <div className="relative mx-auto w-full max-w-[14.5rem] sm:max-w-[17rem] lg:mr-0 lg:max-w-none lg:justify-self-end">
            
            {/* Outer Plum Orbit Ring (Clockwise) */}
            <div
              ref={outerRingRef}
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 z-10 rounded-full border border-plum-500/35 sm:-inset-7"
            >
              <span className="absolute left-1/2 top-[-0.5px] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-plum-600 shadow-[0_0_8px_rgba(122,51,153,0.5)]" />
            </div>

            {/* Inner Teal Orbit Ring (Counter-Clockwise) */}
            <div
              ref={innerRingRef}
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 z-10 rounded-full border border-teal-500/35 sm:-inset-3.5"
            >
              <span className="absolute left-1/2 bottom-[-0.5px] h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-teal-600 shadow-[0_0_8px_rgba(0,86,84,0.5)]" />
            </div>

            {/* Circular Photo Frame with Hover Zoom & Subtle Vignette */}
            <div className="circle-mask group relative aspect-square w-full overflow-hidden bg-cream-deep shadow-soft ring-2 ring-white/60">
              <img
                src={image}
                alt={imageAlt}
                draggable="false"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-teal-950/25 via-transparent to-plum-900/10"
              />
            </div>

            {/* Floating Glass Reassurance Badge */}
            <div
              aria-hidden="true"
              className="absolute -bottom-2 -right-1 z-30 flex items-center gap-1.5 rounded-full border border-white/70 bg-paper/95 px-3 py-1 shadow-soft backdrop-blur-md animate-float-gentle"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-600" />
              </span>
              <span className="text-[10px] font-semibold text-ink">OPD & Tele-Consult</span>
            </div>

            {/* Magnetic Eye-Catching Floating Action Disc */}
            <div className="absolute -top-4 left-1/2 z-30 -translate-x-1/2 sm:-top-5 lg:left-0 lg:top-3 lg:-translate-x-1/3">
              {/* Radar Wave Pulses behind the disc */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 rounded-full border border-teal-500/50 animate-radar"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 rounded-full border border-teal-400/25 animate-radar"
                style={{ animationDelay: '0.9s' }}
              />

              {onAction ? (
                <button
                  type="button"
                  onClick={onAction}
                  className="group relative flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center gap-1 overflow-hidden rounded-full bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 text-cream shadow-[0_10px_25px_rgba(0,86,84,0.35)] transition-all duration-500 hover:scale-108 hover:shadow-[0_16px_36px_rgba(0,86,84,0.55)] active:scale-95"
                  aria-label={linkLabel}
                >
                  {/* Diagonal shimmer sweep */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"
                  />

                  <span className="relative z-10 text-[9px] text-teal-200">✦</span>
                  <span className="relative z-10 text-[0.58rem] font-bold uppercase leading-tight tracking-[0.22em] text-center sm:text-[0.65rem]">
                    Book an
                    <br />
                    Appointment
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="relative z-10 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              ) : (
                <a
                  href={href}
                  className="group relative flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center gap-1 overflow-hidden rounded-full bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 text-cream shadow-[0_10px_25px_rgba(0,86,84,0.35)] transition-all duration-500 hover:scale-108 hover:shadow-[0_16px_36px_rgba(0,86,84,0.55)] active:scale-95"
                  aria-label={linkLabel}
                >
                  {/* Diagonal shimmer sweep */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"
                  />

                  <span className="relative z-10 text-[9px] text-teal-200">✦</span>
                  <span className="relative z-10 text-[0.58rem] font-bold uppercase leading-tight tracking-[0.22em] text-center sm:text-[0.65rem]">
                    Book an
                    <br />
                    Appointment
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="relative z-10 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
