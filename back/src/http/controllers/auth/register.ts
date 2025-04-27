import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-use-case';
import { InsufficientPermissionsError } from '@/use-cases/errors/insufficient-permissions-error';

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    senha: z.string().min(6),
    role: z.enum(['ADMIN', 'CLIENTE', 'PROFISSIONAL']).optional(),
  });

  const { nome, email, senha, role } = registerBodySchema.parse(request.body);

  try {
    const registerUserUseCase = makeRegisterUserUseCase();

    await registerUserUseCase.execute({
      nome,
      email,
      senha,
      role,
      requestRole: request.user?.role,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    if (err instanceof InsufficientPermissionsError) {
      return reply.status(403).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        issues: err.format(),
      });
    }

    throw err;
  }
}
