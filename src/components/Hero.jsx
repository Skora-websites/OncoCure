import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { hero } from '../data/clinic.js';
import SplitReveal, { RevealBlock } from './anim/SplitReveal.jsx';
import CircleBadge from './anim/CircleBadge.jsx';
import { openConsult } from '../lib/consultBus.js';

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
        )
        // The accent under the headline: the hairline draws outward from
        // its centre, then the dot pops onto it.
        .fromTo(
          '[data-hero-accent-line]',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1 },
          '-=0.75',
        )
        .fromTo(
          '[data-hero-accent-dot]',
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 },
          '-=0.45',
        );

      // Ambient life (all slow, all `sine`, all looping): the stage —
      // capsule, rings and badge — breathes on a gentle float, the halo ring
      // pulses a touch wider than the capsule edge, and the accent dot
      // slides along the hairline beneath the headline. Transform/opacity
      // only, and each element owns its property, so nothing fights the
      // entrance timeline or the desktop scroll parallax.
      gsap.to('[data-hero-stage]', {
        y: -12,
        duration: 3.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.2,
      });
      gsap.to('[data-hero-halo]', {
        scale: 1.03,
        duration: 3.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.2,
      });
      gsap.to('[data-hero-accent-dot]', {
        x: 106,
        duration: 2.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.5,
      });

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
      className="relative overflow-x-clip bg-cream pt-40 pb-16 sm:pt-48 sm:pb-20 lg:pt-52 lg:pb-24"
    >
      {/* Clean ground: a delicate static film grain and nothing else — the
          old brand washes and corner foliage are gone. The wrapper carries
          the layer (not the section) so no `overflow: hidden` ancestor
          creeps in around the sticky copy column. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="hero-grain absolute inset-0" />
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

        {/* Small animated accent beneath the headline: a hairline drawn
            outward from the centre with a plum dot gliding along it (the
            site's orbit-dot language, in miniature). */}
        <div
          data-hero-accent
          aria-hidden="true"
          className="relative mx-auto mt-6 h-3 w-28"
        >
          <span
            data-hero-accent-line
            className="absolute inset-x-0 top-1/2 h-px bg-ink/20"
          />
          <span
            data-hero-accent-dot
            className="absolute left-0 top-1/2 mt-[-3px] h-1.5 w-1.5 rounded-full bg-plum-600"
          />
        </div>
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
            <div
              data-hero-stage
              className="relative mx-auto h-[min(36rem,max(16rem,calc(100dvh-26rem)))] w-[80vw] max-w-[23rem] sm:h-auto sm:w-auto sm:max-w-[26rem] lg:max-w-[40rem]"
            >
              {/* Action button: on mobile it straddles the capsule's top edge,
                  dead-centre — the reference's mobile arrangement; from lg up
                  it moves to the right edge. */}
              <div
                data-hero-badge
                className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 lg:left-auto lg:right-0 lg:top-[19%] lg:translate-x-1/2"
              >
                {/* ~80px on mobile (the reference), 112px from lg up.
                    The badge is an action: it opens the consultation form. */}
                <CircleBadge
                  text="LET'S TALK"
                  onClick={openConsult}
                  ariaLabel="Open the consultation form"
                  className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
                  tone="light"
                  bordered
                />
              </div>

              {/* Halo ring behind the capsule, as in the reference */}
              <div
                data-hero-halo
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
                  <RevealBlock delay={0.06} y={18}>
                    <p className="font-serif text-[1.85rem] font-normal leading-tight tracking-tight text-ink lg:text-[1.4rem]">
                      {hero.name}
                    </p>
                  </RevealBlock>
                  <RevealBlock delay={0.18} y={8}>
                    <span
                      aria-hidden="true"
                      className="mx-auto mt-4 block h-0.5 w-10 origin-left rounded-full bg-plum-600 lg:mx-0"
                    />
                  </RevealBlock>
                  <RevealBlock delay={0.3} y={18}>
                    <p className="mx-auto mt-5 max-w-[16.5rem] text-[1.125rem] leading-[1.8] text-ink-70 lg:mx-0 lg:text-[1.0625rem]">
                      {hero.description}
                    </p>
                  </RevealBlock>
                </div>
              </RevealBlock>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
