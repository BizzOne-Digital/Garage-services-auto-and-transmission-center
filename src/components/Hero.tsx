import React from 'react';
import { motion } from 'motion/react';
import { Phone, ArrowRight, ShieldCheck, CheckCircle2, Cpu, Wrench, Sparkles, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/constants';

interface HeroProps {
  onOpenQuoteModal: (serviceId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal }) => {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#0A0A0A]"
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
            src="https://images.unsplash.com/photo-1613214149922-f1809c99b414?q=80&w=2070&auto=format&fit=crop"
            alt="Modern automotive repair workshop and transmission diagnostic bay"
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
                Montréal's Transmission & Auto Specialist
              </span>
            </motion.div>

            {/* Main Artistic Headline with Outlined Text Stroke */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.92] tracking-tighter uppercase text-white"
            >
              Your Complete <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #F5C400' }}>
                Auto Repair
              </span> & <br />
              Transmission
            </motion.h1>

            {/* Supporting Subtext with Yellow Left Border Accent */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-neutral-400 text-base sm:text-lg max-w-xl leading-relaxed border-l-2 border-[#F5C400] pl-5 sm:pl-6"
            >
              Professional automotive service you can count on. We provide dependable repairs, expert transmission overhauls, and honest pricing for drivers and partner garages.
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
                <span>Talk to a Specialist</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </button>

              {/* Direct Phone / Location Hub */}
              <div className="flex items-center gap-4">
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  id="hero-secondary-call-btn"
                  className="flex flex-col justify-center text-left group"
                >
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Direct Workshop</span>
                  <span className="text-sm font-bold text-white group-hover:text-[#F5C400] transition-colors">{BUSINESS_INFO.phone}</span>
                </a>
                <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Location</span>
                  <span className="text-sm font-bold text-neutral-200">Montréal, QC</span>
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
                <span>25+ Years Experience</span>
              </div>
              <span className="text-neutral-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#F5C400]" />
                <span>Fair & Clear Pricing</span>
              </div>
              <span className="text-neutral-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#F5C400]" />
                <span>Master Tech Diagnostics</span>
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
              
              {/* Card 01 */}
              <div
                onClick={() => onOpenQuoteModal('transmission-services')}
                className="group bg-[#151515] p-6 border-l-4 border-transparent hover:border-[#F5C400] transition-all cursor-pointer relative overflow-hidden border border-white/5 hover:border-white/10"
              >
                <div className="absolute -right-3 -bottom-3 text-6xl font-black text-white/5 group-hover:text-[#F5C400]/10 transition-colors pointer-events-none select-none">
                  01
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#F5C400] font-black text-sm uppercase tracking-widest">
                    Transmission Overhaul & Rebuild
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">
                    Quote &rarr;
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-normal max-w-[85%]">
                  Specialized precision rebuilds, slipping gear resolution, and torque converter calibration.
                </p>
              </div>

              {/* Card 02 */}
              <div
                onClick={() => onOpenQuoteModal('brake-services')}
                className="group bg-[#151515] p-6 border-l-4 border-transparent hover:border-[#F5C400] transition-all cursor-pointer relative overflow-hidden border border-white/5 hover:border-white/10"
              >
                <div className="absolute -right-3 -bottom-3 text-6xl font-black text-white/5 group-hover:text-[#F5C400]/10 transition-colors pointer-events-none select-none">
                  02
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#F5C400] font-black text-sm uppercase tracking-widest">
                    Brake & Stopping Systems
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">
                    Quote &rarr;
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-normal max-w-[85%]">
                  Precision stopping power maintenance, rotor replacement, and ABS system troubleshooting.
                </p>
              </div>

              {/* Card 03 */}
              <div
                onClick={() => onOpenQuoteModal('transmission-diagnostics')}
                className="group bg-[#151515] p-6 border-l-4 border-transparent hover:border-[#F5C400] transition-all cursor-pointer relative overflow-hidden border border-white/5 hover:border-white/10"
              >
                <div className="absolute -right-3 -bottom-3 text-6xl font-black text-white/5 group-hover:text-[#F5C400]/10 transition-colors pointer-events-none select-none">
                  03
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#F5C400] font-black text-sm uppercase tracking-widest">
                    Computer Engine Diagnostics
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">
                    Quote &rarr;
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-normal max-w-[85%]">
                  State-of-the-art computer scanning to isolate warning lights and performance faults.
                </p>
              </div>

            </div>

            {/* Direct Intake Banner */}
            <div className="bg-[#111111] p-4 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#F5C400] animate-pulse" />
                <span className="text-xs font-mono uppercase text-neutral-300">
                  Ready for Immediate Intake
                </span>
              </div>
              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="text-xs font-bold uppercase tracking-wider text-[#F5C400] hover:underline"
              >
                Call Abdul &rarr;
              </a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
