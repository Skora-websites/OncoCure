import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { services } from '../data/clinic.js';
import Section, { SectionIntro } from './ui/Blocks.jsx';
import { RevealBlock, StaggerGroup } from './anim/SplitReveal.jsx';
import PillButton from './ui/PillButton.jsx';
import { navigate } from '../lib/hashRoute.js';

/** Mapping of home headline services to their detail page slugs */
const SERVICE_SLUG_MAP = {
  consultation: 'cancer-consultation-evaluation',
  planning: 'personalised-treatment-planning',
  treatments: 'chemotherapy',
  'pain-symptoms': 'cancer-pain-symptom-management',
  support: 'supportive-palliative-care',
  followup: 'staging-response-assessment',
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
 * Services — the template's capability list, in the ribbon's own purple.
 *
 * A ruled list on the deep plum field: each row is separated by a cream
 * hairline, numbered, and lifts quietly on hover. On fine-pointer devices a
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
  // Small-screen cross-fade panel: the touch equivalent of the cursor circle.
  const panelRef = useRef(null);
  const panelImgRefs = useRef([]);

  // Touch / small-screen fallback: a circular image panel above the list
  // cross-fades to whichever row's *description* is crossing the exact
  // middle of the viewport — and hides entirely when none is.
  // It renders only below `lg`, but the observer is wired unconditionally so
  // a desktop→mobile resize is covered without remounting.
  useEffect(() => {
    const list = listRef.current;
    const panel = panelRef.current;
    if (!list || !panel) return undefined;
    // Ref callbacks are nulled on unmount — snapshot inside the effect.
    const imgs = panelImgRefs.current.filter(Boolean);
    if (!imgs.length) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = Array.from(list.querySelectorAll('article'));
    // Gate on the description paragraph itself, not the whole row.
    const descs = rows.map((row) => row.querySelector('p')).filter(Boolean);
    if (!descs.length) return undefined;
    let current = -1;

    const show = (i) => {
      if (i === current) return;
      current = i;
      imgs.forEach((img, j) => {
        if (reduce) {
          img.style.opacity = j === i ? '1' : '0';
        } else {
          gsap.to(img, { opacity: j === i ? 1 : 0, duration: 0.35, ease: 'power2.out' });
        }
      });
    };

    const setPanel = (on) => {
      if (reduce) {
        panel.style.opacity = on ? '1' : '0';
      } else {
        gsap.to(panel, { opacity: on ? 1 : 0, duration: 0.35, ease: 'power2.out' });
      }
    };

    // Descriptions currently inside the centre band (viewport middle 10%).
    const inBand = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const i = descs.indexOf(entry.target);
          if (i < 0) return;
          if (entry.isIntersecting) inBand.add(i);
          else inBand.delete(i);
        });

        if (!inBand.size) {
          setPanel(false);
          return;
        }
        // Two descriptions can straddle the band; the panel reflects the
        // one whose centre is closest to the viewport's exact middle.
        const mid = window.innerHeight / 2;
        let best = -1;
        let bestDist = Infinity;
        inBand.forEach((i) => {
          const r = descs[i].getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        if (best >= 0) {
          show(best);
          setPanel(true);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    descs.forEach((desc) => io.observe(desc));

    return () => {
      io.disconnect();
      gsap.killTweensOf(imgs);
      gsap.killTweensOf(panel);
      imgs.forEach((img) => {
        img.style.opacity = '';
      });
      // Back to the resting (hidden) state declared in markup.
      panel.style.opacity = '';
      current = -1;
      inBand.clear();
    };
  }, []);

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
    // the mouse costs no allocations. 0.3s keeps the follow close behind the
    // pointer without feeling rigid.
    const xTo = gsap.quickTo(circle, 'x', { duration: 0.3, ease: 'power3' });
    const yTo = gsap.quickTo(circle, 'y', { duration: 0.3, ease: 'power3' });

    gsap.set(circle, { xPercent: -50, yPercent: -50, scale: 0.3, opacity: 0 });
    // Snapshot the live image elements once: ref callbacks are nulled on
    // unmount, so the cleanup must not read the array again.
    const imgs = imgRefs.current.filter(Boolean);
    gsap.set(imgs, { opacity: 0 });

    // Why the panel used to get "stuck" far from the list: after a scroll,
    // Chromium re-synthesizes mouseenter/mouseover for whatever element is
    // now under the stationary cursor. Those synthetic events re-ran the old
    // row-enter `show()` right after the scroll handler had hidden the panel,
    // and during the remaining smooth-scroll glide no further real events
    // fired — leaving the circle frozen over whichever section the pointer
    // had scrolled to. Nothing here trusts row hover events; the single
    // source of truth is real pointer movement (mousemove only fires when
    // the pointer actually moves) reconciled against geometry.
    let active = -1; // row whose image the panel currently shows
    let shown = false;
    let lastScrollAt = 0; // suppress gate for synthetic post-scroll hovers

    const crossfade = (i) => {
      active = i;
      imgs.forEach((img, j) => {
        gsap.to(img, { opacity: j === i ? 1 : 0, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
      });
    };

    // Snappy reveal: a hover must read as instant (0.35s read as a lag).
    const show = () => {
      if (shown) return;
      shown = true;
      // `overwrite: 'auto'` — never `true`. Both write the circle's
      // transform, and a blanket overwrite would kill the quickTo x/y tweens
      // mid-flight, leaving the circle stuck at its origin instead of
      // following the cursor. 'auto' only stomps the overlapping properties
      // (scale/opacity), so position tracking survives every reveal.
      gsap.to(circle, { scale: 1, opacity: 1, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
    };
    const hide = () => {
      active = -1;
      shown = false;
      // 'auto' (not true): only the scale/opacity tween is replaced — the
      // quickTo x/y easing keeps running so the circle is already at the
      // cursor's position when it next reveals.
      gsap.to(circle, { scale: 0.3, opacity: 0, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
    };

    // Real pointer movement: exact placement, crossfade to whichever row the
    // coordinates actually land in, and a hard bounds check — coordinates
    // outside the list's rect can never reveal the panel, even if a stale
    // event slips through the scroll-suppress window.
    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);

      if (performance.now() - lastScrollAt < 120) return;

      const rect = list.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) {
        hide();
        return;
      }

      let i = -1;
      list.querySelectorAll('article').forEach((row, j) => {
        const r = row.getBoundingClientRect();
        if (e.clientY >= r.top && e.clientY <= r.bottom) i = j;
      });
      if (i >= 0) {
        if (active !== i) crossfade(i);
        show();
      } else {
        hide();
      }
    };

    // Scrolling invalidates the mapping between a stationary cursor and the
    // row beneath it — so the panel tucks away immediately. Real mousemove
    // events only fire when the pointer genuinely moves, so the suppression
    // window can be short: it exists to swallow only the synthetic events
    // fired in the scroll frame itself, not the whole smooth-scroll glide
    // (a long window here read as a laggy hover right after scrolling).
    const onScroll = () => {
      // Lenis fires `scroll` every frame during a glide: stamp the suppression
      // window each time, but only actually tween the hide once.
      lastScrollAt = performance.now();
      if (shown || active !== -1) hide();
    };

    list.addEventListener('mousemove', onMove);
    list.addEventListener('mouseleave', hide);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      list.removeEventListener('mousemove', onMove);
      list.removeEventListener('mouseleave', hide);
      // quickTo returns a plain setter function, not a tween — there is
      // nothing to `.kill()` on it; killTweensOf covers its underlying tweens.
      gsap.killTweensOf([circle, ...imgs]);
      // Strict Mode remounts this effect: reset the whole panel to its rest
      // state so the fresh wiring starts from a clean slate.
      gsap.set(circle, { scale: 0.3, opacity: 0, xPercent: -50, yPercent: -50, clearProps: 'x,y' });
      gsap.set(imgs, { opacity: 0 });
    };
  }, []);

  return (
    <Section id="services" tone="plum" spacing="tall">
      {/* Narrower than the page default: this list reads better contained. */}
      <div className="mx-auto w-full max-w-[68rem]">
        <SectionIntro
          tone="light"
          label="Areas of Expertise"
          title="What we see, and what we help with"
        />

        {/* Touch / small-screen image panel — the hover circle's equivalent,
            a circular frame below `lg`. Cross-fades to the image of whichever
            row's description is dead-centre, and stays hidden (opacity-0) when
            none is. Decorative: the desktop circle (aria-hidden) carries the
            same art. */}
        <div
          ref={panelRef}
          aria-hidden="true"
          className="sticky top-24 z-10 mx-auto mt-10 aspect-square w-[min(78vw,20rem)] overflow-hidden rounded-full border border-cream/20 opacity-0 shadow-soft lg:hidden"
        >
          {stepImages.map((image, i) => (
            <img
              key={image.src}
              ref={(el) => {
                panelImgRefs.current[i] = el;
              }}
              src={image.src}
              alt=""
              draggable="false"
              className="absolute inset-0 h-full w-full object-cover opacity-0"
              loading="eager"
            />
          ))}
          {/* Soft brand vignette so the panel reads as part of the palette. */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-teal-900/25 via-transparent to-plum-800/10" />
        </div>

        {/* Section intro sits below the image panel so mobile flows
            title → image → description (DESIGN_RULES.md §1). On desktop the
            panel is hidden, so this reads title → description exactly as
            before. */}
        <RevealBlock delay={0.12} className="mx-auto mt-7 max-w-2xl text-center text-base leading-[1.8] text-cream/75 sm:text-lg">
          An oncology and pain clinic works best when the whole picture is
          held by one team. These are the areas the clinic is set up to focus
          on.
        </RevealBlock>

        {/* The ref wrapper owns the pointer wiring (StaggerGroup does not
            forward refs); the rows inside report mouseenter themselves. */}
        <div ref={listRef}>
          <StaggerGroup className="mt-16 border-t border-cream/20 lg:mt-20" stagger={0.08}>
          {services.map((service, i) => {
            const slug = SERVICE_SLUG_MAP[service.id];
            const href = slug ? `/services/${slug}` : '/services';
            return (
              <article
                key={service.id}
                className="group relative grid grid-cols-[auto_1fr] items-start gap-x-5 border-b border-cream/20 py-8 transition-colors duration-500 hover:bg-plum-900/55 sm:gap-x-8 sm:py-10 lg:grid-cols-[auto_minmax(0,26rem)_1fr_auto] lg:items-center lg:gap-10 cursor-pointer"
              >
                <a
                  href={href}
                  className="absolute inset-0 z-10"
                  aria-label={`${service.title} — view service details`}
                />
                <span className="label-sm relative pt-1 text-cream/45 transition-colors duration-500 group-hover:text-cream/80 lg:pt-0">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3 className="relative font-serif text-[1.375rem] leading-snug text-cream transition-colors duration-500 group-hover:text-plum-100 sm:text-[1.625rem]">
                  {service.title}
                </h3>

                <p className="relative col-start-2 mt-2 max-w-xl text-[0.9375rem] leading-[1.75] text-cream/65 transition-colors duration-500 group-hover:text-cream/85 lg:col-start-3 lg:mt-0">
                  {service.text}
                </p>

                <span
                  aria-hidden="true"
                  className="relative col-start-2 mt-4 text-sm font-semibold text-teal-200 transition-all duration-500 group-hover:translate-x-1 lg:col-start-4 lg:mt-0 lg:justify-self-end lg:opacity-0 lg:group-hover:opacity-100"
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
          <PillButton
            tone="light"
            arrow
            interactive
            onClick={() => navigate('/services')}
          >
            All Services
          </PillButton>
          <p className="max-w-md text-sm leading-relaxed text-cream/55">
            Explore our complete range of specialized oncology and pain management services.
          </p>
        </RevealBlock>
      </div>

      {/* Cursor-following image panel. Fixed positioning tracks the cursor in
          viewport space with no offset maths; it sits under the navbar and
          never intercepts a click. Touch devices never wire it up and it
          stays at opacity 0 regardless.

          Portaled to <body> so its fixed positioning always resolves
          against the viewport: any filtered or transformed ancestor inside
          the section would otherwise re-anchor the circle to that section
          and break the cursor follow on desktop. */}
      {createPortal(
        <div
          ref={circleRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 hidden h-52 w-52 overflow-hidden rounded-full border border-cream/25 shadow-soft will-change-transform lg:block"
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
        </div>,
        document.body,
      )}
    </Section>
  );
}
