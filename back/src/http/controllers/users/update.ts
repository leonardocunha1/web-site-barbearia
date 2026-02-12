import { FastifyRequest, FastifyReply } from 'fastify';
import { makeUpdateUserProfileUseCase } from '@/use-cases/factories/make-update-user-profile-factory-use-case';
import { updateProfileBodySchema } from '@/schemas/user';

export async function updateProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { nome, email, telefone } = updateProfileBodySchema.parse(request.body);

  const updateUserProfile = makeUpdateUserProfileUseCase();

  await updateUserProfile.execute({
    userId: request.user.sub,
    nome,
    email,
    telefone,
  });

  return reply.status(200).send();
}
