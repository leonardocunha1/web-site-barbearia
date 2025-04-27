import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createBooking } from './create';
import { updateBookingStatus } from './update-booking-status';
import { listBookings } from './list-user-bookings';

export async function bookingsRoutes(app: FastifyInstance) {
  app.post(
    '/bookings',
    {
      onRequest: [verifyJwt, verifyUserRole('CLIENTE')],
    },
    createBooking,
  );

  app.patch(
    '/:bookingId/status',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
    },
    updateBookingStatus,
  );

  app.get(
    '/user-bookings',
    {
      onRequest: [verifyJwt, verifyUserRole('CLIENTE')],
    },
    listBookings,
  );
}
