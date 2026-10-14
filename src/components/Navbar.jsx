import { useEffect, useState } from 'react';
import { navLinks, cta } from '../data/clinic.js';
import { useClinic } from '../lib/clinicApi.js';
import PillButton from './ui/PillButton.jsx';
import { openConsult } from '../lib/consultBus.js';

/** Hash-route targets; every nav link is now live. */
const NAV_HREFS = {
  home: '/',
  about: '/about',
  services: '/services',
  blogs: '/blogs',
  contact: '/contact',
};
const navHref = (id) => NAV_HREFS[id];
const onNavClick = () => window.dispatchEvent(new Event('occ:scroll-top'));

/**
 * Navbar — minimal fixed bar in the template's style: serif wordmark on the
 * left, navigation and the appointment action on the right.
 *
 * The bar condenses and gains a hairline once the page scrolls. Routing is not
 * wired up yet, so nav items are non-interactive labels; the mobile overlay
 * itself does open and close, since that is pure interface.
 */
export default function Navbar() {
  const clinic = useClinic();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keep Lenis in step with the overlay so the page cannot scroll behind it.
  useEffect(() => {
    window.dispatchEvent(new Event(open ? 'scroll-lock' : 'scroll-unlock'));
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-110 focus:rounded-full focus:bg-teal-800 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-cream"
              >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-90 transition-all duration-500 ${
          scrolled
            ? 'border-b border-line bg-cream/88 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <div className="flex h-22 items-center justify-between gap-6 sm:h-22">
            {/* Wordmark — the supplied brand artwork, not re-typed text */}
            <a href="#main" className="shrink-0">
              <img
                src={clinic.logo.full}
                alt={`${clinic.name}`}
                className="h-11 w-auto sm:h-11 transition-all duration-300"
                draggable="false"
              />
            </a>

            {/* Desktop navigation */}
            <div className="flex items-center gap-8">
              <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={navHref(link.id)}
                    onClick={onNavClick}
                    className="label-sm text-ink-70 transition-colors duration-300 hover:text-ink"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="hidden lg:block">
                <PillButton
                  tone="solid"
                  size="sm"
                  interactive
                  onClick={openConsult}
                >
                  {cta.nav}
                </PillButton>
              </div>

              {/* Toggle */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="site-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="group flex h-12 items-center gap-3 pl-3 lg:hidden"
              >
                <span className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase text-ink-70 group-hover:text-ink">
                  {open ? 'Close' : 'Menu'}
                </span>
                <span className="relative block h-3.5 w-6.5">
                  <span className="absolute left-0 top-0 block h-0.5 w-full bg-ink" />
                  <span className="absolute left-0 top-1/2 block h-0.5 w-full -translate-y-1/2 bg-ink" />
                  <span
                    className={`absolute left-0 top-1/2 block h-0.5 -translate-y-1/2 bg-ink transition-transform duration-500 ${
                      open ? 'rotate-90 opacity-0' : 'w-full'
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <div
        id="site-menu"
        className={`fixed inset-0 z-80 lg:hidden ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-teal-900 transition-opacity duration-500 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />

        <nav
          aria-label="Mobile"
          className={`absolute inset-0 flex flex-col justify-between overflow-y-auto px-6 pt-28 pb-8 transition-all duration-500 ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <ul className="mt-6 flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <li key={link.id} className="overflow-hidden border-b border-cream/10">
                <a
                  href={navHref(link.id)}
                  onClick={() => {
                    setOpen(false);
                    onNavClick();
                  }}
                  style={{
                    display: 'block',
                    padding: '0.9rem 0',
                  }}
                  className="h-display block text-[clamp(1.75rem,8vw,2.5rem)] text-cream"
                  data-index={i}
                >
                  <span className="label-sm mr-4 align-middle text-teal-400">
                    0{i + 1}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div>
            <PillButton
              tone="light"
              size="md"
              className="w-full"
              interactive
              onClick={() => {
                setOpen(false);
                openConsult();
              }}
            >
              {cta.nav}
            </PillButton>
            <div className="mt-6 space-y-1.5 text-sm text-cream/70">
              <p className="label-sm text-cream/40">Call or WhatsApp</p>
              {clinic.contact.phones.map((p) => (
                <a
                  key={p.label}
                  href={`tel:${p.tel}`}
                  className="block transition-colors hover:text-cream"
                >
                  {p.display}
                </a>
              ))}
              <a
                href={`mailto:${clinic.contact.email}`}
                className="block break-all transition-colors hover:text-cream"
              >
                {clinic.contact.email}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
