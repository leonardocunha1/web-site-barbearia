import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { InvalidBusinessHoursError } from '@/use-cases/errors/invalid-business-hours-error';
import { InvalidTimeFormatError } from '@/use-cases/errors/invalid-time-format-error';
import { makeUpdateBusinessHoursUseCase } from '@/use-cases/factories/make-update-business-hours-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { updateBusinessHoursBodySchema } from '@/schemas/horario-funcionamento';

export async function updateBusinessHours(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const professionalId = request.user.profissionalId!;
    const body = updateBusinessHoursBodySchema.parse(request.body);

    const updateBusinessHoursUseCase = makeUpdateBusinessHoursUseCase();

    await updateBusinessHoursUseCase.execute({
      professionalId,
      ...body,
    });

    return reply.status(200).send();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (
      err instanceof InvalidTimeFormatError ||
      err instanceof InvalidBusinessHoursError
    ) {
      return reply.status(422).send({ message: err.message });
    }

    throw err;
  }
}
