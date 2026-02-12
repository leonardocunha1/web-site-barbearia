import { FastifyRequest, FastifyReply } from 'fastify';
import { makeCreateHolidayUseCase } from '@/use-cases/factories/make-create-holiday-use-case';
import { createHolidayBodySchema } from '@/schemas/holidays';

export async function createHoliday(request: FastifyRequest, reply: FastifyReply) {
  const { date, motivo } = createHolidayBodySchema.parse(request.body);

  const createHolidayUseCase = makeCreateHolidayUseCase();

  await createHolidayUseCase.execute({
    professionalId: request.user.professionalId!,
    date: new Date(date),
    motivo,
  });

  return reply.status(201).send();
}
