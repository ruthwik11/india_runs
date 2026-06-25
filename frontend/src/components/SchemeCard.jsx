import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ExternalLink, FileText } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import StepByStep from './StepByStep';
import { formatCurrency } from '../utils/formatters';

const CountUp = ({ to, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(to, 10);
    if (start === end) return;
    let totalMilSecDur = parseInt(duration * 1000, 10);
    let incrementTime = (totalMilSecDur / end) * 2;

    const timer = setInterval(() => {
      start += 1;
      setCount(String(start));
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [to, duration]);

  return <>{count}%</>;
};

const SchemeCard = ({ scheme, index = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const { i18n, t } = useTranslation();
  
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const isLocal = i18n.language !== 'en';
  const name = isLocal && scheme.name_local ? scheme.name_local : scheme.name_en;
  const documents = isLocal && scheme.documents_required_local ? scheme.documents_required_local : scheme.documents_required_en;

  // Magnetic Button Effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setPos({ x: x * 0.15, y: y * 0.15 });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, rotateX: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100, delay: index * 0.1 }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="relative w-full mb-6 rounded-3xl bg-white shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden group perspective-1000"
    >
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,var(--tw-colors-primary),var(--tw-colors-accent),var(--tw-colors-secondary))] opacity-0 group-hover:opacity-100 p-[2px] transition-opacity duration-500">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--tw-colors-primary),var(--tw-colors-accent),var(--tw-colors-secondary))] animate-shimmer bg-[length:200%_auto]"></div>
      </div>
      
      {/* Inner Card Content */}
      <div className="relative z-10 bg-white h-full m-[2px] rounded-[22px] p-6 md:p-8 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-dark leading-snug">{name}</h3>
            <div className="text-3xl font-black text-success mt-2 tracking-tight">
              {formatCurrency(scheme.benefit_amount)}
            </div>
          </div>
          
          {scheme.match_score && (
            <motion.div 
              className="relative w-16 h-16 flex items-center justify-center rounded-full bg-success/10 text-success font-bold text-lg border-2 border-success/30 shadow-inner"
              animate={scheme.match_score >= 80 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-xl"><CountUp to={scheme.match_score} /></span>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 mt-1">{t('chat.matchScore')}</span>
              </div>
            </motion.div>
          )}
        </div>

        {documents && documents.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-muted uppercase tracking-wider">
              <FileText size={16} /> <span>{t('chat.documentsNeeded')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {documents.map((doc, i) => (
                <motion.span 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.3 + (i * 0.05), type: 'spring' }}
                  whileHover={{ scale: 1.05, backgroundColor: 'var(--tw-colors-primary)', color: '#fff' }}
                  className="px-3 py-1.5 bg-muted-bg text-dark text-sm font-medium rounded-lg cursor-default transition-colors"
                >
                  {doc}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {expanded && scheme.application_steps && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden mt-6 border-t border-border/50 pt-4"
            >
              <StepByStep steps={scheme.application_steps} />
              
              {scheme.contact_info && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 p-4 bg-muted-bg/50 rounded-xl border border-border"
                >
                  <span className="font-bold text-sm uppercase text-muted tracking-wider mr-2">{t('chat.contact')}: </span>
                  <span className="text-dark font-medium">{scheme.contact_info}</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex gap-4">
          {scheme.application_steps && scheme.application_steps.length > 0 && (
            <motion.button 
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setPos({ x: 0, y: 0 })}
              animate={{ x: pos.x, y: pos.y }}
              transition={{ type: 'spring', damping: 15, stiffness: 150 }}
              className={`flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold transition-colors ${expanded ? 'bg-dark text-white shadow-lg' : 'bg-muted-bg text-dark hover:bg-border/60'}`}
              onClick={() => setExpanded(!expanded)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={20} />
              </motion.div>
              {expanded ? t('chat.hideSteps') : t('chat.viewSteps')}
            </motion.button>
          )}
          
          {scheme.application_link && (
            <motion.a 
              href={scheme.application_link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold bg-primary text-white shadow-[0_4px_14px_0_rgba(255,107,53,0.39)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.23)] hover:bg-primary/90 transition-all"
            >
              {t('chat.applyNow')} <ExternalLink size={18} />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SchemeCard;
