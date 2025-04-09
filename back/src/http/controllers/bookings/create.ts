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
    startDateTime: z.string().datetime({ offset: true }),
    notes: z.string().max(500).optional(),
  });

  try {
    const { professionalId, serviceId, startDateTime, notes } =
      createBookingBodySchema.parse(request.body);

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
      startDateTime: booking.dataHoraInicio,
      endDateTime: booking.dataHoraFim,
      status: booking.status,
    });
  } catch (err) {
    // Tratamento de erros mais robusto
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: err.errors,
      });
    }

    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: 'User not found' });
    }

    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: 'Professional not found' });
    }

    if (err instanceof ServiceNotFoundError) {
      return reply.status(404).send({ message: 'Service not found' });
    }

    if (err instanceof TimeSlotAlreadyBookedError) {
      return reply.status(409).send({ message: 'Time slot already booked' });
    }

    if (err instanceof InvalidDateTimeError) {
      return reply.status(400).send({ message: 'Invalid date/time' });
    }

    if (err instanceof InvalidDurationError) {
      return reply.status(400).send({ message: 'Invalid service duration' });
    }

    console.error('Booking creation error:', err);
    return reply.status(500).send({ message: 'Internal server error' });
  }
}
