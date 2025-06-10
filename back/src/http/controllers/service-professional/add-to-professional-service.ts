import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { makeAddServiceToProfessionalUseCase } from '@/use-cases/factories/make-add-service-to-professional-use-case';
import { ServiceAlreadyAddedError } from '@/use-cases/errors/service-already-added-error';
import { formatZodError } from '@/utils/formatZodError';
import { addServiceToProfessionalBodySchema } from '@/schemas/services';
import { InvalidServicePriceDurationError } from '@/use-cases/errors/invalid-service-price-duration';

const paramsSchema = z.object({
  professionalId: z.string().uuid(),
});

export async function addToProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { professionalId } = paramsSchema.parse(request.params);
    const { serviceId, preco, duracao } =
      addServiceToProfessionalBodySchema.parse(request.body);

    const addServiceToProfessionalUseCase =
      makeAddServiceToProfessionalUseCase();

    await addServiceToProfessionalUseCase.execute({
      serviceId,
      professionalId,
      preco,
      duracao,
    });

    return reply.status(201).send();
  } catch (err) {
    if (
      err instanceof ServiceNotFoundError ||
      err instanceof ProfessionalNotFoundError
    ) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof ServiceAlreadyAddedError) {
      return reply.status(409).send({ message: err.message });
    }

    if (err instanceof InvalidServicePriceDurationError) {
      return reply.status(400).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
