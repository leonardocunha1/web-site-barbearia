import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { EmailAlreadyExistsError } from '@/use-cases/errors/user-email-already-exists-error';
import { InvalidDataError } from '@/use-cases/errors/invalid-data-error';
import { makeUpdateUserProfileUseCase } from '@/use-cases/factories/make-update-user-profile-factory-use-case';
import { UserDTO } from '@/dtos/user-dto';

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

    const { user } = await updateUserProfile.execute({
      userId: request.user.sub,
      nome,
      email,
      telefone,
    });

    const userWithoutPassword: UserDTO = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      role: user.role,
      emailVerified: user.emailVerified,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return reply.status(200).send(userWithoutPassword);
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
        message: 'Validation error',
        issues: error.format(),
      });
    }

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
