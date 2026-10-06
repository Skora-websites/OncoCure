import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { clinic, consult, cta } from '../../data/clinic.js';
import ConsultationForm from './ConsultationForm.jsx';
import {
  OPEN_CONSULT_EVENT,
  CLOSE_CONSULT_EVENT,
  setConsultOpen,
} from '../../lib/consultBus.js';

/**
 * ConsultationOverlay — the modal consultation request, opened from the top
 * bar, the closing CTA, the footer and the mid-page InlineCta disc.
 *
 * Decoupled by design: triggers dispatch `occ:open-consult` on `window`; this
 * component listens and animates in. It reuses the site's scroll-lock pattern
 * (same events the Navbar menu uses, so Lenis stops with it), closes on
 * Escape / backdrop / ✕, and swaps focus to the first field while it is open.
 *
 * The form inside is inert — see ConsultationForm.
 */
export default function ConsultationOverlay() {
  const rootRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return undefined;

    // Reduced motion: appear and disappear instantly.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const onOpenRm = () => {
        root.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setConsultOpen(true);
        window.dispatchEvent(new Event('scroll-lock'));
        panel.focus({ preventScroll: true });
      };
      const onCloseRm = () => {
        root.style.display = 'none';
        document.body.style.overflow = '';
        setConsultOpen(false);
        window.dispatchEvent(new Event('scroll-unlock'));
      };
      window.addEventListener(OPEN_CONSULT_EVENT, onOpenRm);
      window.addEventListener(CLOSE_CONSULT_EVENT, onCloseRm);
      return () => {
        window.removeEventListener(OPEN_CONSULT_EVENT, onOpenRm);
        window.removeEventListener(CLOSE_CONSULT_EVENT, onCloseRm);
      };
    }

    gsap.set(root, { display: 'none' });
    gsap.set(panel, { yPercent: 6, opacity: 0 });

    const open = () => {
      gsap.killTweensOf([root, panel]);
      gsap.set(root, { display: 'block' });
      gsap
        .timeline()
        .fromTo(
          root,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'power2.out' },
        )
        .fromTo(
          panel,
          { yPercent: 6, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.55, ease: 'expo.out' },
          '-=0.15',
        );
      document.body.style.overflow = 'hidden';
      setConsultOpen(true);
      window.dispatchEvent(new Event('scroll-lock'));
      // Focus after the panel lands so the browser doesn't scroll to the
      // dialog while it is still moving.
      gsap.delayedCall(0.5, () =>
        panel.focus({ preventScroll: true }),
      );
    };

    const close = () => {
      if (root.style.display === 'none') return;
      gsap.killTweensOf([root, panel]);
      gsap
        .timeline({ onComplete: () => gsap.set(root, { display: 'none' }) })
        .to(panel, {
          yPercent: 4,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        })
        .to(root, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '-=0.1');
      document.body.style.overflow = '';
      setConsultOpen(false);
      window.dispatchEvent(new Event('scroll-unlock'));
    };

    const onOpen = () => open();
    const onClose = () => close();
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      close();
    };

    window.addEventListener(OPEN_CONSULT_EVENT, onOpen);
    window.addEventListener(CLOSE_CONSULT_EVENT, onClose);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_CONSULT_EVENT, onOpen);
      window.removeEventListener(CLOSE_CONSULT_EVENT, onClose);
      window.removeEventListener('keydown', onKey);
      // In case the app unmounts while open.
      setConsultOpen(false);
      gsap.set(root, { display: 'none', opacity: 1 });
      gsap.set(panel, { yPercent: 6, opacity: 0 });
    };
  }, []);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="consult-overlay-heading"
      className="fixed inset-0 z-110 hidden overflow-y-auto"
    >
      {/* Scrim */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-teal-900/55 backdrop-blur-sm"
        onClick={() =>
          window.dispatchEvent(new Event(CLOSE_CONSULT_EVENT))
        }
      />

      {/* Panel */}
      <div className="relative mx-auto flex min-h-full w-full items-start justify-center px-5 py-10 sm:px-8 sm:py-16">
        <div
          ref={panelRef}
          tabIndex={-1}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-paper shadow-soft outline-none"
        >
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event(CLOSE_CONSULT_EVENT))
            }
            aria-label="Close consultation form"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink-70 transition-colors duration-300 hover:bg-ink hover:text-cream"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="texture-crumple border-b border-line px-6 py-7 sm:px-10 sm:py-9">
            <span className="label text-plum-600">{consult.label}</span>
            <h2
              id="consult-overlay-heading"
              className="h-serif mt-3 text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.1]"
            >
              {consult.title}
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-[1.75] text-ink-70">
              {consult.intro}
            </p>
          </div>

          <div className="px-6 py-7 sm:px-10 sm:py-9">
            <ConsultationForm />

            <div className="mt-8 border-t border-line pt-6">
              <p className="label-sm text-ink-45">Prefer to talk now?</p>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
                {clinic.contact.phones.map((p) => (
                  <a
                    key={p.label}
                    href={`tel:${p.tel}`}
                    className="font-medium text-teal-800 transition-colors duration-300 hover:text-teal-900"
                  >
                    {p.display}
                  </a>
                ))}
                <a
                  href={`https://wa.me/${clinic.contact.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-medium text-plum-700 transition-colors duration-300 hover:text-plum-800"
                >
                  {cta.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
