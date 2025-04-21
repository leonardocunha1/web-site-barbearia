import { VerificationTokensRepository } from '@/repositories/verification-tokens-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { InvalidTokenError } from '../errors/invalid-token-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserAlreadyVerifiedError } from '../errors/user-already-verified-error';

interface VerifyEmailRequest {
  verificationToken: string;
}

export class VerifyEmailUseCase {
  constructor(
    private verificationTokensRepository: VerificationTokensRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ verificationToken }: VerifyEmailRequest): Promise<void> {
    const verificationTokenEntity =
      await this.verificationTokensRepository.findByToken(verificationToken);

    if (!verificationTokenEntity) {
      throw new InvalidTokenError();
    }

    const user = await this.usersRepository.findById(
      verificationTokenEntity.userId,
    );

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.emailVerified) {
      throw new UserAlreadyVerifiedError();
    }

    // Verifica se o token expirou (24h de validade)
    const tokenExpired = new Date() > verificationTokenEntity.expiresAt;

    if (tokenExpired) {
      await this.verificationTokensRepository.delete(
        verificationTokenEntity.id,
      );
      throw new InvalidTokenError();
    }

    // Atualiza o usuário
    await this.usersRepository.update(user.id, {
      emailVerified: new Date(), // Armazena a data de verificação
    });

    // Remove o token de verificação
    await this.verificationTokensRepository.delete(verificationTokenEntity.id);
  }
}
