import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { makeDeleteServiceUseCase } from '@/use-cases/factories/make-delete-service-use-case';
import { formatZodError } from '@/utils/formatZodError';
import {
  deleteServiceQuerySchema,
  updateServiceParamsSchema,
} from '@/schemas/services';

export async function deleteService(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateServiceParamsSchema.parse(request.params);
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

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
