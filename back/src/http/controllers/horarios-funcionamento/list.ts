import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { makeListBusinessHoursUseCase } from '@/use-cases/factories/make-list-holiday-use-case';

export async function listBusinessHours(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listBusinessHoursParamsSchema = z.object({
    professionalId: z.string().uuid(),
  });

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

    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        issues: err.format(),
      });
    }

    throw err;
  }
}
