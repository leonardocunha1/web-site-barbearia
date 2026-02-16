import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListUserBookingsUseCase } from '@/use-cases/factories/make-list-user-bookings-use-case';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { listUserBookingsQuerySchema } from '@/schemas/bookings';

// Helper to convert Date objects to ISO strings for Zod validation
function serializeBookingsResponse(data: any) {
  return {
    ...data,
    bookings: data.bookings.map((booking: any) => ({
      ...booking,
      startDateTime:
        booking.startDateTime instanceof Date
          ? booking.startDateTime.toISOString()
          : booking.startDateTime,
      endDateTime:
        booking.endDateTime instanceof Date
          ? booking.endDateTime.toISOString()
          : booking.endDateTime,
      canceledAt:
        booking.canceledAt instanceof Date ? booking.canceledAt.toISOString() : booking.canceledAt,
      confirmedAt:
        booking.confirmedAt instanceof Date
          ? booking.confirmedAt.toISOString()
          : booking.confirmedAt,
      createdAt:
        booking.createdAt instanceof Date ? booking.createdAt.toISOString() : booking.createdAt,
      updatedAt:
        booking.updatedAt instanceof Date ? booking.updatedAt.toISOString() : booking.updatedAt,
    })),
  };
}

export async function listUserBookings(request: FastifyRequest, reply: FastifyReply) {
  const { page, limit, sort, startDate, endDate, status } = listUserBookingsQuerySchema.parse(
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

  return reply.status(200).send(serializeBookingsResponse(result));
}
