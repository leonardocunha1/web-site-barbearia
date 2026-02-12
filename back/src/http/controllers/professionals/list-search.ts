import { FastifyRequest, FastifyReply } from 'fastify';
import { ListProfessionalsResponse } from '@/dtos/professional-dto';
import { makeListProfessionalsUseCase } from '@/use-cases/factories/make-list-professionals-use-case';
import { searchProfessionalsQuerySchema } from '@/schemas/profissional';

export async function listOrSearchProfessionals(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ListProfessionalsResponse> {
  const { page, limit, search, specialty, status, sortBy, sortDirection } =
    searchProfessionalsQuerySchema.parse(request.query);

  const active = status === 'active' ? true : status === 'inactive' ? false : undefined;

  const useCase = makeListProfessionalsUseCase();

  let response: ListProfessionalsResponse;

  if (search) {
    response = await useCase.execute({
      query: search,
      page,
      limit,
      active,
      sortBy,
      sortDirection,
    });
  } else {
    response = await useCase.execute({
      page,
      limit,
      specialty,
      active,
      sortBy,
      sortDirection,
    });
  }

  return reply.status(200).send(response);
}
