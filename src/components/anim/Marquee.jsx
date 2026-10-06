import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Marquee — the template's full-bleed scrolling keyword band.
 *
 * The track is duplicated, then translated by exactly -50% so the loop is
 * seamless. The animation is paused when the tab is hidden and disabled
 * entirely for visitors who prefer reduced motion (the band still reads as a
 * static list).
 */
export default function Marquee({
  items = [],
  speed = 32,
  reverse = false,
  className = '',
  separator = '—',
}) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    // The track holds two identical copies, so travelling exactly -50% (or
    // 0% -> -50% reversed) lands on a pixel-identical position: a seamless loop.
    const from = reverse ? -50 : 0;
    const to = reverse ? 0 : -50;
    const tween = gsap.fromTo(
      track,
      { xPercent: from },
      { xPercent: to, duration: speed, ease: 'none', repeat: -1 },
    );

    const onVisibility = () => {
      if (document.hidden) tween.pause();
      else tween.resume();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      tween.kill();
    };
  }, [speed, reverse]);

  const set = items.length ? items : [''];

  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
      <div ref={trackRef} className="flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {set.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="label px-6 py-5 whitespace-nowrap sm:px-9 sm:py-7">
                  {item}
                </span>
                <span className="text-base opacity-40 sm:text-lg">{separator}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
