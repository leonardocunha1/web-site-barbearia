import { FastifyRequest, FastifyReply } from 'fastify';
import { makeCreateServiceUseCase } from '@/use-cases/factories/make-create-service-use-case';
import { createServiceBodySchema } from '@/schemas/services';

export async function createService(request: FastifyRequest, reply: FastifyReply) {
  const { name, description, category, active } = createServiceBodySchema.parse(request.body);

  const createServiceUseCase = makeCreateServiceUseCase();

  await createServiceUseCase.execute({
    name,
    description,
    category,
    active,
  });

  return reply.status(201).send();
}
