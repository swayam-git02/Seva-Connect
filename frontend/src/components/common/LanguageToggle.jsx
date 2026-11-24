// Reusable Language Toggle component for English / Hindi selection
// Login, Signup, Navbar, and Sidebars can use this component directly.

import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const LanguageToggle = ({
  variant = 'pill', // 'pill' | 'card' | 'subtle'
  size = 'md', // 'sm' | 'md'
  showLabel = false,
  className = '',
}) => {
  const { language, setLanguage, isHindi } = useLanguage();

  if (variant === 'card') {
    return (
      <div className={`p-3 bg-surface-muted rounded-xl border border-surface-border ${className}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-brand-600" />
            <span className="text-xs font-semibold text-content-dark">
              Language / भाषा चुनें:
            </span>
          </div>

          <div className="inline-flex p-1 bg-white rounded-lg border border-surface-border shadow-xs">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                !isHindi
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-content-secondary hover:text-content-dark'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                isHindi
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-content-secondary hover:text-content-dark'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default pill / compact toggle
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-xs font-medium text-content-secondary flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-brand-500" />
          <span>{isHindi ? 'भाषा:' : 'Language:'}</span>
        </span>
      )}

      <div className="inline-flex items-center p-0.5 bg-surface-muted border border-surface-border rounded-lg shadow-2xs">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
            !isHindi
              ? 'bg-white text-brand-700 shadow-xs'
              : 'text-content-secondary hover:text-content-dark'
          }`}
          title="Switch to English"
        >
          <span>English</span>
          {!isHindi && <Check className="h-3 w-3 text-brand-600 stroke-[3]" />}
        </button>

        <button
          type="button"
          onClick={() => setLanguage('hi')}
          className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
            isHindi
              ? 'bg-brand-500 text-white shadow-xs'
              : 'text-content-secondary hover:text-content-dark'
          }`}
          title="हिंदी में बदलें"
        >
          <span>हिंदी</span>
          {isHindi && <Check className="h-3 w-3 text-white stroke-[3]" />}
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;

