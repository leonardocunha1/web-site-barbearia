import { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetProfessionalScheduleUseCase } from '@/use-cases/factories/make-schedule-use-case';
import { getPublicScheduleQuerySchema } from '@/dtos/schedule-dto';
import { z } from 'zod';

const getPublicScheduleParamsSchema = z.object({
  professionalId: z.string().uuid(),
});

export async function getPublicSchedule(request: FastifyRequest, reply: FastifyReply) {
  const { professionalId } = getPublicScheduleParamsSchema.parse(request.params);
  const { date, serviceIds } = getPublicScheduleQuerySchema.parse(request.query);

  const getProfessionalScheduleUseCase = makeGetProfessionalScheduleUseCase();
  const schedule = await getProfessionalScheduleUseCase.execute({
    professionalId,
    date,
    serviceIds: serviceIds || [],
  });

  return reply.status(200).send(schedule);
}
