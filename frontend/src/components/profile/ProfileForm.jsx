import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { profileSchema } from '../../utils/validation';
import { Button } from '../shared/Button';

// All Indian states and UTs
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
  'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
].sort((a, b) => a.localeCompare(b));

const steps = [
  { id: 'age', title: "What's your age?", type: 'options', options: ['18-25', '25-35', '35-50', '50-60', '60+'] },
  { id: 'monthly_income', title: "What's your family's monthly income?", type: 'text', placeholder: "e.g., 15000" },
  { id: 'state', title: "Which state do you live in?", type: 'select', options: INDIAN_STATES, placeholder: "Enter your state name" },
  { id: 'occupation', title: "What's your occupation?", type: 'options', options: ['student', 'farmer', 'employed', 'unemployed', 'business', 'other'] },
  { id: 'caste', title: "What is your caste category?", type: 'options', options: ['General', 'OBC', 'SC', 'ST', 'Minority'] },
  { id: 'has_land', title: "Do you own any land?", type: 'boolean' },
  { id: 'land_size_acres', title: "How many acres of land?", type: 'number', placeholder: "e.g., 2", condition: (data) => data.has_land === true },
];

const ProfileForm = ({ onSubmit, initialData }) => {
  const { i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const isProcessing = React.useRef(false);
  const { control, handleSubmit, trigger, watch, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData || {
      age: '',
      monthly_income: '',
      state: '',
      occupation: '',
      caste: '',
      has_land: null,
      land_size_acres: '',
    },
    mode: 'onTouched'
  });

  const formValues = watch();

  // State to Language Mapping Magic
  useEffect(() => {
    if (formValues.state) {
      const stateMap = {
        'Andhra Pradesh': 'te', 'Telangana': 'te',
        'Arunachal Pradesh': 'en', 'Assam': 'as',
        'Bihar': 'hi', 'Chhattisgarh': 'hi', 'Delhi': 'hi', 'Haryana': 'hi', 
        'Himachal Pradesh': 'hi', 'Jharkhand': 'hi', 'Madhya Pradesh': 'hi', 
        'Rajasthan': 'hi', 'Uttar Pradesh': 'hi', 'Uttarakhand': 'hi', 'Chandigarh': 'hi',
        'Goa': 'mr', 'Maharashtra': 'mr',
        'Gujarat': 'gu', 'Dadra and Nagar Haveli and Daman and Diu': 'gu',
        'Karnataka': 'kn',
        'Kerala': 'ml', 'Lakshadweep': 'ml',
        'Odisha': 'or',
        'Punjab': 'pa',
        'Tamil Nadu': 'ta', 'Puducherry': 'ta',
        'West Bengal': 'bn', 'Tripura': 'bn',
        'Jammu and Kashmir': 'ur', 'Ladakh': 'ur',
        'Manipur': 'mni',
        'Meghalaya': 'en', 'Mizoram': 'en', 'Nagaland': 'en', 'Sikkim': 'en', 
        'Andaman and Nicobar Islands': 'en'
      };
      
      const targetLang = stateMap[formValues.state] || 'en';
      i18n.changeLanguage(targetLang);
    }
  }, [formValues.state, i18n]);

  // Filter steps based on conditions
  const activeSteps = steps.filter(step => !step.condition || step.condition(formValues));
  
  const handleNext = async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      const stepField = activeSteps[currentStep].id;
      const isStepValid = await trigger(stepField);
      
      if (isStepValid) {
        if (currentStep < activeSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          handleSubmit(onSubmit)();
        }
      }
    } finally {
      setTimeout(() => {
        isProcessing.current = false;
      }, 150); // Prevent double-tap or key-repeat skipping
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderField = (step) => {
    switch (step.type) {
      case 'options':
        return (
          <Controller
            name={step.id}
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-4">
                {step.options.map((opt) => {
                  const isSelected = field.value === opt;
                  return (
                    <motion.button
                      key={opt}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => field.onChange(opt)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.repeat) {
                          e.preventDefault();
                          handleNext();
                        }
                      }}
                      className={`p-4 border-2 border-black font-mono uppercase tracking-widest text-sm transition-all duration-100 ${
                        isSelected ? 'bg-black text-white' : 'bg-white text-black hover:border-4'
                      }`}
                    >
                      {opt}
                      {isSelected && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="ml-2 inline-block">
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          />
        );
      case 'boolean':
        return (
          <Controller
            name={step.id}
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => field.onChange(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.repeat) {
                      e.preventDefault();
                      handleNext();
                    }
                  }}
                  className={`p-4 border-2 border-black font-mono uppercase tracking-widest text-sm transition-all duration-100 ${
                    field.value === true ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  Yes
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => field.onChange(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.repeat) {
                      e.preventDefault();
                      handleNext();
                    }
                  }}
                  className={`p-4 border-2 border-black font-mono uppercase tracking-widest text-sm transition-all duration-100 ${
                    field.value === false && field.value !== null ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  No
                </motion.button>
              </div>
            )}
          />
        );
      case 'text':
      case 'number':
        return (
          <Controller
            name={step.id}
            control={control}
            render={({ field }) => (
              <input
                type={step.type}
                placeholder={step.placeholder}
                {...field}
                onChange={e => {
                  const val = step.type === 'number' ? (e.target.value ? Number(e.target.value) : '') : e.target.value;
                  field.onChange(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.repeat) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                className={`w-full p-4 text-xl font-body bg-white text-black border-b-2 border-black focus:border-b-4 focus:outline-none transition-all duration-100`}
              />
            )}
          />
        );
      case 'select':
        return (
          <Controller
            name={step.id}
            control={control}
            render={({ field }) => {
              const query = field.value || '';
              const isTyping = query.trim().length > 0;
              const PREFERRED_STATES = [
                'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka',
                'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab',
                'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
              ];
              const filtered = INDIAN_STATES
                .filter(s => s.toLowerCase().includes(query.toLowerCase()))
                .sort((a, b) => a.localeCompare(b));

              return (
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder={step.placeholder}
                    value={query}
                    autoComplete="off"
                    onChange={e => field.onChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.repeat) {
                        e.preventDefault();
                        if (filtered.length === 1) {
                          field.onChange(filtered[0]);
                          setTimeout(() => handleNext(), 100);
                        } else if (filtered.length > 0) {
                          field.onChange(filtered[0]);
                        }
                      }
                    }}
                    className="w-full p-4 text-xl font-body bg-white text-black border-b-2 border-black focus:border-b-4 focus:outline-none transition-all duration-100"
                  />

                  {/* Preferred states shown when input is empty */}
                  {!isTyping && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {PREFERRED_STATES.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            field.onChange(opt);
                            setTimeout(() => handleNext(), 200);
                          }}
                          className="px-3 py-1.5 border border-black font-mono text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-100"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Filtered results while typing */}
                  {isTyping && filtered.length > 0 && (
                    <div className="absolute z-50 left-0 w-full mt-1 bg-white border-2 border-black max-h-52 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      {filtered.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            field.onChange(opt);
                            setTimeout(() => handleNext(), 200);
                          }}
                          className={`w-full text-left px-4 py-3 font-body text-base border-b border-gray-100 last:border-b-0 hover:bg-black hover:text-white transition-colors duration-100 ${
                            field.value === opt ? 'bg-black text-white' : 'bg-white text-black'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {isTyping && filtered.length === 0 && (
                    <div className="absolute z-50 left-0 w-full mt-1 bg-white border-2 border-black px-4 py-3 font-body text-sm text-gray-500">
                      No states found
                    </div>
                  )}
                </div>
              );
            }}
          />
        );
      default:
        return null;
    }
  };

  const currentStepData = activeSteps[currentStep];
  
  // Failsafe against out-of-bounds index caused by rapid re-renders
  if (!currentStepData) return null;

  const errorMessage = errors[currentStepData?.id]?.message;

  return (
    <div className="w-full relative">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-light">
        <motion.div
          className="h-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / activeSteps.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 70, damping: 20 }}
        />
      </div>

      <div className="pt-8 pb-4 min-h-[250px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ type: 'spring', stiffness: 70, damping: 20 }}
            className="w-full"
          >
            <h2 className="font-display text-3xl md:text-4xl mb-8">
              {currentStepData.title}
            </h2>
            
            <div className="mb-4">
              {renderField(currentStepData)}
            </div>

            {/* Error Message with Shake Animation */}
            <AnimatePresence>
              {errorMessage && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    x: [-2, 2, -2, 2, 0]
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-black font-bold font-mono text-sm uppercase mt-4"
                >
                  Error: {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-8 pt-8 border-t-[4px] border-black">
        <Button 
          variant="secondary" 
          onClick={handleBack} 
          disabled={currentStep === 0}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={handleNext}
          className="flex-1"
        >
          {currentStep === activeSteps.length - 1 ? 'Find Schemes' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
