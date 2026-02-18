import { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetBookingUseCase } from '@/use-cases/factories/make-get-booking-use-case';
import { getOrUpdateBookingStatusParamsSchema } from '@/schemas/bookings';

// Helper to convert Date objects to ISO strings for Zod validation
function serializeBooking(booking: any) {
  return {
    ...booking,
    startDateTime: booking.startDateTime instanceof Date ? booking.startDateTime.toISOString() : booking.startDateTime,
    endDateTime: booking.endDateTime instanceof Date ? booking.endDateTime.toISOString() : booking.endDateTime,
    canceledAt: booking.canceledAt instanceof Date ? booking.canceledAt.toISOString() : booking.canceledAt,
    confirmedAt: booking.confirmedAt instanceof Date ? booking.confirmedAt.toISOString() : booking.confirmedAt,
    createdAt: booking.createdAt instanceof Date ? booking.createdAt.toISOString() : booking.createdAt,
    updatedAt: booking.updatedAt instanceof Date ? booking.updatedAt.toISOString() : booking.updatedAt,
  };
}

export async function getBooking(request: FastifyRequest, reply: FastifyReply) {
  const { bookingId } = getOrUpdateBookingStatusParamsSchema.parse(request.params);

  const getBookingUseCase = makeGetBookingUseCase();
  const { booking } = await getBookingUseCase.execute({ bookingId });

  return reply.status(200).send({ booking: serializeBooking(booking) });
}
