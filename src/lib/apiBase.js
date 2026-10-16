/**
 * Global API Router for Client-Side Requests
 *
 * Ensures all API calls (/api/...) transparently target the live backend
 * when the site is deployed on an external domain (e.g. oncocureclinic.com on Hostinger)
 * without requiring a separate Node.js server setup on Hostinger.
 */

const LIVE_BACKEND = 'https://onco-cure.vercel.app';

if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    let url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input && input.url) || '';

    if (typeof url === 'string' && url.startsWith('/api')) {
      const isLocalOrVercel =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.endsWith('.vercel.app');

      if (!isLocalOrVercel) {
        const fullUrl = `${LIVE_BACKEND}${url}`;
        if (typeof input === 'string') {
          input = fullUrl;
        } else if (input instanceof URL) {
          input = new URL(fullUrl);
        } else if (input && typeof input === 'object') {
          input = new Request(fullUrl, input);
        }
      }
    }

    return originalFetch.call(this, input, init);
  };
}
