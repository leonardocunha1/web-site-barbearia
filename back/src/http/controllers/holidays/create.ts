import { FastifyRequest, FastifyReply } from 'fastify';
import { makeCreateHolidayUseCase } from '@/use-cases/factories/make-create-holiday-use-case';
import { createHolidayBodySchema } from '@/schemas/holidays';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';

export async function createHoliday(request: FastifyRequest, reply: FastifyReply) {
  const { date, reason } = createHolidayBodySchema.parse(request.body);

  let professionalId = request.user.professionalId;
  if (!professionalId) {
    const professionalsRepository = new PrismaProfessionalsRepository();
    const professional = await professionalsRepository.findByUserId(request.user.sub);

    if (!professional) {
      return reply.status(404).send({ message: 'Profissional não encontrado' });
    }

    professionalId = professional.id;
  }

  const createHolidayUseCase = makeCreateHolidayUseCase();

  await createHolidayUseCase.execute({
    professionalId,
    date: new Date(date),
    reason,
  });

  return reply.status(201).send();
}
