import { IUsersRepository } from '@/repositories/users-repository';
import { IPasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository';
import bcrypt from 'bcryptjs';
import { PASSWORD_HASH_ROUNDS } from '@/consts/const';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { ExpiredTokenError } from '../errors/expired-token-error';

interface ResetPasswordUseCaseRequest {
  token: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private passwordResetTokensRepository: IPasswordResetTokensRepository,
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

    const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_HASH_ROUNDS);

    await Promise.all([
      this.usersRepository.updatePassword(resetToken.userId, hashedPassword),
      this.passwordResetTokensRepository.delete(resetToken.id),
    ]);
  }
}

