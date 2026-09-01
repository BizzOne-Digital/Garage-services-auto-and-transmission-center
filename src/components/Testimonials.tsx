import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, Quote, UserCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/constants';
import { useLanguage } from '../i18n/LanguageContext';
import { useTestimonials } from '../i18n/useContent';

export const Testimonials: React.FC = () => {
  const { t, format } = useLanguage();
  const testimonials = useTestimonials();

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
            <span>{t.testimonials.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
            {t.testimonials.headline} <span className="text-[#F5C400]">{t.testimonials.headlineAccent}</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-3 font-normal leading-relaxed">
            {format(t.testimonials.intro, { shortName: BUSINESS_INFO.shortName })}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
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
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F5C400]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-[#1A1A1A] px-2 py-0.5 rounded border border-neutral-800">
                    {item.serviceCategory}
                  </span>
                </div>

                {/* Quote Icon */}
                <Quote className="w-6 h-6 text-neutral-700 mb-3 group-hover:text-[#F5C400]/40 transition-colors" />

                {/* Testimonial Text */}
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 italic">
                  "{item.content}"
                </p>
              </div>

              {/* Author & Vehicle Details */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#F5C400] font-mono">
                    {item.role} • {item.vehicle}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.testimonials.verified}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Endorsement Strip */}
        <div className="text-center">
          <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
            {t.testimonials.footNote}
          </p>
        </div>

      </div>
    </section>
  );
};
