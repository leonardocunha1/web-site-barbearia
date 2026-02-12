import { FastifyRequest, FastifyReply } from 'fastify';
import { makeVerifyEmailUseCase } from '@/use-cases/factories/make-verify-email-use-case';
import { verifyEmailQuerySchema } from '@/schemas/tokens';

export async function verifyEmail(request: FastifyRequest, reply: FastifyReply) {
  const { token } = verifyEmailQuerySchema.parse(request.query);
  const verifyEmailUseCase = makeVerifyEmailUseCase();

  await verifyEmailUseCase.execute({
    verificationToken: token,
  });

  return reply.status(200).send({ message: 'E-mail verificado com sucesso' });
}
