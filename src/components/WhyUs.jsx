import { reasons, clinic } from '../data/clinic.js';
import Section, { SectionIntro, Label } from './ui/Blocks.jsx';
import { RevealBlock, StaggerGroup } from './anim/SplitReveal.jsx';

/**
 * WhyUs — the template's numbered trust list.
 *
 * Each point is numbered and ruled off, matching the doctors/approach rhythm.
 * Grounded only in what the clinic has actually supplied: a qualification, a
 * service line, or a published schedule. No success rates or outcome claims.
 */
export default function WhyUs() {
  return (
    <Section id="why" tone="cream">
      <SectionIntro
        label="Why Onco Cure Clinic"
        title="A small clinic, on purpose"
        intro="We keep our focus narrow so we can give each patient the attention they actually need."
      />

      <StaggerGroup className="mt-16 border-t border-line lg:mt-24" stagger={0.1}>
        {reasons.map((reason, i) => (
          <article
            key={reason.id}
            className="group grid gap-4 border-b border-line py-9 transition-colors duration-500 hover:bg-paper sm:grid-cols-[4rem_1fr] sm:gap-8 lg:grid-cols-[6rem_minmax(0,24rem)_1fr] lg:items-start lg:py-12"
          >
            <span className="font-serif text-2xl leading-none text-plum-400 transition-colors duration-500 group-hover:text-plum-800 sm:text-3xl">
              {String(i + 1).padStart(2, '0')}
            </span>

            <h3 className="font-serif text-xl leading-snug text-ink sm:text-[1.5rem]">
              {reason.title}
            </h3>

            <p className="max-w-2xl text-[0.9375rem] leading-[1.8] text-ink-70 sm:col-start-2 lg:col-start-3">
              {reason.text}
            </p>
          </article>
        ))}
      </StaggerGroup>

      {/* Hours */}
      <RevealBlock className="mt-16 lg:mt-20" y={28}>
        <div className="rounded-2xl border border-line bg-paper p-7 sm:p-10">
          <Label tone="ink">Consulting hours</Label>
          <dl className="mt-7 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {clinic.hours.map((h) => (
              <div key={h.id} className="border-l-2 border-plum-400 pl-5">
                <dt className="text-base font-semibold text-ink">{h.label}</dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-70">
                  {h.days}
                  <br />
                  {h.time}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </RevealBlock>
    </Section>
  );
}
