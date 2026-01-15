import * as z from 'zod';

export const loginRequestValidation = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupRequestValidation = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(3).max(25),
  lastName: z.string().min(3).max(25),
  phoneNumber: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' }),
});
