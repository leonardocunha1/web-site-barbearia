import { FastifyReply } from 'fastify';

interface UserForToken {
  id: string;
  role: string;
  profissionalId?: string;
}

interface TokenPayload {
  id: string;
  role: string;
  profissionalId?: string;
}

export class TokenService {
  constructor(private reply: FastifyReply) {}

  async generateTokens(user: UserForToken) {
    // Crie um payload base
    const payload: { role: string; profissionalId?: string } = {
      role: user.role,
    };

    // Se for um PROFISSIONAL, adicione o profissionalId ao payload
    if (user.role === 'PROFISSIONAL' && user.profissionalId) {
      payload.profissionalId = user.profissionalId;
    }

    const token = await this.reply.jwtSign(
      payload, // Use o payload modificado aqui
      { sign: { sub: user.id } },
    );

    const refreshToken = await this.reply.jwtSign(
      payload, // Use o mesmo payload para o refresh token
      { sign: { sub: user.id, expiresIn: '7d' } },
    );

    return { token, refreshToken };
  }

  async generateTokensFromPayload(payload: TokenPayload) {
    const tokenPayload: { role: string; profissionalId?: string } = {
      role: payload.role,
    };

    if (payload.role === 'PROFISSIONAL' && payload.profissionalId) {
      tokenPayload.profissionalId = payload.profissionalId;
    }

    const token = await this.reply.jwtSign(tokenPayload, {
      sign: { sub: payload.id },
    });

    const refreshToken = await this.reply.jwtSign(tokenPayload, {
      sign: { sub: payload.id, expiresIn: '7d' },
    });

    return { token, refreshToken };
  }

  setAuthCookies(token: string, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    const sevenDaysInSeconds = 60 * 60 * 24 * 7;
    const oneHourInSeconds = 60 * 60;

    return this.reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: isProduction,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: sevenDaysInSeconds,
      })
      .setCookie('accessToken', token, {
        path: '/',
        secure: isProduction,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: oneHourInSeconds,
      });
  }
}
