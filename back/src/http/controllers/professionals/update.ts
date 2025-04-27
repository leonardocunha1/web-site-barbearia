import { InvalidUpdateError } from '@/use-cases/errors/invalid-update-error';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { makeUpdateProfessionalUseCase } from '@/use-cases/factories/make-update-professional-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function updateProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateProfessionalParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const updateProfessionalBodySchema = z.object({
    especialidade: z.string().min(3).optional(),
    bio: z.string().nullable().optional(),
    documento: z.string().nullable().optional(),
    registro: z.string().nullable().optional(),
    ativo: z.boolean().optional(),
    intervalosAgendamento: z.number().int().min(15).max(120).optional(),
    avatarUrl: z.string().url().nullable().optional(),
  });

  try {
    const { id } = updateProfessionalParamsSchema.parse(request.params);
    const data = updateProfessionalBodySchema.parse(request.body);

    const updateProfessionalUseCase = makeUpdateProfessionalUseCase();
    const professional = await updateProfessionalUseCase.execute({
      id,
      ...data,
    });

    return reply.status(200).send(professional);
  } catch (error) {
    if (error instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof InvalidUpdateError) {
      return reply.status(400).send({ message: error.message });
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
