import { anonymizeUserParamsSchema } from '@/schemas/user';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { UsuarioTentandoPegarInformacoesDeOutro } from '@/use-cases/errors/usuario-pegando-informacao-de-outro-usuario-error';
import { makeAnonymizeUserUseCase } from '@/use-cases/factories/make-anonymize-user-use-case';
import { formatZodError } from '@/utils/formatZodError';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function anonymizeUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { userIdToAnonymize } = anonymizeUserParamsSchema.parse(
      request.params,
    );

    const role = request.user.role;
    const userId = request.user.sub;

    const anonymizeUserUseCase = makeAnonymizeUserUseCase();
    await anonymizeUserUseCase.execute({
      userIdToAnonymize,
      userId,
      role,
    });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof UsuarioTentandoPegarInformacoesDeOutro) {
      return reply.status(403).send({ message: error.message });
    }

    if (error instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(error));
    }

    throw error;
  }
}
