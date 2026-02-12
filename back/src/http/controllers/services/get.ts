import { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetServiceUseCase } from '@/use-cases/factories/make-get-service-use-case';
import { updateServiceParamsSchema } from '@/schemas/services';

export async function getService(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateServiceParamsSchema.parse(request.params);

  const getServiceUseCase = makeGetServiceUseCase();
  const { service } = await getServiceUseCase.execute({ id });

  return reply.status(200).send({
    service,
  });
}
