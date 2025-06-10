import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { InvalidTimeFormatError } from '@/use-cases/errors/invalid-time-format-error';
import { InvalidBusinessHoursError } from '@/use-cases/errors/invalid-business-hours-error';
import { DuplicateBusinessHoursError } from '@/use-cases/errors/duplicate-business-hours-error';
import { makeCreateBusinessHoursUseCase } from '@/use-cases/factories/make-create-business-hours-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { createBusinessHoursBodySchema } from '@/schemas/horario-funcionamento';

export async function createBusinessHours(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const {
      professionalId,
      diaSemana,
      abreAs,
      fechaAs,
      pausaInicio,
      pausaFim,
    } = createBusinessHoursBodySchema.parse(request.body);

    const createBusinessHoursUseCase = makeCreateBusinessHoursUseCase();

    await createBusinessHoursUseCase.execute({
      professionalId,
      diaSemana,
      abreAs,
      fechaAs,
      pausaInicio,
      pausaFim,
    });

    return reply.status(201).send();
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

    if (err instanceof DuplicateBusinessHoursError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
