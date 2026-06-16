import React from 'react';
import SchemeList from '../components/SchemeList';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Results = ({ schemes }) => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 py-12"
    >
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-dark">{t('results.title')}</h2>
        <p className="text-muted text-xl font-medium">
          {t('results.totalMatched')}: <span className="font-bold text-primary px-3 py-1 bg-primary/10 rounded-lg">{schemes?.length || 0}</span>
        </p>
      </div>
      
      <SchemeList schemes={schemes} />
    </motion.div>
  );
};

export default Results;
