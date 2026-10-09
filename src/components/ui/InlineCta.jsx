import { Label } from './Blocks.jsx';
import SplitReveal, { RevealBlock } from '../anim/SplitReveal.jsx';
import OrbitRing from './OrbitRing.jsx';

/**
 * Mini feature icons for the three reassurance points under the copy.
 * Hairline line-art, drawn to match the site's icon language.
 */
const featureGlyphs = {
  chat: (
    <>
      <path d="M19.5 11.7c0 3.2-3.3 5.8-7.4 5.8-.9 0-1.7-.1-2.4-.3l-3.6 1.7 1.1-2.8c-1.4-1-2.2-2.6-2.2-4.4 0-3.2 3.3-5.8 7.4-5.8s7.1 2.6 7.1 5.8Z" />
      <circle cx="9" cy="11.7" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12.4" cy="11.7" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="11.7" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  file: (
    <>
      <path d="M7.2 3.8h6L17.8 8v12.2H7.2z" />
      <path d="M13.2 3.8V8h4.6" />
      <path d="M9.6 12.4h5.4M9.6 15.4h5.4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.4 5.6 5.8v5.2c0 3.9 2.6 7 6.4 8.2 3.8-1.2 6.4-4.3 6.4-8.2V5.8L12 3.4Z" />
      <path d="m9.2 11.7 2.1 2.1 4-4.2" />
    </>
  ),
};

function FeatureGlyph({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {featureGlyphs[name]}
    </svg>
  );
}

/**
 * InlineCta — the reference's compact mid-page call-to-action band.
 *
 * Left: purple label, large two-tone serif heading, short description, then
 * three hairline icon features separated by vertical rules. Right: a circle
 * photograph with the teal "Book an Appointment" disc overlapping its top
 * left; a hairline ring with a slowly orbiting plum dot encircles the pair
 * (the site's rotating language — the dot tween is killed and restarted
 * cleanly on StrictMode remounts).
 *
 * The band is deliberately shallower than the old version: copy and imagery
 * share one tight row from `lg` up. On mobile everything stacks and centres.
 * With `onAction` the disc is a button; otherwise it is a plain anchor.
 */
export default function InlineCta({
  label = 'Take the next step',
  title = 'Have questions',
  titleContinuation = 'about',
  accent = 'your care?',
  description = 'Speak with our team about your diagnosis, treatment options, or a second opinion.',
  href = '#contact',
  onAction = null,
  linkLabel = 'Book an Appointment',
  image = '/images/photo/journey-c.jpg',
  imageAlt = 'A calm detail photographed for the care band.',
  tone = 'paper',
  className = '',
  features = [
    { id: 'guidance', icon: 'chat', text: 'Get expert guidance' },
    { id: 'options', icon: 'file', text: 'Discuss treatment options' },
    { id: 'concerns', icon: 'shield', text: 'Clarify your concerns' },
  ],
}) {
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
        <div className="grid items-center gap-9 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14 lg:py-14">
          {/* Copy + reassurance features */}
          <div className="text-center lg:text-left">
            <RevealBlock y={16}>
              <span className="inline-flex items-center gap-4">
                <Label tone="plum">{label}</Label>
                <span
                  aria-hidden="true"
                  className="hidden h-px w-12 bg-plum-200/80 sm:block"
                />
              </span>
            </RevealBlock>

            <SplitReveal
              as="h2"
              id="inline-cta-heading"
              className="h-serif mt-4 text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.05]"
              stagger={0.05}
            >
              {title} {titleContinuation}{' '}
              <span className="text-plum-600">{accent}</span>
            </SplitReveal>

            <RevealBlock delay={0.12}>
              <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-[1.75] text-ink-70 sm:text-base lg:mx-0">
                {description}
              </p>
            </RevealBlock>

            {/* Three reassurance points, hairline-separated */}
            <RevealBlock delay={0.18}>
              <ul className="mx-auto mt-7 flex flex-col items-center gap-5 sm:flex-row sm:items-stretch sm:gap-0 lg:mx-0">
                {features.map((feature, i) => (
                  <li
                    key={feature.id}
                    className={`flex items-center gap-3.5 sm:px-7 ${
                      i === 0 ? 'sm:pl-0' : 'sm:border-l sm:border-line'
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lavender text-plum-700">
                      <FeatureGlyph name={feature.icon} />
                    </span>
                    <span className="max-w-[9rem] text-left text-[0.8125rem] font-medium leading-snug text-ink">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealBlock>
          </div>

          {/* Circle photo + overlapping disc + orbit ring */}
          <div className="relative mx-auto w-full max-w-[20rem] lg:mr-[-3rem] lg:max-w-none lg:justify-self-end">
            {/* The orbiting ring wraps both the photo and the disc */}
            <OrbitRing
              ringClass="-inset-6 z-20 border border-plum-600/40 sm:-inset-8"
              dotClass="bg-plum-600"
            />

            <div className="circle-mask relative aspect-square w-full overflow-hidden bg-cream-deep shadow-soft">
              <img
                src={image}
                alt={imageAlt}
                draggable="false"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-teal-900/20 via-transparent to-plum-800/5"
              />
            </div>

            {/* Disc straddles the photo's top-left edge */}
            <div className="absolute -top-4 left-1/2 z-30 -translate-x-1/2 sm:-top-6 lg:left-0 lg:top-6 lg:-translate-x-1/3">
              {onAction ? (
                <button
                  type="button"
                  onClick={onAction}
                  className="group relative flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full bg-teal-800 text-cream shadow-soft transition-transform duration-500 ease-out hover:scale-105 sm:h-32 sm:w-32"
                  aria-label={linkLabel}
                >
                  <span className="text-[0.625rem] font-semibold uppercase leading-relaxed tracking-[0.28em] sm:text-[0.6875rem]">
                    Book an
                    <br />
                    Appointment
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              ) : (
                <a
                  href={href}
                  className="group relative flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full bg-teal-800 text-cream shadow-soft transition-transform duration-500 ease-out hover:scale-105 sm:h-32 sm:w-32"
                  aria-label={linkLabel}
                >
                  <span className="text-[0.625rem] font-semibold uppercase leading-relaxed tracking-[0.28em] sm:text-[0.6875rem]">
                    Book an
                    <br />
                    Appointment
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
