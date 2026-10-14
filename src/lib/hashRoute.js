/**
 * ---------------------------------------------------------------------------
 * route — clean HTML5 History API routing with backwards-compatible hash support
 * ---------------------------------------------------------------------------
 * Routes look like:
 *   /                         home
 *   /about   /contact         static pages
 *   /services?page=2          Services, offset pagination in search params
 *   /blogs?q=pain&page=1      Blogs, search + pagination in search params
 *   /services/<slug>          service detail
 *   /blogs/<slug>             blog detail
 *   /admin                    admin panel
 *   /admin/<tab>              admin tabs (consultations, blogs, etc.)
 *
 * If a visitor enters via a legacy hash URL (e.g. `/#/admin` or `/#/blogs`),
 * it automatically migrates the URL bar to the clean path `/admin` without reloading.
 */
import { useEffect, useState } from 'react';

/** Parse current location into { path, params }. */
export function parseHash() {
  if (typeof window === 'undefined') {
    return { path: '/', params: new URLSearchParams() };
  }

  // Handle legacy hash migration: /#/admin -> /admin
  if (window.location.hash.startsWith('#/')) {
    const rawHash = window.location.hash.replace(/^#/, '');
    const [hPath = '/', hQuery = ''] = rawHash.split('?');
    const targetPath = hPath.startsWith('/') ? hPath : `/${hPath}`;
    const targetUrl = `${targetPath}${hQuery ? `?${hQuery}` : window.location.search}`;
    window.history.replaceState(null, '', targetUrl);
    return { path: targetPath, params: new URLSearchParams(hQuery || window.location.search) };
  }

  const path = window.location.pathname || '/';
  return { path, params: new URLSearchParams(window.location.search) };
}

/** Build a clean path string from a path and optional params. */
export function buildHash(path, params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}` !== '') {
      usp.set(key, `${value}`);
    }
  });
  const qs = usp.toString();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedPath}${qs ? `?${qs}` : ''}`;
}

/**
 * Navigate to a path (with optional params).
 * Dispatches popstate & scroll-top events so SPA re-renders smoothly without full page reload.
 */
export function navigate(path, params = {}, { replace = false } = {}) {
  const next = buildHash(path, params);
  const current = `${window.location.pathname}${window.location.search}`;
  if (current === next) return;

  if (replace) {
    window.history.replaceState(null, '', next);
  } else {
    window.history.pushState(null, '', next);
  }
  window.dispatchEvent(new Event('popstate'));
  window.dispatchEvent(new Event('occ:scroll-top'));
}

/** Reactive location hook — re-renders caller whenever path or search changes. */
export function useHashLocation() {
  const [loc, setLoc] = useState(parseHash);

  useEffect(() => {
    const onLocationChange = () => setLoc(parseHash());

    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);

    // Intercept internal <a> clicks (e.g. href="/about", href="/admin") for smooth SPA navigation
    const onLinkClick = (e) => {
      const a = e.target.closest?.('a');
      if (!a) return;

      const href = a.getAttribute('href');
      if (!href) return;

      // Ignore in-page anchors, external links, mailto, tel, target="_blank"
      if (
        href.startsWith('#') ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        a.getAttribute('target') === '_blank' ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey
      ) {
        return;
      }

      // Handle internal relative paths
      if (href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
      }
    };

    document.addEventListener('click', onLinkClick);

    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
      document.removeEventListener('click', onLinkClick);
    };
  }, []);

  return loc;
}

export default useHashLocation;
