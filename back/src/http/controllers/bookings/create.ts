import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateBookingUseCase } from '@/use-cases/factories/make-create-booking-use-case';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { TimeSlotAlreadyBookedError } from '@/use-cases/errors/time-slot-already-booked-error';
import { InvalidDateTimeError } from '@/use-cases/errors/invalid-date-time-error';
import { InvalidDurationError } from '@/use-cases/errors/invalid-duration-error';
import { formatZodError } from '@/utils/formatZodError';
import { createBookingBodySchema } from '@/schemas/bookings';
import { InsufficientBonusPointsError } from '@/use-cases/errors/insufficient-bonus-points-error';
import { InvalidBonusRedemptionError } from '@/use-cases/errors/invalid-bonus-redemption-error';

export async function createBooking(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { professionalId, services, startDateTime, notes, useBonusPoints } =
      createBookingBodySchema.parse(request.body);

    const createBookingUseCase = makeCreateBookingUseCase();

    await createBookingUseCase.execute({
      userId: request.user.sub,
      professionalId,
      services,
      startDateTime: new Date(startDateTime),
      notes,
      useBonusPoints,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof ServiceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof TimeSlotAlreadyBookedError) {
      return reply.status(409).send({ message: err.message });
    }

    if (err instanceof InvalidDateTimeError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof InvalidDurationError) {
      return reply.status(400).send({ message: err.message });
    }
    if (err instanceof InsufficientBonusPointsError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof InvalidBonusRedemptionError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
