import { closing, clinic, cta } from '../data/clinic.js';
import Section, { SectionIntro } from './ui/Blocks.jsx';
import { RevealBlock } from './anim/SplitReveal.jsx';
import PillButton from './ui/PillButton.jsx';
import CircleBadge from './anim/CircleBadge.jsx';
import { openConsult } from '../lib/consultBus.js';

/**
 * ClosingCta — a large centred statement that closes the page the way the
 * template does, with the practical details kept close beneath.
 */
export default function ClosingCta() {
  return (
    <Section id="contact" tone="cream" spacing="tall">
      <div className="relative mx-auto max-w-4xl text-center">
        <RevealBlock className="flex justify-center" y={20}>
          <CircleBadge
            text="CALL · WHATSAPP · GREATER NOIDA · "
            href={`tel:${clinic.contact.phones[0].tel}`}
            ariaLabel={`Call the clinic on ${clinic.contact.primaryPhone}`}
            size={112}
            duration={26}
            tone="cream"
          />
        </RevealBlock>

        <SectionIntro
          align="center"
          label={closing.eyebrow}
          title={closing.heading}
          intro={closing.body}
          className="mt-12"
        />

        <RevealBlock
          delay={0.15}
          className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <PillButton tone="plum" size="lg" interactive onClick={openConsult}>
            {cta.booking}
          </PillButton>
          <a
            href={`tel:${clinic.contact.phones[0].tel}`}
            className="group inline-flex items-center justify-center gap-3 rounded-full border border-ink/25 px-10 py-5 text-xs font-semibold tracking-[0.2em] text-ink uppercase transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-cream"
          >
            {cta.call}
          </a>
        </RevealBlock>

        <RevealBlock delay={0.2} className="mt-12" y={20}>
          <p className="text-sm text-ink-45">{closing.note}</p>
        </RevealBlock>
      </div>
    </Section>
  );
}
