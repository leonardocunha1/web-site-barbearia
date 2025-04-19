import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';

export class ToggleProfessionalStatusUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute(professionalId: string) {
    const professional =
      await this.professionalsRepository.findById(professionalId);

    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    return this.professionalsRepository.update(professionalId, {
      ativo: !professional.ativo,
    });
  }
}
