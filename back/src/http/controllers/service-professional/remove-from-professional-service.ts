import { removeServiceFromProfessionalParamsSchema } from '@/schemas/services';
import { ServiceProfessionalNotFoundError } from '@/use-cases/errors/service-professional-not-found-error';
import { ServiceWithBookingsError } from '@/use-cases/errors/service-with-bookings-error';
import { makeRemoveServiceFromProfessionalUseCase } from '@/use-cases/factories/make-remove-service-from-professional-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function removeFromProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { professionalId, serviceId } =
      removeServiceFromProfessionalParamsSchema.parse(request.params);

    const removeServiceFromProfessionalUseCase =
      makeRemoveServiceFromProfessionalUseCase();

    await removeServiceFromProfessionalUseCase.execute({
      serviceId,
      professionalId,
    });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ServiceProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof ServiceWithBookingsError) {
      return reply.status(400).send({
        message: err.message,
      });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
