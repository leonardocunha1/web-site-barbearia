import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { BusinessHoursNotFoundError } from '@/use-cases/errors/businnes-hours-not-found-error';
import { makeDeleteBusinessHoursUseCase } from '@/use-cases/factories/make-delete-businnes-hours-use-case';
import { deleteBusinessHoursParamsSchema } from '@/schemas/horario-funcionamento';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '@/use-cases/errors/profissional-pegando-informacao-de-outro-usuario-error';
import { formatZodError } from '@/utils/formatZodError';

export async function deleteBusinessHours(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { businessHoursId } = deleteBusinessHoursParamsSchema.parse(
      request.params,
    );
    const professionalId = request.user.profissionalId!;

    const deleteUseCase = makeDeleteBusinessHoursUseCase();

    await deleteUseCase.execute({ businessHoursId, professionalId });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof BusinessHoursNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof ProfissionalTentandoPegarInformacoesDeOutro) {
      return reply.status(403).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
