import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ListProfessionalsResponse } from '@/dtos/professional-dto';
import { makeSearchProfessionalsUseCase } from '@/use-cases/factories/make-search-professionals-use-case';

export async function searchProfessionals(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ListProfessionalsResponse> {
  const searchProfessionalsQuerySchema = z.object({
    query: z.string().min(2),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    ativo: z.coerce.boolean().optional().default(true),
  });

  try {
    const { query, page, limit, ativo } = searchProfessionalsQuerySchema.parse(
      request.query,
    );

    const searchProfessionalsUseCase = makeSearchProfessionalsUseCase();
    const response = await searchProfessionalsUseCase.execute({
      query,
      page,
      limit,
      ativo,
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
