import { doctors } from '../data/clinic.js';
import Section, { SectionIntro } from './ui/Blocks.jsx';
import { RevealBlock } from './anim/SplitReveal.jsx';
import PillButton from './ui/PillButton.jsx';
import OrbitRing from './ui/OrbitRing.jsx';
import { openConsult } from '../lib/consultBus.js';
import { Buildings, Check } from '@phosphor-icons/react';

/**
 * Doctors — the two consultants as wide portrait cards.
 *
 * Each card follows the approved reference: a circular portrait sitting on a
 * soft accent blob in the left column, encircled by the site's OrbitRing — a
 * hairline ring whose accent dot slowly orbits it; the right column carries
 * the number rule, serif name, accent role pill, credential pills, the
 * "Also at" affiliation line, the bio, check-circle focus areas and a teal
 * outline "Book a Consultation" button.
 *
 * Per DESIGN_RULES.md §1 the DOM orders each card title → portrait →
 * description, so the mobile stack reads correctly with no re-ordering; from
 * `lg` the grid places the portrait on the left and the copy on the right.
 * The portraits are the clinic's own photographs (see data/clinic.js).
 */

export default function Doctors() {
  return (
    <Section id="doctors" tone="deep" spacing="normal">
      {/* Flex wrapper so the intro sits below the cards on mobile
          (title → image → description, DESIGN_RULES.md §1) while `lg:order`
          restores the desktop flow: title → intro → cards. */}
      <div className="flex flex-col">
        <SectionIntro
          label="Meet Our Doctors"
          title="Consultants who lead your care"
        />

        <div className="order-2 mt-12 grid gap-7 sm:gap-8 lg:order-3 lg:mt-16 xl:grid-cols-2 xl:gap-10">
          {doctors.map((doctor, i) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={i} />
          ))}
        </div>

        <RevealBlock
          delay={0.12}
          className="mx-auto order-3 mt-8 max-w-2xl text-center text-base leading-[1.8] text-ink-70 sm:text-lg lg:order-1 lg:mt-7"
        >
          Oncology and anesthesia are different disciplines, but they meet at
          the same point: the patient in front of them. Both consultants see
          patients at Onco Cure Clinic, Greater Noida.
        </RevealBlock>
      </div>
    </Section>
  );
}

/**
 * One consultant, one card. The accent (plum for oncology, teal for pain)
 * drives the number, role pill, portrait blob/ring and check marks; the
 * outlined button stays teal on both cards, as in the reference.
 */
function DoctorCard({ doctor, index }) {
  const isPlum = doctor.accent === 'plum';

  // Full literal class strings per accent — Tailwind only generates the
  // utilities it can see in source, so nothing here is assembled at runtime.
  const tone = isPlum
    ? {
        num: 'text-plum-600',
        line: 'bg-plum-400/60',
        pill: 'bg-plum-100 text-plum-700',
        blob: 'bg-plum-100',
        ring: 'border-plum-400/70',
        dot: 'bg-plum-600',
        check: 'bg-plum-400',
        icon: 'text-plum-600',
      }
    : {
        num: 'text-teal-700',
        line: 'bg-teal-400/60',
        pill: 'bg-teal-100 text-teal-700',
        blob: 'bg-teal-100',
        ring: 'border-teal-400/70',
        dot: 'bg-teal-600',
        check: 'bg-teal-400',
        icon: 'text-teal-600',
      };

  return (
    <RevealBlock delay={index * 0.08} y={30}>
      <article className="relative h-full overflow-hidden rounded-[1.75rem] border border-line/70 bg-paper p-6 shadow-soft sm:p-8 xl:p-9 2xl:p-10">
        {/* Mobile: title → portrait → description (rule §1).
            From lg: portrait left, title top-right, details below it. */}
        <div className="flex flex-col gap-7 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-center lg:gap-x-8 lg:gap-y-5 xl:grid-cols-[11rem_minmax(0,1fr)] 2xl:grid-cols-[13rem_minmax(0,1fr)]">
          {/* 1. Title — heading first on mobile */}
          <header className="min-w-0 lg:col-start-2 lg:row-start-1">
            <span className={`flex items-center gap-3 label-sm ${tone.num}`}>
              {String(index + 1).padStart(2, '0')}
              <span aria-hidden="true" className={`h-px w-8 ${tone.line}`} />
            </span>
            <h3 className="h-serif mt-3 text-[1.65rem] leading-[1.12] sm:text-[1.85rem]">
              {doctor.name}
            </h3>
            <span
              className={`mt-4 inline-block rounded-full px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase ${tone.pill}`}
            >
              {doctor.role}
            </span>
            <p className="mt-3 text-sm text-ink-70">{doctor.roleLine}</p>
          </header>

          {/* 2. Portrait — second on mobile; the left column from lg */}
          <div className="relative mx-auto aspect-square w-44 shrink-0 sm:w-52 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:w-full lg:max-w-[13rem] lg:self-center xl:max-w-[11rem] 2xl:max-w-[13rem]">
            {/* Soft accent blob, offset behind the circle */}
            <span
              aria-hidden="true"
              className={`absolute -top-5 -left-5 h-[86%] w-[86%] rounded-full sm:-top-6 sm:-left-6 ${tone.blob}`}
            />
            {/* The site's hairline ring with a slowly orbiting accent dot */}
            <OrbitRing
              ringClass={`-inset-2.5 border-2 ${tone.ring}`}
              dotClass={tone.dot}
            />
            <div className="circle-mask relative h-full w-full overflow-hidden bg-cream-deep shadow-soft">
              <img
                src={doctor.photo}
                alt={doctor.photoAlt}
                className="h-full w-full object-cover"
                style={{ objectPosition: doctor.photoPos || '50% 25%' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* 3. Description — details below the portrait on mobile */}
          <div className="min-w-0 lg:col-start-2 lg:row-start-2">
            <ul className="flex flex-wrap gap-2">
              {doctor.credentials.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-[0.75rem] font-medium text-ink"
                >
                  {c}
                </li>
              ))}
            </ul>

            {doctor.affiliation ? (
              <p className="mt-4 flex items-start gap-2.5 text-[0.875rem] leading-relaxed text-ink-70">
                <Buildings
                  aria-hidden="true"
                  className={`mt-[0.1rem] h-[1.05rem] w-[1.05rem] shrink-0 ${tone.icon}`}
                />
                <span>
                  <span className="font-semibold text-ink">Also at</span>{' '}
                  {doctor.affiliation}
                </span>
              </p>
            ) : null}

            <p className="mt-4 max-w-[54ch] text-[0.875rem] leading-[1.8] text-ink-70">
              {doctor.bio}
            </p>

            <ul className="mt-5 space-y-2.5">
              {doctor.focusAreas.map((area) => (
                <li
                  key={area}
                  className="flex items-start gap-3 text-[0.8125rem] leading-snug text-ink-70"
                >
                  <span
                    className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${tone.check}`}
                  >
                    <Check
                      aria-hidden="true"
                      className="h-3 w-3 text-white"
                      weight="bold"
                    />
                  </span>
                  {area}
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <PillButton
                size="sm"
                tone="teal"
                arrow
                interactive
                onClick={openConsult}
              >
                Book a Consultation
              </PillButton>
            </div>
          </div>
        </div>

        {/* Short rule at the card's bottom left, as in the reference */}
        <span
          aria-hidden="true"
          className="absolute bottom-8 left-8 hidden h-px w-36 bg-line lg:block"
        />
      </article>
    </RevealBlock>
  );
}
