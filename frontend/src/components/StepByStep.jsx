import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

const StepByStep = ({ steps = [] }) => {
  const { i18n, t } = useTranslation();
  
  if (!steps || steps.length === 0) return null;

  return (
    <div className="relative pt-2">
      <h4 className="font-bold text-lg mb-6 text-dark tracking-tight">{t('chat.howToApply')}</h4>
      
      {/* Animated Timeline Line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute left-4 top-14 bottom-0 w-0.5 bg-border rounded-full"
      />

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
        className="flex flex-col gap-6 relative z-10"
      >
        {steps.map((item, index) => {
          const actionText = i18n.language === 'en' ? item.action_en : (item.action_local || item.action_en);
          
          return (
            <motion.div key={index} variants={stepVariants} className="flex gap-4 group">
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ type: 'spring' }}
                className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md relative"
              >
                {item.step}
                <div className="absolute inset-0 rounded-full border-2 border-accent/30 scale-150 opacity-0 group-hover:animate-ping"></div>
              </motion.div>
              
              <div className="flex-1 pt-1">
                <p className="text-dark font-medium leading-relaxed">{actionText}</p>
                {item.link && (
                  <motion.a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 mt-2 text-accent font-semibold relative overflow-hidden group/link"
                    whileHover="hover"
                  >
                    <span>Click here to open portal</span>
                    <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-accent"
                      initial={{ width: 0 }}
                      variants={{ hover: { width: '100%' } }}
                    />
                  </motion.a>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default StepByStep;
