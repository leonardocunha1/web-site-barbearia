import { FastifyRequest, FastifyReply } from 'fastify';
import { makeToggleServiceStatusUseCase } from '@/use-cases/factories/make-toggle-service-status-use-case';
import { updateServiceParamsSchema } from '@/schemas/services';

export async function toggleServiceStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateServiceParamsSchema.parse(request.params);

  const toggleServiceStatusUseCase = makeToggleServiceStatusUseCase();
  await toggleServiceStatusUseCase.execute({ id });

  return reply.status(200).send();
}
