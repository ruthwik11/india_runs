import { z } from 'zod';

export const profileSchema = z.object({
  age: z.enum(['18-25', '25-35', '35-50', '50-60', '60+'], {
    errorMap: () => ({ message: 'Please select an age range' }),
  }),
  monthly_income: z.union([z.string(), z.number()])
    .transform(v => String(v).trim())
    .refine(val => val !== '', { message: 'Monthly income is required' })
    .refine(val => /^\d+$/.test(val), { message: 'Income must contain numbers only' }),
  state: z.string().min(2, { message: 'Please enter a valid state name' }),
  occupation: z.enum(['student', 'farmer', 'employed', 'unemployed', 'business', 'other'], {
    errorMap: () => ({ message: 'Please select your occupation' }),
  }),
  caste: z.enum(['General', 'OBC', 'SC', 'ST', 'Minority'], {
    errorMap: () => ({ message: 'Please select your caste category' }),
  }),
  has_land: z.boolean({ required_error: 'Please select yes or no', invalid_type_error: 'Please select yes or no' }).nullable().refine(val => val !== null, { message: 'Please select yes or no' }),
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
