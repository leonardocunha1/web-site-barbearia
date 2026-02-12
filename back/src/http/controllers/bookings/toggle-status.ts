import { FastifyRequest, FastifyReply } from 'fastify';
import { makeUpdateBookingStatusUseCase } from '@/use-cases/factories/make-update-booking-status-use-case';
import {
  getOrUpdateBookingStatusParamsSchema,
  updateBookingStatusBodySchema,
} from '@/schemas/bookings';

export async function updateBookingStatus(request: FastifyRequest, reply: FastifyReply) {
  const { bookingId } = getOrUpdateBookingStatusParamsSchema.parse(request.params);
  const { status, reason } = updateBookingStatusBodySchema.parse(request.body);

  const updateBookingStatusUseCase = makeUpdateBookingStatusUseCase();

  await updateBookingStatusUseCase.execute({
    bookingId,
    status,
    reason,
    professionalId: request.user.professionalId as string,
  });

  return reply.status(200).send({
    message: `Agendamento ${status.toLowerCase()} com sucesso`,
  });
}
