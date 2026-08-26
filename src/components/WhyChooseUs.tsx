import React from 'react';
import { motion } from 'motion/react';
import { BadgeDollarSign, Award, Cog, Users, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { WHY_CHOOSE_US, BUSINESS_INFO } from '../lib/constants';

interface WhyChooseUsProps {
  onOpenQuoteModal: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenQuoteModal }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BadgeDollarSign':
        return <BadgeDollarSign className="w-5 h-5 text-[#F5C400]" />;
      case 'Award':
        return <Award className="w-5 h-5 text-[#F5C400]" />;
      case 'Cog':
        return <Cog className="w-5 h-5 text-[#F5C400]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#F5C400]" />;
      case 'CheckCircle':
        return <CheckCircle className="w-5 h-5 text-[#F5C400]" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#F5C400]" />;
    }
  };

  return (
    <section id="why-choose-us" className="py-20 sm:py-28 bg-[#0C0C0C] relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#F5C400]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-neutral-800 text-[11px] font-mono font-bold uppercase tracking-widest text-[#F5C400] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C400]" />
            <span>The Automotive Standard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            Why Choose <br className="hidden sm:block" />
            <span className="text-[#F5C400]">{BUSINESS_INFO.name}?</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-3 font-normal leading-relaxed">
            Built on a foundation of technical mastery, honest communication, and dependable automotive solutions.
          </p>
        </div>

        {/* 5 Distinct Reason Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {WHY_CHOOSE_US.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`relative rounded-2xl bg-gradient-to-b from-[#161616] to-[#101010] border border-neutral-800/90 hover:border-[#F5C400]/50 p-6 sm:p-7 shadow-xl transition-all duration-300 group flex flex-col justify-between ${
                index === 3 ? 'lg:col-span-1' : index === 4 ? 'lg:col-span-2' : ''
              }`}
            >
              {/* Number watermark in top-right */}
              <div className="absolute top-4 right-5 text-3xl sm:text-4xl font-extrabold font-mono text-neutral-800 group-hover:text-[#F5C400]/20 transition-colors pointer-events-none">
                {item.number}
              </div>

              <div>
                {/* Icon & Highlight Pill */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-[#1C1C1C] border border-neutral-700/60 text-[#F5C400] group-hover:bg-[#F5C400] group-hover:text-[#0A0A0A] transition-colors shadow-sm">
                    {getIcon(item.iconName)}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-1 rounded bg-[#1C1C1C] text-neutral-300 border border-neutral-800">
                    {item.highlight}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2.5 group-hover:text-[#F5C400] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom decorative accent */}
              <div className="mt-6 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-500 uppercase">Quality Verified</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5C400] opacity-60" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section Conversion Strip */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1E1909] via-[#141414] to-[#141414] border border-[#F5C400]/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">
              Ready to experience dependable automotive care?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1">
              Contact Abdul for a direct consultation or upfront quote.
            </p>
          </div>
          <button
            onClick={onOpenQuoteModal}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F5C400] hover:bg-[#E5B700] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shrink-0 transition-all active:scale-98"
          >
            <span>Get a Free Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
