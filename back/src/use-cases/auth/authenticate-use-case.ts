import { IUsersRepository } from '@/repositories/users-repository';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { InactiveUserError } from '../errors/inactive-user-error';
import bcrypt from 'bcryptjs';
import { EmailNotVerifiedError } from '../errors/user-email-not-verified-error';
import { User } from '@prisma/client';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';

interface AuthenticateRequest {
  email: string;
  password: string;
}

interface AuthenticateResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  async execute({ email, password }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email);

    this.validateUserExists(user);
    await this.validatePassword(password, user.password);
    this.validateEmailVerified(user);
    this.validateUserActive(user);
    await this.validateProfessionalActive(user);

    return { user };
  }

  /**
   * Validates if user exists
   * @throws {InvalidCredentialsError} If user not found
   */
  private validateUserExists(user: User | null): asserts user is User {
    if (!user) {
      throw new InvalidCredentialsError();
    }
  }

  /**
   * Validates user password
   * @throws {InvalidCredentialsError} If password doesn't match
   */
  private async validatePassword(providedPassword: string, hashedPassword: string): Promise<void> {
    const passwordMatches = await bcrypt.compare(providedPassword, hashedPassword);
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }
  }

  /**
   * Validates if user email is verified
   * @throws {EmailNotVerifiedError} If email not verified
   */
  private validateEmailVerified(user: User): void {
    if (!user.emailVerified) {
      throw new EmailNotVerifiedError();
    }
  }

  /**
   * Validates if user account is active
   * @throws {InactiveUserError} If user is inactive
   */
  private validateUserActive(user: User): void {
    if (!user.active) {
      throw new InactiveUserError();
    }
  }

  /**
   * Validates if professional is active (for professional users)
   * @throws {InactiveUserError} If professional is inactive
   */
  private async validateProfessionalActive(user: User): Promise<void> {
    if (user.role === 'PROFESSIONAL') {
      const professional = await this.professionalsRepository.findByUserId(user.id);

      if (!professional?.active) {
        throw new InactiveUserError();
      }
    }
  }
}
