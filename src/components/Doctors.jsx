import { doctors } from '../data/clinic.js';
import Section, { SectionIntro, Label } from './ui/Blocks.jsx';
import { RevealBlock } from './anim/SplitReveal.jsx';
import PillButton from './ui/PillButton.jsx';
import { openConsult } from '../lib/consultBus.js';

/**
 * Doctors — the two consultants as compact side-by-side panels.
 *
 * Each consultant is a small paper card: a modest circular portrait on one
 * side, name and credentials on the other. At `lg` the two cards share one
 * row; below it they stack (mobile still reads portrait → description,
 * DESIGN_RULES.md §1 — the DOM puts the portrait first inside each card).
 *
 * The portraits are STOCK placeholder images, as agreed: they demonstrate the
 * layout until the clinic supplies official photographs. Each one is labelled
 * as such so no visitor mistakes it for the real doctor.
 */
export default function Doctors() {
  return (
    <Section id="doctors" tone="deep" spacing="normal">
      {/* Flex wrapper so the intro can sit below the cards on mobile
          (title → image → description) while `lg:order` restores the each
          desktop flow: title → intro → cards. */}
      <div className="flex flex-col">
        <SectionIntro
          label="Meet Our Doctors"
          title="Consultants who lead your care"
        />

        <div className="mt-12 order-2 grid gap-6 sm:gap-8 lg:order-3 lg:mt-16 lg:grid-cols-2 lg:gap-10">
          {doctors.map((doctor, i) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={i} />
          ))}
        </div>

        <RevealBlock
          delay={0.12}
          className="mx-auto order-3 mt-8 max-w-2xl text-center text-base leading-[1.8] text-ink-70 sm:text-lg lg:order-1 lg:mt-7"
        >
          Oncology and anesthesia are different disciplines, but they meet at
          the same point — the patient in front of them. Both consultants see
          patients at Onco Cure Clinic, Greater Noida.
        </RevealBlock>
      </div>
    </Section>
  );
}

/**
 * One consultant, one card. Portrait left of a copy column from `lg`
 * (stacked and centred below it), so both cards stay a readable height.
 */
function DoctorCard({ doctor, index }) {
  const isPlum = doctor.accent === 'plum';
  const accentText = isPlum ? 'text-plum-700' : 'text-teal-700';
  const accentBg = isPlum ? 'bg-plum-100' : 'bg-teal-100';
  const numberTone = isPlum ? 'text-plum-600' : 'text-teal-700';
  const bullet = isPlum ? 'bg-plum-400' : 'bg-teal-400';

  return (
    <RevealBlock delay={index * 0.08} y={30}>
      <article className="relative h-full rounded-[1.75rem] border border-line bg-paper p-6 shadow-soft sm:p-8">
        <div className="flex h-full flex-col items-center gap-6 text-center sm:gap-7 lg:flex-row lg:items-center lg:gap-8 lg:text-left">
          {/* Portrait — small circle over an outline ring */}
          <div className="relative mx-auto w-40 shrink-0 sm:w-44 lg:w-40 xl:w-44">
            <div className="circle-mask relative overflow-hidden bg-cream-deep shadow-soft">
              <img
                src={doctor.photo}
                alt={doctor.photoAlt}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-teal-900/25 to-plum-800/5"
              />
            </div>
            <div
              aria-hidden="true"
              className="circle-mask pointer-events-none absolute -inset-2.5 border border-ink/15"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper px-2.5 py-1 text-[0.5rem] font-semibold tracking-[0.08em] text-ink-45 uppercase shadow-soft">
              Stock image — placeholder
            </span>
          </div>

          {/* Copy */}
          <div className="min-w-0 flex flex-col items-center lg:items-start">
            <span className={`label-sm ${numberTone}`}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="h-serif mt-2 text-[1.45rem] leading-tight text-ink sm:text-[1.6rem]">
              {doctor.name}
            </h3>
            <span
              className={`label-sm mt-3 inline-block rounded-full px-3.5 py-1.5 ${accentBg} ${accentText}`}
            >
              {doctor.role}
            </span>
            <p className="mt-2 text-xs text-ink-45">{doctor.roleLine}</p>

            <ul className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
              {doctor.credentials.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-ink/12 bg-paper px-3 py-1 text-[0.75rem] font-medium text-ink"
                >
                  {c}
                </li>
              ))}
            </ul>

            {doctor.affiliation ? (
              <p className="mt-3 text-sm text-ink-70">
                <span className="font-semibold text-ink">Also at</span>{' '}
                {doctor.affiliation}
              </p>
            ) : null}

            <p className="mt-4 text-[0.875rem] leading-[1.75] text-ink-70">
              {doctor.bio}
            </p>

            <ul className="mt-4 w-full max-w-sm space-y-2">
              {doctor.focusAreas.map((area) => (
                <li
                  key={area}
                  className="flex items-start gap-2.5 text-left text-[0.8125rem] leading-snug text-ink-70"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full ${bullet}`}
                  />
                  {area}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <PillButton
                size="sm"
                tone="outline"
                arrow
                interactive
                onClick={openConsult}
              >
                Book a Consultation
              </PillButton>
            </div>
          </div>
        </div>
      </article>
    </RevealBlock>
  );
}
