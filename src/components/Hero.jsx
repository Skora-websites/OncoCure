import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { hero } from '../data/clinic.js';
import { RevealBlock } from './anim/SplitReveal.jsx';
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

    const ringPurple = el.querySelector('[data-hero-ring-purple]');
    const orbitDotsPurple = ringPurple ? [...ringPurple.children] : [];

    let handleResize = null;
    let onRevealCleanup = null;

    const ctx = gsap.context(() => {
      // 1. Capsule entrance: wipes open upward, badge settles, accent line draws
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

      // 2. Headline entrance: Line 1 slides in from off-screen left, Line 2 from off-screen right
      const startHeadlineAnimation = () => {
        gsap.fromTo(
          '[data-hero-line-1]',
          { x: -window.innerWidth, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.3,
            ease: 'expo.out',
            clearProps: 'transform',
          },
        );
        gsap.fromTo(
          '[data-hero-line-2]',
          { x: window.innerWidth, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.3,
            ease: 'expo.out',
            delay: 0.12, // 120ms after line 1 so they meet in place
            clearProps: 'transform',
          },
        );
      };

      // Check whether the leading curtain doors are currently in the DOM
      const hasDoor =
        typeof document !== 'undefined' &&
        Boolean(document.querySelector('[data-door-left]'));

      let headlineStarted = false;
      const playHeadlineOnce = () => {
        if (headlineStarted) return;
        headlineStarted = true;
        startHeadlineAnimation();
      };

      if (hasDoor && !window.__heroLoaded) {
        // Hold headline off-screen while the leading screen curtain doors are active
        gsap.set('[data-hero-line-1]', { x: -window.innerWidth, opacity: 0 });
        gsap.set('[data-hero-line-2]', { x: window.innerWidth, opacity: 0 });

        // Trigger as doors clear (~2.3s), or upon occ:reveal event (whichever comes first)
        const autoTrigger = gsap.delayedCall(2.3, playHeadlineOnce);

        const onReveal = () => {
          autoTrigger.kill();
          playHeadlineOnce();
        };

        window.addEventListener('occ:reveal', onReveal, { once: true });
        onRevealCleanup = () => {
          autoTrigger.kill();
          window.removeEventListener('occ:reveal', onReveal);
        };
      } else {
        // No loader active: animate almost immediately
        gsap.delayedCall(0.1, playHeadlineOnce);
      }

      window.__heroLoaded = true;

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
        if (a <= 0 || b <= 0) return 0;
        const s = Math.sin(phi);
        const c = Math.cos(phi);
        const straight = Math.max(0, b - a); // half-length of the vertical straight sides
        if (straight === 0) return a;
        // The ray lands on a straight side while |tan φ| fits its span.
        if (c !== 0 && Math.abs(s / c) <= straight / a) return a / Math.abs(c);
        // Otherwise it lands on the top/bottom cap (circle of radius a).
        const underRadical = Math.max(0, a * a - straight * straight * c * c);
        return (
          straight * Math.abs(s) +
          Math.sqrt(underRadical)
        );
      };

      if (ring || ringPurple) {
        // Half-dimensions of each dash line's centreline
        let a1 = ring ? ring.offsetWidth / 2 - 0.5 : 0;
        let b1 = ring ? ring.offsetHeight / 2 - 0.5 : 0;
        let a2 = ringPurple ? ringPurple.offsetWidth / 2 - 0.5 : 0;
        let b2 = ringPurple ? ringPurple.offsetHeight / 2 - 0.5 : 0;

        // Define measurement and resize handling functions outside the conditional so they are accessible in cleanup
        const measure = () => {
          if (ring && ring.offsetWidth > 0) {
            a1 = ring.offsetWidth / 2 - 0.5;
            b1 = ring.offsetHeight / 2 - 0.5;
          }
          if (ringPurple && ringPurple.offsetWidth > 0) {
            a2 = ringPurple.offsetWidth / 2 - 0.5;
            b2 = ringPurple.offsetHeight / 2 - 0.5;
          }
        };

        handleResize = () => {
          measure();
        };
        // Add resize listener only if at least one ring exists
        if (ring || ringPurple) {
          window.addEventListener('resize', handleResize);
        }

        const toCalc = (val) =>
          val >= 0
            ? `calc(-50% + ${val.toFixed(2)}px)`
            : `calc(-50% - ${Math.abs(val).toFixed(2)}px)`;

        const updateDots = (progress) => {
          if (a1 <= 0 || b1 <= 0) measure();
          const theta = progress * 2 * Math.PI;

          // Inner teal ring dots (counter-clockwise orbit along racetrack outline)
          if (ring && orbitDots.length > 0) {
            orbitDots.forEach((dot, i) => {
              const phi = phi0[i] - theta;
              const r = stadiumRadius(phi, a1, b1);
              const x = r * Math.cos(phi);
              const y = r * Math.sin(phi);
              dot.style.transform = `translate(${toCalc(x)}, ${toCalc(y)})`;
            });
          }

          // Outer plum ring dots (clockwise orbit in exact symmetrical reverse along racetrack outline)
          if (ringPurple && orbitDotsPurple.length > 0) {
            orbitDotsPurple.forEach((dot, i) => {
              const phi = phi0[i] + theta;
              const r = stadiumRadius(phi, a2, b2);
              const x = r * Math.cos(phi);
              const y = r * Math.sin(phi);
              dot.style.transform = `translate(${toCalc(x)}, ${toCalc(y)})`;
            });
          }
        };

        // Slow ambient rotation of dashed registration rings (untouched)
        const ringTimeline = gsap.timeline({
          repeat: -1,
          ease: 'none',
        });

        if (ring) {
          ringTimeline.fromTo(
            ring,
            { rotation: 0 },
            { rotation: 360, duration: 45, ease: 'none' },
            0,
          );
        }

        if (ringPurple) {
          ringTimeline.fromTo(
            ringPurple,
            { rotation: 0 },
            { rotation: -360, duration: 45, ease: 'none' },
            0,
          );
        }

        // Dedicated orbit animation for the dots (10s per complete orbit)
        gsap.to(
          {},
          {
            duration: 10,
            repeat: -1,
            ease: 'none',
            onUpdate: function () {
              updateDots(this.progress());
            },
          },
        );

        // Initialize dots synchronously at t = 0
        updateDots(0);
      }
    }, el);

    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && el) {
      ro = new ResizeObserver(() => {
        if (handleResize) handleResize();
      });
      ro.observe(el);
    }

    return () => {
      if (onRevealCleanup) {
        onRevealCleanup();
      }
      if (ro) {
        ro.disconnect();
      }
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
      ctx.revert();
      orbitDots.forEach((dot) => {
        dot.style.transform = '';
      });
      orbitDotsPurple.forEach((dot) => {
        dot.style.transform = '';
      });
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-x-clip bg-cream pt-36 pb-14 sm:pt-48 sm:pb-20 lg:pt-52 lg:pb-24"
    >
      {/* Clean ground: delicate static film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="hero-grain absolute inset-0" />
      </div>

      {/* Headline */}
      <div data-hero-headline className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
        {/* Eyebrow */}
        <RevealBlock delay={0.1} y={14}>
          <span className="flex items-center justify-center gap-3 sm:gap-4">
            <span aria-hidden="true" className="h-px w-8 bg-ink/25 sm:w-16" />
            <span className="label text-[0.6875rem] sm:text-xs text-ink-70">
              Specialist Oncology Care · Greater Noida
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-ink/25 sm:w-16" />
          </span>
        </RevealBlock>

        <h1 className="h-serif mx-auto max-w-3xl text-center font-normal text-teal-900 text-[clamp(2.15rem,7.2vw,2.75rem)] sm:text-[clamp(2.75rem,5.5vw,3.5rem)] lg:text-[3.9rem] leading-[1.12] sm:leading-[1.02] lg:leading-none">
          <span
            data-hero-line-1
            className="block whitespace-nowrap sm:whitespace-normal will-change-transform"
          >
            {hero.headline[0].text.trim()}
          </span>
          <span
            data-hero-line-2
            className="block text-plum-800 whitespace-nowrap sm:whitespace-normal will-change-transform"
          >
            {hero.headline[1].text.trim()}
          </span>
        </h1>

        {/* Small animated accent beneath the headline */}
        <div
          data-hero-accent
          aria-hidden="true"
          className="relative mx-auto mt-5 sm:mt-6 h-3 w-24 sm:w-28"
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

      {/* Grid: Narrow copy column + tall capsule photograph */}
      <div
        data-hero-grid
        className="mx-auto mt-14 sm:mt-16 lg:mt-20 w-full max-w-[88rem] px-0 sm:px-8 lg:px-12"
      >
        <div className="relative lg:grid lg:grid-cols-12">
          {/*
           * Capsule column:
           * - On mobile: centered stadium with stable aspect-[3/5.2] at 84vw for comfortable breathing room,
           *   allowing animated racetrack rings to gracefully reach the viewport edges.
           * - On desktop: placed in cols 4-9 alongside the sticky copy with original max-w-[40rem] and aspect-[3/5.4].
           */}
          <div className="sm:mt-6 lg:col-start-4 lg:col-span-6 lg:row-start-1 lg:mt-0">
            <div
              data-hero-stage
              className="relative mx-auto w-[84vw] max-w-[23rem] sm:h-auto sm:w-auto sm:max-w-[26rem] lg:max-w-[40rem]"
            >
              {/* Action button: placed in the top middle on mobile, on the shoulder on desktop */}
              <div
                className="absolute -top-7 left-1/2 -translate-x-1/2 sm:-top-3 sm:left-auto sm:right-0 sm:translate-x-0 lg:left-auto lg:right-0 lg:top-[19%] lg:translate-x-1/2 z-20"
              >
                <div data-hero-badge>
                  <CircleBadge
                    text="LET'S TALK"
                    onClick={openConsult}
                    ariaLabel="Open the consultation form"
                    className="h-20 w-20 xs:h-24 xs:w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
                    tone="light"
                    bordered
                  />
                </div>
              </div>

              {/* Halo ring behind the capsule */}
              <div
                data-hero-halo
                aria-hidden="true"
                className="absolute -inset-3 rounded-[999px] border border-ink/10 sm:-inset-7"
              />

              {/* Primary dashed trackfield (teal) */}
              <div
                data-hero-ring
                aria-hidden="true"
                className="absolute -inset-6 rounded-[999px] border border-dashed border-teal-600/60 sm:-inset-14"
              >
                <span className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-plum-600 sm:h-4 sm:w-4" />
                <span className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-teal-700 sm:h-4 sm:w-4" />
              </div>

              {/* Counter-rotating dashed trackfield (plum) */}
              <div
                data-hero-ring-purple
                aria-hidden="true"
                className="absolute -inset-6 rounded-[999px] border border-dashed border-plum-600/60 sm:-inset-14"
              >
                <span className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-teal-700 sm:h-4 sm:w-4" />
                <span className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-plum-600 sm:h-4 sm:w-4" />
              </div>

              {/* The Stadium Capsule Photograph */}
              <div
                data-hero-capsule
                className="relative w-full aspect-[3/5.2] sm:aspect-[3/5.4] overflow-hidden rounded-[999px] bg-cream-deep shadow-soft"
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

          {/* Text column: On desktop shares the grid row and sticks; on mobile follows naturally */}
          <div className="lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:self-stretch">
            <div className="lg:sticky lg:top-[58vh]">
              <RevealBlock delay={0.3} y={26}>
                <div className="mx-auto mt-10 max-w-sm px-4 pb-2 text-center sm:mt-14 sm:max-w-sm sm:px-8 lg:mx-0 lg:mt-0 lg:max-w-[17rem] lg:px-0 lg:pb-0 lg:text-left">
                  <RevealBlock delay={0.06} y={18}>
                    <p className="font-serif text-[1.45rem] sm:text-[1.85rem] font-normal leading-tight tracking-tight text-ink lg:text-[1.4rem]">
                      {hero.name}
                    </p>
                  </RevealBlock>
                  <RevealBlock delay={0.18} y={8}>
                    <span
                      aria-hidden="true"
                      className="mx-auto mt-3.5 block h-0.5 w-10 origin-left rounded-full bg-plum-600 sm:mt-4 lg:mx-0"
                    />
                  </RevealBlock>
                  <RevealBlock delay={0.3} y={18}>
                    <p className="mx-auto mt-4 max-w-[16.5rem] text-[0.9375rem] sm:text-[1.125rem] leading-[1.7] text-ink-70 sm:mt-5 sm:leading-[1.8] lg:mx-0 lg:text-[1.0625rem]">
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
