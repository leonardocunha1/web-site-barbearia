import { makeListProfessionalServicesUseCase } from '@/use-cases/factories/make-list-professional-services-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import {
  listProfessionalServicesParamsSchema,
  listProfessionalServicesQuerySchema,
} from '@/schemas/services';

export async function listProfessionalServices(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { professionalId } = listProfessionalServicesParamsSchema.parse(
    request.params,
  );
  const { page, limit, activeOnly } = listProfessionalServicesQuerySchema.parse(
    request.query,
  );

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
}
