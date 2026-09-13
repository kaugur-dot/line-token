import React from 'react';

interface HairlineDividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  subtle?: boolean;
}

export const HairlineDivider: React.FC<HairlineDividerProps> = ({
  orientation = 'horizontal',
  className = '',
  subtle = false,
}) => {
  const borderColor = subtle ? 'border-[#E8E2D6]' : 'border-[#DDD6C8]';

  if (orientation === 'vertical') {
    return (
      <div 
        role="separator" 
        aria-orientation="vertical"
        className={`w-0 self-stretch border-r ${borderColor} ${className}`} 
      />
    );
  }

  return (
    <div 
      role="separator" 
      aria-orientation="horizontal"
      className={`w-full h-0 border-b ${borderColor} ${className}`} 
    />
  );
};
