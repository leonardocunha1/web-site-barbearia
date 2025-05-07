import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { formatZodError } from '@/utils/formatZodError';
import { makeGetBalanceUseCase } from '@/use-cases/factories/make-get-balance-use-case';

export async function getBalance(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getBalanceUseCase = makeGetBalanceUseCase();

    const balance = await getBalanceUseCase.execute({
      userId: request.user.sub,
    });

    return reply.status(200).send(balance);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}
