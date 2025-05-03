import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { BookingNotFoundError } from '@/use-cases/errors/booking-not-found-error';
import { formatZodError } from '@/utils/formatZodError';
import { makeGetBookingUseCase } from '@/use-cases/factories/make-get-booking-use-case';
import { getOrUpdateBookingStatusParamsSchema } from '@/schemas/bookings';

export async function getBooking(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { bookingId } = getOrUpdateBookingStatusParamsSchema.parse(
      request.params,
    );

    const getBookingUseCase = makeGetBookingUseCase();
    const { booking } = await getBookingUseCase.execute({ bookingId });

    return reply.status(200).send({ booking });
  } catch (err) {
    if (err instanceof BookingNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
