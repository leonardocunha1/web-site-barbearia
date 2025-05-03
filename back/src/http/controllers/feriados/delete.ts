import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { HolidayNotFoundError } from '@/use-cases/errors/holiday-not-found-error';
import { PastHolidayDeletionError } from '@/use-cases/errors/past-holiday-deletion-error';
import { makeDeleteHolidayUseCase } from '@/use-cases/factories/make-delete-holiday-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '@/use-cases/errors/profissional-pegando-informacao-de-outro-usuario-error';

export async function deleteHoliday(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteHolidayParamsSchema = z.object({
    holidayId: z.string(),
  });

  const { holidayId } = deleteHolidayParamsSchema.parse(request.params);

  try {
    const deleteHolidayUseCase = makeDeleteHolidayUseCase();

    await deleteHolidayUseCase.execute({
      holidayId,
      professionalId: request.user.profissionalId!,
    });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof HolidayNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof ProfissionalTentandoPegarInformacoesDeOutro) {
      return reply.status(403).send({ message: err.message });
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
