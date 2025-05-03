import { forgotPasswordBodySchema } from '@/schemas/tokens';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { makeForgotPasswordUseCase } from '@/use-cases/factories/make-forgot-password-factory-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
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
      return reply.status(400).send(formatZodError(error));
    }

    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
