import React from 'react';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const botVariants = {
  hidden: { opacity: 0, x: -40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { type: 'spring', damping: 25, stiffness: 120 }
  }
};

const BotMessage = ({ children }) => {
  return (
    <motion.div 
      variants={botVariants}
      initial="hidden"
      animate="visible"
      className="flex gap-4 items-start w-full"
    >
      <motion.div 
        whileHover={{ rotate: 15, scale: 1.1 }}
        className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-md shadow-primary/20"
      >
        <Bot size={22} />
      </motion.div>
      <div className="bg-white border border-border/60 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] text-dark p-5 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed will-change-transform">
        {children}
      </div>
    </motion.div>
  );
};

export default BotMessage;
