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
  private readonly refreshTokenExpiration = '7d';
  private readonly accessTokenExpiration = '1h';

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

    const [token, refreshToken] = await Promise.all([
      this.reply.jwtSign(payload, {
        sign: { sub: user.id, expiresIn: this.accessTokenExpiration }
      }),
      this.reply.jwtSign(payload, {
        sign: { sub: user.id, expiresIn: this.refreshTokenExpiration }
      })
    ]);

    return { token, refreshToken };
  }

  async generateTokensFromPayload(payload: TokenPayload) {
    return this.generateTokens(payload); // Reutiliza a mesma lógica
  }

  setAuthCookies(token: string, refreshToken: string) {
    const cookieOptions = {
      path: '/',
      secure: this.isProduction,
      httpOnly: true,
      sameSite: 'strict' as const,
    };

    this.reply
      .setCookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      })
      .setCookie('accessToken', token, {
        ...cookieOptions,
        maxAge: 60 * 60, // 1 hora
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