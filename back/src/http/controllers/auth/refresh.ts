import { FastifyReply, FastifyRequest } from 'fastify';
import { TokenService } from '@/services/token-service';
import { InvalidTokenError } from '@/use-cases/errors/invalid-token-error';

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await verifyRefreshToken(request);

    const tokenService = new TokenService(reply);
    const { token, refreshToken } = await tokenService.generateTokens({
      id: request.user.sub,
      role: request.user.role,
    });

    return tokenService
      .setAuthCookies(token, refreshToken)
      .status(200)
      .send({ token });
  } catch (err) {
    if (err instanceof InvalidTokenError) {
      return reply
        .status(401)
        .clearCookie('refreshToken')
        .send({ message: 'Token inválido ou expirado' });
    }

    throw err;
  }
}

async function verifyRefreshToken(request: FastifyRequest) {
  if (!request.cookies.refreshToken) {
    throw new InvalidTokenError();
  }

  try {
    await request.jwtVerify({ onlyCookie: true });
  } catch (err) {
    throw new InvalidTokenError();
  }
}