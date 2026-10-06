import SplitReveal, { RevealBlock } from '../anim/SplitReveal.jsx';

/**
 * Section — page section wrapper with the template's rhythm and width rules.
 */
export default function Section({
  id,
  children,
  className = '',
  tone = 'cream',
  spacing = 'normal',
}) {
  const tones = {
    cream: 'bg-cream text-ink',
    deep: 'bg-cream-deep text-ink',
    paper: 'bg-paper text-ink',
    lavender: 'bg-lavender text-ink',
    mist: 'bg-mist text-ink',
    ink: 'bg-teal-900 text-cream',
  };
  const rhythm = {
    tight: 'py-16 sm:py-20',
    normal: 'py-24 sm:py-28 lg:py-36',
    tall: 'py-28 sm:py-36 lg:py-44',
  };

  return (
    <section
      id={id}
      className={`relative ${tones[tone] ?? tones.cream} ${
        rhythm[spacing] ?? rhythm.normal
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">{children}</div>
    </section>
  );
}

/**
 * Label — the wide-tracked uppercase micro label that opens every section.
 */
export function Label({ children, className = '', tone = 'ink' }) {
  const tones = {
    ink: 'text-ink-45',
    plum: 'text-plum-600',
    teal: 'text-teal-700',
    light: 'text-cream/55',
  };
  return (
    <span className={`label ${tones[tone]} ${className}`}>{children}</span>
  );
}

/**
 * SectionIntro — the template's standard section opener:
 * a centred label, a centred serif heading, then an optional narrow intro.
 */
export function SectionIntro({
  label,
  title,
  intro,
  align = 'center',
  tone = 'dark',
  className = '',
  titleClass = '',
}) {
  const centred = align === 'center';
  const isDark = tone === 'light';
  return (
    <div
      className={`${centred ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}
    >
      {label ? (
        <RevealBlock y={16}>
          <Label tone={isDark ? 'light' : 'ink'}>{label}</Label>
        </RevealBlock>
      ) : null}

      <SplitReveal
        as="h2"
        className={`h-serif mt-6 text-[clamp(2rem,5vw,3.75rem)] leading-[1.06] ${
          isDark ? 'text-cream' : 'text-ink'
        } ${titleClass}`}
      >
        {title}
      </SplitReveal>

      {intro ? (
        <RevealBlock
          delay={0.12}
          className={`mt-7 text-base leading-[1.8] sm:text-lg ${
            isDark ? 'text-cream/70' : 'text-ink-70'
          } ${centred ? 'mx-auto max-w-2xl' : ''}`}
        >
          {intro}
        </RevealBlock>
      ) : null}
    </div>
  );
}

/**
 * NumberedTitle — the template's "01" over a bold display heading.
 * Used for the doctors and trust-point sections.
 */
export function NumberedTitle({ number, title, tone = 'dark' }) {
  const isDark = tone === 'light';
  return (
    <div className="text-center">
      <RevealBlock y={14}>
        <span
          className={`label-sm block ${
            isDark ? 'text-teal-400' : 'text-plum-600'
          }`}
        >
          {number}
        </span>
      </RevealBlock>
      <SplitReveal
        as="h3"
        className={`h-display mt-4 text-[clamp(1.5rem,3.2vw,2.5rem)] ${
          isDark ? 'text-cream' : 'text-ink'
        }`}
      >
        {title}
      </SplitReveal>
    </div>
  );
}

/**
 * PlaceholderTag — a visible marker for content the clinic has not yet
 * approved, so nothing invented can be mistaken for real copy.
 */
export function PlaceholderTag({ children = 'Placeholder', tone = 'ink' }) {
  const tones = {
    ink: 'border-ink/15 text-ink-45',
    light: 'border-cream/20 text-cream/60',
  };
  return (
    <span
      className={`label-sm inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${tones[tone]}`}
    >
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-current" />
      {children}
    </span>
  );
}
