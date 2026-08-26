import React from 'react';
import { Phone, Mail, Share2, ArrowUpRight, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { Logo } from './Logo';
import { BUSINESS_INFO, SERVICES } from '../lib/constants';

interface FooterProps {
  onOpenQuoteModal: (serviceId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuoteModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Transmission Center', href: '#transmission' },
    { name: 'Why Choose Us', href: '#why-choose-us' },
    { name: 'Repair Process', href: '#process' },
    { name: 'Pricing & FAQs', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact & Location', href: '#contact' },
  ];

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 text-neutral-300 relative overflow-hidden">
      {/* Top Banner inside Footer */}
      <div className="border-b border-white/10 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F5C400] font-bold block mb-1">
              Dependable Automotive Care
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">
              Ready to Get Your Vehicle Diagnosed?
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onOpenQuoteModal()}
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-black hover:bg-[#F5C400] font-black text-xs uppercase tracking-tighter flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Get a Free Quote</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#181818] hover:bg-[#222222] text-white border border-white/10 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F5C400]" />
              <span>Call {BUSINESS_INFO.phone}</span>
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
              {BUSINESS_INFO.subTagline} Complete automotive repair, precision transmission rebuilds, and diagnostic services for drivers and partner garages.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-[#121212] p-2.5 rounded-lg border border-neutral-800">
              <ShieldCheck className="w-4 h-4 text-[#F5C400] shrink-0" />
              <span>Dedicated Quality & Transparent Pricing</span>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              {navLinks.slice(0, 5).map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-neutral-400 hover:text-[#F5C400] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-mono">
              Core Specialties
            </h4>
            <ul className="space-y-2.5 text-xs">
              {SERVICES.map((s) => (
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
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">Lead Contact</span>
                <span className="font-bold text-white">{BUSINESS_INFO.contactPerson}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">Phone</span>
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="font-bold text-[#F5C400] hover:underline"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">Email</span>
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="text-neutral-300 hover:text-white break-all"
                >
                  {BUSINESS_INFO.email}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-500 block">Social Media</span>
                <span className="text-neutral-400">{BUSINESS_INFO.socialMediaName}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 {BUSINESS_INFO.name}. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-[#F5C400] transition-colors font-mono uppercase text-[11px]"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
