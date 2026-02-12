import { FastifyRequest, FastifyReply } from 'fastify';
import { makeCreateServiceUseCase } from '@/use-cases/factories/make-create-service-use-case';
import { createServiceBodySchema } from '@/schemas/services';

export async function createService(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { nome, descricao, categoria, ativo } = createServiceBodySchema.parse(
    request.body,
  );

  const createServiceUseCase = makeCreateServiceUseCase();

  await createServiceUseCase.execute({
    nome,
    descricao,
    categoria,
    ativo,
  });

  return reply.status(201).send();
}
