import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { BookingNotFoundError } from '@/use-cases/errors/booking-not-found-error';
import { makeListUserBookingsUseCase } from '@/use-cases/factories/make-list-user-bookings-use-case';
import { paginationSchema } from '@/validators/pagination-params';

export async function listBookings(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listBookingsParamsSchema = paginationSchema.extend({
    userId: z.string().uuid(),
  });

  const { userId, page, limit } = listBookingsParamsSchema.parse(request.query);

  try {
    const listBookingsUseCase = makeListUserBookingsUseCase();
    const result = await listBookingsUseCase.execute({
      userId,
      page,
      limit,
    });

    return reply.status(200).send(result);
  } catch (err) {
    if (err instanceof BookingNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        issues: err.format(),
      });
    }

    throw err;
  }
}
