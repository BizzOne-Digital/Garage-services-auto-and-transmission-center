import React from 'react';
import { Phone, ArrowUpRight, ShieldCheck, ArrowUp } from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../i18n/LanguageContext';
import { useBusiness, useServices } from '../i18n/useContent';
import { navigate, usePathname } from '../lib/router';
import { scrollToSection } from '../lib/scrollToSection';

interface FooterProps {
  onOpenQuoteModal: (serviceId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuoteModal }) => {
  const { t, format } = useLanguage();
  const business = useBusiness();
  const services = useServices();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: t.footer.links.home, href: '#home' },
    { name: t.footer.links.about, href: '#about' },
    { name: t.footer.links.services, href: '#services' },
    { name: t.footer.links.pricing, href: '#pricing' },
    { name: t.footer.links.testimonials, href: '#testimonials' },
    { name: t.footer.links.contact, href: '#contact' },
  ];

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 text-neutral-300 relative overflow-hidden">
      {/* Top Banner inside Footer */}
      <div className="border-b border-white/10 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F5C400] font-bold block mb-1">
              {t.footer.bannerEyebrow}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">
              {t.footer.bannerTitle}
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onOpenQuoteModal()}
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-black hover:bg-[#F5C400] font-black text-xs uppercase tracking-tighter flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>{t.common.getFreeQuote}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:${business.phoneRaw}`}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#181818] hover:bg-[#222222] text-white border border-white/10 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F5C400]" />
              <span>{t.common.call} {business.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Sitemap Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Col 1: Brand & Bio (5 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Logo size="lg" showTagline={true} className="mb-4" />
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mb-6">
              {t.footer.bio}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-[#121212] p-2.5 rounded-lg border border-neutral-800">
              <ShieldCheck className="w-4 h-4 text-[#F5C400] shrink-0" />
              <span>{t.footer.badge}</span>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono">
              {t.footer.navTitle}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={isHome ? link.href : `/${link.href}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-neutral-400 hover:text-[#F5C400] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/blog"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    navigate('/blog');
                  }}
                  className="text-neutral-400 hover:text-[#F5C400] transition-colors"
                >
                  {t.footer.links.blog}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono">
              {t.footer.servicesTitle}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {services.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => onOpenQuoteModal(s.id)}
                    className="text-neutral-400 hover:text-[#F5C400] transition-colors text-left"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Info (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono">
              {t.footer.contactTitle}
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">{t.footer.leadContact}</span>
                <span className="font-bold text-white">{business.contactPerson}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">{t.footer.phone}</span>
                <a
                  href={`tel:${business.phoneRaw}`}
                  className="font-bold text-[#F5C400] hover:underline"
                >
                  {business.phone}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">{t.footer.email}</span>
                <a
                  href={`mailto:${business.email}`}
                  className="text-neutral-300 hover:text-white break-all"
                >
                  {business.email}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">{t.footer.social}</span>
                <span className="text-neutral-400">{business.socialMediaName}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>{format(t.footer.rights, { name: t.common.businessName })}</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-[#F5C400] transition-colors font-mono uppercase text-[11px]"
          >
            <span>{t.footer.backToTop}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
