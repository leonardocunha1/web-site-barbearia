import { z } from 'zod';
import { paginationSchema } from './pagination';

export const professionalSchema = z.object({
  id: z.string().uuid(),
  especialidade: z.string(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  ativo: z.coerce.boolean(),
  user: z.object({
    id: z.string().uuid(),
    nome: z.string(),
    email: z.string().email(),
    telefone: z.string().nullable().optional(),
  }),
  services: z.array(
    z.object({
      id: z.string().uuid(),
      nome: z.string(),
      descricao: z.string().optional(),
    }),
  ),
});

export const searchProfessionalsQuerySchema = paginationSchema.extend({
  query: z.string().min(2),
  ativo: z.coerce.boolean().optional().default(true),
});

export const listProfessionalsQuerySchema = paginationSchema.extend({
  query: z.string().min(2).optional(),
  especialidade: z.string().optional(),
  ativo: z.coerce.boolean().optional(),
});

export const toggleProfessionalStatusParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateProfessionalParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateProfessionalBodySchema = z.object({
  especialidade: z.string().min(3).optional(),
  bio: z.string().nullable().optional(),
  documento: z.string().nullable().optional(),
  registro: z.string().nullable().optional(),
  ativo: z.boolean().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const createProfessionalBodySchema = z.object({
  userId: z.string().uuid(),
  especialidade: z.string().min(3),
  bio: z.string().optional(),
  documento: z.string().optional(),
  registro: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const dashboardQuerySchema = z.object({
  range: z.enum(['today', 'week', 'month', 'custom']),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
