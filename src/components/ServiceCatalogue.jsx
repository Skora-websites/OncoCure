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

const groupFolio = {
  'oncology-services': {
    folio: '01',
    subtitle: 'Consultation & Staging',
    scopeTag: '08 Diagnostic Focus Areas',
  },
  'cancer-treatments': {
    folio: '02',
    subtitle: 'Therapeutic Protocols',
    scopeTag: '08 Systemic Regimens',
  },
  'cancer-care-support': {
    folio: '03',
    subtitle: 'Continuum & Palliative',
    scopeTag: '08 Supportive Services',
  },
};

/**
 * ServiceCatalogue — the clinic's scope of work, presented in the site's
 * signature RACETRACK cards with tactile scrunched paper texture, refined
 * editorial indexing, and meticulous archival typography.
 */
export default function ServiceCatalogue({ children }) {
  const accents = {
    plum: {
      text: 'text-plum-800',
      num: 'text-plum-700/80',
      border: 'border-plum-200',
      hover: 'group-hover:border-plum-400',
      badgeHover: 'group-hover:border-plum-300',
    },
    teal: {
      text: 'text-teal-800',
      num: 'text-teal-700/80',
      border: 'border-teal-200',
      hover: 'group-hover:border-teal-400',
      badgeHover: 'group-hover:border-teal-300',
    },
  };

  return (
    <Section
      id="service-catalogue"
      tone="cream"
      spacing="tall"
      className="texture-creases paper overflow-hidden !pb-14 sm:!pb-20 lg:!pb-24"
    >
      {/* Light tactile background texture accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#13181c_1px,transparent_1px),linear-gradient(to_bottom,#13181c_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_50%_20%,rgba(122,51,153,0.035),transparent_60%),radial-gradient(circle_at_50%_80%,rgba(0,86,84,0.035),transparent_60%)]"
      />

      <SectionIntro
        label="Full Scope of Care"
        title="Everything the clinic covers"
        intro="A snapshot of the services offered at Onco Cure Clinic, grouped so you can find what is relevant to you."
      />

      <div className="mt-12 grid gap-7 sm:mt-16 lg:mt-24 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
        {serviceGroups.map((group, gi) => {
          const a = accents[group.accent] ?? accents.teal;
          const meta = groupFolio[group.id] ?? {
            folio: `0${gi + 1}`,
            subtitle: 'Clinical Scope',
            scopeTag: '08 Clinical Focus Areas',
          };
          const icon =
            group.id === 'cancer-care-support'
              ? supportIcon
              : icons[group.accent];

          return (
            <RevealBlock key={group.id} delay={gi * 0.09} y={34}>
              {/* The Signature Editorial Racetrack Card */}
              <article
                className={`texture-crumple group relative min-h-[510px] w-full rounded-[2.75rem] border bg-paper transition-all duration-500 ease-out hover:-translate-y-1 sm:min-h-0 sm:aspect-[5/8] sm:rounded-full lg:aspect-[5/8] ${a.border} ${a.hover}`}
              >
                {/* Circular Badge Sitting on the Racetrack's Crest */}
                <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={`relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border border-line bg-cream shadow-soft transition-all duration-500 group-hover:scale-105 group-hover:shadow-md ${a.badgeHover}`}
                  >
                    {/* Concentric Inner Hairline Ring with North/South Accent Pips */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-1.5 rounded-full border border-line/60"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-ink-45/40"
                    />

                    <svg
                      viewBox="0 0 48 48"
                      className={`h-10 w-10 sm:h-11 sm:w-11 ${a.text} transition-transform duration-500 group-hover:scale-105`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      aria-hidden="true"
                    >
                      {icon}
                    </svg>
                  </div>
                </div>

                {/* Content Sits in the Center of the Racetrack */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-[16%] pt-[14%] pb-[14%] sm:gap-5 sm:px-[21%] text-center">
                  
                  {/* Archival Folio Header */}
                  <div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-[9px] font-bold tracking-[0.26em] text-ink-45 uppercase">
                        FOLIO · {meta.folio}
                      </span>
                      <span className="h-0.5 w-0.5 rounded-full bg-ink-45/60" />
                      <span className="font-serif italic text-[11px] text-ink-70/90">
                        {meta.subtitle}
                      </span>
                    </div>

                    <h3 className="h-serif text-center text-[1.375rem] leading-tight text-ink mt-1.5">
                      {group.title}
                    </h3>

                    {/* Fine Editorial Rule with Section Marker */}
                    <div className="mt-2.5 mb-1 flex items-center justify-center gap-2 w-full max-w-[100px] mx-auto opacity-70">
                      <span className="h-px flex-1 bg-line" />
                      <span className="text-[8px] text-ink-45 font-mono">§</span>
                      <span className="h-px flex-1 bg-line" />
                    </div>
                  </div>

                  {/* Indexed 8-Item Clinical Scope List */}
                  <StaggerGroup
                    className="w-full space-y-2 text-left"
                    stagger={0.04}
                    delay={0.1 + gi * 0.05}
                  >
                    {group.items.map((item, i) => (
                      <div
                        key={`${group.id}-${i}`}
                        className="group/item flex items-baseline gap-2.5 transition-colors duration-200"
                      >
                        {/* Tabular Archival Number Index */}
                        <span
                          aria-hidden="true"
                          className={`font-mono text-[10px] tracking-wider select-none shrink-0 ${a.num}`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[0.875rem] leading-[1.5] text-ink-70 transition-colors duration-200 group-hover/item:text-ink sm:text-[0.8125rem]">
                          {item}
                        </span>
                      </div>
                    ))}
                  </StaggerGroup>

                  {/* Archival Bottom Scope Seal */}
                  <div className="mt-1 pt-1.5 border-t border-line/60 w-full max-w-[180px]">
                    <span className="font-mono text-[9px] font-medium tracking-[0.2em] text-ink-45 uppercase">
                      [ {meta.scopeTag} ]
                    </span>
                  </div>
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

      {children}
    </Section>
  );
}
