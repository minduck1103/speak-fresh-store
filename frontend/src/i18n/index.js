import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import viCommon from '../locales/vi/common.json';
import enCommon from '../locales/en/common.json';
import viPages from '../locales/vi/pages.json';
import enPages from '../locales/en/pages.json';

const resources = {
  vi: {
    common: viCommon,
    pages: viPages
  },
  en: {
    common: enCommon,
    pages: enPages
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi', // Default language
    debug: false,

    // Default namespace
    defaultNS: 'common',

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // React options
    react: {
      useSuspense: false,
    }
  });

export default i18n;
