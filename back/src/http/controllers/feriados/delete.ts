import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { HolidayNotFoundError } from '@/use-cases/errors/holiday-not-found-error';
import { PastHolidayDeletionError } from '@/use-cases/errors/past-holiday-deletion-error';
import { makeDeleteHolidayUseCase } from '@/use-cases/factories/make-delete-holiday-use-case';
import { formatZodError } from '@/utils/formatZodError';

export async function deleteHoliday(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteHolidayParamsSchema = z.object({
    holidayId: z.string(),
    professionalId: z.string(),
  });

  const { holidayId, professionalId } = deleteHolidayParamsSchema.parse(
    request.params,
  );

  try {
    const deleteHolidayUseCase = makeDeleteHolidayUseCase();

    await deleteHolidayUseCase.execute({
      holidayId,
      professionalId,
    });

    return reply.status(204).send(); // 204 sem conteúdo após deletar
  } catch (err) {
    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof HolidayNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof PastHolidayDeletionError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
