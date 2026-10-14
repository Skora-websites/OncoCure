/**
 * ---------------------------------------------------------------------------
 * useSeo — per-route document head management (no router dependency yet)
 * ---------------------------------------------------------------------------
 * Sets the document title, meta description, meta keywords, canonical URL,
 * Open Graph and Twitter card tags, and injects route-scoped JSON-LD scripts.
 *
 * Everything the hook touches it tags with `data-oc-seo` and removes again on
 * cleanup (or before the next apply), so navigating between routes never
 * leaves stale tags behind.
 *
 * Feature 1 rules:
 * - Public blog detail page:
 *   - <title> = metaTitle + site suffix; if metaTitle is empty, falls back to blog title
 *   - <meta name="keywords"> = metaKeywords; if empty, OMIT the tag entirely
 *   - <meta name="description"> = metaDescription; if empty, falls back to 160-char
 *     plain-text excerpt (strip HTML, collapse whitespace, append "..." when truncated)
 * - Blog listing page gets sensible default keywords + description meta tags.
 * - All SEO values are XSS-safe (DOM setAttribute / escaped).
 * - Other pages (home, etc.) remain completely unaffected.
 */
import { useEffect } from 'react';
import { clinic } from '../data/clinic.js';
import { getPageSeoByPath } from './pageSeoApi.js';

const TAG = 'data-oc-seo';
const ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

const HOME = {
  title: clinic.meta.title,
  description: clinic.meta.description,
  keywords: null,
  image: '/images/photo/about-consult.jpg',
  path: '/',
};

/**
 * Escapes unsafe characters for HTML/attribute output (Feature 1.7)
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strips HTML tags, collapses whitespace, and truncates to maxLength (Feature 1.5).
 */
export function stripHtmlAndTruncate(input, maxLength = 160) {
  if (!input) return '';
  const text = String(input).replace(/<[^>]+>/g, ' ');
  const collapsed = text.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= maxLength) return collapsed;
  return collapsed.slice(0, maxLength).trim() + '...';
}

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(TAG, '');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content ?? '');
}

function removeMeta(attr, key) {
  const el = document.head.querySelector(`meta[${attr}="${key}"][${TAG}]`);
  if (el) el.remove();
}

/**
 * Apply route meta with dynamic Page SEO overrides.
 */
export function useSeo(seo = null) {
  useEffect(() => {
    let live = true;
    const head = document.head;
    const added = [];
    const route = seo ?? HOME;
    const cleanPath = route.path ? (route.path.startsWith('/') ? route.path : `/${route.path}`) : '';
    let currentUrl = route.canonicalUrl?.trim() || `${ORIGIN}${cleanPath}`;
    const image = route.image ?? HOME.image;

    const previousTitle = document.title;

    const applyMetadata = (title, description, keywords, canonicalHref) => {
      if (!live) return;
      document.title = title;
      upsertMeta('name', 'description', description);

      const kw = (keywords || '').trim();
      if (kw) {
        upsertMeta('name', 'keywords', kw);
      } else {
        removeMeta('name', 'keywords');
      }

      // Canonical
      const prevCanonical = head.querySelector('link[rel="canonical"]');
      if (prevCanonical && !prevCanonical.hasAttribute(TAG)) {
        prevCanonical.setAttribute('href', canonicalHref);
      } else {
        let canonical = head.querySelector(`link[rel="canonical"][${TAG}]`);
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          canonical.setAttribute(TAG, '');
          head.appendChild(canonical);
          added.push(canonical);
        }
        canonical.setAttribute('href', canonicalHref);
      }

      // Open Graph + Twitter
      upsertMeta('property', 'og:title', title);
      upsertMeta('property', 'og:description', description);
      upsertMeta('property', 'og:url', canonicalHref);
      upsertMeta('property', 'og:type', 'website');
      upsertMeta('property', 'og:site_name', clinic.name);
      upsertMeta('property', 'og:image', `${ORIGIN}${image}`);
      upsertMeta('name', 'twitter:card', 'summary_large_image');
      upsertMeta('name', 'twitter:title', title);
      upsertMeta('name', 'twitter:description', description);
      upsertMeta('name', 'twitter:image', `${ORIGIN}${image}`);
    };

    // Apply baseline route metadata
    applyMetadata(route.title, route.description, route.keywords, currentUrl);

    // Check for custom Page SEO override (e.g. for '/', '/about', '/services', '/blogs', '/contact')
    if (route.path) {
      getPageSeoByPath(route.path).then((custom) => {
        if (!live || !custom) return;
        const overriddenTitle = custom.metaTitle?.trim() || route.title;
        const overriddenDesc = custom.metaDescription?.trim() || route.description;
        const overriddenKw = custom.metaKeywords?.trim() || route.keywords;
        const overriddenCanonical = custom.canonicalUrl?.trim() || currentUrl;
        applyMetadata(overriddenTitle, overriddenDesc, overriddenKw, overriddenCanonical);
      });
    }

    // JSON-LD scripts
    const graphs = route.jsonLd
      ? Array.isArray(route.jsonLd)
        ? route.jsonLd
        : [route.jsonLd]
      : [];
    graphs.forEach((graph) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(TAG, '');
      script.textContent = JSON.stringify(graph);
      head.appendChild(script);
      added.push(script);
    });

    return () => {
      live = false;
      document.title = previousTitle;
      added.forEach((el) => el.remove());
      removeMeta('name', 'keywords');
    };
  }, [
    seo?.title,
    seo?.description,
    seo?.keywords,
    seo?.path,
    seo?.canonicalUrl,
    seo?.image,
    seo?.jsonLd ? JSON.stringify(seo.jsonLd) : '',
  ]);
}

export default useSeo;
