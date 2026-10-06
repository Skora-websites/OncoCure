import { clinic, navLinks, footer, cta } from '../data/clinic.js';
import PillButton from './ui/PillButton.jsx';
import { openConsult } from '../lib/consultBus.js';

/** Hash-route targets for the links that exist so far; the rest stay inert. */
const NAV_HREFS = { home: '#/', contact: '#/contact' };

/**
 * Footer — a compact version of the template's dark closing block: brand
 * wordmark, navigation, practical details and the medical disclaimer, finished
 * by an oversized watermark wordmark that fits fully rather than being cropped.
 */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-teal-900 text-cream">
      <div className="mx-auto w-full max-w-[88rem] px-5 pt-14 sm:px-8 lg:px-12 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <img
              src={clinic.logo.full}
              alt={clinic.name}
              className="h-11 w-auto brightness-0 invert"
              draggable="false"
            />
            <p className="mt-5 max-w-sm text-[0.8125rem] leading-[1.75] text-cream/55">
              {footer.blurb}
            </p>
            <p className="mt-4 font-serif text-sm text-plum-200 italic">
              {clinic.tagline}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <p className="label-sm text-cream/40">Navigate</p>
            <ul className="mt-4 space-y-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  {NAV_HREFS[link.id] ? (
                    <a
                      href={NAV_HREFS[link.id]}
                      onClick={() =>
                        window.dispatchEvent(new Event('occ:scroll-top'))
                      }
                      className="font-serif text-lg text-cream/85 transition-colors duration-300 hover:text-cream"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="Navigation links are added in a later stage"
                      className="cursor-default font-serif text-lg text-cream/85 transition-colors duration-300 hover:text-cream"
                    >
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.6875rem] text-cream/35">{footer.navLabel}</p>
          </nav>

          {/* Contact + hours */}
          <div className="lg:col-span-3">
            <p className="label-sm text-cream/40">Visit &amp; contact</p>
            <address className="mt-4 text-[0.8125rem] leading-[1.75] text-cream/70 not-italic">
              {clinic.contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>

            <ul className="mt-4 space-y-1 text-[0.8125rem]">
              {clinic.contact.phones.map((p) => (
                <li key={p.label}>
                  <a
                    href={`tel:${p.tel}`}
                    className="text-cream/70 transition-colors duration-300 hover:text-cream"
                  >
                    {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${clinic.contact.email}`}
                  className="break-all text-cream/70 transition-colors duration-300 hover:text-cream"
                >
                  {clinic.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={clinic.contact.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-plum-200 underline decoration-plum-400/40 decoration-1 underline-offset-4 transition-colors hover:text-cream"
                >
                  {cta.map}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours + action */}
          <div className="lg:col-span-2">
            <p className="label-sm text-cream/40">Hours</p>
            <dl className="mt-4 space-y-2.5 text-[0.8125rem]">
              {clinic.hours.map((h) => (
                <div key={h.id}>
                  <dt className="text-cream/45">{h.label}</dt>
                  <dd className="text-cream/85">
                    {h.days === 'Sunday' ? 'Sunday' : 'Mon – Sat'} · {h.time}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6">
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

        {/* Legal */}
        <div className="mt-12 border-t border-cream/10 py-7">
          <p className="max-w-3xl text-[0.6875rem] leading-[1.75] text-cream/40">
            {footer.disclaimer}
          </p>
          <p className="mt-4 text-[0.6875rem] text-cream/40">{footer.copyright}</p>
        </div>
      </div>

      {/* Oversized watermark wordmark — fully visible, not cropped */}
      <div aria-hidden="true" className="select-none px-5 pb-6 sm:px-8 lg:px-12">
        <p className="text-center font-display text-[clamp(2.75rem,13vw,11rem)] leading-none font-bold tracking-[-0.04em] text-cream/[0.05]">
          Onco Cure
        </p>
      </div>
    </footer>
  );
}
