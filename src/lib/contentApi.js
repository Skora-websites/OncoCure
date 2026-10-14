/**
 * ---------------------------------------------------------------------------
 * contentApi — the single async doorway to all page content
 * ---------------------------------------------------------------------------
 * Components never import the data modules directly for lists: they call the
 * async functions here and receive `{ items, total, offset, limit }`.
 *
 * Automatically fetches from the backend API (`/api/blogs`, `/api/services`),
 * falling back seamlessly to local static data if the backend server is offline.
 */
import { servicesFull } from '../data/services.js';
import { blogs, blogBySlug } from '../data/blogs.js';

export const PAGE_SIZE = 6;

const paged = (all, { offset = 0, limit = PAGE_SIZE } = {}) => {
  const items = all.slice(offset, offset + limit);
  return { items, total: all.length, offset, limit };
};

export async function listServices(params = {}) {
  try {
    const res = await fetch('/api/services');
    if (res.ok) {
      const data = await res.json();
      return paged(data.items, params);
    }
  } catch {
    // API not reachable, fallback to static
  }
  return paged(servicesFull, params);
}

export async function getServiceBySlug(slug) {
  try {
    const res = await fetch('/api/services');
    if (res.ok) {
      const data = await res.json();
      const found = data.items.find((s) => s.slug === slug);
      if (found) return found;
    }
  } catch {
    // Fallback
  }
  return servicesFull.find((s) => s.slug === slug) ?? null;
}

export async function listBlogs({ q = '', category = '', offset = 0, limit = PAGE_SIZE, status = 'published' } = {}) {
  try {
    const query = new URLSearchParams();
    if (q) query.set('q', q);
    if (category) query.set('category', category);
    if (status) query.set('status', status);
    query.set('offset', String(offset));
    query.set('limit', String(limit));

    const res = await fetch(`/api/blogs?${query.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Fallback to static
  }

  // Local static fallback
  const query = q.trim().toLowerCase();
  const newestFirst = [...blogs].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  let filtered = newestFirst;
  if (status) filtered = filtered.filter((b) => !b.status || b.status === status);
  if (category) filtered = filtered.filter((b) => b.category === category);
  if (query) {
    filtered = filtered.filter((b) =>
      [
        b.title,
        b.excerpt,
        b.category,
        ...(Array.isArray(b.body) ? b.body.map((s) => s.heading ?? '') : []),
        b.content || '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }
  return paged(filtered, { offset, limit });
}

export async function getBlogBySlug(slug) {
  try {
    const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Fallback
  }
  return blogBySlug(slug) ?? null;
}
