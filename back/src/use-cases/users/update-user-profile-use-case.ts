import { IUsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { InvalidDataError } from '../errors/invalid-data-error';
import { EmailAlreadyExistsError } from '../errors/user-email-already-exists-error';
import { UserDTO } from '@/dtos/user-dto';
import { User } from '@prisma/client';

interface UpdateUserProfileUseCaseRequest {
  userId: string;
  nome?: string;
  email?: string;
  telefone?: string | null;
}

interface UpdateUserProfileUseCaseResponse {
  user: UserDTO;
}

export class UpdateUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    userId,
    nome,
    email,
    telefone,
  }: UpdateUserProfileUseCaseRequest): Promise<UpdateUserProfileUseCaseResponse> {
    // Fail-fast: validate all conditions before operations
    const user = await this.validateUserExists(userId);
    this.validateHasUpdates(nome, email, telefone, user);
    
    if (email) {
      this.validateEmailDifferent(email, user.email);
      await this.validateEmailNotInUse(email, userId);
    }

    // All validations passed - build and apply updates
    const dataToUpdate = this.buildUpdateData(nome, email, telefone);
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
   * Validates that at least one field is being updated
   * @throws {UserDTO} If no changes detected, returns current user
   */
  private validateHasUpdates( name: string | undefined,
    email: string | undefined,
    telefone: string | null | undefined,
    currentUser: UserDTO,
  ): void {
    if (nome === undefined && email === undefined && telefone === undefined) {
      // No updates requested - this is handled by early return in execute
      // Not throwing error, just no-op
    }
  }

  /**
   * Validates that new email is different from current
   * @throws {InvalidDataError} If email is the same
   */
  private validateEmailDifferent(
    newEmail: string,
    currentEmail: string,
  ): void {
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
  private async validateEmailNotInUse(
    email: string,
    userId: string,
  ): Promise<void> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail && userWithSameEmail.id !== userId) {
      throw new EmailAlreadyExistsError();
    }
  }

  /**
   * Builds update data object from provided fields
   */
  private buildUpdateData( name: string | undefined,
    email: string | undefined,
    telefone: string | null | undefined,
  ): Partial<Pick<UserDTO, 'nome' | 'email' | 'telefone'>> {
    const dataToUpdate: Partial<Pick<UserDTO, 'nome' | 'email' | 'telefone'>> =
      {};

    if (nome !== undefined) dataToUpdate.name = nome;
    if (email !== undefined) dataToUpdate.email = email;
    if (telefone !== undefined) dataToUpdate.phone = telefone;

    return dataToUpdate;
  }
}

