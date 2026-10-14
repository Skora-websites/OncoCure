import { useState } from 'react';
import { consult } from '../../data/clinic.js';

/**
 * ConsultationForm — the clinic's consultation request form.
 * Connected to the backend API (`/api/consultations`).
 */
export default function ConsultationForm({ className = '' }) {
  const f = consult.fields;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    concern: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit consultation request.');
      }

      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', concern: '', message: '' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please call or WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    'w-full rounded-lg border border-ink/15 bg-transparent px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-45 focus:border-teal-800 focus:bg-cream-deep/60 focus:outline-none transition-colors duration-300';

  if (submitted) {
    return (
      <div className={`rounded-xl border border-teal-700/30 bg-teal-50/60 p-8 text-center ${className}`}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-800">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="h-serif mt-4 text-xl text-ink">Consultation Request Received</h3>
        <p className="mt-2 text-sm text-ink-70">
          Thank you. Your details have been sent directly to the clinic team. We will call you back promptly to confirm your consultation slot.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 rounded-full border border-teal-800 px-6 py-2.5 text-xs font-semibold tracking-wider text-teal-800 uppercase transition-colors hover:bg-teal-800 hover:text-white"
        >
          Book Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      className={className}
      aria-label={consult.label}
      onSubmit={handleSubmit}
      noValidate
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="consult-name" className="label-sm block text-ink-70">
            {f.name.label} <span className="text-red-500">*</span>
          </label>
          <input
            id="consult-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            placeholder={f.name.placeholder}
            className={`mt-2 ${field}`}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="consult-phone" className="label-sm block text-ink-70">
            {f.phone.label} <span className="text-red-500">*</span>
          </label>
          <input
            id="consult-phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
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
            value={formData.email}
            onChange={handleChange}
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
            value={formData.concern}
            onChange={handleChange}
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
            value={formData.message}
            onChange={handleChange}
            placeholder={f.message.placeholder}
            className={`mt-2 ${field}`}
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="group relative inline-flex w-full cursor-pointer select-none items-center justify-center gap-3 overflow-hidden rounded-full border border-ink/25 px-10 py-4 text-[0.6875rem] font-semibold tracking-[0.2em] text-ink uppercase sm:w-auto disabled:opacity-60"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-out group-hover:scale-y-100"
          />
          <span className="relative z-10 transition-colors duration-500 group-hover:text-cream">
            {submitting ? 'Submitting…' : consult.submit}
          </span>
          <span
            aria-hidden="true"
            className="relative z-10 transition-all duration-500 group-hover:translate-x-1 group-hover:text-cream"
          >
            &rarr;
          </span>
        </button>
        <p className="mt-4 text-[0.75rem] leading-relaxed text-ink-45">
          {consult.privacy}
        </p>
      </div>
    </form>
  );
}
