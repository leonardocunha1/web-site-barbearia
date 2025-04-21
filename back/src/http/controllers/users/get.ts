import { FastifyRequest, FastifyReply } from 'fastify';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-factory-use-case';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserProfile = makeGetUserProfileUseCase();

    const { user } = await getUserProfile.execute({
      userId: request.user.sub,
    });

    return reply.status(200).send(user);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
