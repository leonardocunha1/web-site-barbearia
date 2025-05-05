import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { getScheduleQuerySchema } from '@/dtos/schedule-dto';
import { makeGetProfessionalScheduleUseCase } from '@/use-cases/factories/make-schedule-use-case';
import { formatZodError } from '@/utils/formatZodError';

export async function getSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { date } = getScheduleQuerySchema.parse(request.query);

    const getProfessionalScheduleUseCase = makeGetProfessionalScheduleUseCase();
    const schedule = await getProfessionalScheduleUseCase.execute({
      professionalId: request.user.profissionalId!,
      date,
    });

    return reply.status(200).send(schedule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(error));
    }

    if (error instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
