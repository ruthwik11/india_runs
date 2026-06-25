import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ type = 'dots', text = 'Loading...' }) => {
  if (type === 'dots') {
    return (
      <div className="flex items-center gap-1 py-1" aria-label={text}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-muted"
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className="flex flex-col gap-3 w-full" aria-hidden="true">
        <motion.div 
          className="h-4 bg-muted-bg rounded w-[80%] animate-pulse"
        />
        <motion.div 
          className="h-4 bg-muted-bg rounded w-[100%] animate-pulse"
        />
        <motion.div 
          className="h-4 bg-muted-bg rounded w-[60%] animate-pulse"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 text-muted">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 size={24} />
      </motion.div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
