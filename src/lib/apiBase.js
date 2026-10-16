/**
 * Global API Router for Client-Side Requests
 *
 * Ensures all API calls (/api/...) transparently reach the backend.
 * - On localhost or Vercel, executes directly against the local host.
 * - On custom production hosts (e.g. oncocureclinic.com), it attempts the local origin
 *   first. If the host responds with 404/502 (e.g. unproxied Apache), it automatically
 *   routes to the live Vercel cloud backend so no request is ever lost.
 */

const LIVE_BACKEND = 'https://onco-cure.vercel.app';

if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    let url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input && input.url) || '';

    if (typeof url === 'string' && url.startsWith('/api')) {
      const isLocalOrVercel =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.endsWith('.vercel.app');

      if (!isLocalOrVercel) {
        try {
          const localRes = await originalFetch.call(this, input, init);
          // If local host responded validly (2xx, 3xx, 400 validation, 401 auth, 403, etc.)
          if (localRes.status !== 404 && localRes.status !== 502 && localRes.status !== 503) {
            return localRes;
          }
        } catch {
          // Local network error, proceed to fallback
        }

        // Seamless fallback to live Vercel backend
        const fullUrl = `${LIVE_BACKEND}${url}`;
        let fallbackInput = fullUrl;
        if (input instanceof URL) {
          fallbackInput = new URL(fullUrl);
        } else if (input && typeof input === 'object' && input.url) {
          fallbackInput = new Request(fullUrl, input);
        }
        return originalFetch.call(this, fallbackInput, init);
      }
    }

    return originalFetch.call(this, input, init);
  };
}
