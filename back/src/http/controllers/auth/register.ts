import { FastifyRequest, FastifyReply } from 'fastify';
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-use-case';
import { registerUserSchema } from '@/schemas/user';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { InsufficientPermissionsError } from '@/use-cases/errors/insufficient-permissions-error';
import { ZodError } from 'zod';
import { formatZodError } from '@/utils/formatZodError';

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = registerUserSchema.parse(request.body);

  try {
    const registerUserUseCase = makeRegisterUserUseCase();

    await registerUserUseCase.execute({
      ...data,
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

    if (err instanceof ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
