import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'kn', label: 'ಕನ್ನಡ' }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('SARKARI_SAATHI_LANG', lng);
    setIsOpen(false);
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Language Switcher"
        className="bg-white border-thin border-black p-3 font-mono uppercase tracking-widest text-sm flex items-center gap-2 hover:bg-black hover:text-white transition-colors duration-100 focus-visible:outline focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-3"
      >
        <span>{currentLang.code}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute right-0 bottom-full mb-2 md:bottom-auto md:top-full md:mb-0 md:mt-2 w-40 bg-white border-thin border-black shadow-[0_0_10px_rgba(0,0,0,0.1)]"
          >
            {languages.map((lang, idx) => (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-3 font-mono text-sm border-b border-light last:border-b-0 hover:bg-black hover:text-white transition-colors duration-100 flex justify-between items-center ${i18n.language === lang.code ? 'bg-black text-white' : ''}`}
              >
                {lang.label}
                {i18n.language === lang.code && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    ✓
                  </motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
