import { describe, expect, it } from 'vitest';
import { loginSchema, signupSchema } from './auth-validation';

const validSignup = {
  name: 'Sandeep Admin',
  username: 'endpoint_admin',
  email: 'admin@example.com',
  password: 'StrongPass1!',
  confirmPassword: 'StrongPass1!',
  title: 'Endpoint Engineer',
  company: 'Makriva',
  terms: 'on',
};

describe('auth validation', () => {
  it('accepts valid login input', () => {
    expect(loginSchema.safeParse({ email: 'ADMIN@EXAMPLE.COM', password: 'secret' }).success).toBe(true);
  });

  it('requires valid username characters', () => {
    const result = signupSchema.safeParse({ ...validSignup, username: 'Bad User' });
    expect(result.success).toBe(false);
  });

  it('requires strong passwords', () => {
    const result = signupSchema.safeParse({ ...validSignup, password: 'weakpassword', confirmPassword: 'weakpassword' });
    expect(result.success).toBe(false);
  });

  it('requires matching passwords', () => {
    const result = signupSchema.safeParse({ ...validSignup, confirmPassword: 'Different1!' });
    expect(result.success).toBe(false);
  });
});
