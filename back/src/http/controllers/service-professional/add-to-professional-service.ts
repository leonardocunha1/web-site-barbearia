import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { makeAddServiceToProfessionalUseCase } from '@/use-cases/factories/make-add-service-to-professional-use-case';
import { ServiceAlreadyAddedError } from '@/use-cases/errors/service-already-added-error';
import { formatZodError } from '@/utils/formatZodError';

export async function addToProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const addServiceToProfessionalBodySchema = z.object({
    serviceId: z.string().uuid(),
    professionalId: z.string().uuid(),
    preco: z.number().positive().optional(),
    duracao: z.number().int().positive().optional(),
  });

  const { serviceId, professionalId, preco, duracao } =
    addServiceToProfessionalBodySchema.parse(request.body);

  try {
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
    if (err instanceof ServiceNotFoundError) {
      return reply.status(404).send({ message: 'Service not found' });
    }

    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: 'Professional not found' });
    }

    if (err instanceof ServiceAlreadyAddedError) {
      return reply
        .status(409)
        .send({ message: 'Service already added to professional' });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
