import { randomUUID } from 'crypto';
import { addHours } from 'date-fns';
import { IUsersRepository } from '@/repositories/users-repository';
import { IVerificationTokensRepository } from '@/repositories/verification-tokens-repository';
import { EmailService } from '@/services/email-service';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserEmailAlreadyVerifiedError } from '../errors/user-email-already-verified-error';
import { EMAIL_VERIFICATION_TOKEN_EXPIRATION_HOURS } from '@/consts/const';

interface SendVerificationEmailRequest {
  email: string;
}

export class SendVerificationEmailUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private verificationTokensRepository: IVerificationTokensRepository,
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
    const expiresAt = addHours(new Date(), EMAIL_VERIFICATION_TOKEN_EXPIRATION_HOURS);

    await this.verificationTokensRepository.create(token, user.id, expiresAt);

    await this.emailService.sendVerificationEmail(user.email, token);
  }
}
