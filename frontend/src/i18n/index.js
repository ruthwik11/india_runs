import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './en.json';
import hiTranslations from './hi.json';
import teTranslations from './te.json';
import taTranslations from './ta.json';
import knTranslations from './kn.json';

const resources = {
  en: { translation: enTranslations },
  hi: { translation: hiTranslations },
  te: { translation: teTranslations },
  ta: { translation: taTranslations },
  kn: { translation: knTranslations }
};

const savedLanguage = localStorage.getItem('SARKARI_SAATHI_LANG') || import.meta.env.VITE_DEFAULT_LANGUAGE || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
