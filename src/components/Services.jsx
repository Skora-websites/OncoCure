import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { services } from '../data/clinic.js';
import Section, { SectionIntro } from './ui/Blocks.jsx';
import { RevealBlock, StaggerGroup } from './anim/SplitReveal.jsx';
import PillButton from './ui/PillButton.jsx';

/** Hover wash colour per accent. */
const washes = {
  plum: 'from-plum-100/60',
  teal: 'from-teal-100/60',
  navy: 'from-mist/80',
};

/** One distinct image per step, shown in the cursor-following circle. */
const stepImages = [
  { src: '/images/photo/consult-two.jpg', alt: 'A consultation in progress at the clinic.' },
  { src: '/images/photo/lab-research.jpg', alt: 'Diagnostic work informing a treatment plan.' },
  { src: '/images/photo/consult-bed.jpg', alt: 'A patient receiving treatment, cared for by a clinician.' },
  { src: '/images/photo/consult-care.jpg', alt: 'A clinician discussing symptoms with a patient.' },
  { src: '/images/photo/calm-leaf.jpg', alt: 'A calm detail from the clinic environment.' },
  { src: '/images/photo/reception-plants.jpg', alt: 'The clinic reception, ready to welcome patients.' },
];

/**
 * Services — the template's capability list.
 *
 * A ruled list rather than a card grid: each row is separated by a hairline,
 * numbered, and opens a brand wash on hover. On fine-pointer devices a
 * circular image panel follows the cursor with a soft easing lag while a row
 * is hovered — each step shows its own image. The panel is wired with GSAP
 * `quickTo` (no React state in the move path), preloads its images stacked
 * and cross-faded, and is disabled entirely on touch devices and for
 * visitors who prefer reduced motion.
 */
export default function Services() {
  const listRef = useRef(null);
  const circleRef = useRef(null);
  const imgRefs = useRef([]);
  const activeIndex = useRef(-1);

  useEffect(() => {
    const list = listRef.current;
    const circle = circleRef.current;
    if (!list || !circle) return undefined;

    // Mouse-follow is a pointer effect: skip it on touch devices, and for
    // reduced-motion visitors.
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduce) return undefined;

    // Eased cursor tracking — quickTo reuses one tween per axis, so moving
    // the mouse costs no allocations.
    const xTo = gsap.quickTo(circle, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(circle, 'y', { duration: 0.45, ease: 'power3' });

    gsap.set(circle, { xPercent: -50, yPercent: -50, scale: 0.3, opacity: 0 });
    // Snapshot the live image elements once: ref callbacks are nulled on
    // unmount, so the cleanup must not read the array again.
    const imgs = imgRefs.current.filter(Boolean);
    gsap.set(imgs, { opacity: 0 });

    const show = () => {
      gsap.to(circle, { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' });
    };
    const hide = () => {
      activeIndex.current = -1;
      gsap.to(circle, { scale: 0.3, opacity: 0, duration: 0.3, ease: 'power3.in' });
    };

    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    // Row enter: cross-fade to that step's image, then reveal the panel.
    const rowEnterHandlers = [];
    const rows = list.querySelectorAll('article');
    rows.forEach((row, i) => {
      const onEnter = () => {
        if (activeIndex.current !== i) {
          activeIndex.current = i;
          imgs.forEach((img, j) => {
            gsap.to(img, { opacity: j === i ? 1 : 0, duration: 0.3, ease: 'power2.out' });
          });
        }
        show();
      };
      row.addEventListener('mouseenter', onEnter);
      rowEnterHandlers.push([row, onEnter]);
    });

    list.addEventListener('mousemove', onMove);
    list.addEventListener('mouseleave', hide);

    // Scrolling can carry the list out from under a stationary pointer —
    // browsers fire no mouseleave in that case, leaving the panel floating
    // over the page. Tuck it away whenever the page scrolls while a row is
    // active.
    const onScrollHide = () => {
      if (activeIndex.current !== -1) hide();
    };
    window.addEventListener('scroll', onScrollHide, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScrollHide);
      list.removeEventListener('mousemove', onMove);
      list.removeEventListener('mouseleave', hide);
      rowEnterHandlers.forEach(([row, fn]) => row.removeEventListener('mouseenter', fn));
      // quickTo returns a plain setter function, not a tween — there is
      // nothing to `.kill()` on it; killTweensOf covers its underlying tweens.
      gsap.killTweensOf([circle, ...imgs]);
      // Strict Mode remounts this effect, and a mid-tween state (panel
      // revealed, or the wrong image still cross-fading) would otherwise
      // carry into the fresh wiring — showing a "stuck" picture long after
      // the pointer has left, even once the section is scrolled past.
      // Reset the whole panel to its rest state so the new effect starts
      // from a clean slate.
      gsap.set(circle, { scale: 0.3, opacity: 0, xPercent: -50, yPercent: -50, clearProps: 'x,y' });
      gsap.set(imgs, { opacity: 0 });
      activeIndex.current = -1;
    };
  }, []);

  return (
    <Section id="services" tone="cream" spacing="tall">
      {/* Narrower than the page default: this list reads better contained. */}
      <div className="mx-auto w-full max-w-[68rem]">
        <SectionIntro
          label="Areas of Expertise"
          title="What we see, and what we help with"
          intro="An oncology and pain clinic works best when the whole picture is held by one team. These are the areas the clinic is set up to focus on."
        />

        {/* The ref wrapper owns the pointer wiring (StaggerGroup does not
            forward refs); the rows inside report mouseenter themselves. */}
        <div ref={listRef}>
          <StaggerGroup className="mt-16 border-t border-line lg:mt-20" stagger={0.08}>
          {services.map((service, i) => {
            return (
              <article
                key={service.id}
                className="group relative grid grid-cols-[auto_1fr] items-start gap-x-5 border-b border-line py-8 transition-colors duration-500 hover:bg-paper sm:gap-x-8 sm:py-10 lg:grid-cols-[auto_minmax(0,26rem)_1fr_auto] lg:items-center lg:gap-10"
              >
                {/* Wash */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r ${
                    washes[service.accent] ?? washes.navy
                  } to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100`}
                />

                <span className="label-sm relative pt-1 text-ink-45 lg:pt-0">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3 className="relative font-serif text-[1.375rem] leading-snug text-ink transition-colors duration-500 group-hover:text-plum-800 sm:text-[1.625rem]">
                  {service.title}
                </h3>

                <p className="relative col-start-2 mt-2 max-w-xl text-[0.9375rem] leading-[1.75] text-ink-45 lg:col-start-3 lg:mt-0">
                  {service.text}
                </p>

                <span
                  aria-hidden="true"
                  className="relative col-start-2 mt-4 text-sm font-semibold text-plum-600 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100 lg:col-start-4 lg:mt-0 lg:justify-self-end"
                >
                  &rarr;
                </span>
              </article>
            );
          })}
          </StaggerGroup>
        </div>

        <RevealBlock
          className="mt-12 flex flex-col items-center gap-5 text-center"
          y={20}
        >
          <PillButton tone="outline" arrow>
            All Services
          </PillButton>
          <p className="max-w-md text-sm leading-relaxed text-ink-45">
            The complete list of services offered at the clinic is set out below.
          </p>
        </RevealBlock>
      </div>

      {/* Cursor-following image panel. Fixed positioning tracks the cursor in
          viewport space with no offset maths; it sits under the navbar and
          never intercepts a click. Touch devices never wire it up and it
          stays at opacity 0 regardless. */}
      <div
        ref={circleRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-52 w-52 overflow-hidden rounded-full border border-ink/15 shadow-soft will-change-transform lg:block"
      >
        {stepImages.map((image, i) => (
          <img
            key={image.src}
            ref={(el) => {
              imgRefs.current[i] = el;
            }}
            src={image.src}
            alt=""
            draggable="false"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
        ))}
      </div>
    </Section>
  );
}
