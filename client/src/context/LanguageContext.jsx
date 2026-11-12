import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/i18n';
import { useAuth } from './AuthContext';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('smartbuy_language') || 'en';
  });

  // When logged-in user changes, honor profile language if set
  useEffect(() => {
    if (user && user.preferences && user.preferences.language) {
      const userLang = user.preferences.language;
      if (userLang !== currentLanguage) {
        changeLanguage(userLang, false);
      }
    }
  }, [user]);

  const changeLanguage = async (code, syncWithBackend = true) => {
    try {
      await i18n.changeLanguage(code);
      setCurrentLanguage(code);
      localStorage.setItem('smartbuy_language', code);

      if (syncWithBackend && user) {
        updateProfile({ preferences: { language: code } }).catch((err) =>
          console.warn('[LanguageContext] Failed to sync language with profile:', err.message)
        );
      }
    } catch (err) {
      console.error('[LanguageContext] Error changing language:', err);
    }
  };

  const getLanguageDetails = (code) => {
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === (code || currentLanguage)) || SUPPORTED_LANGUAGES[0];
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        getLanguageDetails,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
