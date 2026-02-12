import { FastifyRequest, FastifyReply } from 'fastify';
import { makeUpdateUserProfileUseCase } from '@/use-cases/factories/make-update-user-profile-factory-use-case';
import { updateProfileBodySchema } from '@/schemas/user';

export async function updateProfile(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, phone } = updateProfileBodySchema.parse(request.body);

  const updateUserProfile = makeUpdateUserProfileUseCase();

  await updateUserProfile.execute({
    userId: request.user.sub,
    name,
    email,
    phone,
  });

  return reply.status(200).send();
}
