import { useState } from 'react';
import { useClinic } from '../../lib/clinicApi.js';

function formatContactWhatsApp(data) {
  const parts = [
    '🏥 *New Website Inquiry — Onco Cure Clinic*',
    '',
    `👤 *Name:* ${data.name.trim()}`,
    data.phone?.trim() ? `📞 *Phone:* ${data.phone.trim()}` : null,
    `✉️ *Email:* ${data.email.trim()}`,
    data.subject ? `📋 *Subject:* ${data.subject}` : null,
    `💬 *Message:* ${data.message.trim()}`,
    '',
    '_Submitted via oncocureclinic.com contact form_',
  ].filter(Boolean);

  return parts.join('\n');
}

/**
 * ContactForm — Dedicated public contact & inquiry form.
 * Directly connected to `/api/contacts` and WhatsApp.
 */
export default function ContactForm({ className = '' }) {
  const clinic = useClinic();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
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
    if (!formData.name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!formData.message.trim()) {
      setError('Please write your message or query.');
      return;
    }

    setError('');
    setSubmitting(true);

    const targetDigits = (clinic.contact?.whatsapp || '+918750052773').replace(/\D/g, '');
    const waText = encodeURIComponent(formatContactWhatsApp(formData));
    const waUrl = `https://wa.me/${targetDigits}?text=${waText}`;

    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.warn('API contact sync warning:', err);
    }

    // Launch WhatsApp directly
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Ignored if popup blocked; action button provided on confirmation card
    }

    setSubmittedData({ ...formData, waUrl });
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'General Inquiry',
      message: '',
    });
    setSubmitting(false);
  };

  const field =
    'w-full rounded-xl border border-ink/15 bg-white/80 px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-45 focus:border-plum-700 focus:bg-white focus:outline-none transition-colors duration-200';

  if (submitted) {
    return (
      <div className={`rounded-2xl border border-teal-700/30 bg-teal-50/70 p-8 text-center sm:p-10 ${className}`}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-800 shadow-xs">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="h-serif mt-5 text-2xl font-normal text-ink">Message Sent Successfully</h3>
        <p className="mx-auto mt-2.5 max-w-md text-[0.9375rem] leading-relaxed text-ink-70">
          Thank you for contacting Onco Cure Clinic. Your inquiry has been delivered directly to our desk. A member of our clinical administration team will review your query and reply promptly.
        </p>

        {submittedData?.waUrl && (
          <div className="mt-6 flex flex-col items-center">
            <a
              href={submittedData.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-xs font-semibold tracking-wider text-white uppercase shadow-md transition-all hover:bg-[#1ebd59] hover:shadow-lg active:scale-98"
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
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-teal-800 px-7 py-3 text-xs font-semibold tracking-wider text-teal-800 uppercase transition-colors hover:bg-teal-800 hover:text-white"
        >
          Send Another Message &rarr;
        </button>
      </div>
    );
  }

  return (
    <form
      className={className}
      aria-label="Contact and Inquiry Form"
      onSubmit={handleSubmit}
      noValidate
    >
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Notice:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid gap-4.5 sm:grid-cols-2">
        {/* Full Name */}
        <div className="sm:col-span-1">
          <label htmlFor="contact-name" className="label-sm block text-ink-70 mb-1.5 font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className={field}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="sm:col-span-1">
          <label htmlFor="contact-phone" className="label-sm block text-ink-70 mb-1.5 font-medium">
            Phone Number <span className="text-ink-45 text-[10px] font-normal">(Optional)</span>
          </label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 ··········"
            className={field}
          />
        </div>

        {/* Email Address */}
        <div className="sm:col-span-2">
          <label htmlFor="contact-email" className="label-sm block text-ink-70 mb-1.5 font-medium">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={field}
            required
          />
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="label-sm block text-ink-70 mb-1.5 font-medium">
            Your Message or Question <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Please describe your question, diagnosis inquiry, or how we may assist you..."
            className={field}
            required
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="group relative inline-flex w-full cursor-pointer select-none items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-plum-800 via-plum-700 to-plum-900 px-9 py-4 text-xs font-bold tracking-[0.2em] text-cream uppercase transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-60 sm:w-auto"
        >
          <span className="relative z-10 transition-colors duration-300">
            {submitting ? 'Sending Message…' : 'Send Message'}
          </span>
          <span
            aria-hidden="true"
            className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </button>

        <p className="text-[11px] text-ink-45 leading-normal max-w-xs">
          For urgent emergencies or same-day clinical visits, please contact our direct telephone helpline.
        </p>
      </div>
    </form>
  );
}
