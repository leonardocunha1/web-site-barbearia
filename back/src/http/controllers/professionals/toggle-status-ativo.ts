import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { makeToggleProfessionalStatusUseCase } from '@/use-cases/factories/make-toggle-professional-status-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function toggleProfessionalStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const toggleProfessionalStatusParamsSchema = z.object({
    id: z.string().uuid(),
  });

  try {
    const { id } = toggleProfessionalStatusParamsSchema.parse(request.params);

    const toggleProfessionalStatusUseCase =
      makeToggleProfessionalStatusUseCase();
    const professional = await toggleProfessionalStatusUseCase.execute(id);

    if (!professional) {
      return reply.status(404).send({ message: 'Professional not found' });
    }

    return reply.status(200).send({
      message: `Profissional ${professional.ativo ? 'ativado' : 'desativado'} com sucesso`,
      professional,
    });
  } catch (error) {
    if (error instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        issues: error.format(),
      });
    }

    throw error;
  }
}
