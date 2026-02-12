import { FastifyReply, FastifyRequest } from 'fastify';
import { assignBonusBodySchema } from '@/schemas/bonus';
import { makeAssignBonusUseCase } from '@/use-cases/factories/make-assign-bonus-use-case';

export async function assignBonus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId, bookingId, type, description } =
    assignBonusBodySchema.parse(request.body);

  const assignBonusUseCase = makeAssignBonusUseCase();

  await assignBonusUseCase.execute({
    userId,
    bookingId,
    type,
    description,
  });

  return reply.status(201).send();
}
