import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListServicesUseCase } from '@/use-cases/factories/make-list-services-use-case';
import { listServicesQuerySchema } from '@/schemas/services';

// Helper to convert Date objects to ISO strings for Zod validation
function serializeService(service: any) {
  return {
    ...service,
    createdAt: service.createdAt instanceof Date ? service.createdAt.toISOString() : service.createdAt,
    updatedAt: service.updatedAt instanceof Date ? service.updatedAt.toISOString() : service.updatedAt,
  };
}

export async function listServices(request: FastifyRequest, reply: FastifyReply) {
  const { page, limit, name, category, active, professionalId } = listServicesQuerySchema.parse(
    request.query,
  );

  const listServicesUseCase = makeListServicesUseCase();

  const { services, total, totalPages } = await listServicesUseCase.execute({
    page,
    limit,
    name,
    category,
    active,
    professionalId,
  });

  return reply.status(200).send({
    services: services.map(serializeService),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
