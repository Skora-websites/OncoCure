import { useEffect, useRef } from 'react';
import { reasons } from '../data/clinic.js';
import Section, { SectionIntro } from './ui/Blocks.jsx';
import { gsap, ScrollTrigger } from './anim/SplitReveal.jsx';

/**
 * Compact editorial metadata for each milestone on the clinical timeline.
 */
const TIMELINE_METADATA = {
  'consultant-led': {
    phase: '01',
    stage: 'Clinical Leadership',
    badge: 'Senior Medical Leadership',
    tone: 'plum',
    roman: 'I',
    pillars: ['DM Medical Oncology', 'Direct Doctor Access', 'Evidence-Based'],
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3" />
        <path d="M9 12.5v3.5a4 4 0 0 0 4 4h1a4 4 0 0 0 4-4v-1.5" />
        <circle cx="18" cy="13" r="2" />
        <path d="M3 3h3M12 3h3" />
      </svg>
    ),
  },
  'personalised': {
    phase: '02',
    stage: 'Diagnostic Staging',
    badge: 'Precision Oncology',
    tone: 'teal',
    roman: 'II',
    pillars: ['Molecular Staging', 'Individualized Regimens', 'Patient Priorities'],
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </svg>
    ),
  },
  'multidisciplinary': {
    phase: '03',
    stage: 'Collaborative Consensus',
    badge: 'Integrated Hospital Links',
    tone: 'plum',
    roman: 'III',
    pillars: ['Surgical Oncology Sync', 'Radiation Coordination', 'Comprehensive Review'],
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="12" cy="18" r="3" />
        <path d="M8.5 7.5l7 0M7.5 8.5l3 7M16.5 8.5l-3 7" />
      </svg>
    ),
  },
  'whole-person': {
    phase: '04',
    stage: 'Holistic Continuum',
    badge: 'Full Care Continuum',
    tone: 'teal',
    roman: 'IV',
    pillars: ['Pain Clinic Integration', 'Caregiver Support', 'Survivorship Planning'],
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        <path d="M12 7.5v4M10 9.5h4" />
      </svg>
    ),
  },
};

export default function WhyUs() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const line = lineRef.current;
    const items = container.querySelectorAll('[data-timeline-item]');

    // Refresh ScrollTrigger to ensure accurate trigger geometry
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      // 1. Dynamic scrub line that draws down as the user scrolls through the container
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top 75%',
              end: 'bottom 85%',
              scrub: 0.3,
            },
          }
        );
      }
    }, container);

    // 2. Native IntersectionObserver guarantees each milestone animates exactly when scrolled into view
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const item = entry.target;
          const content = item.querySelector('[data-timeline-content]');
          const node = item.querySelector('[data-timeline-node]');
          const pills = item.querySelectorAll('[data-timeline-pill]');
          const index = parseInt(item.getAttribute('data-index') || '0', 10);
          const isLeft = index % 2 === 0;

          // Milestone node entrance with spring pop
          if (node) {
            gsap.fromTo(
              node,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: 'back.out(2)',
              }
            );
          }

          // Content card slide-in
          if (content) {
            gsap.fromTo(
              content,
              {
                opacity: 0,
                x: window.innerWidth >= 1024 ? (isLeft ? -35 : 35) : 25,
              },
              {
                opacity: 1,
                x: 0,
                duration: 0.75,
                delay: 0.08,
                ease: 'power3.out',
              }
            );
          }

          // Staggered commitment pills
          if (pills && pills.length > 0) {
            gsap.fromTo(
              pills,
              { opacity: 0, y: 8 },
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
                stagger: 0.06,
                delay: 0.22,
                ease: 'power2.out',
              }
            );
          }

          io.unobserve(item);
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    items.forEach((item) => io.observe(item));

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <Section id="why" tone="cream" spacing="normal">
      <SectionIntro
        label="Why Onco Cure Clinic"
        title="A small clinic, on purpose"
        intro="We keep our focus narrow so we can give each patient the attention they actually need."
      />

      {/* Compact Vertical Timeline Wrapper (No Cards) */}
      <div
        ref={containerRef}
        className="relative mx-auto mt-12 max-w-4xl lg:mt-16"
      >
        {/* Continuous Background Timeline Track */}
        <div
          aria-hidden="true"
          className="absolute left-4 top-3 bottom-5 w-[2px] -translate-x-1/2 bg-line/80 sm:left-6 lg:left-1/2"
        />

        {/* Dynamic On-Scroll Active Gradient Line (drawn smoothly by GSAP scrub) */}
        <div
          ref={lineRef}
          aria-hidden="true"
          style={{ transformOrigin: 'top center' }}
          className="absolute left-4 top-3 bottom-5 w-[2px] -translate-x-1/2 origin-top bg-gradient-to-b from-plum-600 via-teal-700 to-plum-700 shadow-[0_0_8px_rgba(122,51,153,0.3)] sm:left-6 lg:left-1/2"
        />

        {/* Timeline Items — Compact Spacing */}
        <div className="space-y-8 sm:space-y-10 lg:space-y-12">
          {reasons.map((reason, index) => {
            const meta = TIMELINE_METADATA[reason.id] || {
              phase: String(index + 1).padStart(2, '0'),
              stage: 'Clinical Pathway',
              badge: 'Care Quality',
              tone: index % 2 === 0 ? 'plum' : 'teal',
              roman: String(index + 1),
              pillars: ['Patient-Centred', 'Evidence-Based', 'Specialist-Led'],
              icon: null,
            };

            const isPlum = meta.tone === 'plum';
            const isLeft = index % 2 === 0;

            return (
              <div
                key={reason.id}
                data-timeline-item
                data-index={index}
                className="relative flex flex-col items-start lg:flex-row lg:items-start"
              >
                {/* Compact Milestone Node */}
                <div
                  data-timeline-node
                  className="absolute left-4 top-1.5 -translate-x-1/2 sm:left-6 lg:left-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-cream bg-paper shadow-xs transition-transform duration-300 hover:scale-110"
                >
                  {/* Subtle pulsing aura */}
                  <span
                    aria-hidden="true"
                    className={`absolute -inset-0.5 rounded-full opacity-30 blur-xs ${
                      isPlum ? 'bg-plum-400' : 'bg-teal-400'
                    }`}
                  />

                  {/* Core number badge */}
                  <div
                    className={`relative flex h-full w-full items-center justify-center rounded-full font-serif text-[11px] sm:text-xs font-bold ${
                      isPlum
                        ? 'bg-plum-50 text-plum-800 border border-plum-200'
                        : 'bg-teal-50 text-teal-800 border border-teal-200'
                    }`}
                  >
                    <span>{meta.phase}</span>
                  </div>
                </div>

                {/* Timeline Content Block (Clean, Card-Free Typography) */}
                <div
                  className={`w-full pl-10 sm:pl-14 lg:w-[calc(50%-2.5rem)] lg:pl-0 ${
                    isLeft
                      ? 'lg:mr-auto lg:pr-3 lg:text-left'
                      : 'lg:ml-auto lg:pl-3 lg:text-left'
                  }`}
                >
                  <div data-timeline-content className="relative group">
                    {/* Header Row: Category Badge & Stage Numeral */}
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider border ${
                          isPlum
                            ? 'border-plum-200/80 bg-plum-100/50 text-plum-900'
                            : 'border-teal-200/80 bg-teal-100/50 text-teal-900'
                        }`}
                      >
                        <span className="shrink-0">{meta.icon}</span>
                        <span>{meta.badge}</span>
                      </span>

                      <span className="font-serif text-[11px] tracking-wider text-ink-45">
                        STAGE {meta.roman}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-2 font-serif text-lg font-normal leading-snug text-ink sm:text-xl lg:text-[1.35rem]">
                      {reason.title}
                    </h3>

                    {/* Description Narrative */}
                    <p className="mt-1.5 text-[0.875rem] leading-[1.7] text-ink-70 sm:text-[0.9375rem]">
                      {reason.text}
                    </p>

                    {/* Core Clinical Practice Pillars */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {meta.pillars.map((pill) => (
                        <span
                          key={pill}
                          data-timeline-pill
                          className="inline-flex items-center gap-1 rounded-full border border-line bg-cream-deep/40 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-medium text-ink-70 transition-colors hover:border-ink/20 hover:bg-cream"
                        >
                          <span
                            className={`h-1 w-1 rounded-full ${
                              isPlum ? 'bg-plum-500' : 'bg-teal-600'
                            }`}
                            aria-hidden="true"
                          />
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
