import { doctors } from '../data/clinic.js';
import Section, { SectionIntro, NumberedTitle, Label } from './ui/Blocks.jsx';
import { RevealBlock, Parallax, StaggerGroup } from './anim/SplitReveal.jsx';
import PillButton from './ui/PillButton.jsx';
import { openConsult } from '../lib/consultBus.js';

/**
 * Doctors — the template's numbered editorial list.
 *
 * Each consultant gets a "01" / "02" marker, a bold display name, a circular
 * portrait and a narrow column of copy.
 *
 * The portraits are STOCK placeholder images, as agreed: they demonstrate the
 * layout until the clinic supplies official photographs. Each one is labelled
 * as such so no visitor mistakes it for the real doctor.
 */
export default function Doctors() {
  return (
    <Section id="doctors" tone="deep" spacing="normal">
      <SectionIntro
        label="Meet Our Doctors"
        title="Consultants who lead your care"
        intro="Oncology and anesthesia are different disciplines, but they meet at the same point — the patient in front of them. Both consultants see patients at Onco Cure Clinic, Greater Noida."
      />

      <div className="mt-14 space-y-16 lg:mt-20 lg:space-y-24">
        {doctors.map((doctor, i) => (
          <DoctorBlock key={doctor.id} doctor={doctor} index={i} />
        ))}
      </div>
    </Section>
  );
}

function DoctorBlock({ doctor, index }) {
  const isPlum = doctor.accent === 'plum';
  const accentText = isPlum ? 'text-plum-700' : 'text-teal-700';
  const accentBg = isPlum ? 'bg-plum-100' : 'bg-teal-100';
  const flip = index % 2 === 1;

  return (
    <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Portrait */}
      <RevealBlock className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`} y={40}>
        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
          <div className="circle-mask relative overflow-hidden bg-cream-deep shadow-soft">
            <Parallax strength={22}>
              <img
                src={doctor.photo}
                alt={doctor.photoAlt}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </Parallax>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-teal-900/25 to-plum-800/5"
            />
          </div>
          {/* Outline ring, echoing the template's circles */}
          <div
            aria-hidden="true"
            className="circle-mask pointer-events-none absolute -inset-3 border border-ink/15 sm:-inset-4"
          />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper px-3 py-1 text-[0.5625rem] font-semibold tracking-[0.1em] text-ink-45 uppercase shadow-soft">
            Stock image — placeholder
          </span>
        </div>
      </RevealBlock>

      {/* Copy */}
      <div className={`lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
        <NumberedTitle
          number={String(index + 1).padStart(2, '0')}
          title={doctor.name}
        />

        <RevealBlock delay={0.1} className="mt-5 text-center">
          <span
            className={`label-sm inline-block rounded-full px-4 py-2 ${accentBg} ${accentText}`}
          >
            {doctor.role}
          </span>
          <p className="mt-2.5 text-sm text-ink-45">{doctor.roleLine}</p>
        </RevealBlock>

        <RevealBlock delay={0.16} className="mt-7">
          <div className="mx-auto max-w-xl border-y border-ink/10 py-6">
            <Label tone="ink">Qualifications</Label>
            <ul className="mt-3.5 flex flex-wrap justify-center gap-2">
              {doctor.credentials.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-ink/12 bg-paper px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink"
                >
                  {c}
                </li>
              ))}
            </ul>
            {doctor.affiliation ? (
              <p className="mt-4 text-center text-sm text-ink-70">
                <span className="font-semibold text-ink">Also at</span>{' '}
                {doctor.affiliation}
              </p>
            ) : null}
          </div>
        </RevealBlock>

        <RevealBlock delay={0.2} className="mx-auto mt-7 max-w-xl">
          <p className="text-center text-[0.9375rem] leading-[1.8] text-ink-70">
            {doctor.bio}
          </p>
        </RevealBlock>

        <StaggerGroup
          className="mx-auto mt-7 max-w-xl space-y-2.5"
          stagger={0.08}
          delay={0.05}
        >
          {doctor.focusAreas.map((f, i) => (
            <div key={`${doctor.id}-focus-${i}`} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                  isPlum ? 'bg-plum-400' : 'bg-teal-400'
                }`}
              />
              <span className="text-sm text-ink-70">{f}</span>
            </div>
          ))}
        </StaggerGroup>

        <RevealBlock delay={0.2} className="mt-8 flex justify-center">
          <PillButton tone="outline" arrow interactive onClick={openConsult}>
            Book a Consultation
          </PillButton>
        </RevealBlock>
      </div>
    </article>
  );
}
