import { makeListProfessionalServicesUseCase } from '@/use-cases/factories/make-list-professional-services-use-case';
import { paginationSchema } from '@/schemas/pagination-params';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { formatZodError } from '@/utils/formatZodError';

export async function listProfessionalServices(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listProfessionalServicesQuerySchema = paginationSchema.extend({
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
      return reply.status(400).send(formatZodError(err));
    }
    throw err;
  }
}
