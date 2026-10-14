/**
 * ---------------------------------------------------------------------------
 * Rich Paste Fidelity Cleaner (Feature 3)
 * ---------------------------------------------------------------------------
 * Cleans pasted HTML from Microsoft Word, Google Docs, and web browsers:
 * - Strips office junk: mso-* classes, <o:p>, <w:*>, conditional comments.
 * - Strips scripts, style blocks, meta, links, iframes, inline event handlers.
 * - Preserves headings, bold/italic/underline, text colors, font sizes,
 *   alignment, links, lists (with <ol start="...">), tables (with colspan,
 *   rowspan, border and padding styles).
 * - Identifies remote images and re-hosts them through /api/fetch-remote-image
 *   before insertion, falling back to original remote URL if fetch fails.
 */

const ALLOWED_STYLE_PROPS = [
  'text-align',
  'color',
  'background-color',
  'font-weight',
  'font-style',
  'text-decoration',
  'font-size',
  'margin-left',
  'border',
  'border-collapse',
  'padding',
];

/**
 * Filter an inline CSS style attribute to only allow specific formatting properties.
 */
function filterStyleString(styleStr) {
  if (!styleStr) return '';
  const parts = styleStr.split(';');
  const preserved = [];

  for (const part of parts) {
    const colon = part.indexOf(':');
    if (colon === -1) continue;
    const prop = part.slice(0, colon).trim().toLowerCase();
    const val = part.slice(colon + 1).trim();

    // Block css expressions / script injections
    if (/javascript:|expression\(|behavior:/i.test(val)) continue;

    if (ALLOWED_STYLE_PROPS.includes(prop)) {
      preserved.push(`${prop}: ${val}`);
    }
  }

  return preserved.join('; ');
}

/**
 * Cleans HTML synchronously (removes office junk, scripts, event handlers).
 */
export function cleanPastedHtml(rawHtml) {
  if (!rawHtml) return '';

  let html = rawHtml;

  // 1. Strip conditional comments: <!--[if ...]> ... <![endif]-->
  html = html.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '');
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // 2. Strip dangerous and unnecessary elements
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  html = html.replace(/<meta[^>]*>/gi, '');
  html = html.replace(/<link[^>]*>/gi, '');

  // 3. Strip office namespace tags like <o:p>, <w:sdt>, etc.
  html = html.replace(/<\/?\w+:\w+[^>]*>/gi, '');

  // 4. Use browser DOMParser to cleanly traverse and sanitize attributes
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  function sanitizeNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();

      // Remove forbidden nodes that escaped regex
      if (['script', 'style', 'meta', 'link', 'iframe', 'object', 'embed'].includes(tag)) {
        node.remove();
        return;
      }

      // Sanitize attributes
      const attrs = Array.from(node.attributes);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        const val = attr.value;

        // Drop all inline event handlers (onclick, onload, etc.)
        if (name.startsWith('on')) {
          node.removeAttribute(attr.name);
          continue;
        }

        // Drop mso-* classes or junk classes
        if (name === 'class') {
          const cleanClass = val
            .split(/\s+/)
            .filter((c) => !c.startsWith('mso') && !c.startsWith('Mso'))
            .join(' ');
          if (cleanClass) node.setAttribute('class', cleanClass);
          else node.removeAttribute('class');
          continue;
        }

        // Drop unsafe links
        if (name === 'href') {
          if (/^\s*javascript:/i.test(val)) {
            node.removeAttribute('href');
          }
          continue;
        }

        // Sanitize styles to only keep allowlisted properties
        if (name === 'style') {
          const filtered = filterStyleString(val);
          if (filtered) node.setAttribute('style', filtered);
          else node.removeAttribute('style');
          continue;
        }

        // Preserve table attributes: colspan, rowspan, border
        if (['colspan', 'rowspan', 'border', 'align'].includes(name)) {
          continue;
        }

        // Preserve <ol start="...">
        if (tag === 'ol' && name === 'start') {
          continue;
        }

        // Preserve image src, alt, width, height
        if (tag === 'img' && ['src', 'alt', 'width', 'height'].includes(name)) {
          continue;
        }

        // Preserve standard link target/rel
        if (tag === 'a' && ['target', 'rel'].includes(name)) {
          continue;
        }

        // Remove unknown/junk attributes
        if (!['id', 'title'].includes(name)) {
          node.removeAttribute(attr.name);
        }
      }

      // Recurse children
      Array.from(node.childNodes).forEach(sanitizeNode);
    }
  }

  Array.from(doc.body.childNodes).forEach(sanitizeNode);
  return doc.body.innerHTML;
}

/**
 * Re-host all remote images in an HTML snippet through the server's /api/fetch-remote-image
 * Feature 3.4 requirement:
 * "re-host them by fetching each remote image and uploading it through the project's
 * existing upload endpoint; fall back to the original remote URL if the fetch fails."
 */
export async function rehostPastedImages(cleanHtml) {
  if (!cleanHtml) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanHtml, 'text/html');
  const imgs = Array.from(doc.querySelectorAll('img'));

  if (imgs.length === 0) return cleanHtml;

  const uploadPromises = imgs.map(async (img) => {
    const src = img.getAttribute('src');
    if (!src) return;

    // Skip already local images
    if (src.startsWith('/images/') || src.startsWith('http://localhost') || src.startsWith('http://127.0.0.1')) {
      return;
    }

    try {
      const res = await fetch('/api/fetch-remote-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: src }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          img.setAttribute('src', data.url);
        }
      }
    } catch (err) {
      console.warn('Re-hosting remote image failed, keeping original:', err);
      // Fallback: keep original src
    }
  });

  await Promise.all(uploadPromises);
  return doc.body.innerHTML;
}

/**
 * Process pasted clipboard data with Rich Paste Fidelity.
 * Returns { html: string, isRich: boolean }
 */
export async function processClipboardPaste(clipboardData) {
  const htmlFlavor = clipboardData.getData('text/html');
  const textFlavor = clipboardData.getData('text/plain');

  if (htmlFlavor && htmlFlavor.trim()) {
    // 1. Clean Office junk & scripts
    const cleaned = cleanPastedHtml(htmlFlavor);
    // 2. Re-host remote images
    const rehosted = await rehostPastedImages(cleaned);
    return { html: rehosted, isRich: true };
  }

  // Fallback to plain text
  return { text: textFlavor, isRich: false };
}
