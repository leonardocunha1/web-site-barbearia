import { FastifyRequest, FastifyReply } from 'fastify';
import { paginationSchema } from '@/schemas/pagination';
import { makeListHolidaysUseCase } from '@/use-cases/factories/make-list-holidays-use-case';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';

export async function listHolidays(request: FastifyRequest, reply: FastifyReply) {
  const { page, limit } = paginationSchema.parse(request.query);

  let professionalId = request.user.professionalId;
  if (!professionalId) {
    const professionalsRepository = new PrismaProfessionalsRepository();
    const professional = await professionalsRepository.findByUserId(request.user.sub);

    if (!professional) {
      return reply.status(404).send({ message: 'Profissional não encontrado' });
    }

    professionalId = professional.id;
  }

  const listHolidaysUseCase = makeListHolidaysUseCase();
  const result = await listHolidaysUseCase.execute({
    professionalId,
    page,
    limit,
  });

  // Converter objetos Date para strings ISO 8601
  const formattedResult = {
    ...result,
    holidays: result.holidays.map((holiday) => ({
      ...holiday,
      date: holiday.date.toISOString(),
    })),
  };

  return reply.status(200).send(formattedResult);
}
