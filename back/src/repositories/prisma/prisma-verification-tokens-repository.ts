import { VerificationTokensRepository, VerificationToken } from '@/repositories/verification-tokens-repository';
import { prisma } from '@/lib/prisma';

export class PrismaVerificationTokensRepository implements VerificationTokensRepository {
  async create(token: string, userId: string, expiresAt: Date): Promise<VerificationToken> {
    const verificationToken = await prisma.verificationToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return {
      id: verificationToken.id,
      token: verificationToken.token,
      userId: verificationToken.userId,
      expiresAt: verificationToken.expiresAt,
      createdAt: verificationToken.createdAt,
    };
  }

  async findByToken(token: string): Promise<VerificationToken | null> {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  }

  async delete(id: string): Promise<void> {
    await prisma.verificationToken.delete({
      where: { id },
    });
  }
}