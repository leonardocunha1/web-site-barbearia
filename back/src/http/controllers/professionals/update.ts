import {
  updateProfessionalBodySchema,
  updateProfessionalParamsSchema,
} from '@/schemas/profissional';
import { makeUpdateProfessionalUseCase } from '@/use-cases/factories/make-update-professional-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function updateProfessional(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateProfessionalParamsSchema.parse(request.params);
  const data = updateProfessionalBodySchema.parse(request.body);

  const updateProfessionalUseCase = makeUpdateProfessionalUseCase();
  await updateProfessionalUseCase.execute({
    id,
    ...data,
  });

  return reply.status(200).send();
}
