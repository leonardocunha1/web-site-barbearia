import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { UserAlreadyProfessionalError } from '@/use-cases/errors/user-already-professional-error';
import { makeCreateProfessionalUseCase } from '@/use-cases/factories/make-create-professional-use-case';

export async function createProfessional(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createProfessionalBodySchema = z.object({
    userId: z.string().uuid(),
    especialidade: z.string().min(3),
    bio: z.string().optional(),
    documento: z.string().optional(),
    registro: z.string().optional(),
  });

  try {
    const data = createProfessionalBodySchema.parse(request.body);

    const createProfessionalUseCase = makeCreateProfessionalUseCase();
    const professional = await createProfessionalUseCase.execute(data);

    return reply.status(201).send(professional);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof UserAlreadyProfessionalError) {
      return reply.status(409).send({ message: error.message });
    }

    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
      });
    }

    throw error;
  }
}
