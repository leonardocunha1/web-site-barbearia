import { toggleProfessionalStatusParamsSchema } from '@/schemas/profissional';
import { makeToggleProfessionalStatusUseCase } from '@/use-cases/factories/make-toggle-professional-status-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function toggleProfessionalStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = toggleProfessionalStatusParamsSchema.parse(request.params);

  const toggleProfessionalStatusUseCase = makeToggleProfessionalStatusUseCase();
  const professional = await toggleProfessionalStatusUseCase.execute(id);

  return reply.status(200).send({
    message: `Profissional ${(professional?.active as boolean) ? 'ativado' : 'desativado'} com sucesso`,
  });
}
