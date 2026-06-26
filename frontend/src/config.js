const config = {
  apiBase: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  supportedLanguages: ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'gu', 'mr', 'bn'],
  languageLabels: {
    en: 'English',
    hi: 'हिन्दी',
    te: 'తెలుగు',
    ta: 'தமிழ்',
    kn: 'ಕನ್ನಡ',
    ml: 'മലയാളം',
    gu: 'ગુજરાતી',
    mr: 'मराठी',
    bn: 'বাংলা'
  }
};
export default config;
