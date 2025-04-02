import { FastifyReply } from 'fastify';

interface UserForToken {
  id: string;
  role: string;
}

interface TokenPayload {
  id: string;
  role: string;
}

export class TokenService {
  constructor(private reply: FastifyReply) {}

  async generateTokens(user: UserForToken) {
    const token = await this.reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id } }
    );

    const refreshToken = await this.reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: '7d' } }
    );

    return { token, refreshToken };
  }

  async generateTokensFromPayload(payload: TokenPayload) {
    const token = await this.reply.jwtSign(
      { role: payload.role },
      { sign: { sub: payload.id } }
    );
  
    const refreshToken = await this.reply.jwtSign(
      { role: payload.role },
      { sign: { sub: payload.id, expiresIn: '7d' } }
    );
  
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