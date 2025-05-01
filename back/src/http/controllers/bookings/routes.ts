import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createBooking } from './create';
import { updateBookingStatus } from './update-booking-status';
import { listBookings } from './list-user-bookings';
import { FastifyTypedInstance } from '@/types';
import { createBookingSchema } from '@/schemas/bookings';
import { z } from 'zod';

export async function bookingsRoutes(app: FastifyTypedInstance) {
  app.post(
    '/bookings',
    {
      onRequest: [verifyJwt, verifyUserRole('CLIENTE')],
      schema: {
        tags: ['bookings'],
        description: 'Criação de um novo agendamento.',
        body: createBookingSchema,
        response: {
          201: z.null().describe('Agendamento criado com sucesso.'),
          400: z
            .object({
              message: z.string(),
            })
            .describe('Erro de validação dos dados de entrada'),
          404: z
            .object({
              message: z.string(),
            })
            .describe('Usuário, profissional ou serviço não encontrado'),
          409: z
            .object({
              message: z.string(),
            })
            .describe('Horário já reservado'),
        },
      },
    },
    createBooking,
  );

  app.patch(
    '/bookings/:bookingId/status',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
    },
    updateBookingStatus,
  );

  app.get(
    '/bookings/me',
    {
      onRequest: [verifyJwt, verifyUserRole('CLIENTE')],
    },
    listBookings,
  );
}
