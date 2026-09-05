import React, { useEffect, useState } from 'react';
import { usePathname } from './lib/router';
import { BlogPage } from './pages/BlogPage';
import { PageLoader } from './components/PageLoader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { About } from './components/About';
import { Services } from './components/Services';
import { Pricing } from './components/Pricing';
import { Testimonials } from './components/Testimonials';
import { LeadCTA } from './components/LeadCTA';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';

export default function App() {
  const pathname = usePathname();
  const isBlogRoute = pathname === '/blog' || pathname.startsWith('/blog/');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string | undefined>(undefined);

  const handleOpenQuoteModal = (serviceId?: string) => {
    setSelectedServiceForQuote(serviceId);
    setQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setQuoteModalOpen(false);
  };

  // Entering the blog from an in-page anchor should not keep the previous
  // scroll offset.
  useEffect(() => {
    // `behavior: 'instant'` overrides the global `scroll-smooth` class, which
    // would otherwise animate a full-page scroll on every route change.
    if (isBlogRoute) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [isBlogRoute]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3F3F3] flex flex-col font-sans selection:bg-[#F5C400] selection:text-[#0A0A0A] relative">
      {/* 1.0 - 1.2s Fast Premium Page Intro Animation */}
      <PageLoader />

      {/* Global Floating / Sticky Navbar */}
      <Navbar onOpenQuoteModal={handleOpenQuoteModal} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {isBlogRoute ? (
          /* Soro-managed blog / SEO content */
          <BlogPage />
        ) : (
          <>
          {/* Cinematic Hero Section */}
          <Hero onOpenQuoteModal={handleOpenQuoteModal} />

          {/* Trust Bar (4 Core Value Pillars) */}
          <TrustBar />

          {/* Editorial About Section */}
          <About onOpenQuoteModal={() => handleOpenQuoteModal()} />

          {/* 6 Core Automotive & Transmission Services */}
          <Services onOpenQuoteModal={handleOpenQuoteModal} />

          {/* Transparent Pricing & FAQs */}
          <Pricing onOpenQuoteModal={handleOpenQuoteModal} />

          {/* Customer & Partner Shop Testimonials */}
          <Testimonials />

          {/* High-Impact Lead Conversion Banner */}
          <LeadCTA onOpenQuoteModal={() => handleOpenQuoteModal()} />

          {/* Complete Contact & Lead Form Section */}
          <Contact initialServiceId={selectedServiceForQuote} />
          </>
        )}
      </main>

      {/* Dark Industrial Footer */}
      <Footer onOpenQuoteModal={handleOpenQuoteModal} />

      {/* Universal Get a Quote Pop-up Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={handleCloseQuoteModal}
        initialServiceId={selectedServiceForQuote}
      />
    </div>
  );
}
