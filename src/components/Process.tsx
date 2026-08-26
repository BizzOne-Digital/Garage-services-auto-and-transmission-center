import React from 'react';
import { motion } from 'motion/react';
import { PhoneCall, Search, FileText, Car, Check } from 'lucide-react';
import { PROCESS_STEPS } from '../lib/constants';

interface ProcessProps {
  onOpenQuoteModal: () => void;
}

export const Process: React.FC<ProcessProps> = ({ onOpenQuoteModal }) => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'PhoneCall':
        return <PhoneCall className="w-5 h-5 text-[#F5C400]" />;
      case 'Search':
        return <Search className="w-5 h-5 text-[#F5C400]" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-[#F5C400]" />;
      case 'Car':
        return <Car className="w-5 h-5 text-[#F5C400]" />;
      default:
        return <Check className="w-5 h-5 text-[#F5C400]" />;
    }
  };

  return (
    <section id="process" className="py-20 sm:py-28 bg-[#090909] relative overflow-hidden">
      {/* Visual accents */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-neutral-800 text-[11px] font-mono font-bold uppercase tracking-widest text-[#F5C400] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C400]" />
            <span>How It Works</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            Simple. Professional. <span className="text-[#F5C400]">Straightforward.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-3 font-normal leading-relaxed">
            From your first call with Abdul to driving away with complete confidence, our repair process is designed for clarity and peace of mind.
          </p>
        </div>

        {/* 4 Steps Container with Animated Connecting Line on Desktop */}
        <div className="relative">
          
          {/* Animated Connecting Line on Desktop (hidden on mobile) */}
          <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-[2px] bg-neutral-800 z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="origin-left h-full bg-gradient-to-r from-[#F5C400] via-[#F5C400] to-[#F5C400]/40"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {PROCESS_STEPS.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left group"
              >
                {/* Step Number & Icon Circle */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#1E1E1E] to-[#121212] border-2 border-neutral-700/80 group-hover:border-[#F5C400] flex items-center justify-center shadow-xl group-hover:scale-105 transition-all duration-300">
                    {getStepIcon(step.iconName)}
                  </div>
                  
                  {/* Step Badge */}
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded bg-[#F5C400] text-[#0A0A0A] text-[10px] font-mono font-black shadow-sm">
                    {step.step}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight mb-2 group-hover:text-[#F5C400] transition-colors">
                  {step.title}
                </h3>

                {/* Short Desc */}
                <p className="text-xs font-semibold text-[#F5C400] mb-2 uppercase tracking-wide">
                  {step.description}
                </p>

                {/* Detail */}
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {step.detail}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
