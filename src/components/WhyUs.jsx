import { useEffect, useRef } from 'react';
import { reasons } from '../data/clinic.js';
import Section, { SectionIntro } from './ui/Blocks.jsx';
import { RevealBlock } from './anim/SplitReveal.jsx';

/**
 * WhyUs — cards seated in recessed slots.
 *
 * Each reason is a paper card resting inside a tray (a rounded recess with
 * an inner shadow whose lip peeks out below the card). The interaction model
 * follows DESIGN_RULES.md §2:
 *
 *   - fine pointer / desktop: hovering a card lifts it out of its slot —
 *     the tray band beneath comes into view, the shadow deepens;
 *   - touch / mobile: the same lift plays on scroll — each card rises into
 *     its tray once as it enters the viewport (staggered), then rests in
 *     the card-in-slot look. Nothing here depends on hover.
 *
 * Grounded only in what the clinic has actually supplied: a qualification, a
 * service line, or a published schedule. No success rates or outcome claims.
 */
export default function WhyUs() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    if (!('IntersectionObserver' in window)) return undefined;

    // Ref callbacks aren't involved, but StrictMode runs this twice —
    // arming classes and observing twice is idempotent, and the cleanup
    // disconnects the first observer.
    const slots = Array.from(grid.querySelectorAll('[data-slot]'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('slot-in');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.25 },
    );
    slots.forEach((slot) => {
      slot.classList.add('slot-anim');
      io.observe(slot);
    });

    return () => io.disconnect();
  }, []);

  return (
    <Section id="why" tone="cream">
      <SectionIntro
        label="Why Onco Cure Clinic"
        title="A small clinic, on purpose"
        intro="We keep our focus narrow so we can give each patient the attention they actually need."
      />

      <div
        ref={gridRef}
        className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-24 lg:gap-x-10 lg:gap-y-14"
      >
        {reasons.map((reason, i) => (
          <div
            key={reason.id}
            data-slot
            /* Stagger for the on-scroll entrance (inert unless .slot-anim
               is armed by the effect above). */
            style={{ transitionDelay: `${i * 90}ms` }}
            className="group relative pb-3"
          >
            {/* The tray: a rounded recess, narrower than the card so only
                its lip shows beneath, reading as a slot. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-3 bottom-0 top-3 rounded-2xl bg-cream-deep shadow-[inset_0_4px_12px_rgb(16_18_15/0.10)]"
            />

            <article className="relative rounded-2xl border border-line bg-paper p-6 shadow-soft transition-[transform,box-shadow] duration-500 ease-out will-change-transform group-hover:-translate-y-4 group-hover:shadow-[0_18px_44px_-18px_rgb(16_18_15/0.35)] sm:p-7">
              <div className="flex items-center gap-4">
                <span className="label-sm text-plum-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
              </div>

              <h3 className="mt-5 font-serif text-xl leading-snug text-ink sm:text-[1.5rem]">
                {reason.title}
              </h3>

              <p className="mt-3 text-[0.9375rem] leading-[1.8] text-ink-70">
                {reason.text}
              </p>
            </article>
          </div>
        ))}
      </div>

    </Section>
  );
}
