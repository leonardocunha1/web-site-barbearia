import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ListProfessionalsResponse } from '@/dtos/professional-dto';
import { makeListProfessionalsUseCase } from '@/use-cases/factories/make-list-professionals-use-case';
import { paginationSchema } from '@/validators/pagination-params';

export async function listProfessionals(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ListProfessionalsResponse> {
  const listProfessionalsQuerySchema = paginationSchema.extend({
    especialidade: z.string().optional(),
    ativo: z.coerce.boolean().optional(),
  });

  try {
    const { page, limit, especialidade, ativo } =
      listProfessionalsQuerySchema.parse(request.query);

    const listProfessionalsUseCase = makeListProfessionalsUseCase();
    const response = await listProfessionalsUseCase.execute({
      page,
      limit,
      especialidade,
      ativo,
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
