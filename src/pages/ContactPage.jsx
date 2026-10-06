import { useEffect } from 'react';
import { clinic, contactPage, consult, cta } from '../data/clinic.js';
import { Label, PlaceholderTag } from '../components/ui/Blocks.jsx';
import { RevealBlock } from '../components/anim/SplitReveal.jsx';
import ConsultationForm from '../components/ui/ConsultationForm.jsx';

/**
 * ContactPage — the Contact Us page (reached via `#/contact`).
 *
 * Everything factual comes straight from the clinic data: address, phones,
 * email, WhatsApp, maps link and the exact consulting hours. The map panel is
 * a deliberate placeholder (no embed agreement yet — we link out instead) and
 * the consultation form is the shared inert one.
 */
export default function ContactPage() {
  // Fresh page: make sure the browser lands at the top even after the hash
  // change, and keep the document title honest.
  useEffect(() => {
    window.scrollTo(0, 0);
    const previous = document.title;
    document.title = `Contact Us — ${clinic.name}`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <>
      {/* Page head */}
      <section className="paper texture-creases relative overflow-x-clip bg-cream pt-36 pb-14 sm:pt-44 sm:pb-16 lg:pt-52 lg:pb-20">
        <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <RevealBlock y={16}>
            <Label tone="plum">{contactPage.label}</Label>
          </RevealBlock>
          <RevealBlock delay={0.08}>
            <h1 className="h-serif mt-5 max-w-3xl text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.05]">
              {contactPage.title}
            </h1>
          </RevealBlock>
          <RevealBlock delay={0.14}>
            <p className="mt-6 max-w-2xl text-base leading-[1.8] text-ink-70 sm:text-lg">
              {contactPage.intro}
            </p>
          </RevealBlock>
        </div>
      </section>

      {/* Details + form */}
      <section className="border-t border-line bg-paper py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Contact details */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-line bg-cream p-7 sm:p-9">
                <p className="label-sm text-ink-45">{contactPage.visitLabel}</p>
                <address className="mt-4 font-serif text-[1.35rem] leading-[1.5] text-ink not-italic">
                  {clinic.contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={clinic.contact.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex items-center gap-2 text-[0.8125rem] font-semibold tracking-[0.14em] text-teal-800 uppercase transition-colors duration-300 hover:text-teal-900"
                >
                  {cta.map}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>

                <div className="mt-8 border-t border-line pt-6">
                  <p className="label-sm text-ink-45">{contactPage.callLabel}</p>
                  <div className="mt-3 space-y-1.5">
                    {clinic.contact.phones.map((p) => (
                      <a
                        key={p.label}
                        href={`tel:${p.tel}`}
                        className="block text-[1.0625rem] text-ink transition-colors duration-300 hover:text-teal-800"
                      >
                        {p.display}
                      </a>
                    ))}
                    <a
                      href={`https://wa.me/${clinic.contact.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-block text-[1.0625rem] text-plum-700 transition-colors duration-300 hover:text-plum-800"
                    >
                      {cta.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="mt-8 border-t border-line pt-6">
                  <p className="label-sm text-ink-45">{contactPage.emailLabel}</p>
                  <a
                    href={`mailto:${clinic.contact.email}`}
                    className="mt-3 block break-all text-[1.0625rem] text-ink transition-colors duration-300 hover:text-teal-800"
                  >
                    {clinic.contact.email}
                  </a>
                </div>
              </div>

              {/* Hours — exactly as supplied by the clinic */}
              <div className="mt-6 rounded-2xl border border-line bg-cream p-7 sm:p-9">
                <p className="label-sm text-ink-45">{contactPage.hoursLabel}</p>
                <dl className="mt-4 space-y-4">
                  {clinic.hours.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-baseline justify-between gap-4 border-b border-line pb-4 last:border-b-0 last:pb-0"
                    >
                      <dt className="font-serif text-lg text-ink">
                        {h.label}
                        <span className="label-sm mt-1 block text-ink-45">
                          {h.days}
                        </span>
                      </dt>
                      <dd className="shrink-0 text-[0.9375rem] text-ink-70">
                        {h.time}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Form + map placeholder */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-line bg-cream p-7 sm:p-9">
                <h2 className="h-serif text-[clamp(1.6rem,3.4vw,2.25rem)] leading-[1.12]">
                  {contactPage.formHeading}
                </h2>
                <p className="mt-3 max-w-xl text-[0.9375rem] leading-[1.75] text-ink-70">
                  {consult.intro}
                </p>
                <ConsultationForm className="mt-8" />
              </div>

              {/* Map placeholder — link-out until an embed is agreed */}
              <div className="texture-crumple mt-6 overflow-hidden rounded-2xl border border-line bg-cream-deep">
                <div className="flex min-h-[13rem] flex-col items-center justify-center gap-4 p-8 text-center sm:min-h-[15rem]">
                  <PlaceholderTag>{contactPage.mapNote}</PlaceholderTag>
                  <a
                    href={clinic.contact.mapsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-3 rounded-full border border-ink/25 px-8 py-4 text-[0.6875rem] font-semibold tracking-[0.2em] text-ink uppercase transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-cream"
                  >
                    {cta.map}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-500 group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
