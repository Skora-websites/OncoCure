import Marquee from './anim/Marquee.jsx';

/**
 * MarqueeBand — the template's full-bleed dark strip of keywords.
 *
 * Placed directly under the hero to break up the cream page with a single
 * moment of contrast, exactly as the reference does.
 */
export default function MarqueeBand() {
  return (
    <section className="relative bg-teal-900 py-1 text-cream">
      <Marquee
        items={[
          'Medical Oncology',
          'Pain Management',
          'Evidence-Based Care',
          'Anesthesia',
          'Greater Noida',
          'Patient Centred',
        ]}
        speed={38}
      />
    </section>
  );
}
