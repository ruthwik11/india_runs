import { z } from 'zod';

export const profileSchema = z.object({
  age: z.enum(['18-25', '25-35', '35-50', '50-60', '60+'], {
    errorMap: () => ({ message: 'Please select an age range' }),
  }),
  monthly_income: z.union([z.string(), z.number()]).transform(v => String(v)).refine(val => val.trim() !== '', { 
    message: 'Please enter a valid income' 
  }),
  state: z.string().min(2, { message: 'Please enter a valid state name' }),
  occupation: z.enum(['student', 'farmer', 'employed', 'unemployed', 'business', 'other'], {
    errorMap: () => ({ message: 'Please select your occupation' }),
  }),
  caste: z.enum(['General', 'OBC', 'SC', 'ST', 'Minority'], {
    errorMap: () => ({ message: 'Please select your caste category' }),
  }),
  has_land: z.boolean(),
  land_size_acres: z.number().min(0).optional(),
}).superRefine((data, ctx) => {
  if (data.has_land && data.land_size_acres === undefined) {
    ctx.addIssue({
      path: ['land_size_acres'],
      code: z.ZodIssueCode.custom,
      message: 'Please specify land size',
    });
  }
});
