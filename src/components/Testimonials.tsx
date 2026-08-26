import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, Quote, CheckCircle2, UserCheck } from 'lucide-react';
import { PLACEHOLDER_TESTIMONIALS, BUSINESS_INFO } from '../lib/constants';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-[#090909] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-[#F5C400]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-neutral-800 text-[11px] font-mono font-bold uppercase tracking-widest text-[#F5C400] mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Reputation & Trust</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            Trusted by <span className="text-[#F5C400]">Our Customers</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-3 font-normal leading-relaxed">
            See how drivers and independent partner garages rely on {BUSINESS_INFO.shortName} for dependable auto repair and transmission solutions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {PLACEHOLDER_TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative rounded-2xl bg-gradient-to-b from-[#161616] to-[#101010] border border-neutral-800/90 hover:border-[#F5C400]/40 p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all group"
            >
              <div>
                {/* Rating & Service Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#F5C400]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F5C400]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-[#1A1A1A] px-2 py-0.5 rounded border border-neutral-800">
                    {t.serviceCategory}
                  </span>
                </div>

                {/* Quote Icon */}
                <Quote className="w-6 h-6 text-neutral-700 mb-3 group-hover:text-[#F5C400]/40 transition-colors" />

                {/* Testimonial Text */}
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 italic">
                  "{t.content}"
                </p>
              </div>

              {/* Author & Vehicle Details */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-[#F5C400] font-mono">
                    {t.role} • {t.vehicle}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Endorsement Strip */}
        <div className="text-center">
          <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
            Committed to honest service, fair pricing, and dependable repairs for every client.
          </p>
        </div>

      </div>
    </section>
  );
};
