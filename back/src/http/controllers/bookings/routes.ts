import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createBooking } from './create';
import { updateBookingStatus } from './update-booking-status';
import { listBookings } from './list-user-bookings';
import { FastifyTypedInstance } from '@/types';
import {
  createBookingBodySchema,
  listBookingsQuerySchema,
} from '@/schemas/bookings';
import { z } from 'zod';
import { sortSchema } from '@/schemas/booking-sort-schema';
import { listProfessionalBookings } from './list-professional-bookings';

export async function bookingsRoutes(app: FastifyTypedInstance) {
  app.post(
    '/bookings',
    {
      onRequest: [verifyJwt, verifyUserRole('CLIENTE')],
      schema: {
        tags: ['bookings'],
        description: 'Criação de um novo agendamento.',
        body: createBookingBodySchema,
        response: {
          201: z.null().describe('Agendamento criado com sucesso.'),
          400: z.object({ message: z.string() }).describe('Erro de validação'),
          404: z
            .object({ message: z.string() })
            .describe('Recurso não encontrado'),
          409: z
            .object({ message: z.string() })
            .describe('Conflito de horário'),
        },
      },
    },
    createBooking,
  );

  app.patch(
    '/bookings/:bookingId/status',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
      schema: {
        tags: ['bookings'],
        description:
          'Atualiza o status de um agendamento (apenas para profissionais)',
        params: z.object({
          bookingId: z.string().uuid().describe('ID do agendamento'),
        }),
        body: z.object({
          status: z.enum(['CONFIRMADO', 'CANCELADO']).describe('Novo status'),
          reason: z.string().optional().describe('Motivo do cancelamento'),
        }),
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }).describe('Bad Request'),
          403: z.object({ message: z.string() }).describe('Forbidden'),
          404: z.object({ message: z.string() }).describe('Not Found'),
        },
      },
    },
    updateBookingStatus,
  );

  app.get(
    '/bookings/me',
    {
      onRequest: [verifyJwt, verifyUserRole('CLIENTE')],
      schema: {
        tags: ['bookings'],
        description: 'Lista os agendamentos do usuário autenticado',
        querystring: listBookingsQuerySchema,
        response: {
          200: z.object({
            bookings: z.array(z.any()),
            total: z.number(),
          }),
          400: z.object({ message: z.string() }),
          403: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    listBookings,
  );

  app.get(
    '/bookings/professional',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
      schema: {
        tags: ['bookings'],
        description: 'Lista os agendamentos do profissional autenticado',
        querystring: z.object({
          page: z.number().int().positive().optional().default(1),
          limit: z.number().int().positive().optional().default(10),
          sort: z.array(sortSchema).optional(),
          status: z.string().optional(),
          startDate: z.string().datetime().optional(),
          endDate: z.string().datetime().optional(),
        }),
        response: {
          200: z.object({
            bookings: z.array(z.any()),
            total: z.number(),
            page: z.number(),
            limit: z.number(),
            totalPages: z.number(),
          }),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    listProfessionalBookings,
  );
}
