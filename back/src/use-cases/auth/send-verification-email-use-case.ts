import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { UsersRepository } from '@/repositories/users-repository';
import { VerificationTokensRepository } from '@/repositories/verification-tokens-repository';
import { EmailService } from '@/services/email-service';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserEmailAlreadyVerifiedError } from '../errors/user-email-already-verified-error';

interface SendVerificationEmailRequest {
  email: string;
}

export class SendVerificationEmailUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private verificationTokensRepository: VerificationTokensRepository,
    private emailService: EmailService,
  ) {}

  async execute({ email }: SendVerificationEmailRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.emailVerified) {
      throw new UserEmailAlreadyVerifiedError();
    }

    const token = randomUUID();
    const expiresAt = dayjs().add(24, 'hours').toDate();

    await this.verificationTokensRepository.create(token, user.id, expiresAt);

    await this.emailService.sendVerificationEmail(user.email, token);
  }
}
