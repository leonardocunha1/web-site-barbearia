import {
  PasswordResetTokensRepository,
  PasswordResetToken,
} from '@/repositories/password-reset-tokens-repository';
import { prisma } from '@/lib/prisma';

export class PrismaPasswordResetTokensRepository
  implements PasswordResetTokensRepository
{
  async create(
    token: string,
    userId: string,
    expiresAt: Date,
  ): Promise<PasswordResetToken> {
    // Primeiro remove tokens existentes para o usuário
    await this.deleteByUserId(userId);

    const passwordResetToken = await prisma.passwordResetToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return passwordResetToken;
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  }

  async delete(id: string): Promise<void> {
    await prisma.passwordResetToken.delete({
      where: { id },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
  }
}
