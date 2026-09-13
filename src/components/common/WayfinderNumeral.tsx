import React, { useEffect, useState } from 'react';

interface WayfinderNumeralProps {
  value: string | number;
  prefix?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant' | 'display';
  theme?: 'light' | 'display-amber' | 'display-cream';
  flashOnChange?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const WayfinderNumeral: React.FC<WayfinderNumeralProps> = ({
  value,
  prefix,
  size = 'md',
  theme = 'light',
  flashOnChange = false,
  className = '',
  ariaLabel,
}) => {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (!flashOnChange) return;
    setIsFlashing(true);
    const timer = setTimeout(() => setIsFlashing(false), 300);
    return () => clearTimeout(timer);
  }, [value, flashOnChange]);

  const sizeClasses = {
    sm: 'text-lg md:text-xl font-bold tracking-tight',
    md: 'text-2xl md:text-3xl font-extrabold tracking-tight',
    lg: 'text-4xl md:text-5xl font-extrabold tracking-tighter',
    xl: 'text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter',
    giant: 'text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter',
    display: 'text-8xl sm:text-9xl md:text-[11rem] lg:text-[13rem] leading-none font-black tracking-tighter',
  }[size];

  const themeClasses = {
    light: 'text-[#1E1C19]',
    'display-amber': 'text-[#F59E0B] drop-shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    'display-cream': 'text-[#FAF6ED]',
  }[theme];

  return (
    <span
      className={`font-wayfinder tabular-nums inline-flex items-baseline select-none transition-colors duration-200 ${sizeClasses} ${themeClasses} ${
        isFlashing ? 'opacity-40' : 'opacity-100'
      } ${className}`}
      aria-label={ariaLabel || (prefix ? `${prefix} ${value}` : String(value))}
    >
      {prefix && (
        <span className="opacity-70 mr-1 text-[0.65em] font-bold tracking-normal">
          {prefix}
        </span>
      )}
      <span>{value}</span>
    </span>
  );
};
