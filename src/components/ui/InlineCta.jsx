import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Label } from './Blocks.jsx';
import SplitReveal, { RevealBlock } from '../anim/SplitReveal.jsx';

/**
 * DiscArt — the ring + teal disc artwork shared by the anchor and the button
 * variants of the disc. Children go inside the hairline ring, so the ring and
 * the orbiting dot stay on top of whatever actionable element wraps them.
 */
function DiscArt({ children }) {
  return (
    <>
      {/* Hairline ring with the orbiting purple dot */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-full border border-ink/15 sm:-inset-5"
      >
        <span className="absolute -top-[5px] left-[72%] h-2.5 w-2.5 rounded-full bg-plum-600" />
      </div>

      {/* Teal disc */}
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-full bg-teal-800 text-cream transition-transform duration-500 ease-out group-hover:scale-105">
        <span className="text-[0.8125rem] font-semibold uppercase leading-relaxed tracking-[0.3em]">
          Let&rsquo;s
          <br />
          Talk
        </span>
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1"
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
      {children}
    </>
  );
}

/**
 * InlineCta — the reference template's ruled mid-page call-to-action band,
 * packaged as a drop-in component for use anywhere on the page.
 *
 * Desktop: a hairline rule above and below; left column with a small purple
 * label, a large serif heading whose final phrase is set in the brand purple,
 * and a short sans description; then the teal "Let's Talk" disc inside a
 * hairline ring with a slowly orbiting purple dot; then a large circular
 * photograph that bleeds off the right edge of the viewport.
 *
 * Mobile: the same content stacks and centres, with the disc and the circle
 * photograph following the text.
 *
 * Everything is driven by props (with sensible defaults from the clinic data),
 * so the band can be repeated with different copy and imagery.
 */
export default function InlineCta({
  label = 'Take the next step',
  title = 'Have questions',
  titleContinuation = 'about',
  accent = 'your care?',
  description = 'Speak with our team about your diagnosis, treatment options, or a second opinion.',
  href = '#contact',
  onAction = null,
  linkLabel = "Let's talk",
  image = '/images/photo/reception-plants.jpg',
  imageAlt = 'The calm clinic reception, ready to welcome patients.',
  tone = 'paper',
  className = '',
}) {
  const ringRef = useRef(null);

  // The dot orbits its hairline ring slowly — the site's quiet rotating
  // language, repeated here. Killed on cleanup (StrictMode included).
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const tween = gsap.to(ring, {
      rotation: 360,
      duration: 22,
      ease: 'none',
      repeat: -1,
    });
    return () => tween.kill();
  }, []);

  const tones = {
    paper: 'bg-paper',
    cream: 'bg-cream',
    lavender: 'bg-lavender',
    mist: 'bg-mist',
  };

  return (
    <section
      className={`overflow-x-clip border-y border-line ${tones[tone] ?? tones.paper} ${className}`}
      aria-labelledby="inline-cta-heading"
    >
      <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-14 lg:py-20">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <RevealBlock y={16}>
              <Label tone="plum">{label}</Label>
            </RevealBlock>

            <SplitReveal
              as="h2"
              id="inline-cta-heading"
              className="h-serif mt-5 text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.04]"
              stagger={0.05}
            >
              {title}{' '}
              <br />
              {titleContinuation}{' '}
              <span className="text-plum-600">{accent}</span>
            </SplitReveal>

            <RevealBlock delay={0.12}>
              <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-[1.8] text-ink-70 sm:text-lg lg:mx-0">
                {description}
              </p>
            </RevealBlock>
          </div>

          {/* Disc + orbiting ring. With `onAction` it is a button that fires
              the action (e.g. the consultation overlay); otherwise it stays a
              plain anchor to `href`. */}
          <div className="flex justify-center lg:justify-start">
            {onAction ? (
              <button
                type="button"
                onClick={onAction}
                className="group relative block h-36 w-36 sm:h-44 sm:w-44"
                aria-label={linkLabel}
              >
                <DiscArt />
              </button>
            ) : (
              <a
                href={href}
                className="group relative block h-36 w-36 sm:h-44 sm:w-44"
                aria-label={linkLabel}
              >
                <DiscArt />
              </a>
            )}
          </div>

          {/* Circle photograph — bleeds off the right edge on desktop */}
          <div className="flex justify-center lg:justify-end">
            <div className="h-72 w-72 overflow-hidden rounded-full sm:h-80 sm:w-80 lg:-mr-28 lg:h-[24rem] lg:w-[24rem]">
              <img
                src={image}
                alt={imageAlt}
                draggable="false"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
