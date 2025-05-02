import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { BookingNotFoundError } from '@/use-cases/errors/booking-not-found-error';
import { formatZodError } from '@/utils/formatZodError';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { makeListProfessionalBookingsUseCase } from '@/use-cases/factories/make-list-professional-bookings-use-case';
import { listBookingsQuerySchema } from '@/schemas/bookings';

export async function listProfessionalBookings(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { page, limit, sort, startDate, endDate, status } =
      listBookingsQuerySchema.parse(request.query);

    const sortCriteria: SortBookingSchema[] = sort?.length
      ? sort
      : [{ field: 'dataHoraInicio', order: 'asc' }];

    const filters = {
      ...(status && { status }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    };

    const listProfessionalBookingsUseCase =
      makeListProfessionalBookingsUseCase();

    const result = await listProfessionalBookingsUseCase.execute({
      professionalId: request.user.profissionalId!,
      page,
      limit,
      sort: sortCriteria,
      filters,
    });

    return reply.status(200).send(result);
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
