import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { makeSendVerificationEmailUseCase } from '@/use-cases/factories/make-send-verification-email-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function sendVerificationEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sendVerificationEmailBodySchema = z.object({
    email: z.string().email(),
  });

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
