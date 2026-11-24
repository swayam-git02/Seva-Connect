// Central Language Context for SevaConnect
// Persists language choice (English / Hindi) in localStorage and provides t() translation helper.

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, DIRECT_PHRASE_DICTIONARY } from '../constants/translations';

const LANGUAGE_STORAGE_KEY = 'sevaconnect_language';

export const LanguageContext = createContext({
  language: 'en',
  isHindi: false,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, fallback) => fallback || key,
});

export const LanguageProvider = ({ children }) => {
  // Read persisted language preference from localStorage or default to English
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (newLang) => {
    const validLang = newLang === 'hi' ? 'hi' : 'en';
    setLanguageState(validLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, validLang);
      // Dispatch storage event so all components/tabs sync immediately
      window.dispatchEvent(new Event('languagechange'));
    } catch (e) {
      console.warn('Unable to persist language setting:', e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  // Sync across tabs if user changes language in another tab
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === LANGUAGE_STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'hi')) {
        setLanguageState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Translate key or text
   * @param {string} keyOrText - Key (e.g. 'auth.login') or plain English text ('Customer')
   * @param {string} [fallback] - Optional fallback text
   */
  const t = (keyOrText, fallback) => {
    if (!keyOrText) return '';

    if (language === 'en') {
      // Return English translation if key exists, else return fallback or original text
      if (TRANSLATIONS.en && TRANSLATIONS.en[keyOrText]) {
        return TRANSLATIONS.en[keyOrText];
      }
      return fallback !== undefined ? fallback : keyOrText;
    }

    // Language is 'hi' (Hindi)
    // 1. Direct translation key lookup (e.g. 'auth.welcome')
    if (TRANSLATIONS.hi && TRANSLATIONS.hi[keyOrText]) {
      return TRANSLATIONS.hi[keyOrText];
    }

    // 2. Direct phrase dictionary lookup (e.g. 'Services' -> 'सेवाएं')
    if (DIRECT_PHRASE_DICTIONARY[keyOrText]) {
      return DIRECT_PHRASE_DICTIONARY[keyOrText];
    }

    // 3. Case-insensitive phrase lookup
    const trimmed = String(keyOrText).trim();
    if (DIRECT_PHRASE_DICTIONARY[trimmed]) {
      return DIRECT_PHRASE_DICTIONARY[trimmed];
    }

    return fallback !== undefined ? fallback : keyOrText;
  };

  const value = {
    language,
    isHindi: language === 'hi',
    setLanguage,
    toggleLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageContext;

