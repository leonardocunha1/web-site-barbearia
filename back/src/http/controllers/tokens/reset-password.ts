import { FastifyRequest, FastifyReply } from 'fastify';
import { makeResetPasswordUseCase } from '@/use-cases/factories/make-reset-password-use-case';
import { resetPasswordBodySchema } from '@/schemas/tokens';

export async function resetPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { token, newPassword } = resetPasswordBodySchema.parse(request.body);

  const resetPasswordUseCase = makeResetPasswordUseCase();
  await resetPasswordUseCase.execute({ token, newPassword });

  return reply.status(200).send({
    message: 'Senha redefinida com sucesso',
  });
}
