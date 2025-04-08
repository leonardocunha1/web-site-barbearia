import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateBookingUseCase } from '@/use-cases/factories/make-create-booking-use-case';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { TimeSlotAlreadyBookedError } from '@/use-cases/errors/time-slot-already-booked-error';
import { InvalidDateTimeError } from '@/use-cases/errors/invalid-date-time-error';
import { InvalidDurationError } from '@/use-cases/errors/invalid-duration-error';

export async function createBooking(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBookingBodySchema = z.object({
    professionalId: z.string().uuid(),
    serviceId: z.string().uuid(),
    startDateTime: z.string().datetime(),
    notes: z.string().optional(),
  });

  const { professionalId, serviceId, startDateTime, notes } =
    createBookingBodySchema.parse(request.body);

  try {
    const createBookingUseCase = makeCreateBookingUseCase();

    const { booking } = await createBookingUseCase.execute({
      userId: request.user.sub,
      professionalId,
      serviceId,
      startDateTime: new Date(startDateTime),
      notes,
    });

    return reply.status(201).send({
      bookingId: booking.id,
    });
  } catch (err) {
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

    if (
      err instanceof InvalidDateTimeError ||
      err instanceof InvalidDurationError
    ) {
      return reply.status(400).send({ message: err.message });
    }

    // Log do erro para debug
    console.error('Error creating booking:', err);
    return reply.status(500).send({ message: 'Internal server error' });
  }
}
