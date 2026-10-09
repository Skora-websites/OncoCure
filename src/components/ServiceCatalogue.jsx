import { serviceGroups } from '../data/clinic.js';
import Section, { SectionIntro } from './ui/Blocks.jsx';
import { RevealBlock, StaggerGroup } from './anim/SplitReveal.jsx';
import PillButton from './ui/PillButton.jsx';
import { openConsult } from '../lib/consultBus.js';

/* Line icons, one per group. Drawn inline so there is no icon dependency and
   they inherit the brand colours. Each is a 48-grid composition — finer
   strokes and interior detail so the enlarged badges read as illustration
   rather than glyph. */
const icons = {
  plum: (
    <>
      {/* Heart with an ECG line across it */}
      <path d="M24 41.5S10 33 10 21.5A8.6 8.6 0 0 1 24 16a8.6 8.6 0 0 1 14 5.5C38 33 24 41.5 24 41.5Z" />
      <path d="M14.5 24.5h6l2.5-5 3.5 8 2.5-3h4.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  teal: (
    <>
      {/* Capsule tilted at 45° with a seam and inner highlights */}
      <rect x="7.5" y="17.5" width="33" height="13" rx="6.5" transform="rotate(-45 24 24)" />
      <path d="M17.2 17.2 30.8 30.8" strokeLinecap="round" />
      <path
        d="M20.4 14.2c-1 1.4-1.6 2.9-1.6 4.8 0 4.9 4.6 8.9 10.2 8.9 1.7 0 3.3-.3 4.7-1"
        strokeLinecap="round"
      />
    </>
  ),
};

const supportIcon = (
  <>
    {/* Two hands cradling a figure — care & support */}
    <circle cx="24" cy="14" r="4.5" />
    <path
      d="M24 21.5v7M24 28.5c-2.2 0-4.3.6-6 1.8"
      strokeLinecap="round"
    />
    <path
      d="M6.5 30.5C9 27 13.5 25 18 25.6M41.5 30.5C39 27 34.5 25 30 25.6"
      strokeLinecap="round"
    />
    <path
      d="M6.5 30.5c-1 1.4-1 3.4.4 4.6 4 3.5 9.6 6.4 17.1 6.4s13.1-2.9 17.1-6.4c1.4-1.2 1.4-3.2.4-4.6"
      strokeLinecap="round"
    />
  </>
);

/**
 * ServiceCatalogue — the clinic's scope of work, presented the way the template
 * handles its capabilities: a row of RACETRACK cards — a rectangle capped with
 * semicircles at each end — each with a circular badge on its crest and a short
 * list inside.
 *
 * `rounded-full` gives exactly that: on a tall box the radius collapses to half
 * the width, so the top and bottom become semicircles and the sides stay
 * straight.
 *
 * Eight points per card keeps each column scannable. The clinic's complete,
 * untrimmed service lists live in the data file for the Services page.
 */
export default function ServiceCatalogue() {
  const accents = {
    plum: {
      text: 'text-plum-800',
      bg: 'bg-plum-100',
      border: 'border-plum-200',
      hover: 'group-hover:border-plum-400',
    },
    teal: {
      text: 'text-teal-800',
      bg: 'bg-teal-100',
      border: 'border-teal-200',
      hover: 'group-hover:border-teal-400',
    },
  };

  return (
    <Section id="service-catalogue" tone="cream" spacing="tall">
      <SectionIntro
        label="Full Scope of Care"
        title="Everything the clinic covers"
        intro="A snapshot of the services offered at Onco Cure Clinic, grouped so you can find what is relevant to you."
      />

      <div className="mt-12 grid gap-7 sm:mt-16 lg:mt-24 lg:grid-cols-3 lg:gap-8">
        {serviceGroups.map((group, gi) => {
          const a = accents[group.accent] ?? accents.teal;
          const icon =
            group.id === 'cancer-care-support'
              ? supportIcon
              : icons[group.accent];
          return (
            <RevealBlock key={group.id} delay={gi * 0.09} y={34}>
              <article
                className={`texture-crumple group relative aspect-3/4 w-full rounded-full border bg-paper transition-colors duration-500 sm:aspect-5/8 lg:aspect-5/8 ${a.border} ${a.hover}`}
              >
                {/* Circular badge sitting on the racetrack's crest */}
                <span
                  className={`absolute left-1/2 top-0 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-cream shadow-soft transition-transform duration-500 group-hover:scale-105 sm:h-24 sm:w-24`}
                >
                  <svg
                    viewBox="0 0 48 48"
                    className={`h-11 w-11 ${a.text} sm:h-12 sm:w-12`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    aria-hidden="true"
                  >
                    {icon}
                  </svg>
                </span>

                {/* Content sits in the wide middle of the racetrack. */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-[16%] pt-[14%] pb-[14%] sm:gap-6 sm:px-[22%]">
                  <h3 className="h-serif text-center text-[1.375rem] leading-tight text-ink sm:text-[1.375rem]">
                    {group.title}
                  </h3>

                  <StaggerGroup
                    className="w-full space-y-2.5"
                    stagger={0.05}
                    delay={0.1 + gi * 0.05}
                  >
                    {group.items.map((item, i) => (
                      <div
                        key={`${group.id}-${i}`}
                        className="flex items-start gap-2.5"
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full ${
                            group.accent === 'plum' ? 'bg-plum-400' : 'bg-teal-400'
                          }`}
                        />
                        <span className="text-[0.9375rem] leading-[1.5] text-ink-70 sm:text-[0.8125rem]">
                          {item}
                        </span>
                      </div>
                    ))}
                  </StaggerGroup>
                </div>
              </article>
            </RevealBlock>
          );
        })}
      </div>

      <RevealBlock
        className="mt-16 flex flex-col items-center gap-4 text-center"
        y={20}
      >
        <p className="max-w-md text-[0.9375rem] leading-relaxed text-ink-70">
          Not sure which applies? Call the clinic and describe your concern — we
          will guide you to the right consultation.
        </p>
        <PillButton tone="solid" arrow interactive onClick={openConsult}>
          Book a Consultation
        </PillButton>
      </RevealBlock>
    </Section>
  );
}
