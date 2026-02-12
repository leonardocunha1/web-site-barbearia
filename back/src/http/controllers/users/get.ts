import { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-factory-use-case';
import { UserDTO } from '@/dtos/user-dto';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase();

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  });

  const userWithoutPassword: UserDTO = {
    id: user.id,
    email: user.email, name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    telefone: user.phone,
    emailVerified: user.emailVerified,
    active: user.active,
  };

  return reply.status(200).send({ user: userWithoutPassword });
}
