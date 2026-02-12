import { anonymizeUserParamsSchema } from '@/schemas/user';
import { makeAnonymizeUserUseCase } from '@/use-cases/factories/make-anonymize-user-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function anonymizeUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userIdToAnonymize } = anonymizeUserParamsSchema.parse(request.params);

  const role = request.user.role;
  const userId = request.user.sub;

  const anonymizeUserUseCase = makeAnonymizeUserUseCase();
  await anonymizeUserUseCase.execute({
    userIdToAnonymize,
    userId,
    role,
  });

  return reply.status(204).send();
}
