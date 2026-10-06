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
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="paper texture-creases relative overflow-x-clip bg-cream pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-44 lg:pb-24"
    >
      {/* Soft brand wash. The wash wrapper carries the clipping (not the
          section itself) because an `overflow: hidden` ancestor would kill
          the description column's sticky behaviour. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-48 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-lavender opacity-80 blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-mist opacity-70 blur-3xl" />
      </div>

      {/* Headline */}
      <div data-hero-headline className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <SplitReveal
          as="h1"
          className="h-display mx-auto max-w-3xl text-center font-semibold text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1.16] sm:leading-[1.1] lg:leading-none"
          start="top 99%"
          stagger={0.06}
          direction="down"
        >
          {hero.headline.map((part, i) =>
            part.accent ? (
              <span key={i} className="font-serif text-plum-800">
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
            <div className="relative mx-auto h-[min(36rem,calc(100dvh-19.5rem))] w-[78vw] max-w-[21.5rem] sm:h-auto sm:w-auto sm:max-w-[26rem] lg:max-w-[40rem]">
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

              <div
                data-hero-capsule
                className="relative h-full w-full overflow-hidden rounded-[999px] bg-cream-deep shadow-soft sm:h-auto sm:aspect-[3/5.4]"
              >
                <div
                  data-hero-capsule-img
                  className="absolute -inset-y-[8%] inset-x-0"
                >
                  <img
                    src="/images/photo/hands-support.jpg"
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
                  <p className="text-[1.65rem] font-medium leading-tight tracking-tight text-ink lg:text-[1.35rem]">
                    {hero.name}
                  </p>
                  <p className="mx-auto mt-5 max-w-[16.5rem] text-[1.0625rem] leading-[1.8] text-ink-70 lg:mx-0">
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
