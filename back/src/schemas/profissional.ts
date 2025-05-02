import { z } from 'zod';

export const professionalSchema = z.object({
  id: z.string().uuid(),
  especialidade: z.string(),
  bio: z.string().optional(),
  user: z.object({
    nome: z.string(),
    email: z.string().email(),
    telefone: z.string().optional(),
  }),
});
