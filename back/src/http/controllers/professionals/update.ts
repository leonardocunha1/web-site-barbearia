import {
  updateProfessionalBodySchema,
  updateProfessionalParamsSchema,
} from '@/schemas/profissional';
import { InvalidUpdateError } from '@/use-cases/errors/invalid-update-error';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { makeUpdateProfessionalUseCase } from '@/use-cases/factories/make-update-professional-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function updateProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = updateProfessionalParamsSchema.parse(request.params);
    const data = updateProfessionalBodySchema.parse(request.body);

    const updateProfessionalUseCase = makeUpdateProfessionalUseCase();
    await updateProfessionalUseCase.execute({
      id,
      ...data,
    });

    return reply.status(200).send();
  } catch (error) {
    if (error instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof InvalidUpdateError) {
      return reply.status(400).send({ message: error.message });
    }

    if (error instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(error));
    }

    throw error;
  }
}
