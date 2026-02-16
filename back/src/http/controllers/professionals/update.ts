import {
  updateProfessionalBodySchema,
  updateProfessionalParamsSchema,
} from '@/schemas/profissional';
import { makeUpdateProfessionalUseCase } from '@/use-cases/factories/make-update-professional-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function updateProfessional(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateProfessionalParamsSchema.parse(request.params);
  const data = updateProfessionalBodySchema.parse(request.body);

  if (request.user.role === 'PROFESSIONAL') {
    if (request.user.professionalId !== id) {
      return reply.status(403).send({ message: 'Acesso negado' });
    }

    if (data.active !== undefined) {
      return reply.status(403).send({ message: 'Apenas administradores podem alterar o status' });
    }
  }

  const updateProfessionalUseCase = makeUpdateProfessionalUseCase();
  await updateProfessionalUseCase.execute({
    id,
    ...data,
  });

  return reply.status(200).send();
}
