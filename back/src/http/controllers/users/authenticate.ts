// src/controllers/auth/authenticate.ts
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { TokenService } from '@/services/token-service';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { InactiveUserError } from '@/use-cases/errors/inactive-user-error';

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

    return tokenService.setAuthCookies(token, refreshToken)
      .status(200)
      .send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: 'Credenciais inválidas' });
    }
    if (err instanceof InactiveUserError) {
      return reply.status(403).send({ message: 'Conta desativada' });
    }
    
    console.error('Authentication error:', err);
    return reply.status(500).send({ message: 'Erro interno no servidor' });
  }
}