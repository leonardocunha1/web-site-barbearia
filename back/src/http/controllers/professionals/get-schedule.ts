import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { getScheduleQuerySchema } from '@/dtos/schedule-dto';
import { makeGetProfessionalScheduleUseCase } from '@/use-cases/factories/make-schedule-use-case';

export async function getSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { professionalId, date } = getScheduleQuerySchema.parse(
      request.query,
    );

    const getProfessionalScheduleUseCase = makeGetProfessionalScheduleUseCase();
    const schedule = await getProfessionalScheduleUseCase.execute({
      professionalId,
      date,
    });

    return reply.status(200).send(schedule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        issues: error.format(),
      });
    }

    if (error instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
