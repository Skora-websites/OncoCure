import { navLinks, footer, cta } from '../data/clinic.js';
import { useClinic } from '../lib/clinicApi.js';
import PillButton from './ui/PillButton.jsx';
import { openConsult } from '../lib/consultBus.js';

/** Hash-route targets for the links that exist so far; the rest stay inert. */
const NAV_HREFS = {
  home: '/',
  about: '/about',
  services: '/services',
  blogs: '/blogs',
  contact: '/contact',
};

/**
 * Footer — a dark, textured closing sanctuary block with film grain,
 * ambient radiance, celestial orbit watermark, interactive navigation,
 * quick WhatsApp contact, and a smooth return-to-top control.
 */
export default function Footer() {
  const clinic = useClinic();
  const whatsappDigits = (clinic.contact.whatsapp || '918750052773').replace(/\D/g, '');

  const scrollToTop = () => {
    window.dispatchEvent(new Event('occ:scroll-top'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-teal-900 to-[#022624] text-cream">
      {/* 1. Fine Film Grain & Texture Overlay */}
      <div
        aria-hidden="true"
        className="hero-grain pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
      />

      {/* 2. Light Atmospheric Ambient Radiance (Plum & Deep Teal) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-plum-600/15 blur-3xl animate-pulse-glow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 bottom-10 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl animate-pulse-glow"
        style={{ animationDelay: '3.5s' }}
      />


      {/* Top Border Glow Accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-600/50 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-[88rem] px-5 pt-12 sm:px-8 lg:px-12 lg:pt-16">
        {/* Main Footer Grid */}
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-8">
          
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-4">
            <a href="/" className="inline-block" aria-label="Go to homepage">
              <img
                src={clinic.logo.full}
                alt={clinic.name}
                className="h-11 w-auto brightness-0 invert select-none"
                draggable="false"
              />
            </a>
            <p className="mt-4 max-w-sm text-[0.8125rem] leading-[1.75] text-cream/65">
              {footer.blurb}
            </p>
            <p className="mt-2.5 font-serif text-sm text-plum-200 italic">
              {clinic.tagline}
            </p>

            {/* Live Clinic Care Beacon */}
            <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-teal-700/60 bg-teal-950/60 px-3.5 py-1 text-[11px] font-medium text-teal-200 shadow-2xs backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
              </span>
              <span>Greater Noida · Comprehensive Cancer Care</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <p className="label-sm text-cream/40 uppercase tracking-widest">Navigate</p>
            <ul className="mt-3.5 space-y-1 sm:mt-4 sm:space-y-1.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  {NAV_HREFS[link.id] ? (
                    <a
                      href={NAV_HREFS[link.id]}
                      onClick={() =>
                        window.dispatchEvent(new Event('occ:scroll-top'))
                      }
                      className="group/link inline-flex items-center gap-1.5 py-1 text-[0.9375rem] font-serif text-cream/85 transition-all duration-300 hover:text-cream hover:translate-x-1 sm:text-lg"
                    >
                      <span className="h-1 w-1 rounded-full bg-teal-400/40 opacity-0 transition-opacity duration-300 group-hover/link:opacity-100" />
                      <span>{link.label}</span>
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="Navigation links are added in a later stage"
                      className="cursor-default inline-block py-1 text-[0.9375rem] font-serif text-cream/50 sm:text-lg"
                    >
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.625rem] sm:mt-4 sm:text-[0.6875rem] text-cream/35">
              {footer.navLabel}
            </p>
          </nav>

          {/* Column 3: Contact & Visit */}
          <div className="lg:col-span-3">
            <p className="label-sm text-cream/40 uppercase tracking-widest">Visit &amp; Contact</p>
            <address className="mt-3 text-[0.8125rem] leading-[1.7] text-cream/70 not-italic sm:mt-4 sm:leading-[1.75]">
              {clinic.contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>

            <ul className="mt-3 space-y-2 text-[0.8125rem] sm:mt-4">
              {clinic.contact.phones.map((p) => (
                <li key={p.label}>
                  <a
                    href={`tel:${p.tel}`}
                    className="inline-flex items-center gap-2 text-cream/75 transition-colors duration-300 hover:text-cream"
                  >
                    <svg className="h-3.5 w-3.5 text-teal-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{p.display}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${clinic.contact.email}`}
                  className="inline-flex items-center gap-2 break-all text-cream/75 transition-colors duration-300 hover:text-cream"
                >
                  <svg className="h-3.5 w-3.5 text-teal-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{clinic.contact.email}</span>
                </a>
              </li>
              <li className="pt-1 flex items-center gap-3 flex-wrap">
                <a
                  href={clinic.contact.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-plum-200 underline decoration-plum-400/40 decoration-1 underline-offset-4 transition-colors hover:text-cream text-xs"
                >
                  <span>{cta.map}</span>
                  <span>&rarr;</span>
                </a>
                <span className="text-cream/25">·</span>
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-teal-300 hover:text-white transition-colors text-xs font-semibold"
                >
                  <span>WhatsApp Chat</span>
                  <span>&rarr;</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours & Direct Consultation Action */}
          <div className="lg:col-span-2">
            <p className="label-sm text-cream/40 uppercase tracking-widest">Clinic Hours</p>
            <dl className="mt-3 space-y-2 text-[0.8125rem] sm:mt-4 sm:space-y-2.5">
              {clinic.hours.map((h) => (
                <div key={h.id} className="border-b border-cream/5 pb-1.5">
                  <dt className="text-cream/45 text-[11px] font-bold uppercase tracking-wider">{h.label}</dt>
                  <dd className="text-cream/85 text-xs mt-0.5">
                    {h.days === 'Sunday' ? 'Sunday' : 'Mon – Sat'} · {h.time}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5">
              <PillButton
                tone="light"
                size="sm"
                interactive
                onClick={openConsult}
              >
                {cta.booking}
              </PillButton>
            </div>
          </div>
        </div>

        {/* Legal Bar with Back-to-Top Control */}
        <div className="mt-10 border-t border-cream/10 py-6 sm:mt-14 sm:py-7">
          <p className="max-w-3xl text-[0.625rem] leading-[1.7] text-cream/40 sm:text-[0.6875rem] sm:leading-[1.75]">
            {footer.disclaimer}
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-[0.625rem] text-cream/40 sm:text-[0.6875rem]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p>{footer.copyright}</p>
              <span aria-hidden="true" className="text-cream/20">·</span>
              <p>
                Design by{' '}
                <a
                  href="https://skorainfotech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-cream/60 transition-colors hover:text-cream underline-offset-2 hover:underline"
                >
                  Skora Infotech
                </a>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a href="/admin" className="text-cream/35 hover:text-cream/80 transition-colors">
                Admin Login
              </a>

              {/* Interactive Return-to-Top Button */}
              <button
                type="button"
                onClick={scrollToTop}
                className="group inline-flex items-center gap-1.5 rounded-full border border-teal-700/60 bg-teal-950/50 px-3 py-1 text-[11px] font-semibold text-cream/70 transition-all duration-300 hover:border-teal-400 hover:bg-teal-800 hover:text-cream active:scale-95 cursor-pointer"
                aria-label="Back to top"
              >
                <span>Back to Top</span>
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5">&uarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Oversized Engraved Watermark Wordmark */}
      <div aria-hidden="true" className="select-none px-5 pb-4 sm:px-8 sm:pb-6 lg:px-12">
        <p className="text-center font-display text-[clamp(2.75rem,13vw,11rem)] leading-none font-bold tracking-[-0.04em] bg-gradient-to-t from-cream/[0.08] via-cream/[0.035] to-transparent bg-clip-text text-transparent">
          Onco Cure
        </p>
      </div>
    </footer>
  );
}
