import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { InvalidTokenError } from '@/use-cases/errors/invalid-token-error';
import { ExpiredTokenError } from '@/use-cases/errors/expired-token-error';
import { makeResetPasswordUseCase } from '@/use-cases/factories/make-reset-password-use-case';

export async function resetPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const resetPasswordBodySchema = z.object({
    token: z.string(),
    newPassword: z.string().min(6),
  });

  try {
    const { token, newPassword } = resetPasswordBodySchema.parse(request.body);

    const resetPasswordUseCase = makeResetPasswordUseCase();
    await resetPasswordUseCase.execute({ token, newPassword });

    return reply.status(200).send({
      message: 'Senha redefinida com sucesso',
    });
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      return reply.status(400).send({ message: error.message });
    }

    if (error instanceof ExpiredTokenError) {
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
