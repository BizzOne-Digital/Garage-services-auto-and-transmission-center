import React from 'react';
import { SoroBlog } from '../components/SoroBlog';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * `/blog` — the Soro-managed articles, wrapped in the existing site chrome
 * (navbar, footer, quote modal are supplied by App).
 */
export const BlogPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="blog" className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 text-[#F5C400] mb-5">
          <div className="w-8 h-[1.5px] bg-[#F5C400]" />
          <span className="text-xs font-bold uppercase tracking-[0.3em]">{t.blog.eyebrow}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[0.95] tracking-tighter uppercase text-white">
          {t.blog.title}
        </h1>

        <p className="mt-6 text-neutral-400 text-base sm:text-lg max-w-2xl leading-relaxed border-l-2 border-[#F5C400] pl-5 sm:pl-6">
          {t.blog.subtitle}
        </p>

        {/* Soro renders the published articles into this container. */}
        <div className="mt-12 sm:mt-16">
          <SoroBlog />
        </div>
      </div>
    </section>
  );
};
