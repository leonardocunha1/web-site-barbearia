import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createBooking } from './create';

export async function bookingsRoutes(app: FastifyInstance) {
  app.post(
    '/bookings',
    {
      onRequest: [verifyJwt, verifyUserRole('CLIENTE')],
    },
    createBooking,
  );
}
