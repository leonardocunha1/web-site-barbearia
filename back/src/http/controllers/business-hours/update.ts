import { FastifyRequest, FastifyReply } from 'fastify';
import { makeUpdateBusinessHoursUseCase } from '@/use-cases/factories/make-update-business-hours-use-case';
import { updateBusinessHoursBodySchema } from '@/schemas/business-hours';

export async function updateBusinessHours(request: FastifyRequest, reply: FastifyReply) {
  const professionalId = request.user.professionalId!;
  const body = updateBusinessHoursBodySchema.parse(request.body);

  const updateBusinessHoursUseCase = makeUpdateBusinessHoursUseCase();

  await updateBusinessHoursUseCase.execute({
    professionalId,
    ...body,
  });

  return reply.status(200).send();
}
