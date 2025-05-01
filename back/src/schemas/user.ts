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
