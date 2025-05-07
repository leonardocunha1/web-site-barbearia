import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { formatZodError } from '@/utils/formatZodError';
import { assignBonusBodySchema } from '@/schemas/bonus';
import { makeAssignBonusUseCase } from '@/use-cases/factories/make-assign-bonus-use-case';
import { BookingNotFoundError } from '@/use-cases/errors/booking-not-found-error';
import { BonusAlreadyAssignedError } from '@/use-cases/errors/bonus-already-assigned-error';
import { InvalidBookingStatusError } from '@/use-cases/errors/invalid-booking-status-error';
import { InvalidBonusAssignmentError } from '@/use-cases/errors/invalid-bonus-assignment-error';

export async function assignBonus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { userId, bookingId, type, description } =
      assignBonusBodySchema.parse(request.body);

    const assignBonusUseCase = makeAssignBonusUseCase();

    await assignBonusUseCase.execute({
      userId,
      bookingId,
      type,
      description,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    if (
      err instanceof UserNotFoundError ||
      err instanceof BookingNotFoundError ||
      err instanceof BonusAlreadyAssignedError
    ) {
      return reply.status(404).send({ message: err.message });
    }

    if (
      err instanceof InvalidBookingStatusError ||
      err instanceof InvalidBonusAssignmentError
    ) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
