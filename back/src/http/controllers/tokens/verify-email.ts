import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { InvalidTokenError } from '@/use-cases/errors/invalid-token-error';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { makeVerifyEmailUseCase } from '@/use-cases/factories/make-verify-email-use-case';
import { UserAlreadyVerifiedError } from '@/use-cases/errors/user-already-verified-error';
import { verifyEmailQuerySchema } from '@/schemas/tokens';
import { formatZodError } from '@/utils/formatZodError';

export async function verifyEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { token } = verifyEmailQuerySchema.parse(request.query);

  try {
    const verifyEmailUseCase = makeVerifyEmailUseCase();

    await verifyEmailUseCase.execute({
      verificationToken: token,
    });

    return reply.status(200).send({ message: 'E-mail verificado com sucesso' });
  } catch (err) {
    if (err instanceof InvalidTokenError) {
      return reply.status(400).send({ message: err.message });
    }
    if (err instanceof UserAlreadyVerifiedError) {
      return reply.status(400).send({ message: err.message });
    }
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
