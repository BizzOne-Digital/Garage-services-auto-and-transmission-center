import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, BadgeDollarSign, Cog, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTrustPillars } from '../i18n/useContent';

export const TrustBar: React.FC = () => {
  const { t } = useLanguage();
  const pillars = useTrustPillars();

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#F5C400]" />;
      case 'BadgeDollarSign':
        return <BadgeDollarSign className="w-5 h-5 text-[#F5C400]" />;
      case 'Cog':
        return <Cog className="w-5 h-5 text-[#F5C400]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-[#F5C400]" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#F5C400]" />;
    }
  };

  return (
    <section className="relative z-20 border-y border-white/10 bg-[#111111]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 sm:p-7 flex flex-col justify-between group hover:bg-[#161616] transition-colors relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-mono font-bold">
                  0{index + 1} // {t.trustBar.pillarLabel}
                </span>
                <div className="w-8 h-8 rounded-sm bg-[#1A1A1A] border border-white/10 flex items-center justify-center group-hover:border-[#F5C400]/40 transition-colors">
                  {getIcon(pillar.iconName)}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-[#F5C400] uppercase tracking-wider block mb-0.5">
                  {pillar.subtitle}
                </span>
                <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Bottom line accent on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F5C400] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
