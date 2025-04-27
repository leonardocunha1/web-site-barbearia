import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ServiceNotFoundError } from '@/use-cases/errors/service-not-found-error';
import { makeUpdateServiceUseCase } from '@/use-cases/factories/make-update-service-use-case';

export async function updateService(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateServiceParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const updateServiceBodySchema = z.object({
    nome: z.string().min(3).optional(),
    descricao: z.string().optional(),
    precoPadrao: z.number().positive().optional(),
    duracao: z.number().int().positive().optional(),
    categoria: z.string().optional(),
    ativo: z.boolean().optional(),
    professionalId: z.string().uuid().optional(),
  });

  const { id } = updateServiceParamsSchema.parse(request.params);
  const data = updateServiceBodySchema.parse(request.body);

  try {
    const updateServiceUseCase = makeUpdateServiceUseCase();
    const { service } = await updateServiceUseCase.execute({ id, data });

    return reply.status(200).send({ service });
  } catch (err) {
    if (err instanceof ServiceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        issues: err.format(),
      });
    }

    throw err;
  }
}
