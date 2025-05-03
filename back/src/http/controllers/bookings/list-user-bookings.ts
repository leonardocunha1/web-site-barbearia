import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { BookingNotFoundError } from '@/use-cases/errors/booking-not-found-error';
import { makeListUserBookingsUseCase } from '@/use-cases/factories/make-list-user-bookings-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { listBookingsQuerySchema } from '@/schemas/bookings';
import { UsuarioTentandoPegarInformacoesDeOutro } from '@/use-cases/errors/usuario-pegando-informacao-de-outro-usuario-error';
import { InvalidPageError } from '@/use-cases/errors/invalid-page-error';
import { InvalidLimitError } from '@/use-cases/errors/invalid-limit-error';
import { InvalidPageRangeError } from '@/use-cases/errors/invalid-page-range-error';

export async function listUserBookings(
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

    const listBookingsUseCase = makeListUserBookingsUseCase();

    const result = await listBookingsUseCase.execute({
      userId: request.user.sub,
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

    if (err instanceof UsuarioTentandoPegarInformacoesDeOutro) {
      return reply.status(403).send({ message: err.message });
    }

    if (err instanceof InvalidPageError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof InvalidLimitError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof InvalidPageRangeError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
