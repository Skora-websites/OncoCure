/**
 * ---------------------------------------------------------------------------
 * hashRoute — small helpers for the hash-router URL scheme
 * ---------------------------------------------------------------------------
 * Routes look like:
 *   #/                        home
 *   #/about  #/contact        static pages
 *   #/services?page=2         Services, offset pagination in the hash
 *   #/blogs?q=pain&page=1     Blogs, search + pagination in the hash
 *   #/services/chemotherapy   service detail
 *   #/blogs/<slug>            blog detail
 *
 * One parse function and one navigate function keep the format consistent
 * everywhere; the useHashLocation hook re-renders on hashchange. The
 * `occ:scroll-top` event (see useSmoothScroll.js) is dispatched on navigate
 * so anchor-click smooth scrolling to the top is shared with the navbar.
 */
import { useEffect, useState } from 'react';

/** Parse the current hash into { path, params }. Empty hash → home. */
export function parseHash() {
  const raw = window.location.hash.replace(/^#/, ''); // '/services?page=2'
  const [pathPart = '/', queryPart = ''] = raw.split('?');
  const path = pathPart === '' ? '/' : pathPart;
  return { path, params: new URLSearchParams(queryPart) };
}

/** Build a hash string from a path and optional params, dropping empties. */
export function buildHash(path, params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}` !== '') {
      usp.set(key, `${value}`);
    }
  });
  const qs = usp.toString();
  return `#${path}${qs ? `?${qs}` : ''}`;
}

/**
 * Navigate to a path (with optional params). `replace` swaps the history
 * entry instead of pushing — used by the debounced search box so typing a
 * query does not stack a history row per keystroke.
 */
export function navigate(path, params = {}, { replace = false } = {}) {
  const next = buildHash(path, params);
  if (window.location.hash === next) return;
  if (replace) {
    const url = `${window.location.pathname}${window.location.search}${next}`;
    window.history.replaceState(null, '', url);
    window.dispatchEvent(new Event('hashchange'));
  } else {
    window.location.hash = next;
  }
  window.dispatchEvent(new Event('occ:scroll-top'));
}

/** Reactive parse — re-renders the caller whenever the hash changes. */
export function useHashLocation() {
  const [loc, setLoc] = useState(parseHash);
  useEffect(() => {
    const onHash = () => setLoc(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return loc;
}
