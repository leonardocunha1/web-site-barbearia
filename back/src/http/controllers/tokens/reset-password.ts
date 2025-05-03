import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { InvalidTokenError } from '@/use-cases/errors/invalid-token-error';
import { ExpiredTokenError } from '@/use-cases/errors/expired-token-error';
import { makeResetPasswordUseCase } from '@/use-cases/factories/make-reset-password-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { resetPasswordBodySchema } from '@/schemas/tokens';

export async function resetPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { token, newPassword } = resetPasswordBodySchema.parse(request.body);

    const resetPasswordUseCase = makeResetPasswordUseCase();
    await resetPasswordUseCase.execute({ token, newPassword });

    return reply.status(200).send({
      message: 'Senha redefinida com sucesso',
    });
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      return reply.status(401).send({ message: error.message });
    }

    if (error instanceof ExpiredTokenError) {
      return reply.status(401).send({ message: error.message });
    }

    if (error instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(error));
    }

    throw error;
  }
}
