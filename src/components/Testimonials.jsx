import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { testimonials } from '../data/clinic.js';
import Section, { SectionIntro, PlaceholderTag } from './ui/Blocks.jsx';
import { RevealBlock } from './anim/SplitReveal.jsx';

/**
 * Testimonials — the arc carousel.
 *
 * A faithful adaptation of the reference "arc carousel": the centred card
 * peaks while its neighbours sink and fan-rotate outward. The reference is a
 * native scroll-snap carousel driven by `scrollLeft`; here the same arc maths
 * is driven by a continuously advancing virtual position on the GSAP ticker,
 * so the carousel is always in motion at a readable pace and freezes while
 * hovered (or focused) instead of waiting for a swipe.
 *
 * Reference constants (community-bits ui bits, ArcCarousel defaults):
 *   dip 56px · rotate 9° · dim 0.3 · t = min(distance/cardWidth, 1)
 * One addition for an always-visible arc: cards fade out fully at the far
 * edges (|offset| > 2.4 slots), so the wrap-around happens while invisible.
 *
 * Every quote is a marked placeholder — see `testimonials` in data/clinic.js.
 * The card photos are the same placeholder stock pool used across the page.
 */

/** Portrait photo pool, one per card (placeholder imagery, as agreed). */
const cardImages = [
  { src: '/images/photo/hands-support.jpg', alt: 'Placeholder image — hands offering support.' },
  { src: '/images/photo/consult-care.jpg', alt: 'Placeholder image — a clinician listening to a patient.' },
  { src: '/images/photo/calm-leaf.jpg', alt: 'Placeholder image — a calm detail of the clinic.' },
  { src: '/images/photo/consult-two.jpg', alt: 'Placeholder image — a consultation in progress.' },
  { src: '/images/photo/consult-bed.jpg', alt: 'Placeholder image — care during treatment.' },
  { src: '/images/photo/reception-plants.jpg', alt: 'Placeholder image — the clinic reception.' },
];

/** Reference arc constants. */
const DIP = 56; // px a fully off-centre card sinks
const ROTATE = 9; // fan rotation (deg) of a fully off-centre card
const DIM = 0.3; // opacity lost at full offset
const SATURATION = 1.4; // offsets beyond this many slots sit at full dip/rotate
const FADE_START = 2.4; // slots beyond this fade to zero before the wrap point

/** Gap between cards, matching the responsive widths below. */
const gapFor = () => (window.innerWidth < 640 ? 16 : 24);

export default function Testimonials() {
  const regionRef = useRef(null);
  const slotRefs = useRef([]);
  const pos = useRef(0); // virtual scroll position, in slots
  const step = useRef(320); // slot width + gap, px (re-measured on resize)
  const paused = useRef(false);
  const inView = useRef(false);

  const items = testimonials.items;
  const count = items.length;

  useEffect(() => {
    const region = regionRef.current;
    if (!region || count === 0) return undefined;

    const slots = slotRefs.current.slice(0, count);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const measure = () => {
      const first = slots.find(Boolean);
      if (first) step.current = first.offsetWidth + gapFor();
    };

    /**
     * The reference arc, applied per frame:
     * t saturates by `SATURATION` slots, y/rotate follow it, opacity dims,
     * and cards fade fully before the wrap point so the sign flip of the
     * fan rotation is never seen.
     */
    const update = () => {
      slots.forEach((slot, i) => {
        if (!slot) return;
        let rel = i - pos.current;
        rel -= Math.round(rel / count) * count; // wrap into [-count/2, count/2)
        const dist = Math.abs(rel);
        const t = Math.min(dist / SATURATION, 1);
        const edgeFade =
          dist <= FADE_START ? 1 : Math.max(0, 1 - (dist - FADE_START) / (count / 2 - FADE_START));
        const x = rel * step.current;
        const y = t * DIP;
        const rotate = (rel < 0 ? -1 : 1) * t * ROTATE;
        slot.style.transform = `translate(calc(-50% + ${x.toFixed(2)}px), ${y.toFixed(2)}px) rotate(${rotate.toFixed(3)}deg)`;
        slot.style.opacity = ((1 - t * DIM) * edgeFade).toFixed(4);
        slot.style.zIndex = String(20 - Math.round(dist * 2));
      });
    };

    measure();
    update();

    if (reduce) {
      // Static fan: first card centred, no autoplay.
      return () => {
        slots.forEach((slot) => {
          if (slot) slot.style.transform = '';
        });
      };
    }

    // Constant, readable motion: one card per `interval` seconds.
    const interval = testimonials.interval || 3.4;
    const tick = (time, deltaMs) => {
      if (!paused.current && inView.current && !document.hidden) {
        pos.current = (pos.current + deltaMs / 1000 / interval) % count;
        if (pos.current < 0) pos.current += count;
        update();
      }
    };
    gsap.ticker.add(tick);

    // Hover (or keyboard focus) freezes the carousel in place.
    const stop = () => {
      paused.current = true;
    };
    const resume = () => {
      paused.current = false;
    };
    region.addEventListener('mouseenter', stop);
    region.addEventListener('mouseleave', resume);
    region.addEventListener('focusin', stop);
    region.addEventListener('focusout', resume);

    // Only animate while near the viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
      },
      { rootMargin: '120px' },
    );
    io.observe(region);

    const onResize = () => {
      measure();
      update();
    };
    window.addEventListener('resize', onResize);

    return () => {
      gsap.ticker.remove(tick);
      region.removeEventListener('mouseenter', stop);
      region.removeEventListener('mouseleave', resume);
      region.removeEventListener('focusin', stop);
      region.removeEventListener('focusout', resume);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [count]);  return (
    <Section id="testimonials" tone="deep">
      {/* Flex wrapper: mobile flows title → cards → intro
          (DESIGN_RULES.md §1); `lg:order` restores the original desktop
          flow: title → intro → cards. */}
      <div className="flex flex-col">
        <SectionIntro
          label={testimonials.eyebrow}
          title={testimonials.heading}
        />

        <RevealBlock delay={0.12} className="order-3 mx-auto mt-8 max-w-2xl text-center text-base leading-[1.8] text-ink-70 sm:text-lg lg:order-1 lg:mt-7">
          {testimonials.intro}
        </RevealBlock>

        {/* Carousel region. Slots are absolutely positioned from the centre and
          transformed every frame; the track carries the arc's extra depth. */}
        <RevealBlock y={32} className="order-2 mt-14 lg:order-3 lg:mt-20">
        <div
          ref={regionRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Patient testimonials (placeholder content)"
          className="relative -mx-5 h-[350px] overflow-x-clip sm:-mx-8 sm:h-[395px] md:h-[440px] lg:-mx-12 lg:h-[480px]"
        >
          {items.map((item, i) => {
            const image = cardImages[i % cardImages.length];
            return (
              <article
                key={item.id}
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                className="absolute top-0 left-1/2 aspect-[0.72] w-[11.5rem] will-change-transform sm:w-[14rem] md:w-[16rem] lg:w-[17.5rem]"
              >
                <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.25rem] bg-teal-900 shadow-soft">
                  <img
                    src={image.src}
                    alt={image.alt}
                    draggable="false"
                    loading={i < 3 ? 'eager' : 'lazy'}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Scrim keeps the quote readable over the photo. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-teal-900/95 via-teal-900/45 to-teal-900/15"
                  />

                  <blockquote className="relative p-5 sm:p-6">
                    <p className="font-serif text-[0.9375rem] leading-[1.6] text-cream italic sm:text-base sm:leading-[1.65]">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </blockquote>

                  <figcaption className="relative p-5 pt-0 sm:p-6 sm:pt-0">
                    <span className="block text-sm font-semibold text-cream sm:text-[0.9375rem]">
                      {item.name}
                    </span>
                    <span className="label-sm mt-1.5 block text-cream/60">{item.designation}</span>
                  </figcaption>
                </div>
              </article>
            );
          })}
        </div>
      </RevealBlock>

      <RevealBlock y={16} className="order-4 mt-12 flex justify-center lg:order-3">
        <PlaceholderTag tone="ink">{testimonials.note}</PlaceholderTag>
      </RevealBlock>
      </div>
    </Section>
  );
}
