import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '../components/shared/Button';

function Home({ onStart }) {
  const { t } = useTranslation();

  const titleWords = t('home.title').split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 70, damping: 20 }
    }
  };

  const features = [
    { title: t('home.feature1Title'), desc: t('home.feature1Desc') },
    { title: t('home.feature2Title'), desc: t('home.feature2Desc') },
    { title: t('home.feature3Title'), desc: t('home.feature3Desc') },
  ];

  return (
    <div className="relative bg-white pattern-lines-horizontal">
      {/* Hero Section */}
      <section className="container py-20 md:py-32 flex flex-col items-center">
        {/* Shield Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 border-[3px] border-black flex items-center justify-center mb-8"
        >
          {/* Government Building Icon */}
          <svg width="40" height="40" viewBox="0 0 256 256" fill="currentColor" className="text-black">
            <path d="M128 48 L196 96 H60 Z" />
            <rect x="72" y="104" width="16" height="64" />
            <rect x="120" y="104" width="16" height="64" />
            <rect x="168" y="104" width="16" height="64" />
            <rect x="60" y="176" width="136" height="16" />
            <rect x="52" y="196" width="152" height="16" />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="font-display text-5xl md:text-6xl tracking-tighter leading-[1.1] text-center mb-6 max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {titleWords.map((word, idx) => (
            <motion.span key={idx} variants={wordVariants} className="inline-block mr-4">
              {word}
            </motion.span>
          ))}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="font-body text-xl font-light text-center mb-12 max-w-2xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t('home.subtitle')}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button onClick={onStart} variant="primary" className="text-lg px-12 py-5">
            {t('home.startButton')} →
          </Button>
        </motion.div>
      </section>

      {/* Animated Rule Divider */}
      <motion.div 
        className="w-full h-[8px] bg-black my-16"
        initial={{ width: '0%' }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 2, ease: "linear" }}
      />

      {/* Feature Cards */}
      <section className="container pt-24 pb-48 flex justify-center items-center">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="relative bg-white border-thin border-black p-8 group cursor-pointer"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, backgroundColor: '#000000' }}
              transition={{ 
                opacity: { duration: 0.4, delay: idx * 0.1 },
                y: { type: 'spring', stiffness: 70, damping: 20, delay: idx * 0.1 },
                backgroundColor: { duration: 0.1 }
              }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="mb-8 w-16 h-16 border-thin border-black flex items-center justify-center group-hover:border-white transition-all duration-100">
                <span className="font-mono text-xl group-hover:text-white">0{idx + 1}</span>
              </div>
              <h3 className="font-display text-3xl mb-4 group-hover:text-white transition-colors duration-100">
                {feature.title}
              </h3>
              <p className="font-body text-lg group-hover:text-white transition-colors duration-100">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
