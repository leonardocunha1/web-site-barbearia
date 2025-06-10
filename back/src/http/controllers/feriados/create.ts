import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { PastDateError } from '@/use-cases/errors/past-date-error';
import { InvalidHolidayDescriptionError } from '@/use-cases/errors/invalid-holiday-description-error';
import { DuplicateHolidayError } from '@/use-cases/errors/duplicate-holiday-error';
import { makeCreateHolidayUseCase } from '@/use-cases/factories/make-create-holiday-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { createHolidayBodySchema } from '@/schemas/holidays';

export async function createHoliday(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { date, motivo } = createHolidayBodySchema.parse(request.body);

    const createHolidayUseCase = makeCreateHolidayUseCase();

    await createHolidayUseCase.execute({
      professionalId: request.user.profissionalId!,
      date: new Date(date),
      motivo,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof PastDateError) {
      return reply.status(422).send({ message: err.message });
    }

    if (err instanceof InvalidHolidayDescriptionError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof DuplicateHolidayError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
