import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListBusinessHoursUseCase } from '@/use-cases/factories/make-list-business-hours-use-case';
import { listBusinessHoursParamsSchema } from '@/schemas/business-hours';

export async function listBusinessHours(request: FastifyRequest, reply: FastifyReply) {
  const { professionalId } = listBusinessHoursParamsSchema.parse(request.params);

  const listBusinessHoursUseCase = makeListBusinessHoursUseCase();
  const businessHours = await listBusinessHoursUseCase.execute({
    professionalId,
  });

  return reply.status(200).send({ businessHours });
}
