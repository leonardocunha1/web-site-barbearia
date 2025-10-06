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
  private readonly isProduction: boolean;
  private readonly refreshTokenExpiration = 60 * 60 * 24 * 7; // 7 dias em segundos
  private readonly accessTokenExpiration = 60 * 60; // 1 hora em segundos

  constructor(private reply: FastifyReply) {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  private createTokenPayload(user: UserForToken | TokenPayload) {
    const payload: { role: string; profissionalId?: string } = {
      role: user.role,
    };

    if (user.role === 'PROFISSIONAL' && user.profissionalId) {
      payload.profissionalId = user.profissionalId;
    }

    return payload;
  }

  async generateTokens(user: UserForToken) {
    const payload = this.createTokenPayload(user);

    const [accessToken, refreshToken] = await Promise.all([
      this.reply.jwtSign(payload, {
        sign: { sub: user.id, expiresIn: `${this.accessTokenExpiration}s` },
      }),
      this.reply.jwtSign(payload, {
        sign: { sub: user.id, expiresIn: `${this.refreshTokenExpiration}s` },
      }),
    ]);

    return { token: accessToken, refreshToken };
  }

  async generateTokensFromPayload(payload: TokenPayload) {
    return this.generateTokens(payload);
  }

  setAuthCookies(accessToken: string, refreshToken: string) {
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'strict' as const : 'lax' as const, 
    };

    // Refresh token -> sempre cookie
    this.reply.setCookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: this.refreshTokenExpiration,
    });

    // Access token -> cookie opcional, mas pode ser útil para SSR
    this.reply.setCookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: this.accessTokenExpiration,
    });

    return this.reply;
  }

  clearAuthCookies() {
    this.reply
      .clearCookie('accessToken', { path: '/' })
      .clearCookie('refreshToken', { path: '/' });
    return this.reply;
  }
}
