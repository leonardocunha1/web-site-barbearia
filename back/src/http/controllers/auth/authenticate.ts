import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { TokenService } from '@/services/token-service';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { InactiveUserError } from '@/use-cases/errors/inactive-user-error';
import { EmailNotVerifiedError } from '@/use-cases/errors/user-email-not-verified-error';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    senha: z.string().min(6),
  });

  const { email, senha } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();
    const { user } = await authenticateUseCase.execute({ email, senha });

    const tokenService = new TokenService(reply);
    const { token, refreshToken } = await tokenService.generateTokens(user);

    return tokenService
      .setAuthCookies(token, refreshToken)
      .status(200)
      .send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: 'Credenciais inválidas' });
    }
    if (err instanceof InactiveUserError) {
      return reply.status(403).send({ message: 'Conta desativada' });
    }

    if (err instanceof EmailNotVerifiedError) {
      return reply.status(403).send({ message: 'Email não verificado' });
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
