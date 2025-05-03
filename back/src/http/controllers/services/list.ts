import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListServicesUseCase } from '@/use-cases/factories/make-list-services-use-case';
import { z } from 'zod';
import { paginationSchema } from '@/schemas/pagination';
import { formatZodError } from '@/utils/formatZodError';

export async function listServices(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listServicesQuerySchema = paginationSchema.extend({
    nome: z.string().optional(),
    categoria: z.string().optional(),
    ativo: z.coerce.boolean().optional(),
    professionalId: z.string().uuid().optional(),
  });

  try {
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(error));
    }

    throw error;
  }
}
