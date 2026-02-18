import { FastifyRequest, FastifyReply } from 'fastify';
import { makeUpdateServiceUseCase } from '@/use-cases/factories/make-update-service-use-case';
import { updateServiceBodySchema, updateServiceParamsSchema } from '@/schemas/services';

// Helper to convert Date objects to ISO strings for Zod validation
function serializeService(service: any) {
  return {
    ...service,
    createdAt: service.createdAt instanceof Date ? service.createdAt.toISOString() : service.createdAt,
    updatedAt: service.updatedAt instanceof Date ? service.updatedAt.toISOString() : service.updatedAt,
  };
}

export async function updateService(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateServiceParamsSchema.parse(request.params);
  const data = updateServiceBodySchema.parse(request.body);

  const updateServiceUseCase = makeUpdateServiceUseCase();
  const { service } = await updateServiceUseCase.execute({ id, data });

  return reply.status(200).send({ service: serializeService(service) });
}
