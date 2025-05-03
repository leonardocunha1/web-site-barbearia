import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { SamePasswordError } from '@/use-cases/errors/same-password-error';
import { makeUpdatePasswordUseCase } from '@/use-cases/factories/make-update-password-factory-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { updatePasswordBodySchema } from '@/schemas/user';

export async function updatePassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { currentPassword, newPassword } = updatePasswordBodySchema.parse(
      request.body,
    );

    const updatePasswordUseCase = makeUpdatePasswordUseCase();

    await updatePasswordUseCase.execute({
      userId: request.user.sub,
      currentPassword,
      newPassword,
    });

    return reply.status(200).send();
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message });
    }
    if (error instanceof SamePasswordError) {
      return reply.status(400).send({ message: error.message });
    }
    if (error instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(error));
    }

    throw error;
  }
}
