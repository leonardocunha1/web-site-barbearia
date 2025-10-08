import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ListProfessionalsResponse } from '@/dtos/professional-dto';
import { makeListProfessionalsUseCase } from '@/use-cases/factories/make-list-professionals-use-case';
import { formatZodError } from '@/utils/formatZodError';

export const listProfessionalsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.coerce.string().min(2).optional(),
  especialidade: z.string().optional(),
  status: z.enum(['ativo', 'inativo']).optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
});

export async function listOrSearchProfessionals(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ListProfessionalsResponse> {
  try {
    const { page, limit, search, especialidade, status, sortBy, sortDirection } =
      listProfessionalsQuerySchema.parse(request.query);

    console.log('request.query AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', request.query);

    const ativo = status === "ativo" ? true : status === "inativo" ? false : undefined;

    const useCase = makeListProfessionalsUseCase();

    let response: ListProfessionalsResponse;

    if (search) {
      // busca por termo
      response = await useCase.execute({
        query: search,
        page,
        limit,
        ativo,
        sortBy,
        sortDirection,
      });
    } else {
      // listagem normal
      response = await useCase.execute({
        page,
        limit,
        especialidade,
        ativo,
        sortBy,
        sortDirection,
      });
    }

    return reply.status(200).send(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(error));
    }
    throw error;
  }
}
