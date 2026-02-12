import { FastifyRequest, FastifyReply } from 'fastify';
import { getScheduleQuerySchema } from '@/dtos/schedule-dto';
import { makeGetProfessionalScheduleUseCase } from '@/use-cases/factories/make-schedule-use-case';

export async function getSchedule(request: FastifyRequest, reply: FastifyReply) {
  const { date } = getScheduleQuerySchema.parse(request.query);

  const getProfessionalScheduleUseCase = makeGetProfessionalScheduleUseCase();
  const schedule = await getProfessionalScheduleUseCase.execute({
    professionalId: request.user.professionalId!,
    date,
  });

  return reply.status(200).send(schedule);
}
