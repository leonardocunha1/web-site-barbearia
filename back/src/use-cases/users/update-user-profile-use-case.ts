import { IUsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { InvalidDataError } from '../errors/invalid-data-error';
import { EmailAlreadyExistsError } from '../errors/user-email-already-exists-error';
import { UserDTO } from '@/dtos/user-dto';
import { User, Prisma } from '@prisma/client';

interface UpdateUserProfileUseCaseRequest {
  userId: string;
  name?: string;
  email?: string;
  phone?: string | null;
}

interface UpdateUserProfileUseCaseResponse {
  user: UserDTO;
}

export class UpdateUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
    name,
    email,
    phone,
  }: UpdateUserProfileUseCaseRequest): Promise<UpdateUserProfileUseCaseResponse> {
    // Fail-fast: validate all conditions before operations
    const user = await this.validateUserExists(userId);

    // If no updates requested, return current user
    if (name === undefined && email === undefined && phone === undefined) {
      return { user };
    }

    if (email) {
      this.validateEmailDifferent(email, user.email);
      await this.validateEmailNotInUse(email, userId);
    }

    // All validations passed - build and apply updates
    const dataToUpdate = this.buildUpdateData(name, email, phone);
    const updatedUser = await this.usersRepository.update(userId, dataToUpdate);

    return { user: updatedUser };
  }

  /**
   * Validates that user exists
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
   * Validates that new email is different from current
   * @throws {InvalidDataError} If email is the same
   */
  private validateEmailDifferent(newEmail: string, currentEmail: string): void {
    if (newEmail === currentEmail) {
      throw new InvalidDataError(
        'O email informado é o mesmo que o atual. Por favor, forneça um novo email.',
      );
    }
  }

  /**
   * Validates that email is not already in use by another user
   * @throws {EmailAlreadyExistsError} If email is taken
   */
  private async validateEmailNotInUse(email: string, userId: string): Promise<void> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail && userWithSameEmail.id !== userId) {
      throw new EmailAlreadyExistsError();
    }
  }

  /**
   * Builds update data object from provided fields
   */
  private buildUpdateData(
    name: string | undefined,
    email: string | undefined,
    phone: string | null | undefined,
  ): Prisma.UserUpdateInput {
    const dataToUpdate: Record<string, any> = {};

    if (name !== undefined) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email;
    if (phone !== undefined) dataToUpdate.phone = phone;

    return dataToUpdate as Prisma.UserUpdateInput;
  }
}
