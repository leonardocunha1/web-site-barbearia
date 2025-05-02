import { z } from 'zod';

export const bookingItemSchema = z.object({
  id: z.string().uuid(),
  preco: z.number().positive(),
  duracao: z.number().positive(),
  service: z
    .object({
      nome: z.string(),
      descricao: z.string().optional(),
      duracao: z.number().positive(),
    })
    .optional(),
});
