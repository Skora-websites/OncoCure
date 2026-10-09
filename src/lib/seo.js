/**
 * ---------------------------------------------------------------------------
 * useSeo — per-route document head management (no router dependency yet)
 * ---------------------------------------------------------------------------
 * Sets the document title, meta description, canonical URL, Open Graph and
 * Twitter card tags, and injects route-scoped JSON-LD scripts.
 *
 * Everything the hook touches it tags with `data-oc-seo` and removes again on
 * cleanup (or before the next apply), so navigating between routes never
 * leaves stale tags behind. Home page defaults are restored by simply
 * applying the home route's own meta — every route calls useSeo.
 *
 * Canonical / og:url values are hash-route URLs (`.../#/about`). That is
 * honest for this build: hash routing is a known crawlability limitation and
 * the switch to real paths + prerendering happens at the admin/SSR stage —
 * this hook is the single place that changes then.
 */
import { useEffect } from 'react';
import { clinic } from '../data/clinic.js';

const TAG = 'data-oc-seo';
const ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

const HOME = {
  title: clinic.meta.title,
  description: clinic.meta.description,
  image: '/images/photo/about-consult.jpg',
};

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(TAG, '');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Apply route meta. Pass `null` (or nothing) to restore the home defaults.
 *
 * @param {object|null} seo
 * @param {string}  seo.title        Document title (full, brand included).
 * @param {string}  seo.description  Meta description for the route.
 * @param {string} [seo.path]        Hash path, e.g. '/about' — builds the
 *                                   canonical/OG URLs. Omit for home.
 * @param {string} [seo.image]       Absolute-path social image (defaults to
 *                                   the home hero image).
 * @param {object[]|object} [seo.jsonLd] One or more JSON-LD graph objects.
 */
export function useSeo(seo = null) {
  useEffect(() => {
    const head = document.head;
    const added = [];
    const route = seo ?? HOME;
    const url = `${ORIGIN}/${route.path ? `#${route.path}` : ''}`;
    const image = route.image ?? HOME.image;

    // Title.
    const previousTitle = document.title;
    document.title = route.title;

    // Primary meta.
    upsertMeta('name', 'description', route.description);

    // Canonical (tagged so it is removed on cleanup, restoring home).
    const prevCanonical = head.querySelector('link[rel="canonical"]');
    if (prevCanonical && !prevCanonical.hasAttribute(TAG)) {
      // Keep an untagged canonical if one is ever hand-authored in index.html.
      prevCanonical.setAttribute('href', url);
    } else {
      const canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      canonical.setAttribute(TAG, '');
      head.appendChild(canonical);
      added.push(canonical);
    }

    // Open Graph + Twitter.
    upsertMeta('property', 'og:title', route.title);
    upsertMeta('property', 'og:description', route.description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', clinic.name);
    upsertMeta('property', 'og:image', `${ORIGIN}${image}`);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', route.title);
    upsertMeta('name', 'twitter:description', route.description);
    upsertMeta('name', 'twitter:image', `${ORIGIN}${image}`);

    // JSON-LD: one script per graph object, removed on cleanup.
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
      document.title = previousTitle;
      added.forEach((el) => el.remove());
    };
  }, [
    seo?.title,
    seo?.description,
    seo?.path,
    seo?.image,
    // Graph objects are plain data; serialising keeps the effect stable.
    seo?.jsonLd ? JSON.stringify(seo.jsonLd) : '',
  ]);
}

export default useSeo;
