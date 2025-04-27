import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { makeToggleServiceStatusUseCase } from '@/use-cases/factories/make-toggle-service-status-use-case';

export async function toggleServiceStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const toggleServiceStatusParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = toggleServiceStatusParamsSchema.parse(request.params);

  try {
    const toggleServiceStatusUseCase = makeToggleServiceStatusUseCase();
    const { service } = await toggleServiceStatusUseCase.execute({ id });

    return reply.status(200).send({
      service: {
        id: service.id,
        nome: service.nome,
        ativo: service.ativo,
      },
    });
  } catch (err) {
    if (err instanceof ServiceNotFoundError) {
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
