import { UsersRepository } from '@/repositories/users-repository';
import { PasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository';
import { hash } from 'bcryptjs';
import { InvalidTokenError } from './errors/invalid-token-error';
import { ExpiredTokenError } from './errors/expired-token-error';

interface ResetPasswordUseCaseRequest {
  token: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordResetTokensRepository: PasswordResetTokensRepository,
  ) {}

  async execute({
    token,
    newPassword,
  }: ResetPasswordUseCaseRequest): Promise<void> {
    const resetToken =
      await this.passwordResetTokensRepository.findByToken(token);

    if (!resetToken) {
      throw new InvalidTokenError();
    }

    if (resetToken.expiresAt < new Date()) {
      throw new ExpiredTokenError();
    }

    const hashedPassword = await hash(newPassword, 6);

    await Promise.all([
      this.usersRepository.updatePassword(resetToken.userId, hashedPassword),
      this.passwordResetTokensRepository.delete(resetToken.id),
    ]);
  }
}
