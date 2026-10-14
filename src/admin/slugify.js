/**
 * ---------------------------------------------------------------------------
 * Slug Auto-Fill Utility (WordPress-style) — Feature 2
 * ---------------------------------------------------------------------------
 * Generates a URL-friendly slug from a title:
 * - Lowercase
 * - Accents stripped (é -> e, ü -> u, etc.)
 * - Non-alphanumerics collapsed to hyphens
 * - Trimmed leading and trailing hyphens
 */
export function slugify(text) {
  if (!text) return '';

  return text
    .toString()
    .normalize('NFD') // Separate accents from base letters
    .replace(/[\u0300-\u036f]/g, '') // Strip accent marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars except space and hyphen
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphen
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading and trailing hyphens
}
