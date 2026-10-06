import { consult } from '../../data/clinic.js';

/**
 * ConsultationForm — the clinic's consultation request form.
 *
 * Intentionally INERT at this stage: there is no booking backend yet, so the
 * fields are read-only previews and the submit button announces that the form
 * is not connected. When the backend arrives, add state + an onSubmit here —
 * every component (overlay and contact page) renders this same form, so the
 * wiring lands in one place.
 */
export default function ConsultationForm({ className = '' }) {
  const f = consult.fields;

  // One shared treatment for every field: quiet hairline box, ink-70 text,
  // cream-deep wash when the field is focused.
  const field =
    'w-full rounded-lg border border-ink/15 bg-transparent px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-45 focus:border-teal-800 focus:bg-cream-deep/60 focus:outline-none transition-colors duration-300';

  return (
    <form
      className={className}
      aria-label={consult.label}
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="consult-name" className="label-sm block text-ink-70">
            {f.name.label}
          </label>
          <input
            id="consult-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={f.name.placeholder}
            className={`mt-2 ${field}`}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="consult-phone" className="label-sm block text-ink-70">
            {f.phone.label}
          </label>
          <input
            id="consult-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={f.phone.placeholder}
            className={`mt-2 ${field}`}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="consult-email" className="label-sm block text-ink-70">
            {f.email.label}
          </label>
          <input
            id="consult-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={f.email.placeholder}
            className={`mt-2 ${field}`}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="consult-concern" className="label-sm block text-ink-70">
            {f.concern.label}
          </label>
          <select
            id="consult-concern"
            name="concern"
            defaultValue=""
            className={`mt-2 appearance-none ${field}`}
          >
            <option value="">{f.concern.placeholder}</option>
            {consult.concerns.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="consult-message" className="label-sm block text-ink-70">
            {f.message.label}
          </label>
          <textarea
            id="consult-message"
            name="message"
            rows={3}
            placeholder={f.message.placeholder}
            className={`mt-2 ${field}`}
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          aria-disabled="true"
          className="group relative inline-flex w-full cursor-default select-none items-center justify-center gap-3 overflow-hidden rounded-full border border-ink/25 px-10 py-4 text-[0.6875rem] font-semibold tracking-[0.2em] text-ink uppercase sm:w-auto"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-out group-hover:scale-y-100"
          />
          <span className="relative z-10 transition-colors duration-500 group-hover:text-cream">
            {consult.submit}
          </span>
          <span
            aria-hidden="true"
            className="relative z-10 transition-all duration-500 group-hover:translate-x-1 group-hover:text-cream"
          >
            &rarr;
          </span>
        </button>
        <p className="mt-4 text-[0.75rem] leading-relaxed text-ink-45">
          {consult.inertNote}
        </p>
        <p className="mt-1.5 text-[0.75rem] leading-relaxed text-ink-45">
          {consult.privacy}
        </p>
      </div>
    </form>
  );
}
