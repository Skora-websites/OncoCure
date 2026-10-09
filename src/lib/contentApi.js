/**
 * ---------------------------------------------------------------------------
 * contentApi — the single async doorway to all page content
 * ---------------------------------------------------------------------------
 * Components never import the data modules directly for lists: they call the
 * async functions here and receive `{ items, total, offset, limit }`. Today
 * the functions resolve from the local data modules with a microtask delay
 * (so loading states are real, not theoretical). When the admin panel /
 * backend arrives, only THIS file changes — every call site becomes a
 * `fetch()` against the real API with the same shapes.
 *
 * Pagination is offset-based and mirrored in the URL (`#/services?page=2`),
 * so a page number is always a shareable, restorable state.
 */
import { servicesFull } from '../data/services.js';
import { blogs, blogBySlug } from '../data/blogs.js';

/** Rows per page on the Services and Blogs listings. */
export const PAGE_SIZE = 6;

/** A tiny await so list UIs genuinely mount → load → ready. */
const settle = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), 0));

const paged = (all, { offset = 0, limit = PAGE_SIZE } = {}) => {
  const items = all.slice(offset, offset + limit);
  return { items, total: all.length, offset, limit };
};

/**
 * Services, in list order.
 * @returns {Promise<{items: object[], total: number, offset: number, limit: number}>}
 */
export function listServices(params = {}) {
  return settle(paged(servicesFull, params));
}

export function getServiceBySlug(slug) {
  return settle(servicesFull.find((s) => s.slug === slug) ?? null);
}

/**
 * Blogs, newest first, optionally filtered by a free-text query matched
 * against title, excerpt, category and body headings (case-insensitive) and
 * by an exact category.
 * @returns {Promise<{items: object[], total: number, offset: number, limit: number}>}
 */
export function listBlogs({ q = '', category = '', offset = 0, limit = PAGE_SIZE } = {}) {
  const query = q.trim().toLowerCase();
  const newestFirst = [...blogs].sort((a, b) => b.date.localeCompare(a.date));
  let filtered = newestFirst;
  if (category) filtered = filtered.filter((b) => b.category === category);
  if (query) {
    filtered = filtered.filter((b) =>
      [b.title, b.excerpt, b.category, ...b.body.map((s) => s.heading ?? '')]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }
  return settle(paged(filtered, { offset, limit }));
}

export function getBlogBySlug(slug) {
  return settle(blogBySlug(slug) ?? null);
}
