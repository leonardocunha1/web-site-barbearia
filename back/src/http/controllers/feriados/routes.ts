import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createHoliday } from './create';
import { deleteHoliday } from './delete';
import { listHolidays } from './list';
import { FastifyTypedInstance } from '@/types';
import { z } from 'zod';
import { createBookingBodySchema } from '@/schemas/bookings';
import {
  deleteHolidayParamsSchema,
  listHolidaysResponseSchema,
} from '@/schemas/holidays';
import { paginationSchema } from '@/schemas/pagination';

export async function holidayRoutes(app: FastifyTypedInstance) {
  // Rota para criar um feriado
  app.post(
    '/holidays',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
      schema: {
        operationId: 'createHoliday',
        tags: ['holidays'],
        description: 'Criação de um novo feriado.',
        body: createBookingBodySchema,
        response: {
          201: z.null().describe('Feriado criado com sucesso.'),
          400: z.object({ message: z.string() }).describe('Erro de validação'),
          404: z.object({ message: z.string() }).describe('Recurso não encontrado'),
          409: z.object({ message: z.string() }).describe('Conflito de feriado'),
        },
      },
    },
    createHoliday,
  );

  // Rota para deletar um feriado
  app.delete(
    '/holidays/:holidayId',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
      schema: {
        operationId: 'deleteHoliday',
        tags: ['holidays'],
        description: 'Deletar um feriado.',
        params: deleteHolidayParamsSchema,
        response: {
          204: z.null().describe('Feriado deletado.'),
          400: z.object({ message: z.string() }).describe('Erro de validação'),
          403: z.object({ message: z.string() }).describe('Acesso negado'),
          404: z.object({ message: z.string() }).describe('Recurso não encontrado'),
        },
      },
    },
    deleteHoliday,
  );

  app.get(
    '/holidays',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'listHolidays',
        tags: ['holidays'],
        description: 'Listar feriados.',
        querystring: paginationSchema,
        response: {
          200: listHolidaysResponseSchema.describe('Lista de feriados com paginação.'),
          400: z.object({ message: z.string() }).describe('Erro de validação e/ou dados inválidos'),
          403: z.object({ message: z.string() }).describe('Acesso negado'),
        },
      },
    },
    listHolidays,
  );
}
