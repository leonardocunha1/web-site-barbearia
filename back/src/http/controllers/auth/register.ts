import { FastifyRequest, FastifyReply } from 'fastify';
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-use-case';
import { registerUserSchema } from '@/schemas/user';

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = registerUserSchema.parse(request.body);
  const registerUserUseCase = makeRegisterUserUseCase();

  await registerUserUseCase.execute({
    ...date,
    requestRole: request.user?.role,
  });

  return reply.status(201).send();
}
