import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createBusinessHours } from './create';
import { updateBusinessHours } from './update';
import { FastifyTypedInstance } from '@/types';
import { deleteBusinessHours } from './delete';
import { listBusinessHours } from './list';
import {
  businessHoursSchema,
  createBusinessHoursBodySchema,
  deleteBusinessHoursParamsSchema,
  listBusinessHoursParamsSchema,
  updateBusinessHoursBodySchema,
} from '@/schemas/horario-funcionamento';
import { z } from 'zod';

export async function businessHoursRoutes(app: FastifyTypedInstance) {
  app.post(
    '/business-hours',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
      schema: {
        tags: ['business-hours'],
        description: 'Criação de um novo horário de funcionamento.',
        body: createBusinessHoursBodySchema,
        response: {
          201: z
            .null()
            .describe('Horário de funcionamento criado com sucesso.'),
          400: z
            .object({ message: z.string() })
            .describe('Erro de validação dos dados'),
          404: z
            .object({ message: z.string() })
            .describe('Recurso não encontrado'),
          409: z
            .object({ message: z.string() })
            .describe('Conflito de horário de funcionamento'),
        },
      },
    },
    createBusinessHours,
  );

  app.put(
    '/business-hours/:professionalId',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
      schema: {
        tags: ['business-hours'],
        description: 'Atualização de um horário de funcionamento.',
        body: updateBusinessHoursBodySchema,
        response: {
          200: z
            .null()
            .describe('Horário de funcionamento atualizado com sucesso.'),
          400: z
            .object({ message: z.string() })
            .describe('Erro de validação dos dados'),
          404: z
            .object({ message: z.string() })
            .describe('Recurso não encontrado'),
        },
      },
    },
    updateBusinessHours,
  );

  app.get(
    '/business-hours/:professionalId',
    {
      schema: {
        tags: ['business-hours'],
        description: 'Listar horários de funcionamento.',
        params: listBusinessHoursParamsSchema,
        response: {
          200: z
            .object({
              businessHours: z.array(businessHoursSchema),
            })
            .describe('Horários de funcionamento encontrados.'),
          400: z.object({ message: z.string() }).describe('Erro de validação'),
          404: z
            .object({ message: z.string() })
            .describe('Horário não encontrado'),
        },
      },
    },
    listBusinessHours,
  );

  app.delete(
    '/business-hours/:businessHoursId',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
      schema: {
        tags: ['business-hours'],
        description: 'Deletar um horário de funcionamento.',
        params: deleteBusinessHoursParamsSchema,
        response: {
          204: z.null().describe('Horário de funcionamento deletado.'),
          400: z
            .object({ message: z.string() })
            .describe('Erro de validação dos dados'),
          403: z.object({ message: z.string() }).describe('Acesso negado'),
          404: z
            .object({ message: z.string() })
            .describe('Horário não encontrado'),
        },
      },
    },
    deleteBusinessHours,
  );
}
