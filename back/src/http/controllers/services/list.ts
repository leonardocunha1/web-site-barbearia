import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListServicesUseCase } from '@/use-cases/factories/make-list-services-use-case';
import { listServicesQuerySchema } from '@/schemas/services';

export async function listServices(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page, limit, nome, categoria, ativo, professionalId } =
    listServicesQuerySchema.parse(request.query);

  const listServicesUseCase = makeListServicesUseCase();

  const { services, total, totalPages } = await listServicesUseCase.execute({
    page,
    limit,
    nome,
    categoria,
    ativo,
    professionalId,
  });

  return reply.status(200).send({
    services,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
