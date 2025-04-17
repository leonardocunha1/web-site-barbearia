import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { ListUsersResponse } from '@/dtos/user-dto';
import { makeListUsersUseCase } from '@/use-cases/factories/make-list-users-factory-use-case';

export async function listUsers(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ListUsersResponse> {
  const listUsersQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    role: z.nativeEnum(Role).optional(),
    name: z.string().optional(),
  });

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

    return reply.status(200).send(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Validation error',
        issues: error.format(),
      });
    }

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
