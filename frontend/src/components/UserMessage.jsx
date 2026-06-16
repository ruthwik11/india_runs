import React from 'react';
import { motion } from 'framer-motion';

const userVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { type: 'spring', damping: 25, stiffness: 200 } // Faster, snappier
  }
};

const UserMessage = ({ text }) => {
  return (
    <motion.div 
      variants={userVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-end w-full group"
    >
      <motion.div 
        whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(27, 160, 152, 0.4)' }}
        className="bg-accent text-white p-4 px-5 rounded-2xl rounded-tr-sm max-w-[80%] shadow-lg shadow-accent/20 leading-relaxed will-change-transform transition-all"
      >
        {text}
      </motion.div>
    </motion.div>
  );
};

export default UserMessage;
