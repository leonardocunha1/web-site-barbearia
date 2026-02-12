import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { UpdateProfessionalUseCaseRequest } from './types';

export class UpdateProfessionalUseCase {
  constructor(private professionalsRepository: IProfessionalsRepository) {}

  async execute(data: UpdateProfessionalUseCaseRequest) {
    const professional = await this.professionalsRepository.findById(data.id);

    if (!professional) {
      throw new ProfessionalNotFoundError();
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
