import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetBalanceUseCase } from '@/use-cases/factories/make-get-balance-use-case';

export async function getBalance(request: FastifyRequest, reply: FastifyReply) {
  const getBalanceUseCase = makeGetBalanceUseCase();

  const balance = await getBalanceUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send(balance);
}
