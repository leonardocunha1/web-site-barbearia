import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import {
  updateServiceProfessionalBodySchema,
  updateServiceProfessionalParamsSchema,
} from '@/schemas/services';
import { InvalidServicePriceDurationError } from '@/use-cases/errors/invalid-service-price-duration';
import { makeUpdateServiceProfessionalUseCase } from '@/use-cases/factories/make-update-service-professional-use-case';
import { formatZodError } from '@/utils/formatZodError';

export async function updateServiceProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { professionalId, serviceId } =
      updateServiceProfessionalParamsSchema.parse(request.params);
    const { preco, duracao } = updateServiceProfessionalBodySchema.parse(
      request.body,
    );

    const useCase = makeUpdateServiceProfessionalUseCase();

    await useCase.execute({
      serviceId,
      professionalId,
      preco,
      duracao,
    });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof InvalidServicePriceDurationError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
