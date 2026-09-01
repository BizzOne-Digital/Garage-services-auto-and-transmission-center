import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, Cpu, Activity, Disc, Flame, CheckCircle2, ArrowRight, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { ServiceItem } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { useCategories, useServices } from '../i18n/useContent';

interface ServicesProps {
  onOpenQuoteModal: (serviceId?: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenQuoteModal }) => {
  const { t, format } = useLanguage();
  const services = useServices();
  const categories = useCategories();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const getServiceIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'Disc':
        return <Disc className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={className} />;
      default:
        return <Wrench className={className} />;
    }
  };

  // Derived so the open detail modal follows a language switch.
  const selectedService: ServiceItem | null = services.find(s => s.id === selectedServiceId) ?? null;

  const filteredServices = services.filter(service => {
    if (activeCategory === 'all') return true;
    return service.category === activeCategory;
  });

  return (
    <section id="services" className="py-20 sm:py-28 bg-[#0D0D0D] relative overflow-hidden">
      {/* Subtle background tech grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[#F5C400]">
              <div className="w-8 h-[1.5px] bg-[#F5C400]" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">
                {t.services.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-[0.95]">
              {t.services.headlineLine1} <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1.2px #F5C400' }}>
                {t.services.headlineAccent}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed pt-1">
              {t.services.intro}
            </p>
          </div>

          {/* Category Filter Tabs with Sharp Monospaced Design */}
          <div className="flex flex-wrap items-center gap-2 bg-[#121212] p-1 border border-white/10 self-start md:self-auto">
            {[
              { id: 'all', label: t.services.filters.all },
              ...categories.map(category => ({ id: category.key, label: category.label })),
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeCategory === tab.id
                    ? 'bg-[#F5C400] text-black font-black'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid (6 Cards) - Artistic Flair Architectural Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => {
            const isTransmissionSpecialty = service.category === 'transmission';
            const cardNum = (index + 1).toString().padStart(2, '0');

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="group relative bg-[#151515] border border-white/5 hover:border-white/20 border-l-4 border-l-transparent hover:border-l-[#F5C400] p-6 sm:p-7 flex flex-col justify-between shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Background Watermark Index */}
                <div className="absolute -right-3 -bottom-4 text-7xl font-black text-white/5 group-hover:text-[#F5C400]/10 transition-colors pointer-events-none select-none font-mono">
                  {cardNum}
                </div>

                <div>
                  {/* Top Header of Card: Icon + Category Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-[#F5C400] group-hover:bg-[#F5C400] group-hover:text-black transition-all duration-300">
                      {getServiceIcon(service.iconName, "w-5 h-5")}
                    </div>
                    {isTransmissionSpecialty && (
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold px-2 py-0.5 bg-[#201B0B] text-[#F5C400] border border-[#F5C400]/40">
                        {t.services.specialtyBadge}
                      </span>
                    )}
                  </div>

                  {/* Service Title */}
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2 group-hover:text-[#F5C400] transition-colors">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-neutral-400 leading-relaxed mb-5">
                    {service.shortDesc}
                  </p>

                  {/* Key Features Bullets */}
                  <ul className="space-y-2 mb-6 pt-4 border-t border-white/10">
                    {service.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 font-mono">
                        <span className="text-[#F5C400] font-bold">&gt;</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
                  <button
                    onClick={() => setSelectedServiceId(service.id)}
                    className="text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
                  >
                    {t.common.details} &rarr;
                  </button>

                  <button
                    onClick={() => onOpenQuoteModal(service.id)}
                    className="px-3.5 py-1.5 bg-[#202020] group-hover:bg-[#F5C400] text-neutral-200 group-hover:text-black font-black text-xs uppercase tracking-tighter border border-white/10 group-hover:border-[#F5C400] transition-all flex items-center gap-1.5"
                    aria-label={format(t.services.ariaQuoteFor, { service: service.title })}
                  >
                    <span>{t.services.getQuote}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Interactive Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#141414] border border-neutral-700 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedServiceId(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-[#1F1F1F] text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label={t.services.modal.ariaClose}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#F5C400]/10 text-[#F5C400] border border-[#F5C400]/20">
                  {getServiceIcon(selectedService.iconName, "w-6 h-6")}
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#F5C400] uppercase tracking-wider">{t.services.modal.overview}</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              {/* Full Description */}
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                {selectedService.fullDesc}
              </p>

              {/* Service Features Checklist */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  {t.services.modal.scope}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-200 bg-[#1A1A1A] p-2.5 rounded-lg border border-neutral-800">
                      <Check className="w-4 h-4 text-[#F5C400] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Symptoms (if applicable) */}
              {selectedService.commonSymptoms && (
                <div className="mb-6 p-4 rounded-xl bg-[#1D190B] border border-[#F5C400]/30">
                  <div className="flex items-center gap-2 mb-2 text-[#F5C400]">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{t.services.modal.symptomsTitle}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.commonSymptoms.map((sym, idx) => (
                      <span key={idx} className="text-xs bg-[#2B230A] text-neutral-200 px-2.5 py-1 rounded-md border border-[#F5C400]/20">
                        • {sym}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ideal for note */}
              <div className="p-3 rounded-lg bg-[#181818] border border-neutral-800 text-xs text-neutral-400 mb-6">
                <span className="font-bold text-white uppercase font-mono mr-1">{t.services.modal.idealFor}</span>
                {selectedService.idealFor}
              </div>

              {/* Modal CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => setSelectedServiceId(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  {t.common.close}
                </button>
                <button
                  onClick={() => {
                    const sid = selectedService.id;
                    setSelectedServiceId(null);
                    onOpenQuoteModal(sid);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#F5C400] hover:bg-[#E5B700] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <span>{t.services.modal.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
