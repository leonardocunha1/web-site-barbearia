import { z } from 'zod';
import { paginationSchema } from './pagination';

export const createServiceBodySchema = z.object({
  nome: z.string(),
  descricao: z.string().optional(),
  categoria: z.string().optional(),
});

export const listServicesQuerySchema = paginationSchema.extend({
  nome: z.string().optional(),
  categoria: z.string().optional(),
  ativo: z.coerce.boolean().optional(),
  professionalId: z.string().uuid().optional(),
});

export const servicesSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  descricao: z.string().optional(),
  categoria: z.string().optional(),
  ativo: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const updateServiceBodySchema = z.object({
  nome: z.string().min(3).optional(),
  descricao: z.string().optional(),
  precoPadrao: z.number().positive().optional(),
  duracao: z.number().int().positive().optional(),
  categoria: z.string().optional(),
  ativo: z.boolean().optional(),
});

export const updateServiceParamsSchema = z.object({
  id: z.string().uuid(),
});

export const deleteServiceQuerySchema = z.object({
  permanent: z.coerce.boolean().default(false),
});

// Schema para service-professional

export const serviceSchemaWithProfessional = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  descricao: z.string().optional(),
  categoria: z.string().optional(),
  ativo: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  profissionais: z.array(
    z.object({
      id: z.string().uuid(),
      professional: z.object({
        id: z.string().uuid(),
        user: z.object({
          id: z.string().uuid(),
          nome: z.string(),
        }),
      }),
    }),
  ),
});

export const addServiceToProfessionalBodySchema = z.object({
  serviceId: z.string().uuid(),
  preco: z.number().positive(),
  duracao: z.number().int().positive(),
});

export const removeServiceFromProfessionalParamsSchema = z.object({
  serviceId: z.string().uuid(),
  professionalId: z.string().uuid(),
});

export const listProfessionalServicesParamsSchema = z.object({
  professionalId: z.string().uuid(),
});

export const listProfessionalServicesQuerySchema = paginationSchema.extend({
  activeOnly: z.coerce.boolean().optional().default(true),
});

export const updateServiceProfessionalParamsSchema = z.object({
  serviceId: z.string().uuid(),
  professionalId: z.string().uuid(),
});

export const updateServiceProfessionalBodySchema = z.object({
  preco: z.number().positive(),
  duracao: z.number().positive(),
});
