import { FastifyRequest, FastifyReply } from 'fastify';
import { makeUpdateServiceUseCase } from '@/use-cases/factories/make-update-service-use-case';
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

  const updateServiceUseCase = makeUpdateServiceUseCase();
  const { service } = await updateServiceUseCase.execute({ id, data });

  return reply.status(200).send({ service });
}
