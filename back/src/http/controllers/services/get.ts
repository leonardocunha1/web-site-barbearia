import { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetServiceUseCase } from '@/use-cases/factories/make-get-service-use-case';
import { updateServiceParamsSchema } from '@/schemas/services';

// Helper to convert Date objects to ISO strings for Zod validation
function serializeService(service: any) {
  return {
    ...service,
    createdAt: service.createdAt instanceof Date ? service.createdAt.toISOString() : service.createdAt,
    updatedAt: service.updatedAt instanceof Date ? service.updatedAt.toISOString() : service.updatedAt,
  };
}

export async function getService(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateServiceParamsSchema.parse(request.params);

  const getServiceUseCase = makeGetServiceUseCase();
  const { service } = await getServiceUseCase.execute({ id });

  return reply.status(200).send({
    service: serializeService(service),
  });
}
