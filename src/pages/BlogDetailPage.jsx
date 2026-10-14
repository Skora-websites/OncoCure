import { useEffect, useState } from 'react';
import Section, { Label, PlaceholderTag } from '../components/ui/Blocks.jsx';
import SplitReveal, { RevealBlock } from '../components/anim/SplitReveal.jsx';
import InlineCta from '../components/ui/InlineCta.jsx';
import ClosingCta from '../components/ClosingCta.jsx';
import { useSeo, stripHtmlAndTruncate } from '../lib/seo.js';
import { getBlogBySlug, listBlogs } from '../lib/contentApi.js';
import { navigate } from '../lib/hashRoute.js';
import { openConsult } from '../lib/consultBus.js';
import { blogDateDisplay } from '../data/blogs.js';
import { inlineCta, clinic } from '../data/clinic.js';

/**
 * ---------------------------------------------------------------------------
 * BLOG DETAIL (#/blogs/:slug)
 * ---------------------------------------------------------------------------
 * Proper article semantics (<article>, <time datetime>), the site's editorial
 * styling for the body sections, the closing note as a callout, related posts
 * from the same category, then the standard InlineCta + ClosingCta bands.
 * Carries BlogPosting and BreadcrumbList JSON-LD.
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

export default function BlogDetailPage({ slug }) {
  const [post, setPost] = useState(undefined); // undefined = loading, null = unknown
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let live = true;
    setPost(undefined);
    getBlogBySlug(slug).then((p) => {
      if (!live) return;
      setPost(p);
      if (p) {
        listBlogs({ category: p.category, offset: 0, limit: 20 }).then((all) => {
          if (!live) return;
          setRelated(all.items.filter((x) => x.slug !== p.slug).slice(0, 3));
        });
      }
    });
    return () => {
      live = false;
    };
  }, [slug]);

  const siteSuffix = ` — ${clinic.name}`;
  const seoTitle = post
    ? post.metaTitle?.trim()
      ? `${post.metaTitle.trim()}${siteSuffix}`
      : `${post.title}${siteSuffix}`
    : `Article${siteSuffix}`;

  const rawContent =
    post?.content ||
    (post?.body
      ? post.body
          .map((s) => `${s.heading || ''} ${(s.paragraphs || []).join(' ')}`)
          .join(' ')
      : post?.excerpt || '');

  const seoDescription =
    post?.metaDescription?.trim() ||
    stripHtmlAndTruncate(rawContent, 160) ||
    clinic.meta.description;

  const seoKeywords = post?.metaKeywords?.trim() || null;

  useSeo({
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    path: `/blogs/${slug}`,
    image: post?.image,
    jsonLd: post
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { '@type': 'Organization', name: clinic.name },
            publisher: { '@type': 'Organization', name: clinic.name },
            image: `${window.location.origin}${post.image}`,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${window.location.origin}/#/` },
              { '@type': 'ListItem', position: 2, name: 'Blogs', item: `${window.location.origin}/#/blogs` },
              { '@type': 'ListItem', position: 3, name: post.title },
            ],
          },
        ]
      : undefined,
  });

  if (post === undefined) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-cream">
        <p className="label-sm text-ink-45" aria-live="polite">
          Loading article…
        </p>
      </main>
    );
  }

  if (post === null) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
        <h1 className="h-serif text-[clamp(1.8rem,4vw,2.6rem)] text-ink">
          We could not find that article.
        </h1>
        <p className="max-w-md text-ink-70">
          It may have been renamed. Every article is listed on the journal page.
        </p>
        <button
          type="button"
          onClick={() => navigate('/blogs')}
          className="rounded-full border border-ink/25 px-8 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-ink hover:text-cream"
        >
          All articles
        </button>
      </main>
    );
  }

  return (
    <>
      {/* Breadcrumb + article head */}
      <section className="paper texture-creases relative overflow-x-clip bg-cream pt-28 pb-12 sm:pt-36 sm:pb-14 lg:pt-44 lg:pb-16">
        <div className="mx-auto w-full max-w-[52rem] px-5 sm:px-8">
          <RevealBlock y={14}>
            <nav aria-label="Breadcrumb" className="label-sm flex flex-wrap items-center gap-2">
              <Crumb href="/">Home</Crumb>
              <span aria-hidden="true" className="text-ink-30">/</span>
              <Crumb href="/blogs">Blogs</Crumb>
              <span aria-hidden="true" className="text-ink-30">/</span>
              <Crumb current>{post.category}</Crumb>
            </nav>
          </RevealBlock>

          <RevealBlock delay={0.05} y={14}>
            <p className="label-sm mt-8 text-plum-600">{post.category}</p>
          </RevealBlock>

          <SplitReveal
            as="h1"
            className="h-serif mt-4 text-[clamp(2.65rem,5vw,3.9rem)] leading-[1.08]"
            stagger={0.05}
            start="top 92%"
          >
            {post.title}
          </SplitReveal>

          <RevealBlock delay={0.14}>
            <p className="label-sm mt-7 text-ink-45">
              <time dateTime={post.date}>{blogDateDisplay(post.date)}</time>
              {' · '}
              {post.readMinutes} min read
            </p>
          </RevealBlock>
        </div>
      </section>

      {/* Article body */}
      <main className="bg-cream pb-4">
        <div className="mx-auto w-full max-w-[52rem] px-5 sm:px-8">
          {/* Rectangle lead image — same frame treatment as the services
              page cards (agreed stock pool — visibly tagged) */}
          <RevealBlock y={20}>
            <figure className="relative">
              <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-line bg-cream-deep shadow-soft">
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  className="h-full w-full object-cover"
                  width={1024}
                  height={640}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-teal-900/20 via-transparent to-transparent"
                />
              </div>
              <figcaption className="mt-3 flex justify-center">
                <PlaceholderTag>Stock image — placeholder</PlaceholderTag>
              </figcaption>
            </figure>
          </RevealBlock>

          <article className="mt-12">
            <RevealBlock delay={0.08} y={18}>
              <p className="text-lg leading-[1.8] text-ink sm:text-xl">
                {post.excerpt}
              </p>
            </RevealBlock>

            {post.content ? (
              <RevealBlock delay={0.1} y={16}>
                <div
                  className="mt-10 max-w-none text-ink-70 [&>h2]:h-serif [&>h2]:text-[1.375rem] sm:[&>h2]:text-[1.625rem] [&>h2]:text-ink [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:h-serif [&>h3]:text-[1.2rem] [&>h3]:text-ink [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:mt-4 [&>p]:leading-[1.85] [&>p]:text-[0.9375rem] sm:[&>p]:text-base [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mt-4 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mt-4 [&>ol]:space-y-2 [&>li]:text-[0.9375rem] sm:[&>li]:text-base [&>blockquote]:mt-6 [&>blockquote]:rounded-r-xl [&>blockquote]:border-l-4 [&>blockquote]:border-teal-700 [&>blockquote]:bg-teal-50/50 [&>blockquote]:py-3 [&>blockquote]:px-5 [&>blockquote]:italic [&>blockquote]:text-teal-900 [&>img]:my-8 [&>img]:rounded-2xl [&>img]:w-full [&>img]:shadow-soft"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </RevealBlock>
            ) : Array.isArray(post.body) ? (
              post.body.map((section, i) => (
                <section key={i} className="mt-10">
                  <RevealBlock y={16}>
                    <h2 className="h-serif text-[1.375rem] leading-snug text-ink sm:text-[1.625rem]">
                      {section.heading}
                    </h2>
                  </RevealBlock>
                  {section.paragraphs?.map((para, j) => (
                    <RevealBlock key={j} delay={0.05 + j * 0.04} y={16}>
                      <p className="mt-4 text-[0.9375rem] leading-[1.85] text-ink-70 sm:text-base">
                        {para}
                      </p>
                    </RevealBlock>
                  ))}
                </section>
              ))
            ) : null}

            {/* Closing note if present */}
            {post.closing ? (
              <RevealBlock delay={0.1} y={18}>
                <aside className="mt-12 rounded-2xl border border-teal-200/70 bg-teal-100/40 p-7 sm:p-9">
                  <Label tone="teal">From the clinic</Label>
                  <p className="mt-3 text-[0.9375rem] leading-[1.8] text-teal-900 sm:text-base">
                    {post.closing}
                  </p>
                </aside>
              </RevealBlock>
            ) : null}
          </article>

          {/* Related posts */}
          {related.length > 0 ? (
            <section className="mt-16 border-t border-line pt-12 pb-6 sm:pb-8">
              <RevealBlock y={14}>
                <h2 className="h-serif text-[1.375rem] text-ink sm:text-[1.625rem]">
                  More in {post.category}
                </h2>
              </RevealBlock>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {related.map((r) => (
                  <RevealBlock key={r.slug} y={18}>
                    <a
                      href={`/blogs/${r.slug}`}
                      className="group block h-full rounded-2xl border border-line bg-paper p-6 transition-colors duration-500 hover:border-plum-400"
                    >
                      <p className="label-sm text-ink-45">
                        <time dateTime={r.date}>{blogDateDisplay(r.date)}</time> ·{' '}
                        {r.readMinutes} min
                      </p>
                      <h3 className="h-serif mt-3 text-[1.0625rem] leading-snug text-ink transition-colors duration-300 group-hover:text-plum-800">
                        {r.title}
                      </h3>
                      <span className="label-sm mt-4 inline-flex items-center gap-2 text-teal-800">
                        Read
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-500 group-hover:translate-x-1"
                        >
                          &rarr;
                        </span>
                      </span>
                    </a>
                  </RevealBlock>
                ))}
              </div>

              {/* Embedded Inline CTA trackfield card inside the section */}
              <InlineCta {...inlineCta} onAction={openConsult} className="mt-20 sm:mt-28 lg:mt-32" />
            </section>
          ) : (
            <div className="py-6 sm:py-8">
              <InlineCta {...inlineCta} onAction={openConsult} />
            </div>
          )}
        </div>
      </main>

      <ClosingCta />
    </>
  );
}
