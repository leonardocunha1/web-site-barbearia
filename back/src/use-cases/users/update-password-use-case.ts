import bcrypt from 'bcryptjs';
import { PASSWORD_HASH_ROUNDS } from '@/consts/const';
import { IUsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { SamePasswordError } from '../errors/same-password-error';
import { User } from '@prisma/client';

interface UpdatePasswordUseCaseRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

interface UpdatePasswordUseCaseResponse {
  user: {
    id: string;
    email: string;
  };
}

export class UpdatePasswordUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
    currentPassword,
    newPassword,
  }: UpdatePasswordUseCaseRequest): Promise<UpdatePasswordUseCaseResponse> {
    // Fail-fast: validate all conditions before operations
    const user = await this.validateUserExists(userId);
    await this.validateCurrentPassword(currentPassword, user.password);
    await this.validateNewPasswordDifferent(newPassword, user.password);

    // All validations passed - proceed with operation
    const hashedPassword = await this.hashPassword(newPassword);
    await this.usersRepository.updatePassword(userId, hashedPassword);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  /**
   * Validates that user exists in database
   * @throws {UserNotFoundError} If user is not found
   */
  private async validateUserExists(userId: string): Promise<User> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  /**
   * Validates that current password matches user's password
   * @throws {InvalidCredentialsError} If password doesn't match
   */
  private async validateCurrentPassword(
    currentPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const doesPasswordMatch = await bcrypt.compare(currentPassword, hashedPassword);
    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }
  }

  /**
   * Validates that new password is different from current password
   * @throws {SamePasswordError} If new password equals current password
   */
  private async validateNewPasswordDifferent(
    newPassword: string,
    currentHashedPassword: string,
  ): Promise<void> {
    const isSamePassword = await bcrypt.compare(newPassword, currentHashedPassword);
    if (isSamePassword) {
      throw new SamePasswordError();
    }
  }

  /**
   * Hashes password with configured rounds
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
  }
}
