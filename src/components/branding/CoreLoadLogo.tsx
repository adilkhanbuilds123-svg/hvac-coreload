import React from 'react';

interface CoreLoadLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
}

export const CoreLoadLogo: React.FC<CoreLoadLogoProps> = ({ 
  className = "w-auto h-8", 
  variant = 'auto',
  showText = true 
}) => {
  // We'll use currentColor for versatility, but we can enforce brand colors if needed
  const primaryColor = variant === 'light' ? 'white' : variant === 'dark' ? '#0f172a' : 'currentColor';
  const accentColor = variant === 'light' ? '#fbbf24' : '#f59e0b'; // Amber-like Action Color

  return (
    <div className={`flex items-center gap-2 font-bold tracking-tight ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="h-full w-auto flex-shrink-0"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Hexagon (Structural / Engineering feel) */}
        <path 
          d="M50 5L90 27.5V72.5L50 95L10 72.5V27.5L50 5Z" 
          stroke={primaryColor} 
          strokeWidth="8" 
          strokeLinejoin="round"
        />
        {/* Inner Flame / Leaf abstract (HVAC temp exchange) */}
        <path 
          d="M50 30C50 30 35 45 35 60C35 68.2843 41.7157 75 50 75C58.2843 75 65 68.2843 65 60C65 45 50 30 50 30Z" 
          fill={accentColor} 
        />
        {/* Center dot/core */}
        <circle cx="50" cy="62" r="4" fill="white" />
      </svg>
      {showText && (
        <span className="text-xl md:text-2xl" style={{ color: primaryColor }}>
          Core<span className="text-amber-500">Load</span>
        </span>
      )}
    </div>
  );
};
