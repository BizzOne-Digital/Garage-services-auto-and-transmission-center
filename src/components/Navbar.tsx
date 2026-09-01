import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Menu, X, ArrowUpRight, ChevronRight } from 'lucide-react';
import { Logo } from './Logo';
import { LanguageToggle } from './LanguageToggle';
import { BUSINESS_INFO } from '../lib/constants';
import { useLanguage } from '../i18n/LanguageContext';

interface NavbarProps {
  onOpenQuoteModal: (serviceId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuoteModal }) => {
  const { t, format } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Track active section
      const sections = ['home', 'about', 'services', 'pricing', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: '#home', id: 'home' },
    { name: t.nav.about, href: '#about', id: 'about' },
    { name: t.nav.services, href: '#services', id: 'services' },
    { name: t.nav.pricing, href: '#pricing', id: 'pricing' },
    { name: t.nav.testimonials, href: '#testimonials', id: 'testimonials' },
    { name: t.nav.contact, href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const callLabel = `${t.common.call} ${BUSINESS_INFO.phone}`;

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5'
            : 'bg-[#0A0A0A]/80 backdrop-blur-sm border-b border-white/5 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="group focus:outline-none focus:ring-1 focus:ring-[#F5C400] p-1"
            aria-label={t.nav.ariaLogo}
          >
            <Logo size="md" />
          </a>

          {/* Desktop Navigation Links - Sharp Artistic Tracking */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-6 xl:ml-10 text-xs font-semibold uppercase tracking-widest text-neutral-400" aria-label={t.nav.ariaMain}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`transition-colors py-1 whitespace-nowrap ${
                    isActive
                      ? 'text-white border-b-2 border-[#F5C400]'
                      : 'hover:text-[#F5C400]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Language Switcher, Phone Icon CTA & Get a Quote Button */}
          <div className="hidden lg:flex items-center gap-3.5 ml-6 xl:ml-8">
            {/* FR | EN Language Switcher */}
            <LanguageToggle />

            {/* Direct Phone Call Icon Link */}
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              id="navbar-phone-btn"
              className="p-2.5 bg-[#151515] hover:bg-[#F5C400] text-[#F5C400] hover:text-[#0A0A0A] border border-white/10 hover:border-[#F5C400] transition-all flex items-center justify-center shadow-md active:scale-95 group"
              title={callLabel}
              aria-label={callLabel}
            >
              <Phone className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>

            {/* Primary CTA Button */}
            <button
              id="navbar-quote-btn"
              onClick={() => onOpenQuoteModal()}
              className="bg-[#F5C400] text-[#0A0A0A] px-5 py-2.5 text-xs font-black uppercase tracking-tighter hover:bg-yellow-400 transition-all transform hover:-translate-y-0.5 shadow-md active:scale-95"
            >
              <span>{t.common.getQuote}</span>
            </button>
          </div>

          {/* Mobile Actions: Language Toggle + Phone Icon + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageToggle />

            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              id="mobile-header-call-btn"
              className="p-2 rounded-sm bg-[#F5C400] text-[#0A0A0A] font-bold flex items-center justify-center shadow-md active:scale-95 transition-transform"
              aria-label={callLabel}
              title={callLabel}
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-[#151515] border border-white/10 text-neutral-200 hover:text-white transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label={t.nav.ariaToggleMenu}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-[#0E0E0E]/98 border-b border-neutral-800 shadow-2xl backdrop-blur-xl px-4 py-6 xl:hidden max-h-[calc(100vh-60px)] overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    activeSection === link.id
                      ? 'bg-[#F5C400] text-[#0A0A0A] font-bold'
                      : 'text-neutral-200 hover:bg-neutral-800/80 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className={`w-4 h-4 ${activeSection === link.id ? 'text-[#0A0A0A]' : 'text-neutral-500'}`} />
                </a>
              ))}

              <div className="pt-4 mt-2 border-t border-neutral-800 flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                    {t.language.label}
                  </span>
                  <LanguageToggle size="md" />
                </div>

                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="flex items-center justify-center gap-2.5 w-full py-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-bold text-sm hover:border-[#F5C400] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#F5C400]" />
                  <span>{format(t.nav.callAbdulWithPhone, { phone: BUSINESS_INFO.phone })}</span>
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuoteModal();
                  }}
                  className="w-full py-3 rounded-lg bg-[#F5C400] text-[#0A0A0A] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
                >
                  <span>{t.common.getFreeQuote}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
