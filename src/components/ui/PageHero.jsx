import SplitReveal, { RevealBlock, Parallax } from '../anim/SplitReveal.jsx';
import OrbitRing from './OrbitRing.jsx';
import { Label } from './Blocks.jsx';

/** Pill anchor in PillButton's solid dressing, for in-site links. */
function PillLink({ href, children, className = '' }) {
  return (
    <a
      href={href}
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-teal-800 bg-teal-800 px-8 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-cream transition-colors duration-500 hover:border-teal-900 hover:bg-teal-900 ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-teal-900 transition-transform duration-500 ease-out group-hover:scale-y-100"
      />
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="relative z-10 transition-transform duration-500 group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </a>
  );
}

/**
 * ---------------------------------------------------------------------------
 * PageHero — THE hero template. Every page except the home page renders its
 * opening through this one component, so spacing, type scale, image sizing
 * and tint can never drift between pages.
 * ---------------------------------------------------------------------------
 * Structure (identical to the approved About hero, which now uses it too):
 *
 *   faded green tint + brand washes →
 *   plum label + hairline → large serif h1 (optional plum accent line) →
 *   circular photograph in an OrbitRing (same 23rem sizing, right-hugging,
 *   slow parallax drift) → short description → optional pill CTA.
 *
 * `image` is optional — pages without a hero photograph (Contact) render the
 * same editorial head without the grid's second column, at the same height
 * rhythm. Mobile reads label → title → image → description (§1) via DOM
 * order; from `lg` the columns are explicitly placed on one grid.
 */
export default function PageHero({
  label,
  title,
  titleAccent,
  description,
  image,
  imageAlt,
  ctaLabel,
  ctaHref,
  className = '',
}) {
  return (
    <section
      className={`paper texture-creases relative overflow-x-clip bg-cream pt-24 pb-10 sm:pt-28 sm:pb-12 lg:pt-28 lg:pb-14 ${
        // Mobile, photo-less hero (Contact): no image to size, so the block
        // itself fills the first screen — label → title → description
        // centred in the viewport. From lg the original rhythm returns.
        image ? '' : 'flex min-h-[100dvh] flex-col justify-center lg:min-h-0 lg:block'
      } ${className}`}
    >
      {/* Faded green tint — every inner page's hero carries it (home stays
          cream). Sits above the section background, below the washes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-teal-100/60"
      />

      {/* Soft brand washes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-plum-100 opacity-80 blur-3xl" />
        <div className="absolute top-1/4 -right-32 h-72 w-72 rounded-full bg-teal-100 opacity-80 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <div
          className={`grid items-center gap-7 ${
            image ? 'lg:grid-cols-12 lg:gap-x-12' : ''
          }`}
        >
          {/* Label + title */}
          <div className={image ? 'lg:col-span-6 lg:col-start-1 lg:row-start-1' : ''}>
            <RevealBlock y={16}>
              <span className="inline-flex max-w-full items-center gap-4">
                <Label tone="plum">{label}</Label>
                {/* Hairline hides on narrow phones — at 360px the tracked
                    label alone already fills the content box. */}
                <span
                  aria-hidden="true"
                  className="hidden h-px w-12 bg-plum-200/80 sm:block sm:w-16"
                />
              </span>
            </RevealBlock>
            <SplitReveal
              as="h1"
              className="h-serif mt-4 text-[clamp(3.15rem,5vw,3.9rem)] leading-[1.05]"
              stagger={0.055}
              start="top 92%"
            >
              {title}
              {titleAccent ? (
                <>
                  <br />
                  <span className="text-plum-600">{titleAccent}</span>
                </>
              ) : null}
            </SplitReveal>
          </div>

          {/* Circular photograph — second in the DOM, so mobile reads
              label → title → image → description (§1). */}
          {image ? (
            <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
              <div className="relative mx-auto w-[min(84vw,22rem)] lg:-mr-8 lg:ml-auto lg:w-full lg:max-w-[23rem] xl:-mr-12">
                <OrbitRing
                  ringClass="-inset-5 border border-ink/15 sm:-inset-7"
                  dotClass="bg-plum-600"
                />
                <div className="circle-mask relative overflow-hidden bg-cream-deep shadow-soft">
                  <Parallax strength={18}>
                    <img
                      src={image}
                      alt={imageAlt}
                      className="aspect-square w-full object-cover"
                      width={1024}
                      height={1024}
                    />
                  </Parallax>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-teal-900/25 via-transparent to-plum-800/10"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {/* Description */}
          <div className={image ? 'lg:col-span-6 lg:col-start-1 lg:row-start-2' : ''}>
            <RevealBlock delay={0.14} y={18}>
              <p className="max-w-md text-[1.0625rem] leading-[1.8] text-ink-70 sm:text-base">
                {description}
              </p>
              {ctaLabel ? (
                <div className="mt-6">
                  <PillLink href={ctaHref ?? '#/'}>{ctaLabel}</PillLink>
                </div>
              ) : null}
            </RevealBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
