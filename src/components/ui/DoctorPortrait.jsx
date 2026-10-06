import { motion, useReducedMotion } from 'framer-motion';

/**
 * DoctorPortrait — a designed placeholder panel for a clinician's photograph.
 *
 * We deliberately do NOT drop in a stock photo of an unrelated person: these
 * are real, named doctors, and a substitute face would misrepresent them. The
 * clinic supplies real portraits later and the panel is simply replaced.
 *
 * The panel itself carries the brand: a soft gradient, the logo mark as a
 * watermark, the doctor's initials, and a clearly labelled placeholder note.
 */
export default function DoctorPortrait({
  doctor,
  accent = 'plum',
  className = '',
  fill = false,
}) {
  const reduce = useReducedMotion();
  const palettes = {
    plum: {
      from: 'from-plum-100',
      to: 'to-lavender',
      ring: 'ring-plum-400/25',
      mark: 'text-plum-400/25',
      initials: 'text-plum-800',
    },
    teal: {
      from: 'from-teal-100',
      to: 'to-mist',
      ring: 'ring-teal-400/25',
      mark: 'text-teal-400/25',
      initials: 'text-teal-800',
    },
  };
  const p = palettes[accent] ?? palettes.plum;
  const initials = doctor.name
    .replace(/^Dr\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br ${p.from} ${p.to} ring-1 ${p.ring} ${
        fill ? 'h-full' : 'aspect-[4/5]'
      } ${className}`}
    >
      {/* Watermark mark */}
      <img
        src="/images/brand/logo-mark.png"
        alt=""
        aria-hidden="true"
        className={`absolute -bottom-8 -right-10 w-[78%] select-none object-contain ${p.mark}`}
        draggable="false"
      />

      {/* Initials */}
      <motion.span
        aria-hidden="true"
        className={`absolute inset-0 flex items-center justify-center font-serif text-[4.5rem] leading-none sm:text-[5.5rem] ${p.initials}`}
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {initials}
      </motion.span>

      {/* Placeholder note */}
      <span className="absolute left-3 top-3 rounded-full bg-paper/92 px-3 py-1 text-[0.5625rem] font-semibold tracking-[0.12em] text-plum-800 uppercase backdrop-blur-sm">
        Photo placeholder
      </span>
      <span className="absolute inset-x-3 bottom-3 rounded-lg bg-paper/92 px-3 py-2 text-center text-[0.625rem] leading-snug text-ink backdrop-blur-sm">
        Official portrait to be added
      </span>
    </div>
  );
}
