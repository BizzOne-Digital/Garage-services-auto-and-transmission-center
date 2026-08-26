import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, AlertTriangle, Phone, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Activity, Gauge, Zap } from 'lucide-react';
import { BUSINESS_INFO, TRANSMISSION_SYMPTOMS } from '../lib/constants';

interface TransmissionFeatureProps {
  onOpenQuoteModal: (serviceId?: string) => void;
}

export const TransmissionFeature: React.FC<TransmissionFeatureProps> = ({ onOpenQuoteModal }) => {
  const [selectedSymptom, setSelectedSymptom] = useState(TRANSMISSION_SYMPTOMS[0]);

  return (
    <section id="transmission" className="py-20 sm:py-28 bg-[#090909] relative overflow-hidden">
      {/* Background visual atmosphere */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F5C400]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Banner Container with High-End Dark Metallic Framing */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#181818] via-[#121212] to-[#0A0A0A] border border-neutral-700/80 p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">
          
          {/* Top Yellow Automotive Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F5C400] to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading, Narrative, and Value Proposition */}
            <div className="lg:col-span-7 flex flex-col">
              
              {/* Specialized Tag */}
              <div className="flex items-center gap-3 text-[#F5C400] mb-4">
                <div className="w-8 h-[1.5px] bg-[#F5C400]" />
                <span className="text-xs font-bold uppercase tracking-[0.3em]">
                  Heavy Duty Transmission Lab
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-[0.95] mb-6">
                Transmission Expertise <br />
                <span className="text-transparent" style={{ WebkitTextStroke: '1.2px #F5C400' }}>
                  When It Matters Most
                </span>
              </h2>

              {/* Supporting Content */}
              <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed mb-8 border-l-2 border-[#F5C400] pl-5">
                Whether you're dealing with slipping gears, harsh shifts, or need a full transmission teardown, our master technicians provide exact diagnostics and dependable rebuilds.
              </p>

              {/* Technical Capability Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-[#151515] border-l-2 border-[#F5C400] flex items-start gap-3">
                  <div className="p-2 bg-[#221D0C] text-[#F5C400] shrink-0 mt-0.5">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">All Transmissions Supported</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Automatic, Manual, CVT, Dual-Clutch & Transaxles</p>
                  </div>
                </div>

                <div className="p-4 bg-[#151515] border-l-2 border-[#F5C400] flex items-start gap-3">
                  <div className="p-2 bg-[#221D0C] text-[#F5C400] shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">B2B Garage Sub-Contracting</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Specialized rebuilds & diagnostic help for partner shops</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  id="transmission-feature-quote-btn"
                  onClick={() => onOpenQuoteModal('transmission-services')}
                  className="px-8 py-4 bg-white hover:bg-[#F5C400] text-black font-black text-xs uppercase tracking-tighter transition-all flex items-center justify-center gap-2.5 active:scale-95"
                >
                  <span>Talk to a Transmission Specialist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="px-6 py-4 bg-[#151515] hover:bg-[#1E1E1E] text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5"
                >
                  <Phone className="w-4 h-4 text-[#F5C400]" />
                  <span>Call {BUSINESS_INFO.phone}</span>
                </a>
              </div>

            </div>

            {/* Right Column: Interactive Diagnostic Symptom Checker */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#101010] border border-neutral-700/80 p-6 shadow-xl relative">
                
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#F5C400]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      Transmission Symptom Diagnostic
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Select Symptom</span>
                </div>

                {/* Symptom Select Buttons */}
                <div className="space-y-2 mb-6">
                  {TRANSMISSION_SYMPTOMS.map((sym) => {
                    const isSelected = selectedSymptom.id === sym.id;
                    return (
                      <button
                        key={sym.id}
                        onClick={() => setSelectedSymptom(sym)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#201C0D] border-[#F5C400] text-white'
                            : 'bg-[#151515] border-neutral-800 text-neutral-300 hover:bg-[#1A1A1A] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full ${sym.severity === 'critical' ? 'bg-red-500' : sym.severity === 'high' ? 'bg-[#F5C400]' : 'bg-amber-400'}`} />
                          <span>{sym.name}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#F5C400] translate-x-1' : 'text-neutral-600'} transition-transform`} />
                      </button>
                    );
                  })}
                </div>

                {/* Active Symptom Analysis Card */}
                <div className="p-4 rounded-xl bg-[#161616] border border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-neutral-400">Diagnosis Summary</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      selectedSymptom.severity === 'critical' ? 'bg-red-950/80 text-red-400 border border-red-800' : 'bg-yellow-950/80 text-[#F5C400] border border-yellow-800/50'
                    }`}>
                      {selectedSymptom.severity} urgency
                    </span>
                  </div>
                  
                  <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
                    {selectedSymptom.description}
                  </p>

                  <div className="pt-2 border-t border-neutral-800 text-[11px] text-[#F5C400]">
                    <span className="font-bold text-white font-mono uppercase mr-1">Recommendation:</span>
                    {selectedSymptom.recommendation}
                  </div>
                </div>

                {/* Action button inside symptom checker */}
                <button
                  onClick={() => onOpenQuoteModal('transmission-diagnostics')}
                  className="w-full mt-4 py-2.5 rounded-xl bg-[#F5C400]/20 hover:bg-[#F5C400] text-[#F5C400] hover:text-[#0A0A0A] border border-[#F5C400]/40 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Book Inspection for this issue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
