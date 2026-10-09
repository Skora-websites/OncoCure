import { useEffect, useRef, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import Section, { SectionIntro } from '../components/ui/Blocks.jsx';
import { RevealBlock, StaggerGroup, applyTouchImageSettles } from '../components/anim/SplitReveal.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import { useSeo } from '../lib/seo.js';
import { listServices, PAGE_SIZE } from '../lib/contentApi.js';
import { parseHash } from '../lib/hashRoute.js';
import { clinic } from '../data/clinic.js';

/**
 * ---------------------------------------------------------------------------
 * SERVICES PAGE (#/services)
 * ---------------------------------------------------------------------------
 * Twelve headline services as VERTICAL cards — image → title → description,
 * three per desktop row, two on sm, one on mobile. Six per page with offset
 * pagination carried in the hash (`#/services?page=2`). Each card opens the
 * service's detail page.
 *
 * Card imagery is the agreed stock pool — every card carries a visible
 * placeholder tag until the clinic supplies approved visuals.
 */

/* Read ?page= from the hash (1-based). */
const pageFromHash = () => {
  const { params } = parseHash();
  const n = parseInt(params.get('page') ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
};

export default function ServicesPage() {
  const [page, setPage] = useState(pageFromHash);
  const [data, setData] = useState(null);
  const gridRef = useRef(null);

  // Keep ?page= honest when the hash changes (nav away and back).
  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const offset = (page - 1) * PAGE_SIZE;

  useEffect(() => {
    let live = true;
    setData(null);
    listServices({ offset, limit: PAGE_SIZE }).then((d) => live && setData(d));
    return () => {
      live = false;
    };
  }, [offset]);

  useSeo({
    title: `Services — ${clinic.name}`,
    description:
      'The complete scope of specialist cancer care at Onco Cure Clinic, Greater Noida — consultation, second opinions, personalised treatment planning, chemotherapy, immunotherapy, targeted and hormonal therapy, pain and symptom management, nutrition and palliative care.',
    path: '/services',
    image: '/images/photo/services-hero.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: (data?.items ?? []).map((s, i) => ({
        '@type': 'ListItem',
        position: offset + i + 1,
        name: s.title,
        url: `${window.location.origin}/#/services/${s.slug}`,
      })),
    },
  });

  const items = data?.items ?? [];

  /* Touch: the card zoom is hover-only on desktop — give touch devices the
     §2 non-hover trigger (in-view settle) instead. */
  useEffect(() => applyTouchImageSettles(gridRef.current, 'article img'), [page, items.length]);

  return (
    <>
      <PageHero
        label="Our Services"
        title="Specialist care,"
        titleAccent="every service."
        description="From first consultations and second opinions through systemic therapies, pain and symptom care and palliative support — the complete scope of the clinic, in plain language."
        image="/images/photo/services-hero.jpg"
        imageAlt="A patient receiving chemotherapy in a day-care chair — the clinic's systemic therapy service."
      />

      <Section tone="cream" spacing="normal">
        <SectionIntro
          label="The Full List"
          title="Every service, plainly described"
          intro="Twelve headline services, each opening onto a fuller description of what it involves. Six are shown per page."
        />

        <div ref={gridRef}>
        <StaggerGroup
          key={page}
          watch={items.length}
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:mt-18 lg:grid-cols-3 lg:gap-9"
          stagger={0.07}
          delay={0.05}
        >
          {items.map((s) => (
            <article key={s.slug} className="group h-full">
              <a
                href={`#/services/${s.slug}`}
                className="flex h-full flex-col text-center sm:text-left"
                aria-label={`${s.title} — read the full description`}
              >
                {/* Image first — the card reads image → title → description */}                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-line bg-cream-deep shadow-soft">
                    <img
                      src={s.image}
                      alt={s.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      width={1024}
                      height={768}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-teal-900/20 via-transparent to-transparent"
                    />
                  </div>

                <p className="label-sm mt-5 flex items-center justify-center gap-2.5 text-ink-45 sm:justify-start">
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${
                      s.accent === 'teal' ? 'bg-teal-500' : 'bg-plum-600'
                    }`}
                  />
                  {s.group}
                </p>

                <h2 className="h-serif mt-2.5 text-[1.375rem] leading-snug text-ink transition-colors duration-300 group-hover:text-plum-800 sm:text-[1.5rem]">
                  {s.title}
                </h2>

                <p className="mt-3 text-[0.875rem] leading-[1.7] text-ink-70 sm:text-[0.9375rem]">
                  {s.summary}
                </p>

                <span className="label-sm mt-auto inline-flex items-center gap-2 pt-5 text-teal-800">
                  Read the full description
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </span>
              </a>
            </article>
          ))}
        </StaggerGroup>
        </div>

        {data ? (
          <Pagination
            path="/services"
            total={data.total}
            offset={data.offset}
            limit={data.limit}
            onPage={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        ) : (
          <p className="mt-14 text-center text-sm text-ink-45" aria-live="polite">
            Loading services…
          </p>
        )}
      </Section>
    </>
  );
}
