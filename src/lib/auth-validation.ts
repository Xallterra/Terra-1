import { z } from 'zod';

const usernameRegex = /^[a-z0-9_-]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
  password: z.string().min(1, 'Enter your password.'),
});

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your name.').max(80, 'Name is too long.'),
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters.')
      .max(30, 'Username must be 30 characters or fewer.')
      .regex(usernameRegex, 'Use lowercase letters, numbers, underscores, or hyphens only.')
      .transform((value) => value.toLowerCase()),
    email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
    password: z
      .string()
      .min(10, 'Password must be at least 10 characters.')
      .regex(passwordRegex, 'Password needs uppercase, lowercase, number, and symbol.'),
    confirmPassword: z.string(),
    title: z.string().trim().max(100).optional().or(z.literal('')),
    company: z.string().trim().max(120).optional().or(z.literal('')),
    terms: z.literal('on', { errorMap: () => ({ message: 'You must accept the terms.' }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(2, 'Display name is required.').max(80),
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters.')
    .max(30, 'Username must be 30 characters or fewer.')
    .regex(usernameRegex, 'Use lowercase letters, numbers, underscores, or hyphens only.')
    .transform((value) => value.toLowerCase()),
  title: z.string().trim().max(100).optional().or(z.literal('')),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  bio: z.string().trim().max(600).optional().or(z.literal('')),
  website: z.string().trim().url('Enter a valid URL.').optional().or(z.literal('')),
  avatarUrl: z.string().trim().url('Enter a valid URL.').optional().or(z.literal('')),
});
