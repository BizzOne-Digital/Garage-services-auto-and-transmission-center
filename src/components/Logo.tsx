import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useBusiness } from '../i18n/useContent';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  imageOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  imageOnly = false,
}) => {
  const { t } = useLanguage();
  const business = useBusiness();

  // The lockup is two lines: the first two words of the business name (managed
  // in /admin/settings), then the rest as the descriptor.
  // ponytail: plain word split — give Settings a dedicated descriptor field if a
  // name ever needs a different break.
  const [brandFirst = '', brandSecond = '', ...descriptor] = business.businessName
    .trim()
    .split(/\s+/);
  const descriptorLine = descriptor.join(' ') || t.logo.line2;

  const containerSizes = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  const titleSizes = {
    sm: 'text-sm sm:text-base font-black tracking-tight',
    md: 'text-base sm:text-lg lg:text-xl font-black tracking-tight',
    lg: 'text-xl sm:text-2xl font-black tracking-tight',
    xl: 'text-2xl sm:text-3xl font-black tracking-tight',
  };

  if (imageOnly) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className={`relative ${containerSizes[size]} aspect-square rounded-full overflow-hidden bg-white border-2 border-[#F97316] shadow-xl flex items-center justify-center p-0.5 group`}>
          <img
            src={business.logoUrl}
            alt={t.logo.altEmblem}
            className="w-full h-full object-cover object-center rounded-full scale-[1.04]"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 sm:gap-3.5 select-none ${className}`}>
      {/* Official Brand Emblem Image - Perfect Circle without corners */}
      <div className={`relative shrink-0 ${containerSizes[size]} aspect-square rounded-full overflow-hidden bg-white border-2 border-[#F97316] shadow-md hover:scale-105 transition-transform duration-300 flex items-center justify-center p-0.5`}>
        <img
          src={business.logoUrl}
          alt={t.logo.altEmblem}
          className="w-full h-full object-cover object-center rounded-full scale-[1.04]"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <span className={`${titleSizes[size]} text-white uppercase leading-none font-sans`}>
          {brandFirst} <span className="text-[#F97316]">{brandSecond}</span>
        </span>
        <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.18em] text-[#F97316] font-bold uppercase mt-1">
          {descriptorLine}
        </span>
        {showTagline && (
          <span className="text-[9px] text-neutral-400 tracking-widest uppercase mt-0.5 font-mono">
            {t.logo.tagline}
          </span>
        )}
      </div>
    </div>
  );
};


