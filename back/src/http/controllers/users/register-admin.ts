import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { makeRegisterAdminUseCase } from '@/use-cases/factories/make-register-admin-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function registerAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    senha: z.string().min(6),
  });

  const { nome, email, senha } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterAdminUseCase();

    await registerUseCase.execute({
      nome,
      email,
      senha,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
