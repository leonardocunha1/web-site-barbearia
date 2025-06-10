import { makeListProfessionalServicesUseCase } from '@/use-cases/factories/make-list-professional-services-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { formatZodError } from '@/utils/formatZodError';
import {
  listProfessionalServicesParamsSchema,
  listProfessionalServicesQuerySchema,
} from '@/schemas/services';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';

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

    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}
