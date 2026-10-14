/**
 * DoctorPortrait — a designed placeholder panel for a clinician's photograph.
 * Built with standard Tailwind CSS (no external animation libraries needed).
 */
export default function DoctorPortrait({
  doctor,
  accent = 'plum',
  className = '',
  fill = false,
}) {
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
  const initials = (doctor?.name || '')
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
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60 shadow-sm backdrop-blur-xs">
          <span className={`font-serif text-2xl font-semibold tracking-wider ${p.initials}`}>
            {initials || 'OC'}
          </span>
        </div>
        <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-500">
          Photo coming soon
        </p>
      </div>
    </div>
  );
}
