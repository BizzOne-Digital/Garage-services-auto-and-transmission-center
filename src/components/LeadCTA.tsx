import React from 'react';
import { motion } from 'motion/react';
import { Phone, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/constants';
import { useLanguage } from '../i18n/LanguageContext';

interface LeadCTAProps {
  onOpenQuoteModal: () => void;
}

export const LeadCTA: React.FC<LeadCTAProps> = ({ onOpenQuoteModal }) => {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* High-Impact Visual Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1E190A] via-[#141414] to-[#121212] border border-[#F5C400]/40 p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">
          
          {/* Background Ambient Spotlight */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5C400]/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

          <div className="relative z-10 max-w-3xl flex flex-col items-start text-left">
            
            {/* Top Accent Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A230D] border border-[#F5C400]/40 text-xs font-mono font-bold uppercase tracking-widest text-[#F5C400] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#F5C400] animate-pulse" />
              <span>{t.leadCta.badge}</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-[1.15] mb-4">
              {t.leadCta.headlineLine1} <br />
              <span className="text-[#F5C400]">{t.leadCta.headlineAccent}</span>
            </h2>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-normal leading-relaxed mb-8 max-w-2xl">
              {t.leadCta.intro}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                id="lead-cta-quote-btn"
                onClick={onOpenQuoteModal}
                className="px-8 py-4 rounded-xl bg-[#F5C400] hover:bg-[#E5B700] text-[#0A0A0A] font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-[#F5C400]/30 transition-all flex items-center justify-center gap-2.5 active:scale-98"
              >
                <span>{t.common.getFreeQuote}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                id="lead-cta-call-btn"
                className="px-8 py-4 rounded-xl bg-[#181818] hover:bg-[#222222] text-white border border-neutral-700 hover:border-[#F5C400]/50 font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2.5 group"
              >
                <Phone className="w-4 h-4 text-[#F5C400] group-hover:scale-110 transition-transform" />
                <span>{t.common.call} {BUSINESS_INFO.phone}</span>
              </a>
            </div>

            {/* Trust Indicators Note */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-neutral-800/80 text-xs text-neutral-400 font-medium">
              <span>{t.leadCta.note1}</span>
              <span>{t.leadCta.note2}</span>
              <span>{t.leadCta.note3}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
