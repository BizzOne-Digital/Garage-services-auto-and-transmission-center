import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const innerSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  const titleSizes = {
    sm: 'text-base font-black tracking-tighter',
    md: 'text-xl font-black tracking-tighter',
    lg: 'text-2xl font-black tracking-tighter',
  };

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Brand Icon Emblem - Artistic Rotated Diamond Symbol */}
      <div className={`${iconSizes[size]} bg-[#F5C400] flex items-center justify-center rounded-sm rotate-45 shrink-0 shadow-lg shadow-[#F5C400]/20 transition-transform duration-300 group-hover:rotate-[225deg]`}>
        <div className={`${innerSizes[size]} border-2 border-black -rotate-45 flex items-center justify-center`}>
          <div className="w-1.5 h-1.5 bg-black rounded-full" />
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <span className={`${titleSizes[size]} text-white uppercase leading-none font-sans`}>
          GARAGE <span className="text-[#F5C400]">SERVICES</span>
        </span>
        <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#F5C400] font-bold uppercase mt-1">
          AUTO & TRANSMISSION
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
