import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { paginationSchema } from '@/validators/pagination-params';
import { makeListHolidaysUseCase } from '@/use-cases/factories/make-list-holidays-use-case';

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
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        issues: err.format(),
      });
    }

    throw err;
  }
}
