import { useState } from 'react';
import { consult } from '../../data/clinic.js';
import { useClinic } from '../../lib/clinicApi.js';

function formatConsultationWhatsApp(data) {
  const parts = [
    '🏥 *New Consultation Request — Onco Cure Clinic*',
    '',
    `👤 *Patient Name:* ${data.name.trim()}`,
    `📞 *Phone Number:* ${data.phone.trim()}`,
    data.email?.trim() ? `✉️ *Email:* ${data.email.trim()}` : null,
    data.concern?.trim() ? `🩺 *Concern:* ${data.concern.trim()}` : null,
    data.message?.trim() ? `💬 *Brief Details:* ${data.message.trim()}` : null,
    '',
    '_Sent from oncocureclinic.com consultation desk_',
  ].filter(Boolean);

  return parts.join('\n');
}

/**
 * ConsultationForm — the clinic's consultation request form.
 * Connected to the backend API (`/api/consultations`) and WhatsApp.
 */
export default function ConsultationForm({ className = '' }) {
  const clinic = useClinic();
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
  const [submittedData, setSubmittedData] = useState(null);
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

    const targetDigits = (clinic.contact?.whatsapp || '+918750052773').replace(/\D/g, '');
    const waText = encodeURIComponent(formatConsultationWhatsApp(formData));
    const waUrl = `https://wa.me/${targetDigits}?text=${waText}`;

    // Attempt backend sync
    try {
      await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.warn('API sync warning:', err);
    }

    // Launch WhatsApp directly so clinic receives the lead in real-time
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Browser popup blocked; fallback button provided on card
    }

    setSubmittedData({ ...formData, waUrl });
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', concern: '', message: '' });
    setSubmitting(false);
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

        {submittedData?.waUrl && (
          <div className="mt-5 flex flex-col items-center">
            <a
              href={submittedData.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase shadow-md transition-all hover:bg-[#1ebd59] hover:shadow-lg active:scale-98"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>Chat / Send on WhatsApp</span>
            </a>
            <span className="mt-2 text-[11px] text-ink-45">
              Click to open WhatsApp if it did not open automatically
            </span>
          </div>
        )}

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
