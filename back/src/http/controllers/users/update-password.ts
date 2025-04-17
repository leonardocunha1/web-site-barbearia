import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { SamePasswordError } from '@/use-cases/errors/same-password-error';
import { makeUpdatePasswordUseCase } from '@/use-cases/factories/make-update-password-factory-use-case';

export async function updatePassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updatePasswordBodySchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
  });

  try {
    const { currentPassword, newPassword } = updatePasswordBodySchema.parse(
      request.body,
    );

    const updatePasswordUseCase = makeUpdatePasswordUseCase();

    const { user } = await updatePasswordUseCase.execute({
      userId: request.user.sub,
      currentPassword,
      newPassword,
    });

    return reply.status(200).send({
      message: 'Password updated successfully',
      user,
    });
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
      return reply.status(400).send({
        message: 'Validation error',
        issues: error.format(),
      });
    }

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
