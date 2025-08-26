import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ListProfessionalsResponse } from '@/dtos/professional-dto';
import { makeListProfessionalsUseCase } from '@/use-cases/factories/make-list-professionals-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { listProfessionalsQuerySchema } from '@/schemas/profissional';

export async function listOrSearchProfessionals(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ListProfessionalsResponse> {
  try {
    const { page, limit, query, especialidade, ativo } =
      listProfessionalsQuerySchema.parse(request.query);


    let response: ListProfessionalsResponse;

    if (query) {
      // Caso tenha o parâmetro "query", usamos a busca
      const searchProfessionalsUseCase = makeListProfessionalsUseCase();
      response = await searchProfessionalsUseCase.execute({
        query,
        page,
        limit,
        ativo,
      });
    } else {
      // Caso contrário, fazemos a listagem
      const listProfessionalsUseCase = makeListProfessionalsUseCase();
      response = await listProfessionalsUseCase.execute({
        page,
        limit,
        especialidade,
        ativo,
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
