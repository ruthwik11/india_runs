import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Check, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AGE_RANGES, INCOME_RANGES, INDIAN_STATES, OCCUPATIONS } from '../utils/constants';
import { validateStep } from '../utils/validators';

const STEPS = ['age', 'income', 'state', 'occupation', 'family_size', 'land', 'review'];

// Spring configurations
const springConfig = { type: 'spring', stiffness: 300, damping: 30 };
const elasticConfig = { type: 'spring', stiffness: 400, damping: 10 };

// Variants
const stepVariants = {
  enter: (direction) => ({
    y: direction > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      y: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 }
    }
  },
  exit: (direction) => ({
    y: direction < 0 ? 60 : -60,
    opacity: 0,
    scale: 1.05,
    transition: { duration: 0.2 }
  })
};

const optionVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: i => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, ...springConfig }
  }),
  hover: { scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' },
  tap: { scale: 0.98 }
};

const shakeVariants = {
  shake: {
    x: [-2, 2, -2, 2, 0],
    transition: { duration: 0.3 }
  }
};

const ProfileForm = ({ onSubmit, initialData = {} }) => {
  const { t, i18n } = useTranslation();
  const [[currentStep, direction], setPage] = useState([0, 0]);
  const [formData, setFormData] = useState({
    age: '', income: '', state: '', occupation: '', family_size: '', has_land: null, land_size: '',
    ...initialData
  });
  const [error, setError] = useState('');

  const stepName = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    const { isValid, error: stepError } = validateStep(stepName, formData);
    if (!isValid) {
      setError(stepError);
      return;
    }
    setError('');
    if (currentStep < STEPS.length - 1) {
      setPage([currentStep + 1, 1]);
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep > 0) setPage([currentStep - 1, -1]);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const renderStepContent = () => {
    switch (stepName) {
      case 'age':
        return (
          <div className="flex flex-col h-full">
            <motion.h3 className="mb-6 font-bold text-2xl text-dark" layoutId="form-title">{t('form.ageQuestion')}</motion.h3>
            <div className="grid grid-cols-2 gap-4">
              {AGE_RANGES.map((age, i) => (
                <motion.div 
                  key={age}
                  custom={i}
                  variants={optionVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  className={`relative p-4 rounded-xl border-2 cursor-pointer overflow-hidden transition-colors ${formData.age === age ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-border bg-white hover:border-primary/40'}`}
                  onClick={() => updateField('age', age)}
                >
                  {formData.age === age && (
                    <motion.div layoutId="selected-bg" className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-0" />
                  )}
                  <span className="relative z-10 flex justify-between items-center text-lg">
                    {age}
                    {formData.age === age && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={elasticConfig}>
                        <Check size={20} className="text-primary" />
                      </motion.div>
                    )}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        );
      
      case 'income':
        return (
          <div className="flex flex-col h-full">
            <motion.h3 className="mb-6 font-bold text-2xl text-dark" layoutId="form-title">{t('form.incomeQuestion')}</motion.h3>
            <motion.div className="relative group" whileFocus="focus">
              <select 
                className="w-full p-4 rounded-xl border-2 border-border bg-white text-lg focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none appearance-none"
                value={formData.income}
                onChange={e => updateField('income', e.target.value)}
              >
                <option value="">{t('form.selectPlaceholder')}</option>
                {INCOME_RANGES.map(inc => <option key={inc.value} value={inc.value}>{inc.label}</option>)}
              </select>
            </motion.div>
          </div>
        );
        
      case 'state':
        return (
          <div className="flex flex-col h-full">
            <motion.h3 className="mb-6 font-bold text-2xl text-dark" layoutId="form-title">{t('form.stateQuestion')}</motion.h3>
            <div className="relative">
              <select 
                className="w-full p-4 rounded-xl border-2 border-border bg-white text-lg focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none appearance-none"
                value={formData.state}
                onChange={e => updateField('state', e.target.value)}
              >
                <option value="">{t('form.selectPlaceholder')}</option>
                {INDIAN_STATES.map(st => <option key={st.value} value={st.value}>{st.name}</option>)}
              </select>
            </div>
          </div>
        );
        
      case 'occupation':
        return (
          <div className="flex flex-col h-full">
            <motion.h3 className="mb-6 font-bold text-2xl text-dark" layoutId="form-title">{t('form.occupationQuestion')}</motion.h3>
            <div className="relative">
              <select 
                className="w-full p-4 rounded-xl border-2 border-border bg-white text-lg focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none appearance-none"
                value={formData.occupation}
                onChange={e => updateField('occupation', e.target.value)}
              >
                <option value="">{t('form.selectPlaceholder')}</option>
                {OCCUPATIONS.map(occ => {
                  const labelKey = `label_${i18n.language}`;
                  return <option key={occ.value} value={occ.value}>{occ[labelKey] || occ.label_en}</option>;
                })}
              </select>
            </div>
          </div>
        );
        
      case 'family_size':
        return (
          <div className="flex flex-col h-full">
            <motion.h3 className="mb-6 font-bold text-2xl text-dark" layoutId="form-title">{t('form.familySizeQuestion')}</motion.h3>
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input 
                type="number" min="1" max="20"
                className="w-full p-6 text-center text-3xl font-bold rounded-xl border-2 border-border bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                value={formData.family_size}
                onChange={e => updateField('family_size', e.target.value)}
                placeholder="0"
              />
            </motion.div>
          </div>
        );
        
      case 'land':
        return (
          <div className="flex flex-col h-full">
            <motion.h3 className="mb-6 font-bold text-2xl text-dark" layoutId="form-title">{t('form.landQuestion')}</motion.h3>
            <div className="flex gap-4 mb-6">
              {[true, false].map((val, i) => (
                <motion.button 
                  key={String(val)}
                  custom={i}
                  variants={optionVariants}
                  initial="hidden" animate="visible" whileHover="hover" whileTap="tap"
                  type="button"
                  className={`flex-1 p-4 rounded-xl border-2 font-bold text-lg transition-all ${formData.has_land === val ? 'border-primary bg-primary text-white shadow-lg' : 'border-border bg-white text-muted hover:border-primary/40'}`}
                  onClick={() => {
                    updateField('has_land', val);
                    if (!val) updateField('land_size', '0');
                  }}
                >
                  {val ? t('form.yes') : t('form.no')}
                </motion.button>
              ))}
            </div>
            
            <AnimatePresence>
              {formData.has_land && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="text-sm font-semibold text-muted mb-2 block uppercase tracking-wider">{t('form.landSizePlaceholder')}</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" min="0" step="0.1"
                      className="w-full p-4 text-xl font-bold rounded-xl border-2 border-border bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                      value={formData.land_size}
                      onChange={e => updateField('land_size', e.target.value)}
                      placeholder="e.g. 2.5"
                    />
                    <span className="text-xl font-medium text-dark">{t('form.acres')}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
        
      case 'review':
        return (
          <div className="flex flex-col h-full">
            <motion.h3 className="mb-6 font-bold text-2xl text-dark" layoutId="form-title">{t('form.reviewTitle')}</motion.h3>
            <div className="bg-muted-bg/50 border border-border rounded-2xl p-6 shadow-inner">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {[
                  { label: t('form.age'), value: formData.age, step: 0 },
                  { label: t('form.income'), value: INCOME_RANGES.find(i => i.value === formData.income)?.label, step: 1 },
                  { label: t('form.state'), value: INDIAN_STATES.find(s => s.value === formData.state)?.name, step: 2 },
                  { label: t('form.occupation'), value: OCCUPATIONS.find(o => o.value === formData.occupation)?.[`label_${i18n.language}`] || OCCUPATIONS.find(o => o.value === formData.occupation)?.label_en, step: 3 },
                  { label: t('form.familySize'), value: formData.family_size, step: 4 },
                  { label: t('form.land'), value: formData.has_land ? `${formData.land_size} ${t('form.acres')}` : t('form.none'), step: 5 }
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div className="text-sm font-semibold text-muted uppercase tracking-wider flex items-center">{item.label}</div>
                    <div className="font-bold text-dark text-right flex justify-end items-center gap-2 group">
                      {item.value || '-'} 
                      <motion.button 
                        whileHover={{ scale: 1.2, rotate: 15 }} 
                        whileTap={{ scale: 0.9 }}
                        className="text-muted group-hover:text-primary transition-colors p-1"
                        onClick={() => setPage([item.step, -1])}
                      >
                        <Edit2 size={16} />
                      </motion.button>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        );
        
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-border/50 overflow-hidden flex flex-col relative z-20 will-change-transform">
      {/* Sticky Header & Progress */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-30 px-8 pt-8 pb-4 border-b border-border/40">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-muted bg-muted-bg px-3 py-1 rounded-full">
            {t('form.step')} {currentStep + 1} / {STEPS.length}
          </span>
          <span className="text-xs font-black text-primary uppercase tracking-widest">
            {stepName.replace('_', ' ')}
          </span>
        </div>
        <div className="w-full bg-muted-bg rounded-full h-2 overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full rounded-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMjBMMjAgMEgyMEwyMCAyMEgweiIgZmlsbD0icmdiYSg1LCAxNTAsIDEwNSwgMC4yKSIvPjwvc3ZnPg==')] bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          />
        </div>
      </div>
      
      {/* Form Content Area */}
      <div className="relative p-8 min-h-[380px] flex flex-col overflow-hidden">
        <motion.div 
          animate={error ? "shake" : ""} 
          variants={shakeVariants}
          className="flex-1 relative"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full h-full"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-destructive text-sm font-medium bg-destructive/10 p-3 rounded-lg mt-4 text-center border border-destructive/20"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border/50">
          <motion.button 
            type="button"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-muted hover:bg-muted-bg transition-colors"
            onClick={handleBack}
            animate={{ opacity: currentStep === 0 ? 0 : 1, pointerEvents: currentStep === 0 ? 'none' : 'auto' }}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={20} /> {t('form.back')}
          </motion.button>
          
          <motion.button 
            type="button"
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-colors ${currentStep === STEPS.length - 1 ? 'bg-primary hover:bg-primary/90 shadow-primary/30' : 'bg-dark hover:bg-black shadow-dark/20'}`}
            onClick={handleNext}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentStep === STEPS.length - 1 ? t('form.submit') : (
              <>{t('form.next')} <ChevronRight size={20} /></>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
