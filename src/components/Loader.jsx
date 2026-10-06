import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { clinic } from '../data/clinic.js';

/**
 * Loader — the reference site's loading page, closed with a shutter.
 *
 *   1. a paper curtain covers the page, the official logo artwork (purple-teal
 *      serif, exactly as supplied) fades in at the centre,
 *   2. the front curtain slides up out of view, briefly exposing the deep-teal
 *      layer behind it,
 *   3. the teal layer follows — a two-stage shutter opening upward, revealing
 *      the hero already laid out beneath.
 *
 * The page renders underneath the whole time; the loader is purely an overlay.
 * On completion it signals `occ:reveal` and unmounts through React state.
 * Respected `prefers-reduced-motion` by skipping straight to the reveal.
 */
export default function Loader() {
  const root = useRef(null);
  const logoRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return undefined;
    const el = root.current;
    if (!el) return undefined;

    // Hold the page still while the shutter is closed.
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
      gsap
        .timeline({ onComplete: finish })
        // The official logo registers on the paper curtain.
        .fromTo(
          logoRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' },
        )
        // A quiet hold.
        .to({}, { duration: 0.6 })
        // The shutter opens: the paper leaf lifts first, its logo drifting
        // up and away with it.
        .to(
          logoRef.current,
          { yPercent: -60, opacity: 0, duration: 0.7, ease: 'power3.in' },
          'open',
        )
        .to(
          '[data-shutter-front]',
          { yPercent: -100, duration: 0.9, ease: 'power4.inOut' },
          'open+=0.15',
        )
        // …then the teal leaf follows, completing the opening.
        .to(
          '[data-shutter-back]',
          { yPercent: -100, duration: 0.9, ease: 'power4.inOut' },
          'open+=0.5',
        );
    }, el);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [done]);

  if (done) return null;

  return (
    <div ref={root} aria-hidden="true" className="fixed inset-0 z-[100]">
      {/* Back leaf — deep teal, revealed briefly as the paper leaf lifts */}
      <div data-shutter-back className="absolute inset-0 bg-teal-900" />

      {/* Front leaf — paper, carrying the official logo artwork */}
      <div
        data-shutter-front
        className="absolute inset-0 flex items-center justify-center bg-paper"
      >
        <img
          ref={logoRef}
          src={clinic.logo.full}
          alt=""
          draggable="false"
          className="h-16 w-auto opacity-0 sm:h-20"
        />
      </div>
    </div>
  );
}
