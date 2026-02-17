import { FastifyRequest, FastifyReply } from 'fastify';
import { makeDeleteHolidayUseCase } from '@/use-cases/factories/make-delete-holiday-use-case';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';

export async function deleteHoliday(request: FastifyRequest, reply: FastifyReply) {
  const deleteHolidayParamsSchema = z.object({
    holidayId: z.string(),
  });

  const { holidayId } = deleteHolidayParamsSchema.parse(request.params);

  let professionalId = request.user.professionalId;
  if (!professionalId) {
    const professionalsRepository = new PrismaProfessionalsRepository();
    const professional = await professionalsRepository.findByUserId(request.user.sub);

    if (!professional) {
      return reply.status(404).send({ message: 'Profissional não encontrado' });
    }

    professionalId = professional.id;
  }

  const deleteHolidayUseCase = makeDeleteHolidayUseCase();

  await deleteHolidayUseCase.execute({
    holidayId,
    professionalId,
  });

  return reply.status(204).send();
}
