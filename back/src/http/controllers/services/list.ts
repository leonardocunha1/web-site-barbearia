import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListServicesUseCase } from '@/use-cases/factories/make-list-services-use-case';
import { z } from 'zod';

export async function listServices(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listServicesQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    nome: z.string().optional(),
    categoria: z.string().optional(),
    ativo: z.coerce.boolean().optional(),
    professionalId: z.string().uuid().optional(),
  });

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
