import React, { useState, useEffect } from 'react';

export const IconRenderer = ({ 
  icon, 
  className = "", 
  containerClassName = "",
  fallback = "🍌"
}: { 
  icon: string; 
  className?: string; 
  containerClassName?: string;
  fallback?: string;
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset states when icon changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [icon]);

  const isImageRef = (icon.startsWith('/') || icon.startsWith('http') || icon.includes('.'));
  const isBananaTails = icon === '/banana_tails.png' || icon.toLowerCase().includes('banana');
  const showImage = isImageRef && !hasError;
  
  if (showImage) {
    return (
      <div className={`flex items-center justify-center overflow-hidden pointer-events-none relative ${containerClassName}`}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${className} flex items-center justify-center leading-none select-none opacity-40`}>
              {isBananaTails ? '🍌' : fallback}
            </span>
          </div>
        )}
        <img
          src={icon}
          alt=""
          className={`w-full h-full object-contain pointer-events-none transition-opacity duration-200 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            console.warn(`Icon failed to load: ${icon}`);
            setHasError(true);
          }}
        />
      </div>
    );
  }
  
  // If it's not an image or failed to load, render text/emoji
  const displayIcon = isBananaTails ? '🍌' : fallback;
  
  return (
    <div className={`flex items-center justify-center ${containerClassName}`}>
      <span className={`${className} flex items-center justify-center leading-none select-none`}>
        {hasError ? displayIcon : icon}
      </span>
    </div>
  );
};
