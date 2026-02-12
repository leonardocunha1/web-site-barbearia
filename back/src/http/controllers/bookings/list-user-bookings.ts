import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListUserBookingsUseCase } from '@/use-cases/factories/make-list-user-bookings-use-case';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { listBookingsQuerySchema } from '@/schemas/bookings';

export async function listUserBookings(request: FastifyRequest, reply: FastifyReply) {
  const { page, limit, sort, startDate, endDate, status } = listBookingsQuerySchema.parse(
    request.query,
  );

  const sortCriteria: SortBookingSchema[] = sort?.length
    ? sort
    : [{ field: 'startDateTime', order: 'asc' }];

  const filters = {
    ...(status && { status }),
    ...(startDate && { startDate: new Date(startDate) }),
    ...(endDate && { endDate: new Date(endDate) }),
  };

  const listBookingsUseCase = makeListUserBookingsUseCase();

  const result = await listBookingsUseCase.execute({
    userId: request.user.sub,
    page,
    limit,
    sort: sortCriteria,
    filters,
  });

  return reply.status(200).send(result);
}
