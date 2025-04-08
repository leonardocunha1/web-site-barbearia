import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { InsufficientPermissionsError } from '@/use-cases/errors/insufficient-permissions-error';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { makeCreateServiceUseCase } from '@/use-cases/factories/make-create-service-use-case';

export async function createService(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createServiceBodySchema = z.object({
    nome: z.string(),
    descricao: z.string().optional(),
    precoPadrao: z.number().positive(),
    duracao: z.number().int().positive(),
    categoria: z.string().optional(),
  });

  const { nome, descricao, precoPadrao, duracao, categoria } =
    createServiceBodySchema.parse(request.body);

  try {
    const createServiceUseCase = makeCreateServiceUseCase();

    await createServiceUseCase.execute({
      nome,
      descricao,
      precoPadrao,
      duracao,
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

    throw err;
  }
}
