import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';

export const UserMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    className="flex justify-end mb-4"
  >
    <div className="bg-white border-thin border-black text-black px-4 py-3 sm:px-6 sm:py-4 max-w-[90%] md:max-w-[80%] font-body">
      {message}
    </div>
  </motion.div>
);

export const BotMessage = ({ message, children }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToSpeak = typeof message === 'string' ? message : JSON.stringify(message);
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="flex justify-start mb-4"
    >
      <div className="bg-white border-thin border-black text-black px-4 py-3 sm:px-6 sm:py-4 max-w-[95%] md:max-w-[90%] font-body relative group/msg">
        <button 
          onClick={toggleSpeech}
          className="absolute bottom-2 right-2 text-gray-500 hover:text-black w-8 h-8 flex items-center justify-center opacity-0 group-hover/msg:opacity-100 transition-opacity z-10"
          title="Read Aloud"
        >
          {isSpeaking ? '⏹' : '🔊'}
        </button>
        <div className="markdown-content">
          <ReactMarkdown>{typeof message === 'string' ? message : (message ? JSON.stringify(message, null, 2) : '')}</ReactMarkdown>
        </div>
        {children}
      </div>
    </motion.div>
  );
};

export const TypingIndicator = () => {
  const [textIndex, setTextIndex] = useState(0);
  const loadingTexts = ["Thinking", "Reviewing profile", "Finding matches", "Almost done"];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-start mb-4"
    >
      <div className="bg-white border-thin border-black text-black px-6 py-4 font-body flex gap-1 items-center">
        <span className="mr-2 uppercase tracking-widest text-sm font-bold">{loadingTexts[textIndex]}</span>
        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity }}>•</motion.span>
        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}>•</motion.span>
        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}>•</motion.span>
      </div>
    </motion.div>
  );
};
