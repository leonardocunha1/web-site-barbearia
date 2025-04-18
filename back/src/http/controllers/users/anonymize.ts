import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { makeAnonymizeUserUseCase } from '@/use-cases/factories/make-anonymize-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function anonymizeUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const anonymizeUserParamsSchema = z.object({
    userId: z.string().uuid(),
  });

  try {
    const { userId } = anonymizeUserParamsSchema.parse(request.params);

    const anonymizeUserUseCase = makeAnonymizeUserUseCase();
    await anonymizeUserUseCase.execute(userId);

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Validation error',
        issues: error.format(),
      });
    }

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
