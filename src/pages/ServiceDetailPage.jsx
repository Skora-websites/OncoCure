import { useEffect, useState } from 'react';
import Section, { SectionIntro } from '../components/ui/Blocks.jsx';
import SplitReveal, { RevealBlock, StaggerGroup } from '../components/anim/SplitReveal.jsx';
import InlineCta from '../components/ui/InlineCta.jsx';
import ClosingCta from '../components/ClosingCta.jsx';
import { useSeo } from '../lib/seo.js';
import { getServiceBySlug, listServices } from '../lib/contentApi.js';
import { navigate } from '../lib/hashRoute.js';
import { openConsult } from '../lib/consultBus.js';
import { inlineCta, clinic } from '../data/clinic.js';

/**
 * ---------------------------------------------------------------------------
 * SERVICE DETAIL (#/services/:slug)
 * ---------------------------------------------------------------------------
 * A breadcrumb, a plain editorial head, "What it covers" in the clinic's OWN
 * wording (verbatim from the service lists the clinic supplied), a
 * plain-language overview, related services from the same group, then the
 * site's standard InlineCta + ClosingCta bands. Carries Service and
 * BreadcrumbList JSON-LD.
 */

function Crumb({ href, children, current = false }) {
  // Padding + negative margin: a ≥44px hit area without shifting the row.
  return current ? (
    <span aria-current="page" className="inline-block px-2 -mx-2 py-4 -my-4 text-ink">
      {children}
    </span>
  ) : (
    <a
      href={href}
      className="inline-block px-2 -mx-2 py-4 -my-4 text-ink-45 transition-colors hover:text-ink"
    >
      {children}
    </a>
  );
}

export default function ServiceDetailPage({ slug }) {
  const [service, setService] = useState(undefined); // undefined = loading, null = unknown
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let live = true;
    setService(undefined);
    getServiceBySlug(slug).then((s) => {
      if (!live) return;
      setService(s);
      if (s) {
        listServices({ offset: 0, limit: 100 }).then((all) => {
          if (!live) return;
          setRelated(
            all.items
              .filter((x) => x.group === s.group && x.slug !== s.slug)
              .slice(0, 3),
          );
        });
      }
    });
    return () => {
      live = false;
    };
  }, [slug]);

  const seoTitle = service?.metaTitle?.trim()
    ? service.metaTitle.trim()
    : service
    ? `${service.title} — ${clinic.name}`
    : `Service — ${clinic.name}`;

  const seoDescription =
    service?.metaDescription?.trim() || service?.summary || clinic.meta.description;

  const seoKeywords = service?.metaKeywords?.trim() || null;

  useSeo({
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    canonicalUrl: service?.canonicalUrl,
    path: `/services/${slug}`,
    image: service?.image || '/images/photo/consult-care.jpg',
    jsonLd: service
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            description: service.summary,
            provider: {
              '@type': 'MedicalClinic',
              name: clinic.name,
              address: clinic.contact.addressSingle,
              telephone: clinic.contact.primaryPhone,
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${window.location.origin}/#/` },
              { '@type': 'ListItem', position: 2, name: 'Services', item: `${window.location.origin}/#/services` },
              { '@type': 'ListItem', position: 3, name: service.title },
            ],
          },
        ]
      : undefined,
  });

  if (service === undefined) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-cream">
        <p className="label-sm text-ink-45" aria-live="polite">
          Loading service…
        </p>
      </main>
    );
  }

  if (service === null) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
        <h1 className="h-serif text-[clamp(1.8rem,4vw,2.6rem)] text-ink">
          We could not find that service.
        </h1>
        <p className="max-w-md text-ink-70">
          It may have been renamed. The full list of services is one click away.
        </p>
        <button
          type="button"
          onClick={() => navigate('/services')}
          className="rounded-full border border-ink/25 px-8 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-ink hover:text-cream"
        >
          All services
        </button>
      </main>
    );
  }

  const coversList = Array.isArray(service.covers) ? service.covers : [];
  const overviewList =
    Array.isArray(service.overview) && service.overview.length > 0
      ? service.overview
      : typeof service.description === 'string' && service.description.trim()
      ? service.description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
      : [];

  return (
    <>
      {/* Breadcrumb + head */}
      <section className="paper texture-creases relative overflow-x-clip bg-cream pt-28 pb-14 sm:pt-36 sm:pb-16 lg:pt-44 lg:pb-20">
        <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <RevealBlock y={14}>
            <nav aria-label="Breadcrumb" className="label-sm flex flex-wrap items-center gap-2">
              <Crumb href="/">Home</Crumb>
              <span aria-hidden="true" className="text-ink-30">/</span>
              <Crumb href="/services">Services</Crumb>
              <span aria-hidden="true" className="text-ink-30">/</span>
              <Crumb current>{service.title}</Crumb>
            </nav>
          </RevealBlock>

          <SplitReveal
            as="h1"
            className="h-serif mt-6 max-w-3xl text-[clamp(2.65rem,5vw,3.9rem)] leading-[1.05]"
            stagger={0.055}
            start="top 92%"
          >
            {service.title}
          </SplitReveal>

          <RevealBlock delay={0.14} y={18}>
            <p className="mt-6 max-w-2xl text-base leading-[1.8] text-ink-70 sm:text-lg">
              {service.summary}
            </p>
            <p className="label-sm mt-6 text-plum-600">{service.group}</p>
          </RevealBlock>
        </div>
      </section>

      {/* Covers + overview */}
      <Section tone="paper" spacing="normal" className="border-t border-line">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-16">
          {/* What it covers — the clinic's own wording */}
          {coversList.length > 0 ? (
            <div className="lg:col-span-5">
              <RevealBlock y={18}>
                <div className="rounded-2xl border border-line bg-cream p-8 shadow-soft sm:p-10">
                  <h2 className="h-serif text-[1.375rem] text-ink sm:text-[1.625rem]">
                    What it covers
                  </h2>
                  <span aria-hidden="true" className="mt-5 block h-px w-12 bg-plum-200/80" />
                  <ul className="mt-7 space-y-4">
                    {coversList.map((line) => (
                      <li key={line} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className={`mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full ${
                            service.accent === 'teal' ? 'bg-teal-500' : 'bg-plum-600'
                          }`}
                        />
                        <span className="text-[0.9375rem] leading-[1.7] text-ink">
                          {line}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealBlock>
            </div>
          ) : null}

          {/* Plain-language overview */}
          <div className={coversList.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl'}>
            <SectionIntro
              align="left"
              label="In Plain Language"
              title="What this involves"
            />
            <div className="mt-8 space-y-6">
              {overviewList.map((para, i) => (
                <RevealBlock key={i} delay={0.08 + i * 0.06} y={18}>
                  <p className="max-w-2xl text-[0.9375rem] leading-[1.85] text-ink-70 sm:text-base">
                    {para}
                  </p>
                </RevealBlock>
              ))}
            </div>
            <RevealBlock delay={0.2}>
              <p className="mt-10 max-w-2xl rounded-2xl border border-teal-200/70 bg-teal-100/40 p-6 text-sm leading-[1.8] text-teal-900">
                This page is general information, not medical advice. For
                anything specific to your situation, please speak with the
                clinic — every treatment decision is made in consultation.
              </p>
            </RevealBlock>
          </div>
        </div>
      </Section>

      {/* Related services */}
      {related.length > 0 ? (
        <Section tone="cream" spacing="normal" className="!pb-14 sm:!pb-18 lg:!pb-20">
          <SectionIntro
            label="Related Care"
            title="Also in this group"
            intro={`More of the clinic's ${service.group.toLowerCase()} services.`}
          />
          <StaggerGroup className="mt-12 flex flex-col gap-4 lg:gap-5" stagger={0.07}>
            {related.map((r) => (
              <a
                key={r.slug}
                href={`/services/${r.slug}`}
                className="group flex items-center justify-between gap-6 rounded-full border border-line bg-paper py-4 pl-8 pr-6 transition-colors duration-500 hover:border-plum-400 sm:py-5 sm:pl-10"
              >
                <span className="h-serif text-[1rem] text-ink sm:text-[1.25rem]">
                  {r.title}
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-plum-200 text-plum-800 transition-colors duration-500 group-hover:bg-plum-800 group-hover:text-cream group-hover:border-plum-800"
                >
                  &rarr;
                </span>
              </a>
            ))}
          </StaggerGroup>

          {/* Embedded Inline CTA trackfield card inside the section */}
          <InlineCta {...inlineCta} onAction={openConsult} className="mt-20 sm:mt-28 lg:mt-32" />
        </Section>
      ) : (
        <div className="py-6 sm:py-8">
          <InlineCta {...inlineCta} onAction={openConsult} />
        </div>
      )}

      <ClosingCta />
    </>
  );
}
