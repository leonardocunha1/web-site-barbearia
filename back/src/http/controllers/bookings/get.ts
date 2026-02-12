import { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetBookingUseCase } from '@/use-cases/factories/make-get-booking-use-case';
import { getOrUpdateBookingStatusParamsSchema } from '@/schemas/bookings';

export async function getBooking(request: FastifyRequest, reply: FastifyReply) {
  const { bookingId } = getOrUpdateBookingStatusParamsSchema.parse(
    request.params,
  );

  const getBookingUseCase = makeGetBookingUseCase();
  const { booking } = await getBookingUseCase.execute({ bookingId });

  return reply.status(200).send({ booking });
}
