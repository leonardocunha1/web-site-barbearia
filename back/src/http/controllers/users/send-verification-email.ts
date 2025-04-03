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
      message: 'E-mail de verificação enviado com sucesso' 
    });
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: 'Usuário não encontrado' });
    }

    console.error('Send verification email error:', err);
    return reply.status(500).send({ message: 'Erro ao enviar e-mail de verificação' });
  }
}