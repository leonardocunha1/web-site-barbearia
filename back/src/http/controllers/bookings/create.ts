import { FastifyReply, FastifyRequest } from 'fastify';
import { makeCreateBookingUseCase } from '@/use-cases/factories/make-create-booking-use-case';
import { createBookingBodySchema } from '@/schemas/bookings';

export async function createBooking(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const {
    professionalId,
    services,
    startDateTime,
    notes,
    useBonusPoints,
    couponCode,
  } = createBookingBodySchema.parse(request.body);

  const createBookingUseCase = makeCreateBookingUseCase();

  await createBookingUseCase.execute({
    userId: request.user.sub,
    professionalId,
    services,
    startDateTime: new Date(startDateTime),
    notes,
    useBonusPoints,
    couponCode,
  });

  return reply.status(201).send();
}
