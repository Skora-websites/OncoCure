import { useClinic } from '../lib/clinicApi.js';
import { cta } from '../data/clinic.js';

export default function WhatsAppChatButton({ whatsappDigits: digitsProp } = {}) {
  const clinic = useClinic();
  const digits =
    (digitsProp ?? clinic.contact?.whatsapp ?? '+918750052773').replace(/\D/g, '');
  const href = `https://wa.me/${digits}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${clinic.name} on WhatsApp`}
      className="
        group relative flex h-[44px] w-[44px] items-center justify-center
        rounded-full border border-teal-700/30 bg-teal-700
        shadow-[0_8px_24px_-6px_rgba(19,136,113,0.55)]
        transition-all duration-300
        hover:bg-teal-800 hover:scale-105
        hover:shadow-[0_12px_32px_-6px_rgba(19,136,113,0.65)]
        active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
        focus-visible:ring-offset-2 focus-visible:ring-offset-cream
      "
      style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: '9999' }}
    >
      {/* subtle outer pulse ring */}
      <span
        aria-hidden="true"
        className="
          absolute inset-0 m-auto h-[50px] w-[50px] rounded-full
          border border-teal-400/30 animate-pulse opacity-0 hover:opacity-100
        "
      />

      {/* Exact WhatsApp brand mark — the official speech-bubble + handset glyph, not a reinterpretation */}
      <svg
        className="relative z-10 h-6 w-6 text-cream drop-shadow-sm"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>

      {/* floating label tooltip on hover */}
      <span
        aria-hidden="true"
        className="
          absolute right-full mr-3 top-1/2 -translate-y-1/2
          rounded-lg bg-ink px-3 py-1.5 text-[11px] font-bold text-cream
          shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100
        "
      >
        {cta.whatsapp}
      </span>

      <span className="sr-only">Open WhatsApp chat with {clinic.name}</span>
    </a>
  );
}
