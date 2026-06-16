import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export const UserMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: 'spring', stiffness: 70, damping: 20 }}
    className="flex justify-end mb-4"
  >
    <div className="bg-white border-thin border-black text-black px-6 py-4 max-w-[80%] font-body">
      {message}
    </div>
  </motion.div>
);

export const BotMessage = ({ message, children }) => (
  <motion.div
    initial={{ opacity: 0, x: -40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: 'spring', stiffness: 70, damping: 20, delay: 0.1 }}
    className="flex justify-start mb-4"
  >
    <div className="bg-white border-thin border-black text-black px-6 py-4 max-w-[90%] font-body">
      {message}
      {children}
    </div>
  </motion.div>
);

export const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, x: -40 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex justify-start mb-4"
  >
    <div className="bg-white border-thin border-black text-black px-6 py-4 font-body flex gap-1 items-center">
      <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity }}>•</motion.span>
      <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}>•</motion.span>
      <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}>•</motion.span>
    </div>
  </motion.div>
);
