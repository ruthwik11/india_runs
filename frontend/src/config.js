const config = {
  apiBase: import.meta.env.VITE_API_BASE || 'http://localhost:8000',
  supportedLanguages: ['en', 'hi', 'te', 'ta', 'kn'],
  languageLabels: {
    en: 'English',
    hi: 'हिन्दी',
    te: 'తెలుగు',
    ta: 'தமிழ்',
    kn: 'ಕನ್ನಡ'
  }
};
export default config;
