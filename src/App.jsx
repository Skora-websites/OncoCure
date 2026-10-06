import { useEffect, useState } from 'react';
import useSmoothScroll from './hooks/useSmoothScroll.js';

import Loader from './components/Loader.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import MarqueeBand from './components/MarqueeBand.jsx';
import ClinicIntro from './components/ClinicIntro.jsx';
import Doctors from './components/Doctors.jsx';
import Services from './components/Services.jsx';
import ServiceCatalogue from './components/ServiceCatalogue.jsx';
import InlineCta from './components/ui/InlineCta.jsx';
import Approach from './components/Approach.jsx';
import Testimonials from './components/Testimonials.jsx';
import WhyUs from './components/WhyUs.jsx';
import ClosingCta from './components/ClosingCta.jsx';
import Footer from './components/Footer.jsx';
import ConsultationOverlay from './components/ui/ConsultationOverlay.jsx';
import { openConsult } from './lib/consultBus.js';
import ContactPage from './pages/ContactPage.jsx';

import { inlineCta } from './data/clinic.js';

/**
 * Minimal hash routing — no router dependency yet. `#/contact` shows the
 * Contact Us page; every other hash (or none) shows the home page. Hash-only
 * changes never reload, so Lenis, GSAP and the loader keep their state.
 */
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return hash;
}

export default function App() {
  // Lenis smooth scrolling, driven by GSAP's ticker and synced to ScrollTrigger.
  useSmoothScroll();

  const hash = useHashRoute();
  const isContact = hash.startsWith('#/contact');

  return (
    <div className="min-h-screen bg-cream">
      <Loader />
      <Navbar />

      {/* The consultation overlay lives above every page. */}
      <ConsultationOverlay />

      {isContact ? (
        <main id="main">
          <ContactPage />
        </main>
      ) : (
        <main id="main">
          <Hero />
          <MarqueeBand />
          <ClinicIntro />
          <Doctors />
          <Services />
          <ServiceCatalogue />
          {/* The mid-page band's disc opens the consultation overlay. */}
          <InlineCta {...inlineCta} onAction={openConsult} />
          <Approach />
          <Testimonials />
          <WhyUs />
          <ClosingCta />
        </main>
      )}

      <Footer />
    </div>
  );
}
