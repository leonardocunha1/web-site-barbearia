import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { InsufficientPermissionsError } from '@/use-cases/errors/insufficient-permissions-error';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { makeCreateServiceUseCase } from '@/use-cases/factories/make-create-service-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { createServiceBodySchema } from '@/schemas/services';

export async function createService(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { nome, descricao, categoria } = createServiceBodySchema.parse(
    request.body,
  );

  try {
    const createServiceUseCase = makeCreateServiceUseCase();

    await createServiceUseCase.execute({
      nome,
      descricao,
      categoria,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof InsufficientPermissionsError) {
      return reply.status(403).send({ message: err.message });
    }

    if (err instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
