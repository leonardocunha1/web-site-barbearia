import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { TokenService } from '@/services/token-service';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { InactiveUserError } from '@/use-cases/errors/inactive-user-error';
import { EmailNotVerifiedError } from '@/use-cases/errors/user-email-not-verified-error';
import { formatZodError } from '@/utils/formatZodError';
import { loginUserSchema } from '@/schemas/user';
import { UserDTO } from '@/dtos/user-dto';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, senha } = loginUserSchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();
    const { user } = await authenticateUseCase.execute({ email, senha });

    const tokenService = new TokenService(reply);
    const { token, refreshToken } = await tokenService.generateTokens(user);

    const userWithoutPassword: UserDTO = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      createdAt: user.createdAt,
      telefone: user.telefone,
      emailVerified: user.emailVerified,
      active: user.active,
    };


    return tokenService
      .setAuthCookies(token, refreshToken)
      .status(200)
      .send({ token, user: userWithoutPassword });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message });
    }
    if (
      err instanceof InactiveUserError ||
      err instanceof EmailNotVerifiedError
    ) {
      return reply.status(403).send({ message: err.message });
    }

    if (err instanceof z.ZodError) {
      return reply.status(400).send(formatZodError(err));
    }

    throw err;
  }
}
