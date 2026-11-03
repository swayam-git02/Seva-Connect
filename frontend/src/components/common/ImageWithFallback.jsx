import React, { useState } from 'react';
import { FALLBACK_PLACEHOLDER } from '../../utils/imageHelpers';

/**
 * Bulletproof Image Component with automatic fallback handling
 * Roman Hinglish: Agar image load na ho to graceful SVG placeholder display karta hai
 */
export const ImageWithFallback = ({
  src,
  alt = 'SevaConnect Service',
  fallbackSrc = FALLBACK_PLACEHOLDER,
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading={loading}
      onError={handleError}
      className={`transition-opacity duration-300 ${className}`}
      {...props}
    />
  );
};

export default ImageWithFallback;
