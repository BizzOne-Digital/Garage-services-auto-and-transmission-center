import React from 'react';
import { Language, useLanguage } from '../i18n/LanguageContext';

interface LanguageToggleProps {
  className?: string;
  /** Slightly larger hit areas for the mobile drawer. */
  size?: 'sm' | 'md';
}

/**
 * Simple "FR | EN" switcher matching the site's sharp industrial styling.
 * Fixed-width buttons keep the header free of layout shifts when switching.
 */
export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '', size = 'sm' }) => {
  const { lang, setLang, t } = useLanguage();

  const options: { code: Language; label: string; aria: string }[] = [
    { code: 'fr', label: t.language.fr, aria: t.language.switchToFr },
    { code: 'en', label: t.language.en, aria: t.language.switchToEn },
  ];

  const padding = size === 'md' ? 'px-3 py-2' : 'px-2.5 py-1.5';

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className={`flex items-center bg-[#151515] border border-white/10 shrink-0 ${className}`}
    >
      {options.map((option, index) => {
        const isActive = lang === option.code;
        return (
          <React.Fragment key={option.code}>
            {index > 0 && <span aria-hidden="true" className="w-[1px] self-stretch bg-white/10" />}
            <button
              type="button"
              onClick={() => setLang(option.code)}
              aria-label={option.aria}
              aria-pressed={isActive}
              lang={option.code}
              className={`${padding} w-10 text-center text-[11px] font-mono font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-1 focus:ring-[#F5C400] ${
                isActive ? 'bg-[#F5C400] text-[#0A0A0A]' : 'text-neutral-400 hover:text-[#F5C400]'
              }`}
            >
              {option.label}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};
