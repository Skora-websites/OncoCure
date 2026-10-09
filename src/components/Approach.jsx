import { approach } from '../data/clinic.js';
import Section, { SectionIntro, NumberedTitle } from './ui/Blocks.jsx';
import { RevealBlock, Parallax, StaggerGroup } from './anim/SplitReveal.jsx';

/**
 * Approach — the template's dark storytelling interlude.
 *
 * An inverted (ink) section that resets the rhythm: a sticky heading column on
 * the left, numbered narrative points on the right, and a pull-quote.
 */
export default function Approach() {
  return (
    <Section id="approach" tone="ink" spacing="tall">
      {/* Faint brand glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-plum-800/25 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-teal-800/25 blur-3xl" />
      </div>

      <div className="relative grid gap-16 lg:grid-cols-12 lg:gap-20">
        {/* Sticky column. Flex + order so mobile flows title → image →
            lead (DESIGN_RULES.md §1) while `lg:order-none` restores the
            desktop flow: title → lead → image. */}
        <div className="lg:col-span-5">
          <div className="flex flex-col lg:sticky lg:top-32">
            <SectionIntro
              align="left"
              tone="light"
              label={approach.eyebrow}
              title={approach.heading}
            />

            <RevealBlock delay={0.12} className="order-3 mt-7 text-base leading-[1.8] text-cream/70 sm:text-lg lg:order-none">
              {approach.lead}
            </RevealBlock>

            <RevealBlock delay={0.15} className="order-2 mt-12 lg:order-none">
              <div className="circle-mask relative mx-auto max-w-xs overflow-hidden shadow-lift lg:max-w-sm">
                <Parallax strength={30}>
                  <img
                    src="/images/photo/consult-bed.jpg"
                    alt="A doctor speaking with a patient during a hospital consultation."
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                </Parallax>
              </div>
            </RevealBlock>
          </div>
        </div>

        {/* Numbered points */}
        <div className="lg:col-span-7">
          <div className="border-t border-cream/12">
            {approach.points.map((point, i) => (
              <div
                key={point.id}
                className="group border-b border-cream/12 py-9 transition-colors duration-500 hover:bg-cream/[0.05] lg:py-11"
              >
                <NumberedTitle
                  number={String(i + 1).padStart(2, '0')}
                  title={point.title}
                  tone="light"
                />
                <p className="mx-auto mt-5 max-w-xl text-center text-[0.9375rem] leading-[1.85] text-cream/70">
                  {point.text}
                </p>
              </div>
            ))}
          </div>

          {/* Pull quote */}
          <RevealBlock delay={0.1} className="mt-14">
            <figure className="border-l-2 border-plum-400 pl-7">
              <blockquote className="font-serif text-xl leading-[1.5] text-cream italic sm:text-2xl">
                &ldquo;{approach.quote.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5">
                <span className="label-sm text-cream/45">
                  {approach.quote.attribution}
                </span>
              </figcaption>
            </figure>
          </RevealBlock>
        </div>
      </div>
    </Section>
  );
}
