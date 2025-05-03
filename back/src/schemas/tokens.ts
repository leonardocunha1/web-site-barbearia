import { z } from 'zod';

export const verifyEmailQuerySchema = z.object({
  token: z.string().uuid(),
});

export const sendVerificationEmailBodySchema = z.object({
  email: z.string().email(),
});

export const forgotPasswordBodySchema = z.object({
  email: z.string().email(),
});

export const resetPasswordBodySchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
});
