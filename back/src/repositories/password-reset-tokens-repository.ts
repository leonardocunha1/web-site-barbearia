export interface PasswordResetToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IPasswordResetTokensRepository {
  create(
    token: string,
    userId: string,
    expiresAt: Date,
  ): Promise<PasswordResetToken>;
  findByToken(token: string): Promise<PasswordResetToken | null>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}

