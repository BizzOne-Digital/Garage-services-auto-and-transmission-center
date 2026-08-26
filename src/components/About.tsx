import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, Wrench, ArrowRight, Phone, Sparkles, Cpu, Users } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/constants';

interface AboutProps {
  onOpenQuoteModal: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenQuoteModal }) => {
  const highlights = [
    { num: "01", title: "Professional Service", desc: "Rigorous standards and certified diagnostic equipment on every vehicle." },
    { num: "02", title: "Fair & Clear Pricing", desc: "Honest, itemized estimates with no surprise costs or unnecessary upsells." },
    { num: "03", title: "Dependable Workmanship", desc: "Repairs performed right the first time with premium quality components." },
    { num: "04", title: "Transmission Expertise", desc: "Specialized in-depth transmission rebuilds, diagnostics, and overhauls." },
    { num: "05", title: "Customer-First Approach", desc: "Transparent communication with direct, approachable consultation from Abdul." },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#F5C400]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-12 sm:mb-16 space-y-2">
          <div className="flex items-center gap-3 text-[#F5C400]">
            <div className="w-8 h-[1.5px] bg-[#F5C400]" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">
              Heritage & Craftsmanship
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-[0.95]">
            Automotive Expertise <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1.2px #F5C400' }}>
              You Can Trust
            </span>
          </h2>
        </div>

        {/* Editorial Grid: Left Image & Specs, Right Text & Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Workshop Photography & Technical Accent Badges */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            {/* Image Container with Sharp Architectural Borders */}
            <div className="relative overflow-hidden border border-white/10 bg-[#141414] shadow-2xl group">
              <div className="aspect-[4/3] sm:aspect-[16/11] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1846&auto=format&fit=crop"
                  alt="Professional mechanic inspecting engine and transmission system at Garage Services"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter grayscale brightness-90 contrast-125"
                  loading="lazy"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90" />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 bg-[#0A0A0A] border-l-2 border-[#F5C400] px-4 py-2 flex items-center gap-2.5 shadow-xl">
                <span className="w-2 h-2 bg-[#F5C400]" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                  Transmission Diagnostic Bay
                </span>
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#111111] border border-white/10 p-4 shadow-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#F5C400] font-bold block tracking-wider">
                    Lead Technician
                  </span>
                  <span className="text-sm font-black text-white uppercase tracking-tight">
                    Abdul • Master Diagnostic Lead
                  </span>
                </div>
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="px-3 py-2 bg-[#F5C400] text-black font-bold text-xs uppercase tracking-tighter hover:bg-yellow-400 transition-colors"
                  aria-label="Call Abdul directly"
                >
                  (514) 993-7705
                </a>
              </div>
            </div>

            {/* Corner geometrical accent */}
            <div className="hidden sm:block absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#F5C400] pointer-events-none" />
          </motion.div>

          {/* Right Column: Narrative & Key Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col"
          >
            {/* Story Paragraphs with Editorial Border */}
            <div className="relative pl-6 border-l-2 border-[#F5C400] mb-8 space-y-3">
              <p className="text-base sm:text-lg text-white font-bold leading-snug uppercase tracking-tight">
                {BUSINESS_INFO.name} is dedicated to honest diagnostics, precision transmission rebuilds, and dependable automotive care.
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed">
                We take immense pride in serving both everyday vehicle owners seeking dependable repairs and professional mechanic garages needing trusted, high-precision transmission sub-contracting and diagnostic support.
              </p>
            </div>

            {/* 5 Distinct Highlights with Sharp Indexing */}
            <div className="space-y-3 mb-8">
              {highlights.map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-3 bg-[#131313] border-l-2 border-transparent hover:border-[#F5C400] transition-colors">
                  <span className="text-xs font-mono font-bold text-[#F5C400] shrink-0 mt-0.5">
                    {item.num}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-normal mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenQuoteModal}
                className="px-7 py-3.5 bg-white text-black font-black text-xs uppercase tracking-tighter hover:bg-[#F5C400] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Request a Free Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="px-6 py-3.5 bg-[#151515] hover:bg-[#1E1E1E] text-neutral-200 hover:text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#F5C400]" />
                <span>Call {BUSINESS_INFO.phone}</span>
              </a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
