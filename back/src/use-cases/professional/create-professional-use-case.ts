import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { IUsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserAlreadyProfessionalError } from '../errors/user-already-professional-error';
import { UserCannotBeProfessionalError } from '../errors/user-cannot-be-professional-error';
import { CreateProfessionalUseCaseRequest } from './types';

export class CreateProfessionalUseCase {
  constructor(
    private professionalsRepository: IProfessionalsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute(data: CreateProfessionalUseCaseRequest) {
    // Fail-fast: validate all business rules
    const user = await this.validateUserExists(data.email);
    this.validateUserCanBeProfessional(user);
    await this.validateUserNotAlreadyProfessional(user.id);

    await this.usersRepository.update(user.id, { role: 'PROFESSIONAL' });

    return this.professionalsRepository.create({
      specialty: data.specialty,
      bio: data.bio,
      document: data.document,
      active: data.active ?? true,
      avatarUrl: data.avatarUrl,
      user: { connect: { id: user.id } },
    });
  }

  /**
   * Validates that user exists and returns it
   * @throws {UserNotFoundError} If user not found
   */
  private async validateUserExists(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  /**
   * Validates that user can become a professional
   * @throws {UserCannotBeProfessionalError} If user is admin
   */
  private validateUserCanBeProfessional(user: { role: string }): void {
    if (user.role === 'ADMIN') {
      throw new UserCannotBeProfessionalError();
    }
  }

  /**
   * Validates that user is not already a professional
   * @throws {UserAlreadyProfessionalError} If user is already professional
   */
  private async validateUserNotAlreadyProfessional(userId: string): Promise<void> {
    const existingProfessional = await this.professionalsRepository.findByUserId(userId);

    if (existingProfessional) {
      throw new UserAlreadyProfessionalError();
    }
  }
}
