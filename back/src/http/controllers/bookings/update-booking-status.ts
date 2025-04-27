import { FastifyRequest, FastifyReply } from 'fastify';
import { BookingNotFoundError } from '@/use-cases/errors/booking-not-found-error';
import { InvalidBookingStatusError } from '@/use-cases/errors/invalid-booking-status-error';
import {
  updateBookingStatusBodySchema,
  updateBookingStatusParamsSchema,
} from '@/dtos/update-booking-status.dto';
import { BookingUpdateError } from '@/use-cases/errors/booking-update-error';
import { z } from 'zod';
import { makeUpdateBookingStatusUseCase } from '@/use-cases/factories/make-update-booking-status-use-case';

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

    const { booking } = await updateBookingStatusUseCase.execute({
      bookingId,
      status,
      reason,
    });

    return reply.status(200).send({
      message: `Agendamento ${status.toLowerCase()} com sucesso`,
      booking,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        errors: err.errors,
      });
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

    console.error('Booking status update error:', err);
    return reply.status(500).send({ message: 'Internal server error' });
  }
}
