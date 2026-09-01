import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useBusiness } from '../i18n/useContent';

interface HeroProps {
  onOpenQuoteModal: (serviceId?: string) => void;
}

/** Breathing room kept between the fixed navbar and the hero copy. */
const NAVBAR_CLEARANCE = 32;

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal }) => {
  const { t } = useLanguage();
  const business = useBusiness();

  // The navbar is fixed and its height changes with viewport width and language
  // (the logo/nav labels wrap), so reserve its measured height instead of a fixed padding.
  const [navbarHeight, setNavbarHeight] = useState<number | null>(null);

  useEffect(() => {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    // The navbar also shrinks slightly once scrolled; only measure its resting
    // height at the top of the page so the hero never shifts while scrolling.
    const measure = () => {
      if (window.scrollY > 30) return;
      setNavbarHeight(navbar.getBoundingClientRect().height);
    };

    // Measure after layout so a language switch or late webfont is accounted for.
    const frame = requestAnimationFrame(measure);
    document.fonts?.ready.then(measure).catch(() => {});

    const observer = new ResizeObserver(measure);
    observer.observe(navbar);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [t]);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#0A0A0A]"
      style={navbarHeight !== null ? { paddingTop: navbarHeight + NAVBAR_CLEARANCE } : undefined}
    >
      {/* Background with Cinematic Dark Gradient & Subtle Light Spotlights */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="w-full h-full"
        >
          <img
            src={business.heroImageUrl}
            alt={t.hero.imageAlt}
            className="w-full h-full object-cover object-center opacity-20 filter grayscale contrast-125"
            loading="eager"
          />
        </motion.div>

        {/* Multi-layered dark vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/90 to-[#0A0A0A]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#F5C400]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Hero Copy - Left Column (Col 7) */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-7">
            
            {/* Artistic Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 text-[#F5C400]"
            >
              <div className="w-8 h-[1.5px] bg-[#F5C400]" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">
                {t.hero.eyebrow}
              </span>
            </motion.div>

            {/* Main Artistic Headline with Outlined Text Stroke */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.92] tracking-tighter uppercase text-white"
            >
              {t.hero.headlineLine1} <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #F5C400' }}>
                {t.hero.headlineAccent}
              </span> <br />
              {t.hero.headlineLine3}
            </motion.h1>

            {/* Supporting Subtext with Yellow Left Border Accent */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-neutral-400 text-base sm:text-lg max-w-xl leading-relaxed border-l-2 border-[#F5C400] pl-5 sm:pl-6"
            >
              {t.hero.subtext}
            </motion.p>

            {/* CTA Action Buttons & Location Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-2"
            >
              {/* Primary High-Contrast White / Yellow Hover Button */}
              <button
                id="hero-primary-quote-btn"
                onClick={() => onOpenQuoteModal()}
                className="group flex items-center justify-center gap-4 bg-white text-black px-8 py-4 font-black uppercase tracking-tighter hover:bg-[#F5C400] transition-all active:scale-95"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </button>

              {/* Direct Phone / Location Hub */}
              <div className="flex items-center gap-4">
                <a
                  href={`tel:${business.phoneRaw}`}
                  id="hero-secondary-call-btn"
                  className="flex flex-col justify-center text-left group"
                >
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">{t.hero.directWorkshop}</span>
                  <span className="text-sm font-bold text-white group-hover:text-[#F5C400] transition-colors">{business.phone}</span>
                </a>
                <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">{t.hero.locationLabel}</span>
                  <span className="text-sm font-bold text-neutral-200">{t.common.location}</span>
                </div>
              </div>
            </motion.div>

            {/* Subtle Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-400 font-mono uppercase tracking-wider pt-4 border-t border-white/10"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#F5C400]" />
                <span>{t.hero.trust1}</span>
              </div>
              <span className="text-neutral-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#F5C400]" />
                <span>{t.hero.trust2}</span>
              </div>
              <span className="text-neutral-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#F5C400]" />
                <span>{t.hero.trust3}</span>
              </div>
            </motion.div>
          </div>

          {/* Artistic Interactive Diagnostic Stack - Right Column (Col 5) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-5 relative flex flex-col justify-center gap-4"
          >
            <div className="grid grid-cols-1 gap-3.5 z-10">

              {t.hero.cards.map((card, index) => (
                <div
                  key={card.serviceId}
                  onClick={() => onOpenQuoteModal(card.serviceId)}
                  className="group bg-[#151515] p-6 border-l-4 border-transparent hover:border-[#F5C400] transition-all cursor-pointer relative overflow-hidden border border-white/5 hover:border-white/10"
                >
                  <div className="absolute -right-3 -bottom-3 text-6xl font-black text-white/5 group-hover:text-[#F5C400]/10 transition-colors pointer-events-none select-none">
                    {`0${index + 1}`}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[#F5C400] font-black text-sm uppercase tracking-widest">
                      {card.title}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">
                      {t.common.quote} &rarr;
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-normal max-w-[85%]">
                    {card.desc}
                  </p>
                </div>
              ))}

            </div>

            {/* Direct Intake Banner */}
            <div className="bg-[#111111] p-4 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#F5C400] animate-pulse" />
                <span className="text-xs font-mono uppercase text-neutral-300">
                  {t.hero.intakeBanner}
                </span>
              </div>
              <a
                href={`tel:${business.phoneRaw}`}
                className="text-xs font-bold uppercase tracking-wider text-[#F5C400] hover:underline"
              >
                {t.common.callAbdul} &rarr;
              </a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
