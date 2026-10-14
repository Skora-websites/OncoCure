import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * useSmoothScroll — Lenis smooth scrolling driven by GSAP's ticker.
 *
 * This is the standard pairing: Lenis handles the interpolation, GSAP's ticker
 * drives it, and ScrollTrigger is refreshed on every scroll event so pinned and
 * scrubbed animations stay in sync with the virtual scroll position.
 *
 * Both libraries are disabled when the visitor prefers reduced motion.
 */
export default function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // Let native scrolling work untouched.
      ScrollTrigger.refresh();
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      // Exponential ease-out: fast pickup, long glide, no rubber-band bounce.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Pause Lenis while a modal-ish overlay owns the screen.
    const lock = () => lenis.stop();
    const unlock = () => lenis.start();
    window.addEventListener('scroll-lock', lock);
    window.addEventListener('scroll-unlock', unlock);

    // Synchronize ScrollTrigger markers as images load and curtain reveals
    const refreshScrollTriggers = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', refreshScrollTriggers);
    window.addEventListener('occ:reveal', refreshScrollTriggers);
    const refreshTimer1 = setTimeout(refreshScrollTriggers, 400);
    const refreshTimer2 = setTimeout(refreshScrollTriggers, 1200);
    const refreshTimer3 = setTimeout(refreshScrollTriggers, 2500);

    // Page switches (hash routing) need the virtual scroll reset; a plain
    // window.scrollTo would be fought by Lenis on its next frame.
    const scrollTop = () => lenis.scrollTo(0, { immediate: true });
    window.addEventListener('occ:scroll-top', scrollTop);

    // Anchor links route through Lenis so in-page navigation stays smooth.
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      // Hash routes (e.g. #/contact) are page navigation, not in-page anchors.
      if (id.startsWith('#/')) return;
      let el;
      try {
        el = document.querySelector(id);
      } catch {
        return;
      }
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -90, duration: 1.2 });
    };
    document.addEventListener('click', onClick);

    // Layout settles after webfonts land; refresh so trigger positions are right.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', refreshScrollTriggers);
      window.removeEventListener('occ:reveal', refreshScrollTriggers);
      clearTimeout(refreshTimer1);
      clearTimeout(refreshTimer2);
      clearTimeout(refreshTimer3);
      window.removeEventListener('scroll-lock', lock);
      window.removeEventListener('scroll-unlock', unlock);
      window.removeEventListener('occ:scroll-top', scrollTop);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [enabled]);
}

export { gsap, ScrollTrigger };
