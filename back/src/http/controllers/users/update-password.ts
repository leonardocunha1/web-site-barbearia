import { FastifyRequest, FastifyReply } from 'fastify';
import { makeUpdatePasswordUseCase } from '@/use-cases/factories/make-update-password-factory-use-case';
import { updatePasswordBodySchema } from '@/schemas/user';

export async function updatePassword(request: FastifyRequest, reply: FastifyReply) {
  const { currentPassword, newPassword } = updatePasswordBodySchema.parse(request.body);

  const updatePasswordUseCase = makeUpdatePasswordUseCase();

  await updatePasswordUseCase.execute({
    userId: request.user.sub,
    currentPassword,
    newPassword,
  });

  return reply.status(200).send();
}
