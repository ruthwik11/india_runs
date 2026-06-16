import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../shared/Button';

export const SchemeCard = ({ scheme }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 70, damping: 20 }}
      whileHover={{ backgroundColor: '#000000', color: '#FFFFFF' }}
      className="bg-white border-thin border-black p-8 group transition-colors duration-100 mb-4"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-display text-4xl font-semibold tracking-tight mb-2 group-hover:text-white">
            {scheme.name_en}
          </h3>
          <p className="font-body text-2xl font-bold group-hover:text-white">
            {scheme.benefit_amount}
          </p>
        </div>
        <div className="w-16 h-16 border-thin border-black rounded-full flex items-center justify-center group-hover:border-white">
          <span className="font-mono text-xl font-bold">
            {Math.round(scheme.eligibility_match_score * 100)}%
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {scheme.required_documents?.map((doc, idx) => (
          <span key={idx} className="border-hairline border-black px-3 py-1 text-sm font-mono group-hover:border-white">
            {doc}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        <Button 
          variant="secondary" 
          onClick={() => setExpanded(!expanded)}
          className="group-hover:bg-white group-hover:text-black group-hover:border-white"
        >
          {expanded ? 'Hide Steps' : 'View Steps'}
        </Button>
        <Button 
          variant="primary"
          onClick={() => window.open(scheme.apply_link, '_blank')}
          className="group-hover:bg-white group-hover:text-black group-hover:border-white"
        >
          Apply Now →
        </Button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="mt-8 pt-8 border-t-thin border-black group-hover:border-white">
              <h4 className="font-mono uppercase tracking-widest text-sm mb-4">Steps to Apply</h4>
              <ol className="space-y-4">
                {scheme.steps_to_apply?.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="font-mono border-thin border-black w-8 h-8 flex items-center justify-center group-hover:border-white shrink-0">
                      {step.step}
                    </span>
                    <span className="font-body text-lg leading-relaxed">{step.action_en}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
