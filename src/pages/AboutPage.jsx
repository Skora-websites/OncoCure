import { useEffect } from 'react';
import { aboutPage, clinic, doctors, inlineCta } from '../data/clinic.js';
import OrbitRing from '../components/ui/OrbitRing.jsx';
import Section, { SectionIntro, PlaceholderTag } from '../components/ui/Blocks.jsx';
import { RevealBlock } from '../components/anim/SplitReveal.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import PillButton from '../components/ui/PillButton.jsx';
import InlineCta from '../components/ui/InlineCta.jsx';
import ClosingCta from '../components/ClosingCta.jsx';
import { Parallax } from '../components/anim/SplitReveal.jsx';
import { openConsult } from '../lib/consultBus.js';

/**
 * ---------------------------------------------------------------------------
 * ABOUT US PAGE (reached via `#/about`)
 * ---------------------------------------------------------------------------
 *
 * Follows the approved About mockup: an editorial hero, Our Story with one
 * clinic photograph, four icon-only values, a horizontal care journey drawn
 * in the site's own hairline/ring language, an impact band of large numbers,
 * the specialists with their photographs, and the existing InlineCta band as
 * the closer — no new CTA component.
 *
 * PROVENANCE: every figure in "Our Impact" that the clinic has not verified
 * carries a visible placeholder tag (same policy as the testimonials). Doctor
 * profile facts come from the CV material the clinic supplied; portraits are
 * the agreed stock placeholders until official photographs arrive.
 *
 * DESIGN_RULES.md §1: below `lg` every section reads title → image (if any)
 * → description, via DOM order plus explicit lg grid placement.
 */

/* -------------------------------------------------------------------------
 * Line icons — drawn in the site's hairline weight. Values and impact are
 * icon-only (no photographs), as the brief requires.
 * ---------------------------------------------------------------------- */
const glyphs = {
  people: (
    <>
      <circle cx="9.2" cy="8.4" r="3.2" />
      <path d="M3.6 19.2c.6-3 2.9-4.8 5.6-4.8s5 1.8 5.6 4.8" />
      <circle cx="16.8" cy="9.6" r="2.3" />
      <path d="M16.2 14.6c2.2-.2 4.1 1.2 4.7 4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.4 5.4 5.9v5.3c0 4 2.7 7.2 6.6 8.4 3.9-1.2 6.6-4.4 6.6-8.4V5.9L12 3.4Z" />
      <path d="m9 11.9 2.2 2.2 4.2-4.4" />
    </>
  ),
  chat: (
    <>
      <path d="M20 12.3c0 3.5-3.6 6.4-8 6.4-.9 0-1.7-.1-2.5-.4L5.2 20.4l1.3-3.2C4.9 16 4 14.3 4 12.3 4 8.8 7.6 5.9 12 5.9s8 2.9 8 6.4Z" />
      <circle cx="9" cy="12.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12.2" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  heart: (
    <path d="M12 19.5C7.2 16.4 4.5 13.6 4.5 10.6A3.9 3.9 0 0 1 12 8.7a3.9 3.9 0 0 1 7.5 1.9c0 3-2.7 5.8-7.5 8.9Z" />
  ),
  stethoscope: (
    <>
      <path d="M6.2 3.6v4.1a3.9 3.9 0 0 0 7.8 0V3.6" />
      <path d="M4.7 3.6h3M12.7 3.6h3" />
      <path d="M10.1 11.5v2a4.6 4.6 0 0 0 9.2 0v-1.1" />
      <circle cx="19.3" cy="9.6" r="2.1" />
    </>
  ),
  file: (
    <>
      <path d="M7 3.6h6.4L18 8.2v12.2H7z" />
      <path d="M13.4 3.6v4.6H18" />
      <path d="M9.6 12.6h5.2M9.6 15.6h5.2" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 3.8v2.4M12 17.8v2.4M20.2 12h-2.4M6.2 12H3.8M17.8 6.2l-1.7 1.7M7.9 16.1l-1.7 1.7M17.8 17.8l-1.7-1.7M7.9 7.9 6.2 6.2" />
    </>
  ),
  hands: (
    <>
      <path d="M12 8.6c1-1.9 4.7-1.7 4.7 1 0 2.1-2.7 3.7-4.7 5.1-2-1.4-4.7-3-4.7-5.1 0-2.7 3.7-2.9 4.7-1Z" />
      <path d="M4.4 14.2c1.8.5 4.4 4.3 7.6 4.3s5.8-3.8 7.6-4.3" />
    </>
  ),
  ribbon: (
    <>
      <circle cx="12" cy="8.8" r="4.1" />
      <path d="m9.4 12.4-2.7 8.2 5.3-2.8 5.3 2.8-2.7-8.2" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5.2" y="5.4" width="13.6" height="14.8" rx="2" />
      <path d="M9.1 5.4V4.1a1.1 1.1 0 0 1 1.1-1.1h3.6a1.1 1.1 0 0 1 1.1 1.1v1.3" />
      <path d="M8.9 10.4h6.2M8.9 13.6h6.2M8.9 16.8h4" />
    </>
  ),
};

function Glyph({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      {glyphs[name]}
    </svg>
  );
}

/** Pill anchor in PillButton's outline dressing (for in-page journeys). */
function PillLink({ href, tone = 'outline', children }) {
  const tones = {
    outline: 'border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream',
    solid:
      'border-teal-800 bg-teal-800 text-cream hover:border-teal-900 hover:bg-teal-900',
  };
  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-3 rounded-full border px-8 py-4 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-500 ${tones[tone]}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-500 group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </a>
  );
}

/**
 * DoctorBand — one full-bleed colour band per doctor.
 *
 * Band 1 is teal, band 2 plum. At `lg` the band is exactly two aligned
 * content blocks separated by a hairline: the doctor's identity (number,
 * name, credentials) stacked directly above the description, and opposite
 * it the circular portrait over a colour halo with an OrbitRing — the image
 * side alternates per band. Both columns are `justify-self`-pinned and
 * centre-locked to the same width, so the two bands read as one repeated
 * pattern. Each body block is a fixed-max-width column (max-w narrow +
 * centered), with no content peeking outside. On mobile it reads
 * name → portrait → description (DESIGN_RULES.md §1).
 */
function DoctorBand({ doctor, index }) {
  const first = index === 0;
  const band = first
    ? {
        section: 'bg-teal-100/45',
        halo: 'bg-teal-200/50',
        ring: 'border-teal-700/45',
        dot: 'bg-plum-600',
        chip: 'bg-teal-100 text-teal-800',
        accentText: 'text-teal-800',
      }
    : {
        section: 'bg-plum-100/50',
        halo: 'bg-plum-200/55',
        ring: 'border-plum-600/45',
        dot: 'bg-teal-700',
        chip: 'bg-plum-100 text-plum-800',
        accentText: 'text-plum-700',
      };
  const elevation = first ? aboutPage.team.sahilCard : null;

  /* Column pins — the image side alternates: band 1 image right, band 2 image
     left. Grid rows: identity (top) and description (bottom) share the copy
     column; the portrait spans both rows so the pair stays centre-locked. */
  const descColX = first ? 'lg:col-start-1' : 'lg:col-start-2';
  const imgColX = first ? 'lg:col-start-2' : 'lg:col-start-1';
  /* Copy hugs the centre gap so the text side reads as one soft-edged block:
     the description column's inner edge aligns toward the portrait. */
  const descHug = first ? 'lg:justify-self-end' : 'lg:justify-self-start';

  return (
    <section aria-label={doctor.name} className={`${band.section} border-t border-line`}>
      <div className="mx-auto w-full max-w-[88rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        {/* DOM order (mobile): identity → portrait → description — exactly
            DESIGN_RULES.md §1. At lg the same three children are pinned into
            a two-column, two-row layout, so nothing depends on wrappers. */}
        <div className="grid gap-9 lg:grid-cols-2 lg:items-center lg:gap-x-16">
          {/* Identity: number · role, name, credential chips */}
          <div className={`mx-auto w-full max-w-xl lg:mx-0 lg:max-w-[42ch] ${descHug} ${descColX} lg:row-start-1`}>
            <span className={`label-sm text-center block lg:text-left ${band.accentText}`}>
              {String(index + 1).padStart(2, '0')} · {doctor.role}
            </span>
            <h3 className="h-serif mt-4 text-center text-[2.15rem] leading-[1.1] text-ink sm:text-[2.35rem] lg:text-left">
              {doctor.name}
            </h3>
            <ul className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
              {doctor.credentials.map((c) => (
                <li
                  key={c}
                  className={`rounded-full px-3 py-1 text-[0.75rem] font-medium ${band.chip}`}
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Portrait — circle portrait over the band halo + OrbitRing */}
          <div
            className={`relative mx-auto w-[min(78vw,18rem)] sm:w-[20rem] ${imgColX} lg:row-span-2 lg:row-start-1 lg:w-96 ${
              first ? 'lg:justify-self-end' : 'lg:justify-self-start'
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute -inset-7 rounded-full ${band.halo}`}
            />
            <OrbitRing
              ringClass={`-inset-11 hidden border sm:block ${band.ring}`}
              dotClass={band.dot}
            />
            <div className="circle-mask relative overflow-hidden bg-cream-deep shadow-soft">
              <img
                src={doctor.photo}
                alt={doctor.photoAlt}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper px-3 py-1 text-[0.5625rem] font-semibold tracking-[0.1em] text-ink-45 uppercase shadow-soft">
              Stock image — placeholder
            </span>
          </div>

          {/* Description body — the identity's continuation, same column */}
          <div className={`mx-auto w-full max-w-xl min-w-0 lg:mx-0 lg:max-w-[42ch] ${descHug} ${descColX} lg:row-start-2`}>
            {elevation ? (
              <>
                <p className="text-[0.9375rem] leading-[1.85] text-ink-70 sm:text-base">
                  {aboutPage.team.sahil.training}
                </p>
                <p className="mt-4 text-[0.9375rem] leading-[1.85] text-ink-70">
                  {elevation.line}
                </p>
                <p className="label-sm mt-7 text-ink-45">{elevation.focusLabel}</p>
                <ul className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {elevation.focus.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-ink/12 bg-cream px-3 py-1.5 text-[0.8125rem] font-medium text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="text-[0.9375rem] leading-[1.85] text-ink-70 sm:text-base">
                  {doctor.bio}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {doctor.focusAreas.map((area) => (
                    <li
                      key={area}
                      className="flex items-start gap-3 text-[0.875rem] leading-relaxed text-ink-70"
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                          first ? 'bg-teal-600' : 'bg-plum-500'
                        }`}
                      />
                      {area}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  // Fresh page: land at the top after the hash change, keep the title honest.
  useEffect(() => {
    window.scrollTo(0, 0);
    const previous = document.title;
    document.title = `About Us — ${clinic.name}`;
    return () => {
      document.title = previous;
    };
  }, []);

  const { story, values, journey, impact, team } = aboutPage;
  const stepCount = journey.steps.length;

  return (
    <>
      {/* Hero — the shared site-wide template (src/components/ui/PageHero.jsx),
          which this page's hero originally defined. */}
      <PageHero
        label={aboutPage.label}
        title={aboutPage.title}
        titleAccent={aboutPage.titleAccent}
        description={aboutPage.intro}
        image={aboutPage.heroImage}
        imageAlt={aboutPage.heroImageAlt}
        ctaLabel={aboutPage.heroCta}
        ctaHref="#our-journey"
      />

      {/* -----------------------------------------------------------------
          01 · Our Story — one editorial text column, one clinic photograph.
          ------------------------------------------------------------------ */}
      <Section
        id="our-story"
        tone="paper"
        spacing="normal"
        className="border-t border-line"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-14 lg:gap-y-8">
          <div className="text-center sm:text-left lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <SectionIntro
              align="left"
              label={story.label}
              title={story.title}
            />
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
            {/* Semi-racetrack frame: a full semicircular cap on the left,
                straight top/bottom, and a right end that runs past the
                viewport edge (body clips it) so the frame reads as cut off
                by the screen. The negative margins cancel the section's
                horizontal padding plus a few pixels at every breakpoint. */}
            <div className="relative -mr-6 overflow-hidden rounded-l-full border border-line bg-cream-deep shadow-soft sm:-mr-10 lg:-mr-14 xl:-mr-16">
              {/* GSAP: a slow dimensional drift as the photo passes. */}
              <Parallax strength={26}>
                <img
                  src={story.image}
                  alt={story.imageAlt}
                  className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
                  loading="lazy"
                />
              </Parallax>
            </div>
          </div>

          <div className="text-center sm:text-left lg:col-span-5 lg:col-start-1 lg:row-start-2">
            <RevealBlock delay={0.1} y={18}>
              <p className="mx-auto max-w-xl text-base leading-[1.85] text-ink-70 sm:text-[1.0625rem]">
                {story.body}
              </p>
              {/* CV seam: the community-oncology work behind that belief. */}
              <p className="mx-auto mt-5 max-w-xl text-sm leading-[1.8] text-ink-45">
                {story.clinical}
              </p>
              <div className="mt-8">
                <PillLink href="#our-team" tone="solid">
                  {story.cta}
                </PillLink>
              </div>
            </RevealBlock>
          </div>
        </div>
      </Section>

      {/* Mid-page CTA — the ruled InlineCta band, placed after Our Story
          before the values (between sections rather than closing the page). */}
      <InlineCta {...inlineCta} onAction={openConsult} />

      {/* -----------------------------------------------------------------
          02 · What Guides Us — four icon values, no photographs.
          ------------------------------------------------------------------ */}
      <Section id="values" tone="deep" spacing="normal">
        <SectionIntro
          align="left"
          label={values.label}
          title={values.title}
        />

        <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-10 lg:mt-16 lg:grid-cols-4 lg:gap-x-0">
          {values.items.map((item, i) => (
            <RevealBlock
              key={item.id}
              delay={i * 0.07}
              y={20}
              className={
                i > 0
                  ? 'lg:border-l lg:border-line lg:pl-8 lg:pr-8'
                  : 'lg:pr-8'
              }
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-paper text-teal-800">
                <Glyph name={item.icon} />
              </span>
              <h3 className="mt-5 font-serif text-[1.15rem] leading-snug text-ink sm:text-[1.25rem]">
                {item.title}
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-[1.75] text-ink-45">
                {item.text}
              </p>
            </RevealBlock>
          ))}
        </div>
      </Section>

      {/* -----------------------------------------------------------------
          03 · Our Approach — the horizontal care journey, drawn in the
          site's hairline + node language (vertical rail below lg).
          ------------------------------------------------------------------ */}
      <Section
        id="our-journey"
        tone="cream"
        spacing="normal"
        className="border-t border-line"
      >
        <div className="grid gap-7 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="text-center sm:text-left lg:col-span-6">
            <SectionIntro
              align="left"
              label={journey.label}
              title={
                <>
                  {journey.title}{' '}
                  <span className="text-plum-600">{journey.titleAccent}</span>
                </>
              }
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <RevealBlock
              delay={0.12}
              className="text-center text-base leading-[1.85] text-ink-70 sm:text-left sm:text-[1.0625rem] lg:border-l lg:border-line lg:pl-8"
            >
              <p>{journey.lead}</p>
              {/* CV seam: how Dr Bambroo actually works, per the clinic. */}
              <p className="mt-4 text-sm leading-[1.8] text-ink-45">
                {journey.clinical}
              </p>
            </RevealBlock>
          </div>
        </div>

        <ol className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-4 lg:gap-8">
          {journey.steps.map((step, i) => {
            const last = i === stepCount - 1;
            return (
              <li key={step.id} className="relative flex gap-5 lg:block">
                {/* Mobile: vertical rail between this node and the next. */}
                {last ? null : (
                  <span
                    aria-hidden="true"
                    className="absolute left-8 top-16 -bottom-12 w-px bg-line lg:hidden"
                  />
                )}
                {/* Desktop: horizontal rail from this node to the next, plus
                    the midpoint dot the template's rules use. */}
                {last ? null : (
                  <span
                    aria-hidden="true"
                    className="absolute top-9 left-0 hidden border-t border-line lg:block lg:-right-[4.25rem]"
                  />
                )}
                {last ? null : (
                  <span
                    aria-hidden="true"
                    className="absolute top-9 -right-4 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-plum-600 lg:block"
                  />
                )}

                <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line bg-cream text-teal-800 lg:h-[4.5rem] lg:w-[4.5rem]">
                  <Glyph name={step.icon} />
                </span>

                <div className="min-w-0 lg:mt-7">
                  <span className="label-sm block text-plum-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2.5 font-serif text-[1.15rem] leading-snug text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-[1.75] text-ink-45">
                    {step.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* -----------------------------------------------------------------
          05 · Meet the Specialists — two full-width bands, one teal and one
          plum, each a photo-and-description grid whose image side alternates
          (image left / image right). No cards.
          ------------------------------------------------------------------ */}
      <section id="our-team" className="border-t border-line bg-paper">
        {/* Band intro — centred above the two bands */}
        <div className="mx-auto w-full max-w-[88rem] px-5 pb-6 pt-16 text-center sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
          <SectionIntro
            align="center"
            label={team.label}
            title={
              <>
                {team.title}{' '}
                <span className="text-plum-600">{team.titleAccent}</span>
              </>
            }
          />
          <RevealBlock delay={0.12} className="mx-auto mt-6 max-w-2xl">
            <p className="text-base leading-[1.8] text-ink-70 sm:text-lg">
              {team.body}
            </p>
            <div className="mt-7">
              <PillButton tone="solid" arrow interactive onClick={openConsult}>
                {team.cta}
              </PillButton>
            </div>
          </RevealBlock>
        </div>

        {doctors.map((doctor, i) => (
          <DoctorBand key={doctor.id} doctor={doctor} index={i} />
        ))}
      </section>

      {/* -----------------------------------------------------------------
          06 · Our Impact — large numbers instead of photographs; the two
          unverified figures carry a visible placeholder note.
          ------------------------------------------------------------------ */}
      <Section
        id="impact"
        tone="paper"
        spacing="normal"
        className="border-t border-line"
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="text-center sm:text-left lg:col-span-5">
            <SectionIntro
              align="left"
              label={impact.label}
              title={impact.title}
            />
            <RevealBlock
              delay={0.12}
              className="mx-auto mt-6 max-w-md text-center text-base leading-[1.8] text-ink-70 sm:text-left sm:text-lg"
            >
              {impact.body}
              {/* CV seam: the academic work behind the figures. */}
              <p className="mt-4 text-sm leading-[1.8] text-ink-45">
                {impact.clinical}
              </p>
            </RevealBlock>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {/* Uneven columns so the word-valued figure never crowds
                its neighbours at narrow desktop widths. */}
            <div className="grid gap-9 sm:grid-cols-[1fr_0.8fr_1.4fr] sm:gap-6">
              {impact.figures.map((figure, i) => {
                const isNumeric = /^\d/.test(figure.value);
                return (
                  <RevealBlock
                    key={figure.id}
                    delay={i * 0.08}
                    y={22}
                    className="flex flex-col items-start"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-cream text-teal-800">
                      <Glyph name={figure.icon} />
                    </span>
                    <p
                      className={`h-display mt-5 ${
                        isNumeric
                          ? 'text-[clamp(2.25rem,4vw,3.25rem)]'
                          : 'text-[clamp(1.6rem,2.6vw,2.4rem)]'
                      }`}
                    >
                      {figure.value}
                    </p>
                    <p className="mt-2 max-w-[12rem] text-sm leading-snug text-ink-45">
                      {figure.caption}
                    </p>
                  </RevealBlock>
                );
              })}
            </div>

            <RevealBlock delay={0.1} className="mt-9">
              <PlaceholderTag>{impact.note}</PlaceholderTag>
            </RevealBlock>
          </div>
        </div>
      </Section>

      {/* Final CTA — the site's closing-CTA language, not a new component. */}
      <ClosingCta />
    </>
  );
}
