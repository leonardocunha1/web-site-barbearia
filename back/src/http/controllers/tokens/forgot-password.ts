import { forgotPasswordBodySchema } from '@/schemas/tokens';
import { makeForgotPasswordUseCase } from '@/use-cases/factories/make-forgot-password-factory-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email } = forgotPasswordBodySchema.parse(request.body);

  const forgotPasswordUseCase = makeForgotPasswordUseCase();
  await forgotPasswordUseCase.execute({ email });

  return reply.status(200).send({
    message:
      'Se o e-mail estiver cadastrado, você receberá um link para redefinição de senha',
  });
}
