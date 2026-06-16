import { z } from 'zod';

export const profileSchema = z.object({
  age: z.enum(['18-25', '25-35', '35-50', '50-60', '60+'], {
    errorMap: () => ({ message: 'Please select an age range' }),
  }),
  monthly_income: z.enum(['<10k', '10k-25k', '25k-50k', '50k+'], {
    errorMap: () => ({ message: 'Please select an income range' }),
  }),
  state: z.string().min(2, { message: 'Please enter a valid state name' }),
  occupation: z.enum(['student', 'farmer', 'employed', 'unemployed', 'business', 'other'], {
    errorMap: () => ({ message: 'Please select your occupation' }),
  }),
  family_size: z.number().min(1, { message: 'Family size must be at least 1' }),
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
