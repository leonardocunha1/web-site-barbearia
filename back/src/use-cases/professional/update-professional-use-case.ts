import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';

interface UpdateProfessionalUseCaseRequest {
  id: string;
  especialidade?: string;
  bio?: string | null;
  documento?: string | null;
  ativo?: boolean;
  avatarUrl?: string | null;
}

export class UpdateProfessionalUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute(data: UpdateProfessionalUseCaseRequest) {
    const professional = await this.professionalsRepository.findById(data.id);

    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    return this.professionalsRepository.update(data.id, {
      especialidade: data.especialidade,
      bio: data.bio,
      documento: data.documento,
      ativo: data.ativo,
      updatedAt: new Date(),
      avatarUrl: data.avatarUrl,
    });
  }
}
