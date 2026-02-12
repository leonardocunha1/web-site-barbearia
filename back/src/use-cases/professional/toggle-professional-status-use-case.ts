import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { Professional } from '@prisma/client';

export class ToggleProfessionalStatusUseCase {
  constructor(private professionalsRepository: IProfessionalsRepository) {}

  async execute(professionalId: string): Promise<Professional> {
    // Fail-fast: validate before operation
    const professional = await this.validateProfessionalExists(professionalId);

    // All validations passed - proceed with operation
    return this.professionalsRepository.update(professionalId, {
      ativo: !professional.active,
    });
  }

  /**
   * Validates that professional exists
   * @throws {ProfessionalNotFoundError} If professional is not found
   */
  private async validateProfessionalExists(
    professionalId: string,
  ): Promise<Professional> {
    const professional =
      await this.professionalsRepository.findById(professionalId);
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }
    return professional;
  }
}

