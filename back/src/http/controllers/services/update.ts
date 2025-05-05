import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { makeUpdateServiceUseCase } from '@/use-cases/factories/make-update-service-use-case';
import { formatZodError } from '@/utils/formatZodError';
import {
  updateServiceBodySchema,
  updateServiceParamsSchema,
} from '@/schemas/services';

export async function updateService(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateServiceParamsSchema.parse(request.params);
  const data = updateServiceBodySchema.parse(request.body);

  try {
    const updateServiceUseCase = makeUpdateServiceUseCase();
    await updateServiceUseCase.execute({ id, data });

    return reply.status(200).send();
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
