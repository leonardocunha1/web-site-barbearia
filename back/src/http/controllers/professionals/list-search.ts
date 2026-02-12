import { FastifyRequest, FastifyReply } from 'fastify';
import { ListProfessionalsResponse } from '@/dtos/professional-dto';
import { makeListProfessionalsUseCase } from '@/use-cases/factories/make-list-professionals-use-case';
import { searchProfessionalsQuerySchema } from '@/schemas/profissional';

export async function listOrSearchProfessionals(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ListProfessionalsResponse> {
  const { page, limit, search, especialidade, status, sortBy, sortDirection } =
    searchProfessionalsQuerySchema.parse(request.query);

  const ativo =
    status === 'ativo' ? true : status === 'inativo' ? false : undefined;

  const useCase = makeListProfessionalsUseCase();

  let response: ListProfessionalsResponse;

  if (search) {
    response = await useCase.execute({
      query: search,
      page,
      limit,
      ativo,
      sortBy,
      sortDirection,
    });
  } else {
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
}
