import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListServicesUseCase } from '@/use-cases/factories/make-list-services-use-case';
import { z } from 'zod';
import { formatZodError } from '@/utils/formatZodError';
import { listServicesQuerySchema } from '@/schemas/services';
import { InvalidPageError } from '@/use-cases/errors/invalid-page-error';
import { InvalidLimitError } from '@/use-cases/errors/invalid-limit-error';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';

export async function listServices(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { page, limit, nome, categoria, ativo, professionalId } =
      listServicesQuerySchema.parse(request.query);

    const listServicesUseCase = makeListServicesUseCase();

    const { services, total, totalPages } = await listServicesUseCase.execute({
      page,
      limit,
      nome,
      categoria,
      ativo,
      professionalId,
    });

    return reply.status(200).send({
      services,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(error));
    }

    if (
      error instanceof InvalidPageError ||
      error instanceof InvalidLimitError
    ) {
      return reply.status(400).send({ message: error.message });
    }

    if (error instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
