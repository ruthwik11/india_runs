import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { UserCircle } from 'lucide-react';

import './styles/globals.css';

import Home from './pages/Home';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import LanguageSwitcher from './components/shared/LanguageSwitcher';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { t } = useTranslation();

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
    <div className="bg-white min-h-screen flex flex-col text-black font-body overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black">
        <div className="container flex justify-between items-center py-6 px-4 md:px-8 mx-auto">
          <motion.div 
            className="cursor-pointer flex items-center gap-3"
            onClick={() => setCurrentPage('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Logo */}
            <img
              src="/favicon.svg"
              alt="SarkariSaathi Logo"
              className="w-9 h-9 flex-shrink-0"
            />
            <h1 className="font-display text-2xl md:text-3xl tracking-tighter font-bold">
              SarkariSaathi
            </h1>
          </motion.div>
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setCurrentPage('profile')}
              className="flex items-center gap-2 font-bold hover:text-blue-600 transition-colors"
            >
              <UserCircle className="w-6 h-6" />
              <span className="hidden md:inline">Profile</span>
            </button>
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
              <Home onStart={() => setCurrentPage('chat')} />
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
              <Chat onBack={() => setCurrentPage('home')} />
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
      <footer className="bg-black text-white p-8 mt-auto z-10">
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
