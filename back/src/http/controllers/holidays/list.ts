import { FastifyRequest, FastifyReply } from 'fastify';
import { paginationSchema } from '@/schemas/pagination';
import { makeListHolidaysUseCase } from '@/use-cases/factories/make-list-holidays-use-case';

export async function listHolidays(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page, limit } = paginationSchema.parse(request.query);

  const listHolidaysUseCase = makeListHolidaysUseCase();
  const result = await listHolidaysUseCase.execute({
    professionalId: request.user.professionalId!,
    page,
    limit,
  });

  return reply.status(200).send(result);
}
