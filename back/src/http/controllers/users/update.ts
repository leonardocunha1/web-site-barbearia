import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { EmailAlreadyExistsError } from '@/use-cases/errors/user-email-already-exists-error';
import { InvalidDataError } from '@/use-cases/errors/invalid-data-error';
import { makeUpdateUserProfileUseCase } from '@/use-cases/factories/make-update-user-profile-factory-use-case';

export async function updateProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateProfileBodySchema = z.object({
    nome: z.string().min(3).optional(),
    email: z.string().email().optional(),
    telefone: z.string().optional().nullable(),
  });

  try {
    const { nome, email, telefone } = updateProfileBodySchema.parse(
      request.body,
    );

    const updateUserProfile = makeUpdateUserProfileUseCase();

    await updateUserProfile.execute({
      userId: request.user.sub,
      nome,
      email,
      telefone,
    });

    return reply.status(200).send();
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    if (error instanceof InvalidDataError) {
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
