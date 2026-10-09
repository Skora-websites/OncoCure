import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { hero } from '../data/clinic.js';
import SplitReveal, { RevealBlock } from './anim/SplitReveal.jsx';
import CircleBadge from './anim/CircleBadge.jsx';

/**
 * Hero — the reference template's opening, reproduced exactly:
 *
 *   1. a large centred display headline,
 *   2. a tall capsule photograph (straight sides, semicircular top and
 *      bottom) centred on the page with a soft halo ring,
 *   3. a small light circular action button straddling the capsule's right
 *      edge, high up,
 *   4. a narrow description column pinned low on the left.
 *
 * SCROLL BEHAVIOUR (the reference's signature move)
 * The description column is `position: sticky`, so it holds in place while
 * the capsule — much taller than the viewport remainder — scrolls up past
 * it; once the capsule's bottom clears, both travel off together. The
 * headline also fades away as it leaves.
 *
 * On small screens sticky is switched off and the copy stacks above the image.
 */
export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const ring = el.querySelector('[data-hero-ring]');
    const orbitDots = ring ? [...ring.children] : [];

    const ctx = gsap.context(() => {
      // Entrance: the capsule wipes open upward, the badge settles onto it.
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, delay: 0.35 })
        .fromTo(
          '[data-hero-capsule]',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4 },
        )
        .fromTo(
          '[data-hero-badge]',
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9 },
          '-=0.9',
        );

      // Desktop only: the headline drifts up and softens as it leaves, and
      // the capsule drifts gently on the way past for dimension.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        // Numeric offsets: the fade runs between ~scrollY 437 and ~937, so
        // the headline is fully opaque at rest. (The old percentage start,
        // 'top 80%', was already passed on load — leaving the heading
        // translucent before the visitor scrolled anywhere.)
        gsap.to('[data-hero-headline]', {
          yPercent: -30,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-hero-grid]',
            start: '100 top',
            end: '600 top',
            scrub: true,
          },
        });

        gsap.fromTo(
          '[data-hero-capsule-img]',
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-hero-capsule]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });

      // Ornament motion: the dashed registration ring turns at a pace you
      // can actually see the dashes travel.
      //
      // The two accent dots COUNTER the ring's spin. A dot merely pinned to
      // the ring could only ever travel with it, so each dot instead slides
      // along the outline at twice the ring's rate in the opposite sense:
      // local angle φ advances at −2ω while the ring carries it +ω, which
      // nets a page-space orbit of −ω — against the racetrack — while the
      // dot stays exactly on the dash line at every instant.
      const phi0 = [-Math.PI / 2, Math.PI / 2]; // top / bottom anchors (y-down)

      /** Radius of a vertical stadium (racetrack) outline at polar angle φ. */
      const stadiumRadius = (phi, a, b) => {
        const s = Math.sin(phi);
        const c = Math.cos(phi);
        const straight = b - a; // half-length of the straight sides
        // The ray lands on a straight side while |tan φ| fits its span.
        if (c !== 0 && Math.abs(s / c) <= straight / a) return a / Math.abs(c);
        // Otherwise it lands on the top/bottom cap (circle of radius a).
        return (
          straight * Math.abs(s) +
          Math.sqrt(a * a - straight * straight * c * c)
        );
      };

      if (ring) {
        gsap.to(ring, {
          rotation: 360,
          duration: 45,
          repeat: -1,
          ease: 'none',
          onUpdate: () => {
            const theta = (gsap.getProperty(ring, 'rotation') * Math.PI) / 180;
            // Half-dimensions of the dash line's centreline (the ring's 1px
            // border sits inside the offset box, and absolute children anchor
            // to the padding box — so inset by 0.5px for both).
            const a = ring.offsetWidth / 2 - 0.5;
            const b = ring.offsetHeight / 2 - 0.5;
            orbitDots.forEach((dot, i) => {
              const phi = phi0[i] - 2 * theta;
              const r = stadiumRadius(phi, a, b);
              // Offset from the dot's CSS anchor (top/bottom tangent point
              // on the line); the stadium apex equals that anchor at t=0.
              dot.style.transform = `translate(${(r * Math.cos(phi)).toFixed(
                2,
              )}px, ${(
                r * Math.sin(phi) +
                (i === 0 ? b : -b)
              ).toFixed(2)}px)`;
            });
          },
        });
      }
    }, el);

    return () => {
      ctx.revert();
      orbitDots.forEach((dot) => {
        dot.style.transform = '';
      });
    };
  }, []);

  return (
    <section
      ref={root}
      className="paper texture-creases relative overflow-x-clip bg-cream pt-40 pb-16 sm:pt-48 sm:pb-20 lg:pt-52 lg:pb-24"
    >
      {/* Soft brand wash. The wash wrapper carries the clipping (not the
          section itself) because an `overflow: hidden` ancestor would kill
          the description column's sticky behaviour. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-48 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-plum-100 opacity-80 blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-teal-100 opacity-80 blur-3xl" />

        {/* Botanical line-art — the reference plate's corner foliage,
             drawn in the brand's teal and plum hairlines. Desktop only. */}
        <div className="absolute -left-24 -top-28 hidden w-[22rem] opacity-90 sm:block lg:w-[27rem]">
          <svg viewBox="0 0 340 480" fill="none" className="h-auto w-full">
            <defs>
              <path id="oc-leaf-a" d="M0 0 C 16 -13 38 -20 56 -17 C 48 4 20 14 0 0 Z" />
            </defs>
            <path d="M40 16 C 110 130 150 260 132 470" stroke="#3f9c98" strokeOpacity="0.5" strokeWidth="1.3" />
            <g stroke="#3f9c98" strokeOpacity="0.5" strokeWidth="1.2">
              <use href="#oc-leaf-a" transform="translate(78 80) rotate(-40) scale(1.15)" fill="#eaf1ec" fillOpacity="0.9" />
              <use href="#oc-leaf-a" transform="translate(104 150) rotate(-20) scale(1.3)" fill="#efe7f4" fillOpacity="0.85" />
              <use href="#oc-leaf-a" transform="translate(124 230) rotate(-5) scale(1.35)" fill="#eaf1ec" fillOpacity="0.9" />
              <use href="#oc-leaf-a" transform="translate(134 310) rotate(12) scale(1.3)" fill="none" />
              <use href="#oc-leaf-a" transform="translate(132 395) rotate(28) scale(1.15)" fill="#efe7f4" fillOpacity="0.85" />
              <use href="#oc-leaf-a" transform="translate(62 132) scale(-1.1 1.1) rotate(-30)" fill="#eaf1ec" fillOpacity="0.9" />
              <use href="#oc-leaf-a" transform="translate(100 300) scale(-1.15 1.15) rotate(-15)" fill="#efe7f4" fillOpacity="0.85" />
            </g>
          </svg>
        </div>
        <div className="absolute -right-32 top-10 hidden w-[26rem] -scale-x-100 opacity-80 lg:block xl:w-[30rem]">
          <svg viewBox="0 0 340 480" fill="none" className="h-auto w-full">
            <defs>
              <path id="oc-leaf-b" d="M0 0 C 16 -13 38 -20 56 -17 C 48 4 20 14 0 0 Z" />
            </defs>
            <path d="M40 16 C 110 130 150 260 132 470" stroke="#3f9c98" strokeOpacity="0.45" strokeWidth="1.3" />
            <g stroke="#3f9c98" strokeOpacity="0.45" strokeWidth="1.2">
              <use href="#oc-leaf-b" transform="translate(82 92) rotate(-34) scale(1.2)" fill="#efe7f4" fillOpacity="0.85" />
              <use href="#oc-leaf-b" transform="translate(108 170) rotate(-14) scale(1.35)" fill="#eaf1ec" fillOpacity="0.9" />
              <use href="#oc-leaf-b" transform="translate(126 250) rotate(4) scale(1.3)" fill="none" />
              <use href="#oc-leaf-b" transform="translate(132 330) rotate(18) scale(1.25)" fill="#efe7f4" fillOpacity="0.85" />
              <use href="#oc-leaf-b" transform="translate(64 140) scale(-1.15 1.15) rotate(-26)" fill="#eaf1ec" fillOpacity="0.9" />
            </g>
          </svg>
        </div>
        <div className="absolute -left-16 bottom-4 hidden w-60 rotate-[14deg] opacity-85 lg:block">
          <svg viewBox="0 0 340 480" fill="none" className="h-auto w-full">
            <defs>
              <path id="oc-leaf-c" d="M0 0 C 16 -13 38 -20 56 -17 C 48 4 20 14 0 0 Z" />
            </defs>
            <path d="M40 16 C 110 130 150 260 132 470" stroke="#9c54b4" strokeOpacity="0.4" strokeWidth="1.6" />
            <g stroke="#9c54b4" strokeOpacity="0.45" strokeWidth="1.5">
              <use href="#oc-leaf-c" transform="translate(84 96) rotate(-36) scale(1.3)" fill="#efe7f4" fillOpacity="0.9" />
              <use href="#oc-leaf-c" transform="translate(110 180) rotate(-12) scale(1.4)" fill="none" />
              <use href="#oc-leaf-c" transform="translate(124 260) rotate(6) scale(1.3)" fill="#efe7f4" fillOpacity="0.9" />
              <use href="#oc-leaf-c" transform="translate(64 148) scale(-1.2 1.2) rotate(-28)" fill="none" />
            </g>
          </svg>
        </div>
      </div>

      {/* Headline */}
      <div data-hero-headline className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
        {/* Eyebrow, as the reference plate: one tracked line between two
            hairlines — no pill, no dots. */}
        <RevealBlock delay={0.1} y={14}>
          <span className="flex items-center justify-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-ink/25 sm:w-16" />
            <span className="label text-ink-70">
              Specialist Oncology Care · Greater Noida
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-ink/25 sm:w-16" />
          </span>
        </RevealBlock>

        <SplitReveal
          as="h1"
          className="h-serif mx-auto max-w-3xl text-center font-normal text-teal-900 text-[clamp(3.15rem,5vw,3.9rem)] leading-[1.08] sm:leading-[1.02] lg:leading-none"
          start="top 99%"
          stagger={0.06}
          direction="down"
        >
          {hero.headline.map((part, i) =>
            part.accent ? (
              <span key={i} className="text-plum-800">
                {part.text}
              </span>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </SplitReveal>
      </div>

      {/* Narrow left column + tall capsule photograph */}
      <div
        data-hero-grid
        className="mx-auto mt-14 w-full max-w-[88rem] px-5 sm:mt-16 sm:px-8 lg:mt-20 lg:px-12"
      >
        <div className="relative lg:grid lg:grid-cols-12">
          {/*
           * Capsule first in the DOM: on mobile the reference's flow is
           * headline → image → copy. On desktop both columns are explicitly
           * placed on the same grid row, so JSX order is irrelevant there.
           */}
          <div className="sm:mt-6 lg:col-start-4 lg:col-span-6 lg:row-start-1 lg:mt-0">
            {/* Mobile: the capsule fills the first screen beneath the headline
                (viewport-height minus the space the headline block takes), so
                only headline + photograph are visible before scrolling. From
                sm up it returns to the reference's fixed aspect ratio. */}
            <div className="relative mx-auto h-[min(36rem,max(16rem,calc(100dvh-26rem)))] w-[80vw] max-w-[23rem] sm:h-auto sm:w-auto sm:max-w-[26rem] lg:max-w-[40rem]">
              {/* Action button: on mobile it straddles the capsule's top edge,
                  dead-centre — the reference's mobile arrangement; from lg up
                  it moves to the right edge. */}
              <div
                data-hero-badge
                className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 lg:left-auto lg:right-0 lg:top-[19%] lg:translate-x-1/2"
              >
                {/* ~80px on mobile (the reference), 112px from lg up. */}
                <CircleBadge
                  text="LET'S TALK"
                  href="#contact"
                  className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
                  tone="light"
                  bordered
                />
              </div>

              {/* Halo ring behind the capsule, as in the reference */}
              <div
                aria-hidden="true"
                className="absolute -inset-5 rounded-[999px] border border-ink/10 sm:-inset-7"
              />

              {/* Outer dashed ring — a rotating ornament, tinted so the
                  dashes actually read against the cream. Two accent dots are
                  pinned to opposite points on the line (the OrbitRing trick):
                  the ring itself is what rotates, so the dots travel the full
                  racetrack outline. */}
              <div
                data-hero-ring
                aria-hidden="true"
                className="absolute -inset-9 rounded-[999px] border border-dashed border-teal-600/60 sm:-inset-14"
              >
                <span className="absolute left-1/2 top-[-0.5px] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-plum-600 sm:h-4 sm:w-4" />
                <span className="absolute left-1/2 bottom-[-0.5px] h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-teal-700 sm:h-4 sm:w-4" />
              </div>

              <div
                data-hero-capsule
                className="relative h-full w-full overflow-hidden rounded-[999px] bg-cream-deep shadow-soft sm:h-auto sm:aspect-[3/5.4]"
              >
                <div
                  data-hero-capsule-img
                  className="absolute -inset-y-[8%] inset-x-0"
                >
                  <img
                    src="/images/photo/doctor-writing.png"
                    alt="A clinician in a white coat gently holding a patient's hand during a consultation."
                    className="h-full w-full object-cover"
                    width={800}
                    height={1230}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-teal-900/30 via-transparent to-plum-800/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/*
           * Text column. On desktop it shares the capsule's grid row and
           * stretches to its full height, so the sticky block has travel:
           * the copy holds while the capsule scrolls up past it, then both
           * leave together. On mobile it simply follows the capsule in
           * normal flow, centred — the reference's arrangement.
           */}
          <div className="lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:self-stretch">
            <div className="lg:sticky lg:top-[58vh]">
              <RevealBlock delay={0.3} y={26}>
                {/* Mobile: below the capsule, centred, sans name — as the
                    reference. Desktop: the narrow sticky serif column left. */}
                <div className="mx-auto mt-14 max-w-sm px-5 pb-4 text-center sm:px-8 lg:mx-0 lg:mt-0 lg:max-w-[17rem] lg:px-0 lg:pb-0 lg:text-left">
                  <p className="font-serif text-[1.85rem] font-normal leading-tight tracking-tight text-ink lg:text-[1.4rem]">
                    {hero.name}
                  </p>
                  <span
                    aria-hidden="true"
                    className="mx-auto mt-4 block h-0.5 w-10 rounded-full bg-plum-600 lg:mx-0"
                  />
                  <p className="mx-auto mt-5 max-w-[16.5rem] text-[1.125rem] leading-[1.8] text-ink-70 lg:mx-0 lg:text-[1.0625rem]">
                    {hero.description}
                  </p>
                </div>
              </RevealBlock>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
