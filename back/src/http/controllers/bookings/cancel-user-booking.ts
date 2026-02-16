import { FastifyRequest, FastifyReply } from 'fastify';
import { cancelBookingBodySchema, getOrUpdateBookingStatusParamsSchema } from '@/schemas/bookings';
import { makeCancelUserBookingUseCase } from '@/use-cases/factories/make-cancel-user-booking-use-case';

export async function cancelUserBooking(request: FastifyRequest, reply: FastifyReply) {
  const { bookingId } = getOrUpdateBookingStatusParamsSchema.parse(request.params);
  const { reason } = cancelBookingBodySchema.parse(request.body ?? {});

  const cancelUserBookingUseCase = makeCancelUserBookingUseCase();

  await cancelUserBookingUseCase.execute({
    bookingId,
    userId: request.user.sub,
    reason,
  });

  return reply.status(200).send({
    message: 'Agendamento cancelado com sucesso',
  });
}
