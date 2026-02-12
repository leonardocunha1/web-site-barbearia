import { FastifyRequest, FastifyReply } from 'fastify';
import { makeCreateProfessionalUseCase } from '@/use-cases/factories/make-create-professional-use-case';
import { createProfessionalBodySchema } from '@/schemas/profissional';

export async function createProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = createProfessionalBodySchema.parse(request.body);

  const createProfessionalUseCase = makeCreateProfessionalUseCase();
  await createProfessionalUseCase.execute(data);

  return reply.status(201).send();
}
