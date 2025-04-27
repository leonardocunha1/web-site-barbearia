import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ListProfessionalsResponse } from '@/dtos/professional-dto';
import { makeListProfessionalsUseCase } from '@/use-cases/factories/make-list-professionals-use-case';

export async function listProfessionals(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ListProfessionalsResponse> {
  const listProfessionalsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
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
