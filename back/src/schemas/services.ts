import { z } from 'zod';
import { paginationSchema } from './pagination';

export const createServiceBodySchema = z.object({ name: z
    .string()
    .min(3, { message: 'O nome do serviço deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'O nome do serviço não pode exceder 100 caracteres' }), description: z
    .string()
    .max(500, { message: 'A descrição não pode exceder 500 caracteres' })
    .optional(),
  categoria: z
    .string()
    .max(50, { message: 'A categoria não pode exceder 50 caracteres' })
    .optional(),
  ativo: z.boolean().default(true),
});

export const listServicesQuerySchema = paginationSchema.extend({ name: z
    .string()
    .max(100, { message: 'O termo de busca não pode exceder 100 caracteres' })
    .optional(),
  categoria: z
    .string()
    .max(50, {
      message: 'O filtro de categoria não pode exceder 50 caracteres',
    })
    .optional(),
  ativo: z.coerce
    .boolean({
      invalid_type_error: 'O filtro de status deve ser verdadeiro ou falso',
    })
    .optional(),
  professionalId: z
    .string()
    .uuid({ message: 'ID do profissional deve ser um UUID válido' })
    .optional(),
});

export const servicesProfessionalSchema = z.object({
  id: z.string().uuid({ message: 'ID do serviço inválido' }), name: z.string(), description: z.string().nullable(),
  categoria: z.string().nullable(),
  ativo: z.boolean(), price: z.number().nullable(), duration: z.number().nullable(),
});

export const servicesSchema = z.object({
  id: z.string().uuid({ message: 'ID do serviço inválido' }), name: z.string(), description: z.string().nullable(),
  categoria: z.string().nullable(),
  ativo: z.boolean(),
});

export const updateServiceBodySchema = z.object({ name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'O nome não pode exceder 100 caracteres' })
    .optional(), description: z
    .string()
    .max(500, { message: 'A descrição não pode exceder 500 caracteres' })
    .optional(),
  precoPadrao: z
    .number()
    .positive({ message: 'O preço deve ser um valor positivo' })
    .optional(), duration: z
    .number()
    .int({ message: 'A duração deve ser um número inteiro' })
    .positive({ message: 'A duração deve ser um valor positivo' })
    .optional(),
  categoria: z
    .string()
    .max(50, { message: 'A categoria não pode exceder 50 caracteres' })
    .optional(),
  ativo: z.boolean().optional(),
});

export const updateServiceParamsSchema = z.object({
  id: z.string().uuid({ message: 'ID do serviço inválido' }),
});

export const deleteServiceQuerySchema = z.object({
  permanent: z.coerce
    .boolean({
      invalid_type_error: 'O parâmetro permanent deve ser verdadeiro ou falso',
    })
    .default(false),
});

// Schema para service-professional
export const serviceSchemaWithProfessional = z.object({
  id: z.string().uuid(), name: z.string(), description: z.string().optional(),
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
          id: z.string().uuid(), name: z.string(),
        }),
      }),
    }),
  ),
});

export const addServiceToProfessionalBodySchema = z.object({
  serviceId: z.string().uuid({ message: 'ID do serviço inválido' }), price: z.number().positive({ message: 'O preço deve ser um valor positivo' }), duration: z
    .number()
    .int({ message: 'A duração deve ser um número inteiro' })
    .positive({ message: 'A duração deve ser um valor positivo' }),
});

export const removeServiceFromProfessionalParamsSchema = z.object({
  serviceId: z.string().uuid({ message: 'ID do serviço inválido' }),
  professionalId: z.string().uuid({ message: 'ID do profissional inválido' }),
});

export const listProfessionalServicesParamsSchema = z.object({
  professionalId: z.string().uuid({ message: 'ID do profissional inválido' }),
});

export const listProfessionalServicesQuerySchema = paginationSchema.extend({
  activeOnly: z.coerce
    .boolean({
      invalid_type_error: 'O filtro activeOnly deve ser verdadeiro ou falso',
    })
    .optional()
    .default(true),
});

export const updateProfessionalServicesParamsSchema = z.object({
  professionalId: z.string().uuid(),
});

export const updateProfessionalServicesBodySchema = z.object({
  services: z.array(
    z.object({
      serviceId: z.string().uuid(), price: z.number().positive(), duration: z.number().positive(),
      linked: z.boolean(),
    }),
  ),
});
