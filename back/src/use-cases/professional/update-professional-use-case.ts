import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { IUsersRepository } from '@/repositories/users-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { UpdateProfessionalUseCaseRequest } from './types';

export class UpdateProfessionalUseCase {
  constructor(
    private professionalsRepository: IProfessionalsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute(data: UpdateProfessionalUseCaseRequest) {
    const professional = await this.professionalsRepository.findById(data.id);

    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    if (data.name !== undefined || data.email !== undefined || data.phone !== undefined) {
      await this.usersRepository.update(professional.userId, {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
      });
    }

    return this.professionalsRepository.update(data.id, {
      specialty: data.specialty,
      bio: data.bio,
      document: data.document,
      active: data.active,
      updatedAt: new Date(),
      avatarUrl: data.avatarUrl,
    });
  }
}
