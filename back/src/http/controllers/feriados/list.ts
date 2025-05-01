import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { paginationSchema } from '@/schemas/pagination-params';
import { makeListHolidaysUseCase } from '@/use-cases/factories/make-list-holidays-use-case';
import { formatZodError } from '@/utils/formatZodError';

export async function listHolidays(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listHolidaysParamsSchema = paginationSchema.extend({
    professionalId: z.string().uuid(),
  });

  const { professionalId, page, limit } = listHolidaysParamsSchema.parse(
    request.query,
  );

  try {
    const listHolidaysUseCase = makeListHolidaysUseCase();
    const result = await listHolidaysUseCase.execute({
      professionalId,
      page,
      limit,
    });

    return reply.status(200).send(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
