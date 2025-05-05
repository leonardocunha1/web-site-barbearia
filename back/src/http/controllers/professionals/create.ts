import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { UserAlreadyProfessionalError } from '@/use-cases/errors/user-already-professional-error';
import { makeCreateProfessionalUseCase } from '@/use-cases/factories/make-create-professional-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { createProfessionalBodySchema } from '@/schemas/profissional';

export async function createProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const data = createProfessionalBodySchema.parse(request.body);

    const createProfessionalUseCase = makeCreateProfessionalUseCase();
    await createProfessionalUseCase.execute(data);

    return reply.status(201).send();
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof UserAlreadyProfessionalError) {
      return reply.status(409).send({ message: error.message });
    }

    if (error instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(error));
    }

    throw error;
  }
}
