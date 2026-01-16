import * as z from 'zod';

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(128, { message: 'Password must not exceed 128 characters' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' });

const phoneNumberSchema = z
  .string()
  .min(10, { message: 'Phone number must be at least 10 digits' })
  .max(15, { message: 'Phone number must not exceed 15 digits' })
  .regex(/^\+?[0-9]+$/, {
    message: 'Phone number must contain only digits and optionally start with +',
  });

export const loginRequestValidation = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Please provide a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const signupRequestValidation = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Please provide a valid email address' }),
  password: passwordSchema,
  firstName: z
    .string()
    .trim()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must not exceed 50 characters' })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: 'First name can only contain letters, spaces, hyphens, and apostrophes',
    }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name must not exceed 50 characters' })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
    }),
  phoneNumber: phoneNumberSchema,
});
