import { z } from 'zod';
import { paginationSchema } from './pagination';
import { Role } from '@prisma/client';

export const registerUserSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  role: z.enum(['CLIENTE', 'PROFISSIONAL', 'ADMIN']).optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  email: z.string().email().optional(),
  telefone: z.string().nullable().optional(),
  role: z.enum(['CLIENTE', 'PROFISSIONAL', 'ADMIN']).optional(),
  emailVerified: z.boolean(),
  active: z.boolean(),
  createdAt: z.date(),
});

export const updateProfileBodySchema = z.object({
  nome: z.string().min(3).optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional().nullable(),
});

export const listUsersQuerySchema = paginationSchema.extend({
  role: z.nativeEnum(Role).optional(),
  name: z.string().optional(),
});

export const anonymizeUserParamsSchema = z.object({
  userIdToAnonymize: z.string().uuid(),
});

export const updatePasswordBodySchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});
