import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createBooking } from './create';
import { updateBookingStatus } from './toggle-status';
import { listUserBookings } from './list-user-bookings';
import { FastifyTypedInstance } from '@/types';
import {
  bookingSchema,
  createBookingBodySchema,
  getOrUpdateBookingStatusParamsSchema,
  listBookingsQuerySchema,
  paginatedBookingResponseSchema,
  updateBookingStatusBodySchema,
} from '@/schemas/bookings';
import { z } from 'zod';
import { listProfessionalBookings } from './list-professional-bookings';
import { getBooking } from './get';

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
        params: getOrUpdateBookingStatusParamsSchema,
        body: updateBookingStatusBodySchema,
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
          200: paginatedBookingResponseSchema,
          400: z.object({ message: z.string() }),
          403: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    listUserBookings,
  );

  app.get(
    '/bookings/professional',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
      schema: {
        tags: ['bookings'],
        description: 'Lista os agendamentos do profissional autenticado',
        querystring: listBookingsQuerySchema,
        response: {
          200: paginatedBookingResponseSchema,
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    listProfessionalBookings,
  );

  app.get(
    '/bookings/:bookingId',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['bookings'],
        description: 'Busca os detalhes de um agendamento pelo ID.',
        params: getOrUpdateBookingStatusParamsSchema,
        response: {
          200: z.object({
            booking: bookingSchema,
          }),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    getBooking,
  );
}
