import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * Loader — the opening curtain as sideways sliding doors.
 *
 *   1. Two brand doors cover the page, both deep teal: the left carries the
 *      word "onco", the right carries "cure" — set small and dainty in
 *      Cormorant Garamond semibold, white, letterspaced like a colophon.
 *   2. On small screens the pair collapses to a single full-width teal door
 *      reading "onco cure" — one panel, still sliding sideways.
 *   3. The doors slide apart horizontally (left → -100%, right → +100%),
 *      words riding along, revealing the hero already laid out beneath.
 *
 * There is deliberately no paper front panel or logo image — the two words
 * are the whole show.
 *
 * The page renders underneath the whole time; the loader is purely an
 * overlay. On completion it signals `occ:reveal` and unmounts through React
 * state. Respects `prefers-reduced-motion` by skipping straight to reveal,
 * and holds the body still while the doors are closed.
 */
export default function Loader() {
  const root = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return undefined;
    const el = root.current;
    if (!el) return undefined;

    // Hold the page still while the doors are closed.
    document.body.style.overflow = 'hidden';

    const finish = () => {
      document.body.style.overflow = '';
      window.dispatchEvent(new Event('occ:reveal'));
      // Unmount through React rather than removing the node behind its back.
      setDone(true);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return undefined;
    }

    const ctx = gsap.context(() => {
      // One door below `sm`, two above — decide once, at timeline build.
      const single = !window.matchMedia('(min-width: 640px)').matches;

      const tl = gsap.timeline({ onComplete: finish });

      tl
        // The words register on their doors.
        .fromTo(
          '[data-door-word]',
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.1,
          },
        )
        // A quiet hold.
        .to({}, { duration: 0.55 })
        // The doors slide sideways apart, words riding along, opening the
        // stage.
        .to(
          '[data-door-left]',
          { xPercent: -100, duration: 1.05, ease: 'power4.inOut' },
          'open+=0.05',
        );

      // The right door only exists from `sm` up — on small screens the
      // single left door carries the whole lockup and slides alone.
      if (!single) {
        tl.to(
          '[data-door-right]',
          { xPercent: 100, duration: 1.05, ease: 'power4.inOut' },
          'open+=0.05',
        );
      }
    }, el);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [done]);

  if (done) return null;

  return (
    <div ref={root} aria-hidden="true" className="fixed inset-0 z-[100] overflow-hidden">
      {/* Left door — deep teal, "onco". Full width on small screens (the
          single-panel door); half width from `sm` up. */}
      <div
        data-door-left
        className="absolute inset-y-0 left-0 flex w-full items-center justify-center bg-teal-900 sm:w-1/2 sm:justify-end sm:pr-[0.32em]"
      >
        <span
          data-door-word
          className="font-garamond font-semibold text-[clamp(1.5rem,3.4vw,2.4rem)] leading-none tracking-[0.22em] text-white"
        >
          Onco
        </span>
        {/* The single door carries the full name on mobile. */}
        <span
          data-door-word
          className="ml-[0.6em] font-garamond font-semibold text-[clamp(1.5rem,3.4vw,2.4rem)] leading-none tracking-[0.22em] text-white sm:hidden"
        >
          Cure
        </span>
      </div>

      {/* Right door — teal, "Cure". Desktop only; the two words sit flush
          across the seam so they read as one name: Onco|Cure. */}
      <div
        data-door-right
        className="absolute inset-y-0 right-0 hidden w-1/2 items-center border-l border-cream/15 bg-teal-800 sm:flex sm:pl-[0.32em]"
      >
        <span
          data-door-word
          className="font-garamond font-semibold text-[clamp(1.5rem,3.4vw,2.4rem)] leading-none tracking-[0.22em] text-white"
        >
          Cure
        </span>
      </div>
    </div>
  );
}
