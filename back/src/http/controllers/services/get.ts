import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { makeGetServiceUseCase } from '@/use-cases/factories/make-get-service-use-case';
import { formatZodError } from '@/utils/formatZodError';

export async function getService(request: FastifyRequest, reply: FastifyReply) {
  const getServiceParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = getServiceParamsSchema.parse(request.params);

  try {
    const getServiceUseCase = makeGetServiceUseCase();
    const { service } = await getServiceUseCase.execute({ id });

    return reply.status(200).send({
      service,
    });
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
