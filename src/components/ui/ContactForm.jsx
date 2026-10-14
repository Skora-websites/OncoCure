import { useState } from 'react';

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Second Opinion Guidance',
  'Chemotherapy & Treatment Information',
  'Reports & Scan Review',
  'Pain Clinic & Symptom Care',
  'Appointment & Schedule Inquiries',
  'Other',
];

/**
 * ContactForm — Dedicated public contact & inquiry form.
 * Directly connected to `/api/contacts` and persisted to MongoDB / Admin Inquiries desk.
 */
export default function ContactForm({ className = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
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

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to send message.');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
      });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please call or WhatsApp the clinic.');
    } finally {
      setSubmitting(false);
    }
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

        {/* Email Address */}
        <div className="sm:col-span-1">
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

        {/* Subject / Topic */}
        <div className="sm:col-span-1">
          <label htmlFor="contact-subject" className="label-sm block text-ink-70 mb-1.5 font-medium">
            Topic of Inquiry
          </label>
          <select
            id="contact-subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`${field} cursor-pointer`}
          >
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
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
