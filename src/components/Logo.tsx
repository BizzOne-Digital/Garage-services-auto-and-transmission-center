import React from 'react';
import { BUSINESS_INFO } from '../lib/constants';

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
        <div className={`relative ${containerSizes[size]} aspect-square rounded-full overflow-hidden bg-white border-2 border-[#F5C400] shadow-xl flex items-center justify-center p-0.5 group`}>
          <img
            src={BUSINESS_INFO.logoUrl}
            alt="Garage Services Auto and Transmission Center Official Logo"
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
      <div className={`relative shrink-0 ${containerSizes[size]} aspect-square rounded-full overflow-hidden bg-white border-2 border-[#F5C400] shadow-md hover:scale-105 transition-transform duration-300 flex items-center justify-center p-0.5`}>
        <img
          src={BUSINESS_INFO.logoUrl}
          alt="Garage Services Auto and Transmission Center Emblem"
          className="w-full h-full object-cover object-center rounded-full scale-[1.04]"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <span className={`${titleSizes[size]} text-white uppercase leading-none font-sans`}>
          GARAGE <span className="text-[#F5C400]">SERVICES</span>
        </span>
        <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.18em] text-[#F5C400] font-bold uppercase mt-1">
          AUTO & TRANSMISSION CENTER
        </span>
        {showTagline && (
          <span className="text-[9px] text-neutral-400 tracking-widest uppercase mt-0.5 font-mono">
            Montréal • Specialized Precision
          </span>
        )}
      </div>
    </div>
  );
};


