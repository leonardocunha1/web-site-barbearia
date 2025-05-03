import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { makeListBusinessHoursUseCase } from '@/use-cases/factories/make-list-holiday-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { BusinessHoursNotFoundError } from '@/use-cases/errors/businnes-hours-not-found-error';
import { listBusinessHoursParamsSchema } from '@/schemas/horario-funcionamento';

export async function listBusinessHours(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { professionalId } = listBusinessHoursParamsSchema.parse(
    request.params,
  );

  try {
    const listBusinessHoursUseCase = makeListBusinessHoursUseCase();
    const businessHours = await listBusinessHoursUseCase.execute({
      professionalId,
    });

    return reply.status(200).send({ businessHours });
  } catch (err) {
    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof BusinessHoursNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
