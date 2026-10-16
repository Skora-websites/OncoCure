import { useEffect } from 'react';
import useSmoothScroll from './hooks/useSmoothScroll.js';
import { useHashLocation } from './lib/hashRoute.js';
import { useSeo } from './lib/seo.js';

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
import WhyUs from './components/WhyUs.jsx';
import ClosingCta from './components/ClosingCta.jsx';
import Footer from './components/Footer.jsx';
import ConsultationOverlay from './components/ui/ConsultationOverlay.jsx';
import { openConsult } from './lib/consultBus.js';
import ContactPage from './pages/ContactPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ServiceDetailPage from './pages/ServiceDetailPage.jsx';
import BlogsPage from './pages/BlogsPage.jsx';
import BlogDetailPage from './pages/BlogDetailPage.jsx';import AdminPage from './pages/AdminPage.jsx';
import { inlineCta } from './data/clinic.js';
import WhatsAppChatButton from './components/WhatsappChatButton.jsx';

/**
 * Minimal hash routing — no router dependency yet. The path after `#` decides
 * the page:
 *
 *   #/                       home
 *   #/about   #/contact      static pages
 *   #/services               services list (?page=n for pagination)
 *   #/services/<slug>        service detail
 *   #/blogs                  blogs list (?q= search, ?page=n pagination)
 *   #/blogs/<slug>           blog detail
 *
 * Hash-only changes never reload, so Lenis, GSAP and the loader keep their
 * state.
 */
export default function App() {
  const { path } = useHashLocation();

  const segments = path.replace(/^\//, '').split('/'); // 'services/chemo' → ['services','chemo']
  const root = segments[0] || 'home';
  const sub = segments[1] ?? null;
  const isAdmin = root === 'admin';

  // Lenis smooth scrolling for public website, completely disabled on admin portal
  useSmoothScroll(!isAdmin);

  // Home route dynamic SEO
  useSeo(root === 'home' && !isAdmin ? { path: '/' } : null);

  // Every fresh route lands at the top. Query-param changes (?page=, ?q=)
  // do not alter `path`, so pagination and search keep their reading position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  let page;
  if (root === 'admin') return <AdminPage />;
  else if (root === 'about') page = <AboutPage />;
  else if (root === 'contact') page = <ContactPage />;
  else if (root === 'services')
    page = sub ? <ServiceDetailPage slug={sub} /> : <ServicesPage />;
  else if (root === 'blogs')
    page = sub ? <BlogDetailPage slug={sub} /> : <BlogsPage />;
  else
    page = (
      <>
        <Hero />
        <MarqueeBand />
        <ClinicIntro />
        <Doctors />
        <Services />
        <ServiceCatalogue>
          <InlineCta {...inlineCta} onAction={openConsult} className="mt-20 sm:mt-28 lg:mt-32" />
        </ServiceCatalogue>
        <Approach />
        {/* Testimonials section commented out for now: */}
        {/* <Testimonials /> */}
        <WhyUs />
        <ClosingCta />
      </>
    );

  return (
    <div className="min-h-screen bg-cream">
      <Loader />
      <Navbar />

      {/* The consultation overlay lives above every page. */}
      <ConsultationOverlay />

      <main id="main">{page}</main>

      <Footer />

      {/* Sticky WhatsApp chat button — bottom-right of the viewport on all public pages. */}
      <WhatsAppChatButton />
    </div>
  );
}
