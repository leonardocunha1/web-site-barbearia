import { z } from 'zod';

export const registerUserSchema = z.object({
  nome: z.string(),
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
  telefone: z.string().optional(),
  role: z.enum(['CLIENTE', 'PROFISSIONAL', 'ADMIN']).optional(),
});
