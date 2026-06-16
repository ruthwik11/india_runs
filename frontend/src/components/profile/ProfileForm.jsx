import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { profileSchema } from '../../utils/validation';
import { Button } from '../shared/Button';

const steps = [
  { id: 'age', title: "What's your age?", type: 'options', options: ['18-25', '25-35', '35-50', '50-60', '60+'] },
  { id: 'monthly_income', title: "What's your monthly income?", type: 'options', options: ['<10k', '10k-25k', '25k-50k', '50k+'] },
  { id: 'state', title: "Which state do you live in?", type: 'text', placeholder: "e.g., Maharashtra" },
  { id: 'occupation', title: "What's your occupation?", type: 'options', options: ['student', 'farmer', 'employed', 'unemployed', 'business', 'other'] },
  { id: 'family_size', title: "How many members are in your family?", type: 'number', placeholder: "e.g., 4" },
  { id: 'has_land', title: "Do you own any land?", type: 'boolean' },
  { id: 'land_size_acres', title: "How many acres of land?", type: 'number', placeholder: "e.g., 2", condition: (data) => data.has_land === true },
];

const ProfileForm = ({ onSubmit, initialData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { control, handleSubmit, trigger, watch, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData || {
      age: '',
      monthly_income: '',
      state: '',
      occupation: '',
      family_size: 1,
      has_land: false,
      land_size_acres: 0,
    },
    mode: 'onTouched'
  });

  const formValues = watch();

  // Filter steps based on conditions
  const activeSteps = steps.filter(step => !step.condition || step.condition(formValues));
  
  const handleNext = async () => {
    const stepField = activeSteps[currentStep].id;
    const isStepValid = await trigger(stepField);
    
    if (isStepValid) {
      if (currentStep < activeSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit(onSubmit)();
      }
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
                  className={`p-4 border-2 border-black font-mono uppercase tracking-widest text-sm transition-all duration-100 ${
                    field.value === false ? 'bg-black text-white' : 'bg-white text-black'
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
                className={`w-full p-4 text-xl font-body bg-white text-black border-b-2 border-black focus:border-b-4 focus:outline-none transition-all duration-100`}
              />
            )}
          />
        );
      default:
        return null;
    }
  };

  const currentStepData = activeSteps[currentStep];
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
