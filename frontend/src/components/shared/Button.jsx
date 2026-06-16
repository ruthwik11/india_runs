import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { tv } from 'tailwind-variants';

const buttonVariants = tv({
  base: 'font-mono uppercase tracking-widest font-semibold text-sm transition-all duration-100 focus-visible:outline focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-3 flex items-center justify-center gap-2',
  variants: {
    variant: {
      primary: 'bg-black text-white px-8 py-4 border-2 border-black hover:bg-white hover:text-black',
      secondary: 'bg-white text-black border-2 border-black px-8 py-4 hover:bg-black hover:text-white',
      ghost: 'bg-transparent text-black px-4 py-2 border-none underline hover:no-underline hover:text-black/70',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed hover:bg-black hover:text-white (for primary) etc...',
    }
  },
  defaultVariants: {
    variant: 'primary',
    fullWidth: false,
    disabled: false,
  }
});

export const Button = React.forwardRef(({ 
  className, 
  variant, 
  fullWidth, 
  disabled, 
  isLoading, 
  children, 
  ...props 
}, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      disabled={disabled || isLoading}
      className={clsx(buttonVariants({ variant, fullWidth }), className, disabled && 'opacity-50 pointer-events-none')}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
