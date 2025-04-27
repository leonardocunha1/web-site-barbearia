import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { InvalidTokenError } from '@/use-cases/errors/invalid-token-error';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { makeVerifyEmailUseCase } from '@/use-cases/factories/make-verify-email-use-case';
import { UserAlreadyVerifiedError } from '@/use-cases/errors/user-already-verified-error';

export async function verifyEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const verifyEmailQuerySchema = z.object({
    token: z.string().uuid(),
  });

  const { token } = verifyEmailQuerySchema.parse(request.query);

  try {
    const verifyEmailUseCase = makeVerifyEmailUseCase();

    await verifyEmailUseCase.execute({
      verificationToken: token,
    });

    return reply.status(200).send({ message: 'E-mail verificado com sucesso' });
  } catch (err) {
    if (err instanceof InvalidTokenError) {
      return reply.status(400).send({ message: 'Token inválido ou expirado' });
    }
    if (err instanceof UserAlreadyVerifiedError) {
      return reply.status(400).send({ message: 'E-mail já verificado' });
    }
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: 'Usuário não encontrado' });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        issues: err.format(),
      });
    }

    throw err;
  }
}
