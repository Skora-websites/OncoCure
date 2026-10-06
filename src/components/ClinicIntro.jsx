import { intro, clinic } from '../data/clinic.js';
import Section, { SectionIntro, Label } from './ui/Blocks.jsx';
import { RevealBlock, Parallax, StaggerGroup } from './anim/SplitReveal.jsx';

/**
 * ClinicIntro — the template's "my story" block, kept compact: a centred serif
 * heading, a short two-column body and a small circular photograph.
 */
export default function ClinicIntro() {
  return (
    <Section id="about" tone="cream" spacing="normal">
      <SectionIntro label={intro.eyebrow} title={intro.heading} />

      <div className="mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16 xl:gap-24">
        {/* Body copy, held to a narrow measure so clear space separates it
            from the photograph */}
        <div className="lg:col-span-5">
          <StaggerGroup className="space-y-4" stagger={0.1}>
            {intro.paragraphs.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'h-serif text-lg leading-[1.6] text-ink sm:text-xl'
                    : 'text-[0.9375rem] leading-[1.8] text-ink-70'
                }
              >
                {para}
              </p>
            ))}
          </StaggerGroup>
        </div>

        {/* Circular photograph, sized to match the description column */}
        <RevealBlock className="lg:col-span-5 lg:col-start-8" y={32}>
          <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[22rem] lg:max-w-none">
            <div className="circle-mask overflow-hidden bg-cream-deep shadow-soft">
              <Parallax strength={22}>
                <img
                  src="/images/photo/reception-plants.jpg"
                  alt="A quiet clinic room with armchairs and a plant, lit in soft natural light."
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
              </Parallax>
            </div>
            <div
              aria-hidden="true"
              className="circle-mask pointer-events-none absolute -inset-3 border border-line sm:-inset-4"
            />
          </div>
        </RevealBlock>
      </div>

      {/* Clinic facts */}
      <RevealBlock className="mt-14 border-t border-line pt-10 lg:mt-20" y={26}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Fact
            label="Where to find us"
            value={clinic.contact.addressSingle}
            href={clinic.contact.mapsUrl}
            linkLabel="Get directions"
          />
          <Fact
            label="Oncology hours"
            value={`${clinic.hours[0].days} · ${clinic.hours[0].time}`}
          />
          <Fact
            label="Pain clinic hours"
            value={`${clinic.hours[1].days} · ${clinic.hours[1].time}`}
          />
          <Fact
            label="Sunday session"
            value={`${clinic.hours[2].days} · ${clinic.hours[2].time}`}
          />
        </div>
      </RevealBlock>
    </Section>
  );
}

function Fact({ label, value, href, linkLabel }) {
  return (
    <div>
      <Label tone="ink">{label}</Label>
      <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-70">{value}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="label-sm mt-2.5 inline-block text-plum-600 underline decoration-plum-400 decoration-1 underline-offset-4 transition-colors hover:text-plum-800"
        >
          {linkLabel}
        </a>
      ) : null}
    </div>
  );
}
