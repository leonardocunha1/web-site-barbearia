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
  const removeServiceFromProfessionalBodySchema = z.object({
    serviceId: z.string().uuid(),
    professionalId: z.string().uuid(),
  });

  const { serviceId, professionalId } =
    removeServiceFromProfessionalBodySchema.parse(request.body);

  try {
    const removeServiceFromProfessionalUseCase =
      makeRemoveServiceFromProfessionalUseCase();

    await removeServiceFromProfessionalUseCase.execute({
      serviceId,
      professionalId,
    });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ServiceProfessionalNotFoundError) {
      return reply
        .status(404)
        .send({ message: 'Service not linked to professional' });
    }

    if (err instanceof ServiceWithBookingsError) {
      return reply.status(400).send({
        message: 'Cannot remove service with active bookings',
      });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
