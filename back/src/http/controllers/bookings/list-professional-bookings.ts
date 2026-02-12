import { FastifyRequest, FastifyReply } from 'fastify';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { makeListProfessionalBookingsUseCase } from '@/use-cases/factories/make-list-professional-bookings-use-case';
import { listBookingsQuerySchema } from '@/schemas/bookings';

export async function listProfessionalBookings(request: FastifyRequest, reply: FastifyReply) {
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

  const listProfessionalBookingsUseCase = makeListProfessionalBookingsUseCase();

  const result = await listProfessionalBookingsUseCase.execute({
    professionalId: request.user.professionalId!,
    page,
    limit,
    sort: sortCriteria,
    filters,
  });

  return reply.status(200).send(result);
}
