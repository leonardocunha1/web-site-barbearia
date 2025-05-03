import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { paginationSchema } from '@/schemas/pagination';
import { makeListHolidaysUseCase } from '@/use-cases/factories/make-list-holidays-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { InvalidPageError } from '@/use-cases/errors/invalid-page-error';
import { InvalidLimitError } from '@/use-cases/errors/invalid-limit-error';
import { InvalidPageRangeError } from '@/use-cases/errors/invalid-page-range-error';
import { HolidayNotFoundError } from '@/use-cases/errors/holiday-not-found-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '@/use-cases/errors/profissional-pegando-informacao-de-outro-usuario-error';

export async function listHolidays(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page, limit } = paginationSchema.parse(request.query);

  try {
    const listHolidaysUseCase = makeListHolidaysUseCase();
    const result = await listHolidaysUseCase.execute({
      professionalId: request.user.profissionalId!,
      page,
      limit,
    });

    return reply.status(200).send(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    if (err instanceof InvalidPageError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof InvalidLimitError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof InvalidPageRangeError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof HolidayNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof ProfissionalTentandoPegarInformacoesDeOutro) {
      return reply.status(403).send({
        message: err.message,
      });
    }

    // Caso seja um erro desconhecido, relança
    throw err;
  }
}
