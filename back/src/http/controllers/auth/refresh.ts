import { FastifyReply, FastifyRequest } from 'fastify';
import { TokenService } from '@/services/token-service';
import { InvalidTokenError } from '@/use-cases/errors/invalid-token-error';

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = await verifyRefreshToken(request);

    const tokenService = new TokenService(reply);
    const { token, refreshToken } = await tokenService.generateTokens({
      id: payload.sub,
      role: payload.role,
      professionalId: payload.professionalId,
    });
    
    return tokenService
      .setAuthCookies(token, refreshToken)
      .status(200)
      .send({ token, refreshToken });
  } catch (err) {
    if (err instanceof InvalidTokenError) {
      reply.clearCookie('refreshToken');
    }

    throw err;
  }
}

async function verifyRefreshToken(request: FastifyRequest) {
  const refreshToken = request.cookies.refreshToken;

  if (!refreshToken) {
    throw new InvalidTokenError();
  }

  try {
    const payload = request.server.jwt.verify(refreshToken) as {
      sub: string;
      role: string;
      professionalId?: string;
    };

    if (!payload?.sub || !payload?.role) {
      throw new InvalidTokenError();
    }

    return payload;
  } catch (err) {
    throw new InvalidTokenError();
  }
}