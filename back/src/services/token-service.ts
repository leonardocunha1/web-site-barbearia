import { FastifyReply } from 'fastify';
import {
  ACCESS_TOKEN_EXPIRATION_SECONDS,
  REFRESH_TOKEN_EXPIRATION_SECONDS,
} from '@/consts/const';

interface UserForToken {
  id: string;
  role: string;
  professionalId?: string;
}

interface TokenPayload {
  id: string;
  role: string;
  professionalId?: string;
}

export class TokenService {
  private readonly isProduction: boolean;
  private readonly refreshTokenExpiration = REFRESH_TOKEN_EXPIRATION_SECONDS;
  private readonly accessTokenExpiration = ACCESS_TOKEN_EXPIRATION_SECONDS;

  constructor(private reply: FastifyReply) {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  private createTokenPayload(user: UserForToken | TokenPayload) {
    const payload: { role: string; professionalId?: string } = {
      role: user.role,
    };

    if (user.role === 'PROFESSIONAL' && user.professionalId) {
      payload.professionalId = user.professionalId;
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
