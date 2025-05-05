import { toggleProfessionalStatusParamsSchema } from '@/schemas/profissional';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { makeToggleProfessionalStatusUseCase } from '@/use-cases/factories/make-toggle-professional-status-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function toggleProfessionalStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = toggleProfessionalStatusParamsSchema.parse(request.params);

    const toggleProfessionalStatusUseCase =
      makeToggleProfessionalStatusUseCase();
    const professional = await toggleProfessionalStatusUseCase.execute(id);

    return reply.status(200).send({
      message: `Profissional ${(professional?.ativo as boolean) ? 'ativado' : 'desativado'} com sucesso`,
    });
  } catch (error) {
    if (error instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(error));
    }

    throw error;
  }
}
