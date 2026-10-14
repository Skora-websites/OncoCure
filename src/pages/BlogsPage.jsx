import { useEffect, useRef, useState } from 'react';
import { RevealBlock, StaggerGroup, applyTouchImageSettles } from '../components/anim/SplitReveal.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import Section from '../components/ui/Blocks.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import { useSeo } from '../lib/seo.js';
import { listBlogs, PAGE_SIZE } from '../lib/contentApi.js';
import { parseHash, navigate } from '../lib/hashRoute.js';
import { blogCategories, blogDateDisplay } from '../data/blogs.js';
import { clinic } from '../data/clinic.js';

/**
 * ---------------------------------------------------------------------------
 * BLOGS PAGE (#/blogs)
 * ---------------------------------------------------------------------------
 * The journal: a hero, a debounced free-text search carried in the hash
 * (`#/blogs?q=pain`), category chips, and article cards that read
 * title → arch-clipped image → description on mobile (DESIGN_RULES.md §1)
 * and pick up a hover zoom on pointer devices. Six posts per page with offset
 * pagination. Cards are identical to the Services page's cards.
 *
 * Article imagery is the agreed stock pool — every card carries a visible
 * placeholder tag until the clinic supplies approved visuals.
 */

/* Read ?q= and ?page= from the hash. */
const stateFromHash = () => {
  const { params } = parseHash();
  const q = params.get('q') ?? '';
  const page = parseInt(params.get('page') ?? '1', 10);
  return { q, page: Number.isFinite(page) && page > 0 ? page : 1 };
};

export default function BlogsPage() {
  // The hash is the source of truth; the input mirrors it and writes back
  // debounced (replace-mode, so typing does not stack history rows).
  const [q, setQ] = useState(stateFromHash().q);
  const [page, setPage] = useState(stateFromHash().page);
  const [category, setCategory] = useState('');
  const [data, setData] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const onLocationChange = () => {
      const s = stateFromHash();
      setQ(s.q);
      setPage(s.page);
    };
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, []);

  const offset = (page - 1) * PAGE_SIZE;

  useEffect(() => {
    let live = true;
    setData(null);
    listBlogs({ q, category, offset, limit: PAGE_SIZE }).then((d) => {
      if (live) setData(d);
    });
    return () => {
      live = false;
    };
  }, [q, category, offset]);

  const onSearchInput = (value) => {
    setQ(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate('/blogs', { q: value }, { replace: true });
    }, 300);
  };

  // A new query or category resets to the first page.
  const switchCategory = (cat) => {
    setCategory(cat);
    setPage(1);
    clearTimeout(debounceRef.current);
    navigate('/blogs', { q }, { replace: true });
  };

  const clearSearch = () => {
    setQ('');
    setCategory('');
    setPage(1);
    navigate('/blogs', {}, { replace: true });
  };

  useSeo({
    title: `Blogs — ${clinic.name}`,
    description:
      'Plain-language patient education from Onco Cure Clinic: understanding cancer, treatments and therapies, living well, pain and symptom care, and prevention and screening.',
    keywords:
      'cancer blog, oncology patient education, cancer symptoms, chemotherapy advice, cancer care greater noida, onco cure clinic articles',
    path: '/blogs',
    image: '/images/photo/reception-plants.jpg',
  });

  const items = data?.items ?? [];
  const searching = q.trim() !== '' || category !== '';

  /* Touch: the card zoom is hover-only on desktop — §2 non-hover trigger. */
  const cardsRef = useRef(null);
  useEffect(
    () => applyTouchImageSettles(cardsRef.current, 'article img'),
    [q, category, page, items.length],
  );

  return (
    <>
      <PageHero
        label="Health Notes"
        title="Knowledge,"
        titleAccent="gently shared."
        description="Answers to the questions families ask us most — about diagnosis, therapies, nutrition and comfort — explained the way we would explain them in person."
        image="/images/photo/reception-plants.jpg"
        imageAlt="A quiet corner of the clinic with plants."
      />

      <Section tone="cream" spacing="normal">
        {/* Search + category chips */}
        <div className="flex flex-col gap-8">
          <RevealBlock y={16}>
            <div className="relative mx-auto w-full max-w-xl">
              <label htmlFor="blog-search" className="label-sm mb-3 block text-ink-45">
                Search articles
              </label>
              <div className="relative">
                <input
                  id="blog-search"
                  type="text"
                  value={q}
                  onChange={(e) => onSearchInput(e.target.value)}
                  placeholder="Try “chemotherapy”, “pain”, “screening”…"
                  className="w-full rounded-full border border-line bg-paper py-4 pl-12 pr-12 text-[0.9375rem] text-ink placeholder:text-ink-30 focus:border-teal-600 focus:outline-none"
                />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-45"
                >
                  <circle cx="10.8" cy="10.8" r="6.2" />
                  <path d="m15.4 15.4 4.2 4.2" />
                </svg>
                {q ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-45 transition-colors hover:text-ink"
                  >
                    &#10005;
                  </button>
                ) : null}
              </div>
            </div>
          </RevealBlock>

          <RevealBlock delay={0.06} y={14}>
            <div
              role="group"
              aria-label="Filter by category"
              className="flex flex-wrap items-center justify-center gap-2.5"
            >
              {['All', ...blogCategories].map((cat) => {
                const active = cat === 'All' ? category === '' : category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={active}
                    onClick={() => switchCategory(cat === 'All' ? '' : cat)}
                    className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
                      active
                        ? 'border-plum-800 bg-plum-800 text-cream'
                        : 'border-ink/15 bg-paper text-ink-70 hover:border-ink/40 hover:text-ink'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </RevealBlock>

          <p className="text-center text-sm text-ink-45" aria-live="polite">
            {data
              ? searching
                ? `${data.total} article${data.total === 1 ? '' : 's'} found`
                : `${data.total} articles`
              : 'Loading articles…'}
          </p>
        </div>

        {/* Cards */}
        {data && items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-6 rounded-2xl border border-dashed border-ink/15 px-8 py-16 text-center">
            <p className="h-serif text-[1.5rem] text-ink">Nothing matches that yet.</p>
            <p className="max-w-md text-ink-70">
              Try a different word, or clear the search to see every article.
            </p>
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-full border border-ink/25 px-8 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-ink hover:text-cream"
            >
              Clear search
            </button>
          </div>
        ) : (
          /* Cards — identical to the Services page's cards: image → title →
             description, same shape and rhythm, no featured oversized card. */
          <div ref={cardsRef}>
          <StaggerGroup
            key={`${q}|${category}|${page}`}
            watch={items.length}
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-9"
            stagger={0.06}
          >
            {items.map((post) => {
              return (
                <article key={post.slug} className="group h-full">
                  <a
                    href={`/blogs/${post.slug}`}
                    className="flex h-full flex-col text-center sm:text-left"
                    aria-label={post.title}
                  >
                    <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-line bg-cream-deep shadow-soft">
                      <img
                        src={post.image}
                        alt={post.imageAlt}
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

                    <h2 className="h-serif mt-5 text-[1.375rem] leading-snug text-ink transition-colors duration-300 group-hover:text-plum-800 sm:text-[1.5rem]">
                      {post.title}
                    </h2>

                    <p className="label-sm mt-3 text-ink-45">
                      {blogDateDisplay(post.date)} · {post.readMinutes} min read
                      <span className="text-plum-600"> · {post.category}</span>
                    </p>
                    <p className="mt-3 text-[0.875rem] leading-[1.7] text-ink-70 sm:text-[0.9375rem]">
                      {post.excerpt}
                    </p>

                    <span className="label-sm mt-auto inline-flex items-center gap-2 pt-5 text-teal-800">
                      Read article
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-500 group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </span>
                  </a>
                </article>
              );
            })}
          </StaggerGroup>
          </div>
        )}

        {data && items.length > 0 ? (
          <Pagination
            path="/blogs"
            params={{ ...(q ? { q } : {}), ...(category ? { cat: category } : {}) }}
            total={data.total}
            offset={data.offset}
            limit={data.limit}
            onPage={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        ) : null}
      </Section>
    </>
  );
}
