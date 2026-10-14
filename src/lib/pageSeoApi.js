/**
 * Client API for Static Page SEO management
 */

let memoryCache = null;

export async function listPageSeo() {
  try {
    const res = await fetch('/api/page-seo');
    if (!res.ok) throw new Error('Failed to fetch page SEO');
    const data = await res.json();
    memoryCache = data.items || [];
    return data;
  } catch (err) {
    console.warn('Page SEO load failed, using fallback:', err.message);
    return { items: memoryCache || [], total: (memoryCache || []).length };
  }
}

export async function getPageSeoByPath(path) {
  const norm = path === '/' ? '/' : (path.startsWith('/') ? path : `/${path}`).replace(/\/$/, '');

  // Quick check memory cache
  if (memoryCache) {
    const found = memoryCache.find((p) => p.path === norm);
    if (found) return found;
  }

  try {
    const res = await fetch(`/api/page-seo/by-path?path=${encodeURIComponent(norm)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function updatePageSeo(id, payload) {
  const res = await fetch(`/api/page-seo/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Update failed' }));
    throw new Error(err.error || 'Failed to update page SEO');
  }

  const updated = await res.json();
  if (memoryCache) {
    const idx = memoryCache.findIndex((p) => p.id === id || p.path === id);
    if (idx !== -1) memoryCache[idx] = updated;
  }
  return updated;
}
