export interface VerificationToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface VerificationTokensRepository {
  create(token: string, userId: string, expiresAt: Date): Promise<VerificationToken>;
  findByToken(token: string): Promise<VerificationToken | null>;
  delete(id: string): Promise<void>;
}