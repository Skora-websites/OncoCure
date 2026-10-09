import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * OrbitRing — the site's slowly turning hairline ring with a single accent
 * dot riding it (hero portrait, doctor bands, the InlineCta circle).
 *
 * Why the dot can never drift off the line: it is pinned to the ring's exact
 * top tangent — `left-1/2` (true centre) plus `top-[-0.5px]` with
 * `-translate-y-1/2` places the dot's centre 0.5px from the ring's top edge,
 * i.e. the centre of the 1px border line. The ring itself is what rotates
 * (one GSAP tween), so the dot travels along the circle line. There is no
 * per-dot trigonometry to get wrong.
 *
 * Reduced-motion visitors get a static ring. StrictMode's mount → cleanup →
 * mount cycle always ends with the tween running (`fromTo` restarts it), and
 * cleanup kills the tween and clears the inline transform.
 */
export default function OrbitRing({ ringClass = '', dotClass = 'bg-plum-600' }) {
  const ringRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const tween = gsap.fromTo(
      ring,
      { rotate: 0 },
      { rotate: 360, duration: 22, ease: 'none', repeat: -1 },
    );
    return () => {
      tween.kill();
      gsap.set(ring, { clearProps: 'rotate,transform' });
    };
  }, []);

  return (
    <span
      ref={ringRef}
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${ringClass}`}
    >
      {/* Pinned to the ring's top tangent — the dot's centre rides the 1px
          line exactly, and the rotating ring carries it round the circle. */}
      <span
        className={`absolute left-1/2 top-[-0.5px] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${dotClass}`}
      />
    </span>
  );
}
