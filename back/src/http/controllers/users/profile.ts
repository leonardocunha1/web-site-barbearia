import { FastifyRequest, FastifyReply } from 'fastify';
import { GetUserProfileUseCase } from '@/use-cases/get-user-profile';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';

export type UserDTO = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  role: string;
  emailVerified: Date | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserProfile = new GetUserProfileUseCase(
      new PrismaUsersRepository(),
    );

    const { user } = await getUserProfile.execute({
      userId: request.user.sub,
    });

    // Não retornar a senha
    const userWithoutPassword: UserDTO = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      role: user.role,
      emailVerified: user.emailVerified,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return reply.status(200).send(userWithoutPassword);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
