import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { ListUsersResponse } from '@/dtos/user-dto';
import { makeListUsersUseCase } from '@/use-cases/factories/make-list-users-factory-use-case';
import { paginationSchema } from '@/schemas/pagination-params';

export async function listUsers(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ListUsersResponse> {
  const listUsersQuerySchema = paginationSchema.extend({
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
        message: 'Erro na validação dos dados de entrada',
        issues: error.format(),
      });
    }

    throw error;
  }
}
