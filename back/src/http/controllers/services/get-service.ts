import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { makeGetServiceUseCase } from '@/use-cases/factories/make-get-service-use-case';

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

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
