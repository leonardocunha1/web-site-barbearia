import { FastifyRequest, FastifyReply } from 'fastify';
import { makeCreateBusinessHoursUseCase } from '@/use-cases/factories/make-create-business-hours-use-case';
import { createBusinessHoursBodySchema } from '@/schemas/business-hours';

export async function createBusinessHours(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { dayOfWeek, opensAt, closesAt, breakStart, breakEnd } =
    createBusinessHoursBodySchema.parse(request.body);

  const createBusinessHoursUseCase = makeCreateBusinessHoursUseCase();

  await createBusinessHoursUseCase.execute({
    professionalId: request.user.professionalId!,
    dayOfWeek,
    opensAt,
    closesAt,
    breakStart,
    breakEnd,
  });

  return reply.status(201).send();
}

