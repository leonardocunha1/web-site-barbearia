import { makeListProfessionalServicesUseCase } from '@/use-cases/factories/make-list-professional-services-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function listProfessionalServices(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listProfessionalServicesQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    activeOnly: z.coerce.boolean().optional().default(true),
  });

  const listProfessionalServicesParamsSchema = z.object({
    professionalId: z.string().uuid(),
  });

  const { professionalId } = listProfessionalServicesParamsSchema.parse(
    request.params,
  );
  const { page, limit, activeOnly } = listProfessionalServicesQuerySchema.parse(
    request.query,
  );

  try {
    const listProfessionalServicesUseCase =
      makeListProfessionalServicesUseCase();

    const { services, total } = await listProfessionalServicesUseCase.execute({
      professionalId,
      page,
      limit,
      activeOnly,
    });

    return reply.status(200).send({
      services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        issues: err.format(),
      });
    }
    throw err;
  }
}
