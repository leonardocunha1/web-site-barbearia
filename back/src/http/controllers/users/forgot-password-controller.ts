import { makeForgotPasswordUseCase } from '@/use-cases/factories/make-forgot-password-factory-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const forgotPasswordBodySchema = z.object({
    email: z.string().email(),
  });

  try {
    const { email } = forgotPasswordBodySchema.parse(request.body);

    const forgotPasswordUseCase = makeForgotPasswordUseCase();
    await forgotPasswordUseCase.execute({ email });

    return reply.status(200).send({
      message:
        'Se o e-mail estiver cadastrado, você receberá um link para redefinição de senha',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Validation error',
        issues: error.format(),
      });
    }

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
