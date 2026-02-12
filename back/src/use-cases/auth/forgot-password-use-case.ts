import { IUsersRepository } from '@/repositories/users-repository';
import { IPasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository';
import { EmailService } from '@/services/email-service';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { PASSWORD_RESET_TOKEN_EXPIRATION_HOURS } from '@/consts/const';

interface ForgotPasswordUseCaseRequest {
  email: string;
}

export class ForgotPasswordUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private passwordResetTokensRepository: IPasswordResetTokensRepository,
    private emailService: EmailService,
  ) {}

  async execute({ email }: ForgotPasswordUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = addHours(new Date(), PASSWORD_RESET_TOKEN_EXPIRATION_HOURS);

    await this.passwordResetTokensRepository.create(token, user.id, expiresAt);
    await this.emailService.sendPasswordResetEmail(user.email, token);
  }
}

