import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { PastDateError } from '@/use-cases/errors/past-date-error';
import { InvalidHolidayDescriptionError } from '@/use-cases/errors/invalid-holiday-description-error';
import { DuplicateHolidayError } from '@/use-cases/errors/duplicate-holiday-error';
import { makeCreateHolidayUseCase } from '@/use-cases/factories/make-create-holiday-use-case';

export async function createHoliday(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createHolidayBodySchema = z.object({
    professionalId: z.string(),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Data inválida',
    }),
    motivo: z.string().min(3).max(100),
  });

  const { professionalId, date, motivo } = createHolidayBodySchema.parse(
    request.body,
  );

  try {
    const createHolidayUseCase = makeCreateHolidayUseCase();

    await createHolidayUseCase.execute({
      professionalId,
      date: new Date(date),
      motivo,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof PastDateError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof InvalidHolidayDescriptionError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof DuplicateHolidayError) {
      return reply.status(409).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        issues: err.format(),
      });
    }

    throw err;
  }
}
