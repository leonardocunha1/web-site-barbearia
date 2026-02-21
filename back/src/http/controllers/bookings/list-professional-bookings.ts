import { FastifyRequest, FastifyReply } from 'fastify';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { makeListProfessionalBookingsUseCase } from '@/use-cases/factories/make-list-professional-bookings-use-case';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { listBookingsQuerySchema } from '@/schemas/bookings';

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

export async function listProfessionalBookings(request: FastifyRequest, reply: FastifyReply) {
  const { page, limit, sortBy, sortDirection, startDate, endDate, status } = listBookingsQuerySchema.parse(
    request.query,
  );

  // Converter sortBy e sortDirection em formato de array que o use-case espera
  const sortCriteria: SortBookingSchema[] = sortBy
    ? [{ field: sortBy as 'startDateTime' | 'totalAmount', order: sortDirection || 'asc' }]
    : [{ field: 'startDateTime', order: 'asc' }];

  const filters = {
    ...(status && { status }),
    ...(startDate && { startDate: new Date(startDate) }),
    ...(endDate && { endDate: new Date(endDate) }),
  };

  let professionalId = request.user.professionalId;

  // Se não temos o professionalId no token, buscamos pelo userId
  if (!professionalId) {
    const professionalsRepository = new PrismaProfessionalsRepository();
    const professional = await professionalsRepository.findByUserId(request.user.sub);

    if (!professional) {
      return reply.status(404).send({ message: 'Profissional não encontrado' });
    }

    professionalId = professional.id;
  }

  const listProfessionalBookingsUseCase = makeListProfessionalBookingsUseCase();

  const result = await listProfessionalBookingsUseCase.execute({
    professionalId,
    page,
    limit,
    sort: sortCriteria,
    filters,
  });

  return reply.status(200).send(serializeBookingsResponse(result));
}
