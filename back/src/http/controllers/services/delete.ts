import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { makeDeleteServiceUseCase } from '@/use-cases/factories/make-delete-service-use-case';

export async function deleteService(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteServiceParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const deleteServiceQuerySchema = z.object({
    permanent: z.coerce.boolean().default(false),
  });

  const { id } = deleteServiceParamsSchema.parse(request.params);
  const { permanent } = deleteServiceQuerySchema.parse(request.query);

  try {
    const deleteServiceUseCase = makeDeleteServiceUseCase();

    if (permanent) {
      await deleteServiceUseCase.executePermanent(id);
    } else {
      await deleteServiceUseCase.executeSoft(id);
    }

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ServiceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
