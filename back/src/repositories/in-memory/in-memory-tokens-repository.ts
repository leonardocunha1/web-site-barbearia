import {
  VerificationTokensRepository,
  VerificationToken,
} from '@/repositories/verification-tokens-repository';

import { randomUUID } from 'crypto';

export class InMemoryVerificationTokensRepository
  implements VerificationTokensRepository
{
  public tokens: VerificationToken[] = [];

  async create(
    token: string,
    userId: string,
    expiresAt: Date,
  ): Promise<VerificationToken> {
    const verificationToken: VerificationToken = {
      id: randomUUID(),
      token,
      userId,
      expiresAt,
      createdAt: new Date(),
    };

    this.tokens.push(verificationToken);

    return verificationToken;
  }

  async findByToken(token: string): Promise<VerificationToken | null> {
    return this.tokens.find((t) => t.token === token) || null;
  }

  async delete(id: string): Promise<void> {
    this.tokens = this.tokens.filter((t) => t.id !== id);
  }
}
