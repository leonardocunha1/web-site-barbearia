import { sendVerificationEmailBodySchema } from '@/schemas/tokens';
import { makeSendVerificationEmailUseCase } from '@/use-cases/factories/make-send-verification-email-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function sendVerificationEmail(request: FastifyRequest, reply: FastifyReply) {
  const { email } = sendVerificationEmailBodySchema.parse(request.body);
  const sendVerificationEmailUseCase = makeSendVerificationEmailUseCase();

  await sendVerificationEmailUseCase.execute({
    email,
  });

  return reply.status(200).send({
    message: 'E-mail de verificação enviado com sucesso',
  });
}
