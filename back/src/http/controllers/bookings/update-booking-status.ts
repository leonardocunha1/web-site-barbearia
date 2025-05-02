import { FastifyRequest, FastifyReply } from 'fastify';
import { BookingNotFoundError } from '@/use-cases/errors/booking-not-found-error';
import { InvalidBookingStatusError } from '@/use-cases/errors/invalid-booking-status-error';
import {
  updateBookingStatusBodySchema,
  updateBookingStatusParamsSchema,
} from '@/dtos/atualizar-status-reserva.dto';
import { BookingUpdateError } from '@/use-cases/errors/booking-update-error';
import { z } from 'zod';
import { makeUpdateBookingStatusUseCase } from '@/use-cases/factories/make-update-booking-status-use-case';
import { formatZodError } from '@/utils/formatZodError';

export async function updateBookingStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { bookingId } = updateBookingStatusParamsSchema.parse(request.params);
    const { status, reason } = updateBookingStatusBodySchema.parse(
      request.body,
    );

    const updateBookingStatusUseCase = makeUpdateBookingStatusUseCase();

    await updateBookingStatusUseCase.execute({
      bookingId,
      status,
      reason,
      profissionalId: request.user.profissionalId as string,
    });

    return reply.status(200).send({
      message: `Agendamento ${status.toLowerCase()} com sucesso`,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    if (err instanceof BookingNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (
      err instanceof InvalidBookingStatusError ||
      err instanceof BookingUpdateError
    ) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
