import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeListUsersUseCase } from '@/use-cases/factories/make-list-users-factory-use-case';
import { listUsersQuerySchema } from '@/schemas/user';
import { formatZodError } from '@/utils/formatZodError';

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { page, limit, role, name } = listUsersQuerySchema.parse(
      request.query,
    );

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
      nome: user.nome,
      role: user.role,
      createdAt: user.createdAt,
      telefone: user.telefone,
      emailVerified: user.emailVerified,
      active: user.active,
    }));

    response.users = usersWithoutPassword;

    return reply.status(200).send({
      ...response,
      users: usersWithoutPassword,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
