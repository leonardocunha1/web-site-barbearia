import { FastifyRequest, FastifyReply } from 'fastify';
import { makeDeleteBusinessHoursUseCase } from '@/use-cases/factories/make-delete-business-hours-use-case';
import { deleteBusinessHoursParamsSchema } from '@/schemas/business-hours';

export async function deleteBusinessHours(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { businessHoursId } = deleteBusinessHoursParamsSchema.parse(
    request.params,
  );
  const professionalId = request.user.professionalId!;

  const deleteUseCase = makeDeleteBusinessHoursUseCase();

  await deleteUseCase.execute({ businessHoursId, professionalId });

  return reply.status(204).send();
}

