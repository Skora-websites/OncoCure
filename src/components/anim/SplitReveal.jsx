import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SplitReveal — the template's signature text animation.
 *
 * Splits a string into words, wraps each in a line-masked span, and staggers
 * them up into place with GSAP when the element scrolls into view.
 *
 * StrictMode note: React runs mount → cleanup → mount in development. The
 * cleanup restores the element's original markup, so every effect cycle splits
 * from a pristine DOM and re-attaches the animation. (A "split only once" flag
 * here would leave the second cycle — the one that sticks — with no animation
 * attached at all.)
 */
export default function SplitReveal({
  children,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  stagger = 0.055,
  duration = 1.05,
  start = 'top 82%',
  _accentWord = null,
  direction = 'up',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const original = el.innerHTML;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Split only the top-level text nodes, so inline markup is preserved.
    const words = [];
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          const parts = child.textContent.split(/(\s+)/);
          parts.forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(' '));
              return;
            }
            const word = document.createElement('span');
            word.className = 'split-word';
            word.textContent = part;
            frag.appendChild(word);
            words.push(word);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && !child.classList.contains('split-word')) {
          walk(child);
        }
      });
    };

    walk(el);

    if (reduce) {
      gsap.set(words, { opacity: 1, y: 0 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        // 'up' rises into place from below; 'down' floats down from above.
        { yPercent: direction === 'down' ? -118 : 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        },
      );
    }, el);

    // Restore the original markup so the next effect cycle (StrictMode's
    // second mount, or a dependency change) splits cleanly from scratch.
    return () => {
      ctx.revert();
      el.innerHTML = original;
    };
  }, [delay, stagger, duration, start, direction]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * RevealBlock — a generic entrance for non-text blocks: a soft rise and fade.
 * Re-creating the tween every effect cycle (StrictMode included) is safe.
 */
export function RevealBlock({
  children,
  className = '',
  delay = 0,
  y = 40,
  duration = 1,
  start = 'top 85%',
  as: Tag = 'div',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, y: 0 });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y, duration, start]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Parallax — moves an element vertically as it passes through the viewport.
 * Used for the layered imagery so sections feel dimensional without animating
 * anything flashy.
 */
export function Parallax({ children, className = '', strength = 60 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      gsap.fromTo(
        el,
        { yPercent: -strength / 10 },
        {
          yPercent: strength / 10,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    });

    return () => mm.revert();
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Fade a group of children up in sequence as the group enters view.
 *
 * `watch` re-arms the group when its value changes — pass the item count on
 * async-loaded lists (data arrives after mount, so the first effect cycle
 * would otherwise find zero children, warn, and never animate).
 */
export function StaggerGroup({
  children,
  className = '',
  stagger = 0.09,
  delay = 0,
  y = 30,
  start = 'top 85%',
  watch = null,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const items = el.children;
    if (items.length === 0) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(items, { opacity: 1, y: 0 });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          delay,
          stagger,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [stagger, delay, y, start, watch]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * applyTouchImageSettles — DESIGN_RULES.md §2: a hover-only zoom needs a
 * non-hover trigger on touch. On `(hover: none)` devices every image matching
 * `selector` inside `root` gently settles from a slight zoom as it scrolls
 * into view (once), so the card reads as alive without any hover. Desktop
 * hover behaviour is untouched; reduced-motion visitors get nothing.
 *
 * Returns a cleanup function (a no-op on hover-capable devices).
 */
export function applyTouchImageSettles(root, selector = 'img') {
  if (!root) return () => {};
  if (!window.matchMedia('(hover: none)').matches) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const ctx = gsap.context(() => {
    root.querySelectorAll(selector).forEach((img) => {
      gsap.fromTo(
        img,
        { scale: 1.07 },
        {
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: img, start: 'top 92%', once: true },
        },
      );
    });
  }, root);
  return () => ctx.revert();
}

export { gsap, ScrollTrigger };
