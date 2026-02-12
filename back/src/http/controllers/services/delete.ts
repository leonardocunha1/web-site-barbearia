import { FastifyRequest, FastifyReply } from 'fastify';
import { makeDeleteServiceUseCase } from '@/use-cases/factories/make-delete-service-use-case';
import { deleteServiceQuerySchema, updateServiceParamsSchema } from '@/schemas/services';

export async function deleteService(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateServiceParamsSchema.parse(request.params);
  const { permanent } = deleteServiceQuerySchema.parse(request.query);

  const deleteServiceUseCase = makeDeleteServiceUseCase();

  if (permanent) {
    await deleteServiceUseCase.executePermanent(id);
  } else {
    await deleteServiceUseCase.executeSoft(id);
  }

  return reply.status(204).send();
}
