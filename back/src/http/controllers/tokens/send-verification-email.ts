import { sendVerificationEmailBodySchema } from '@/schemas/tokens';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { makeSendVerificationEmailUseCase } from '@/use-cases/factories/make-send-verification-email-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function sendVerificationEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email } = sendVerificationEmailBodySchema.parse(request.body);

  try {
    const sendVerificationEmailUseCase = makeSendVerificationEmailUseCase();

    await sendVerificationEmailUseCase.execute({
      email,
    });

    return reply.status(200).send({
      message: 'E-mail de verificação enviado com sucesso',
    });
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
