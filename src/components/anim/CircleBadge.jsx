import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * CircleBadge — the reference site's circular call-to-action.
 *
 * A light disc with a hairline border and a label set around the rim
 * (the reference reads "LETS TALK"), rotating slowly and continuously.
 * Hovering spins it faster and scales it up — the template's exact hover —
 * and it is a real link to the consultation action.
 *
 * The rim label uses SVG text-on-a-path so it follows the circle at any
 * size; the text is measured against the path length and repeated until it
 * fills the ring without overflowing.
 */
export default function CircleBadge({
  text = 'LET\u2019S TALK \u00b7 ',
  href = '#contact',
  onClick = null,
  className = '',
  size,
  tone = 'light',
  bordered = true,
  ariaLabel,
}) {
  const root = useRef(null);
  const spinner = useRef(null);
  const tween = useRef(null);

  // Base rotation: slow, endless, linear. Hover multiplies the timeScale and
  // lifts the disc, easing back to base on leave — the template's feel.
  useEffect(() => {
    const el = spinner.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    tween.current = gsap.to(el, {
      rotation: 360,
      duration: 16,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      tween.current?.kill();
      tween.current = null;
    };
  }, []);

  const spin = (speed, scale) => {
    if (tween.current) gsap.to(tween.current, { timeScale: speed, duration: 0.5 });
    if (root.current) gsap.to(root.current, { scale, duration: 0.5, ease: 'power3.out' });
  };

  const tones = {
    light: 'bg-paper text-ink border-line',
    ink: 'bg-teal-900 text-cream border-teal-900',
  };

  /* Hover colour-swap (light tone): the fill washes up from the bottom in
     teal while the label inverts to cream — same fill-slide mechanic as the
     template's pill buttons — while the rim keeps its spin speed-up. */
  const hoverFx = {
    light:
      'before:absolute before:inset-0 before:origin-bottom before:scale-y-0 before:rounded-full before:bg-teal-800 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:before:scale-y-100 group-focus-visible:before:scale-y-100',
    ink: '',
  };
  const hoverText = {
    light: 'group-hover:text-cream group-focus-visible:text-cream',
    ink: '',
  };

  /* With `onClick` the badge becomes an action (e.g. opening the
     consultation overlay): `href` is dropped so nothing navigates, and
     keyboard activation is wired up by hand because an anchor without an
     href fires no click on Enter. Without onClick it stays a plain link. */
  const isAction = Boolean(onClick);
  const hasLink = !isAction && Boolean(href);
  const interactive = isAction || hasLink;
  const Tag = interactive ? 'a' : 'div';

  const handleKeyDown = (event) => {
    if (!isAction) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(event);
    }
  };

  // Fill the rim: repeat the label until it covers the path circumference.
  const label = text.trim().endsWith('·') ? text : `${text} · `;
  const repeats = Math.max(1, Math.ceil(150 / Math.max(6, label.length)));

  return (
    <Tag
      ref={root}
      href={isAction ? undefined : href}
      onClick={isAction ? onClick : undefined}
      role={isAction ? 'button' : undefined}
      tabIndex={isAction ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel ?? (interactive ? text : undefined)}
      aria-hidden={interactive ? undefined : 'true'}
      onMouseEnter={() => spin(3.2, 1.08)}
      onMouseLeave={() => spin(1, 1)}
      onFocus={() => spin(3.2, 1.08)}
      onBlur={() => spin(1, 1)}
      className={`group relative block shrink-0 select-none overflow-hidden rounded-full border shadow-soft transition-colors duration-500 ${tones[tone]} ${
        bordered ? '' : 'border-transparent shadow-none'
      } ${hoverFx[tone]} ${hoverText[tone]} ${className}`}
      // Fixed pixel sizing only when `size` is given; otherwise the caller
      // sizes the disc with responsive classes (the SVG label scales with it).
      style={size ? { width: size, height: size } : undefined}
    >
      <div ref={spinner} className="relative z-10 h-full w-full will-change-transform">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <path
              id="badge-rim"
              d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
              fill="none"
            />
          </defs>
          <text
            fill="currentColor"
            fontSize="7.5"
            fontWeight="600"
            letterSpacing="1.1"
          >
            <textPath href="#badge-rim" startOffset="0%">
              {label.repeat(repeats)}
            </textPath>
          </text>
        </svg>
      </div>

      {/* Centre arrow, nudged outward on hover. Sits above the teal wash. */}
      <span className="absolute inset-0 z-10 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="h-[22%] w-[22%] transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-cream"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Tag>
  );
}
