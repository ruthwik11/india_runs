import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';


import './styles/globals.css';

import Home from './pages/Home';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import LanguageSwitcher from './components/shared/LanguageSwitcher';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [chatKey, setChatKey] = useState(0);
  const { t } = useTranslation();

  const goToPage = (page) => {
    if (page === 'chat') setChatKey(k => k + 1); // force Chat remount
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentPage(page);
  };

  useEffect(() => {
    // Disable smooth scroll on mobile devices for native touch behavior
    const isMobile = window.innerWidth <= 768;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: !isMobile, 
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col text-black font-body overflow-x-hidden pb-[80px] md:pb-0">
      {/* Header */}
      <header className="fixed bottom-0 left-0 w-full md:sticky md:bottom-auto md:top-3 z-50 bg-white border-t-[3px] md:border-t-0 md:border-b-[5px] border-black shadow-[0_-4px_15px_rgba(0,0,0,0.05)] md:shadow-none pb-[env(safe-area-inset-bottom)] md:pb-0">
        <div className="container flex justify-between items-center py-3 md:py-5 px-4 md:px-8 mx-auto">
          <div className="flex items-center gap-3">
            {/* Government Building Logo — static, not clickable */}
            <div className="w-9 h-9 border-[2.5px] border-black flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 256 256" fill="currentColor" className="text-black">
                <path d="M128 48 L196 96 H60 Z" />
                <rect x="72" y="104" width="16" height="64" />
                <rect x="120" y="104" width="16" height="64" />
                <rect x="168" y="104" width="16" height="64" />
                <rect x="60" y="176" width="136" height="16" />
                <rect x="52" y="196" width="152" height="16" />
              </svg>
            </div>
            {/* SarkariSaathi title — clickable, navigates to home */}
            <motion.h1
              className="font-display text-xl md:text-3xl tracking-tighter font-bold cursor-pointer"
              onClick={() => goToPage('home')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              SarkariSaathi
            </motion.h1>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full relative pattern-noise flex flex-col">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1"
            >
              <Home onStart={() => goToPage('chat')} />
            </motion.div>
          )}
          {currentPage === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1"
            >
              <Chat key={chatKey} onBack={() => goToPage('home')} />
            </motion.div>
          )}
          {currentPage === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full flex-1"
            >
              <Profile onBack={() => setCurrentPage('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white p-5 md:p-8 mt-auto z-10">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p className="font-mono text-sm tracking-widest uppercase">
            &copy; {new Date().getFullYear()} SarkariSaathi. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
