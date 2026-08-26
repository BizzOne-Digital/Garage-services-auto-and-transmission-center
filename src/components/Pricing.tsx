import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BadgeDollarSign, ShieldCheck, Check, ArrowRight, Phone, Calculator, HelpCircle, Sparkles } from 'lucide-react';
import { BUSINESS_INFO, FAQS } from '../lib/constants';

interface PricingProps {
  onOpenQuoteModal: (serviceId?: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onOpenQuoteModal }) => {
  const [selectedVehicleType, setSelectedVehicleType] = useState('sedan-suv');
  const [selectedServiceType, setSelectedServiceType] = useState('transmission');

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-[#0D0D0D] relative overflow-hidden">
      {/* Visual accents */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#F5C400]/5 blur-[140px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-neutral-800 text-[11px] font-mono font-bold uppercase tracking-widest text-[#F5C400] mb-3">
            <BadgeDollarSign className="w-3.5 h-3.5" />
            <span>Honest Automotive Valuation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            Quality Service. <span className="text-[#F5C400]">Fair Pricing.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 mt-3 font-normal leading-relaxed">
            Every vehicle and repair is different. Contact us for a professional assessment and a clear quote based on your vehicle's needs.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 text-xs font-mono font-bold text-[#F5C400] bg-[#1C180A] px-3.5 py-1.5 rounded-lg border border-[#F5C400]/30">
            <span>Transparent • Fair • No Guesswork</span>
          </div>
        </div>

        {/* Lead-Gen Pricing Cards & Estimator Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Card 1: Standard Vehicle Auto Repair & Maintenance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 rounded-2xl bg-gradient-to-b from-[#161616] to-[#101010] border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">Personal & Commuter Vehicles</span>
                <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">Custom Assessment</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight mb-2">
                Mechanical & Maintenance
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                Complete diagnostic assessment and repair estimate tailored to your exact make, model, and symptoms.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "OBD-II Computer scan and diagnostic pinpointing",
                  "Itemized parts and labor breakdown before approval",
                  "Honest recommendation on urgent vs optional work",
                  "Brake service, fluid flushes, suspension, and engine repairs",
                  "Fair local rates with premium component options"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-200">
                    <Check className="w-4 h-4 text-[#F5C400] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenQuoteModal('auto-repair')}
              className="w-full py-3.5 rounded-xl bg-neutral-800 hover:bg-[#F5C400] text-white hover:text-[#0A0A0A] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Request Mechanical Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Card 2: Specialized Transmission Services (Highlighted) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 rounded-2xl bg-gradient-to-b from-[#201C0B] to-[#121212] border-2 border-[#F5C400]/80 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative"
          >
            {/* Top Badge */}
            <div className="absolute -top-3 right-6 bg-[#F5C400] text-[#0A0A0A] text-[10px] font-mono font-black uppercase px-3 py-1 rounded-full shadow-md">
              Specialized Service
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5C400]">Transmission Department</span>
                <span className="text-[10px] font-mono uppercase bg-[#F5C400]/20 text-[#F5C400] px-2 py-0.5 rounded border border-[#F5C400]/30">Specialist Rate</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight mb-2">
                Transmission Diagnostics & Rebuilds
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                Specialized transmission analysis for shifting issues, slipping gears, solenoid faults, or complete rebuilds.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Specialized electronic sensor & hydraulic pressure testing",
                  "Fluid condition & metal particle contamination check",
                  "Repair options: Solenoid/valve body fix vs complete rebuild",
                  "Direct service for vehicle owners and partner mechanic garages",
                  "Clear, upfront quotation with Abdul prior to any disassembly"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-100">
                    <Check className="w-4 h-4 text-[#F5C400] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenQuoteModal('transmission-services')}
              className="w-full py-3.5 rounded-xl bg-[#F5C400] hover:bg-[#E5B700] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Request Transmission Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

        </div>

        {/* FAQs Accordion */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#141414] border border-neutral-800 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-[#F5C400]" />
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
              Frequently Asked Pricing & Service Questions
            </h3>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#1A1A1A] border border-neutral-800">
                <h4 className="text-sm font-bold text-white mb-2">
                  {faq.q}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
