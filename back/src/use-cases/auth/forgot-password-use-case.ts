import { UsersRepository } from '@/repositories/users-repository';
import { PasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository';
import { EmailService } from '@/services/email-service';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';
import { UserNotFoundError } from '../errors/user-not-found-error';

interface ForgotPasswordUseCaseRequest {
  email: string;
}

export class ForgotPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordResetTokensRepository: PasswordResetTokensRepository,
    private emailService: EmailService,
  ) {}

  async execute({ email }: ForgotPasswordUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = addHours(new Date(), 2); // Token expira em 2 horas

    await this.passwordResetTokensRepository.create(token, user.id, expiresAt);
    await this.emailService.sendPasswordResetEmail(user.email, token);
  }
}
