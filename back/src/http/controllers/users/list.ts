import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListUsersUseCase } from '@/use-cases/factories/make-list-users-factory-use-case';
import { listUsersQuerySchema } from '@/schemas/user';

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  const { page, limit, role, name } = listUsersQuerySchema.parse(request.query);

  const listUsersUseCase = makeListUsersUseCase();
  const response = await listUsersUseCase.execute({
    page,
    limit,
    role,
    name,
  });

  const usersWithoutPassword = response.users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    phone: user.phone,
    emailVerified: user.emailVerified,
    active: user.active,
  }));

  response.users = usersWithoutPassword;

  return reply.status(200).send({
    ...response,
    users: usersWithoutPassword,
  });
}
