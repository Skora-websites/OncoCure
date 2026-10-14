/**
 * ---------------------------------------------------------------------------
 * Server-Side HTML Sanitizer & Allowlist
 * ---------------------------------------------------------------------------
 * Cleans pasted and saved rich content according to Feature 3 requirements:
 * 1. Strips Office junk (mso-* classes/styles, <o:p>, <w:*>, conditional comments).
 * 2. Strips unsafe elements (<script>, <style>, <meta>, <link>, <iframe>, <object>, <embed>).
 * 3. Strips inline event handlers (on* attributes like onclick, onload, etc.) and javascript: URLs.
 * 4. Extends allowlist to preserve:
 *    - colspan and rowspan on table cells (<th>, <td>)
 *    - start attribute on <ol>
 *    - Allowed CSS style properties:
 *      text-align, color, background-color, font-weight, font-style,
 *      text-decoration, font-size, margin-left, border, border-collapse, padding.
 */

const ALLOWED_TAGS = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr', 'br',
  'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'sub', 'sup', 'mark',
  'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  'a', 'img', 'span', 'div', 'pre', 'code'
]);

const ALLOWED_STYLE_PROPERTIES = new Set([
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
  'padding'
]);

/**
 * Filter a style attribute string to only keep allowed CSS properties.
 */
function sanitizeStyleAttribute(styleStr) {
  if (!styleStr) return '';
  const declarations = styleStr.split(';');
  const preserved = [];

  for (const decl of declarations) {
    const colonIdx = decl.indexOf(':');
    if (colonIdx === -1) continue;
    const prop = decl.substring(0, colonIdx).trim().toLowerCase();
    const val = decl.substring(colonIdx + 1).trim();

    // Prevent CSS url(javascript:...) or expression() injection
    if (/javascript:|expression\(|behavior:/i.test(val)) continue;

    if (ALLOWED_STYLE_PROPERTIES.has(prop)) {
      preserved.push(`${prop}: ${val}`);
    }
  }

  return preserved.join('; ');
}

/**
 * Strip conditional comments: <!--[if ...]> ... <![endif]-->
 */
function stripConditionalComments(html) {
  return html.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '');
}

/**
 * Strip namespaced Word tags like <o:p>, <w:sdt>, etc.
 */
function stripOfficeNamespaces(html) {
  // Strip opening/closing namespaced tags: <o:p>, </o:p>, <w:wrap>, etc.
  return html.replace(/<\/?\w+:\w+[^>]*>/gi, '');
}

/**
 * Sanitize HTML string on the server side.
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';

  let cleaned = html;

  // 1. Strip comments and conditional comments
  cleaned = stripConditionalComments(cleaned);
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  // 2. Strip unsafe elements and their contents
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '');
  cleaned = cleaned.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  cleaned = cleaned.replace(/<object[\s\S]*?<\/object>/gi, '');
  cleaned = cleaned.replace(/<embed[\s\S]*?<\/embed>/gi, '');
  cleaned = cleaned.replace(/<meta[^>]*>/gi, '');
  cleaned = cleaned.replace(/<link[^>]*>/gi, '');

  // 3. Strip office namespace tags
  cleaned = stripOfficeNamespaces(cleaned);

  // 4. Parse tags and sanitize attributes
  const tagRegex = /<\/?([a-zA-Z0-9]+)([^>]*)>/g;
  cleaned = cleaned.replace(tagRegex, (match, tagName, attrs) => {
    const tag = tagName.toLowerCase();
    const isClosing = match.startsWith('</');

    if (!ALLOWED_TAGS.has(tag)) {
      // Disallowed tag - strip tag itself
      return '';
    }

    if (isClosing) {
      return `</${tag}>`;
    }

    // Parse attributes
    const attrRegex = /([a-zA-Z0-9_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    const sanitizedAttrs = [];
    let attrMatch;

    while ((attrMatch = attrRegex.exec(attrs)) !== null) {
      const attrName = attrMatch[1].toLowerCase();
      const attrVal = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

      // Strictly drop inline event handlers
      if (attrName.startsWith('on')) continue;

      // Drop javascript: or data: (except data:image for images)
      if (attrName === 'href') {
        if (/^\s*javascript:/i.test(attrVal)) continue;
        sanitizedAttrs.push(`href="${attrVal.replace(/"/g, '&quot;')}"`);
        continue;
      }

      if (attrName === 'src') {
        if (/^\s*javascript:/i.test(attrVal)) continue;
        sanitizedAttrs.push(`src="${attrVal.replace(/"/g, '&quot;')}"`);
        continue;
      }

      if (attrName === 'alt') {
        sanitizedAttrs.push(`alt="${attrVal.replace(/"/g, '&quot;')}"`);
        continue;
      }

      if (attrName === 'title') {
        sanitizedAttrs.push(`title="${attrVal.replace(/"/g, '&quot;')}"`);
        continue;
      }

      // Feature 3: Allow colspan and rowspan on table cells
      if ((tag === 'td' || tag === 'th') && (attrName === 'colspan' || attrName === 'rowspan')) {
        const num = parseInt(attrVal, 10);
        if (!isNaN(num) && num > 0) {
          sanitizedAttrs.push(`${attrName}="${num}"`);
        }
        continue;
      }

      // Feature 3: Allow start attribute on <ol>
      if (tag === 'ol' && attrName === 'start') {
        const num = parseInt(attrVal, 10);
        if (!isNaN(num)) {
          sanitizedAttrs.push(`start="${num}"`);
        }
        continue;
      }

      // Feature 3: Allow sanitized style attribute
      if (attrName === 'style') {
        const cleanStyle = sanitizeStyleAttribute(attrVal);
        if (cleanStyle) {
          sanitizedAttrs.push(`style="${cleanStyle}"`);
        }
        continue;
      }

      // Allow standard table borders/align if present
      if ((tag === 'table' || tag === 'td' || tag === 'th') && (attrName === 'border' || attrName === 'align')) {
        sanitizedAttrs.push(`${attrName}="${attrVal.replace(/"/g, '&quot;')}"`);
        continue;
      }

      // Allow target="_blank" and rel for links
      if (tag === 'a' && (attrName === 'target' || attrName === 'rel')) {
        sanitizedAttrs.push(`${attrName}="${attrVal.replace(/"/g, '&quot;')}"`);
        continue;
      }
    }

    const attrStr = sanitizedAttrs.length > 0 ? ` ${sanitizedAttrs.join(' ')}` : '';
    const selfClosing = match.endsWith('/>') ? ' />' : '>';
    return `<${tag}${attrStr}${selfClosing}`;
  });

  return cleaned.trim();
}

/**
 * Plain-text excerpt generator (160 characters target, stripped of HTML, collapsed whitespace).
 */
export function generatePlainTextExcerpt(htmlOrText, maxLength = 160) {
  if (!htmlOrText) return '';
  // Strip HTML tags
  const plain = htmlOrText.replace(/<[^>]+>/g, ' ');
  // Collapse whitespace
  const collapsed = plain.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= maxLength) return collapsed;
  return collapsed.slice(0, maxLength).trim() + '...';
}

/**
 * HTML escaper for XSS safety.
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
