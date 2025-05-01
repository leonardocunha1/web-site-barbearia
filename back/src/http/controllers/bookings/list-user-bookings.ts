import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { BookingNotFoundError } from '@/use-cases/errors/booking-not-found-error';
import { makeListUserBookingsUseCase } from '@/use-cases/factories/make-list-user-bookings-use-case';
import { paginationSchema } from '@/schemas/pagination-params';
import { formatZodError } from '@/utils/formatZodError';
import { SortBookingSchema, sortSchema } from '@/schemas/booking-sort-schema';

export async function listBookings(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listBookingsParamsSchema = paginationSchema.extend({
    userId: z.string().uuid(),
    sort: z.array(sortSchema).optional(),
  });

  try {
    const { userId, page, limit, sort } = listBookingsParamsSchema.parse(
      request.query,
    );

    const sortCriteria: SortBookingSchema[] = sort?.length
      ? sort
      : [{ field: 'dataHoraInicio', order: 'asc' }];

    const listBookingsUseCase = makeListUserBookingsUseCase();
    const result = await listBookingsUseCase.execute({
      userId,
      page,
      limit,
      sort: sortCriteria,
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
