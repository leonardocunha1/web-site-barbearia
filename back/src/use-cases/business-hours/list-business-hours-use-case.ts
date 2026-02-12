import { IBusinessHoursRepository } from '@/repositories/business-hours-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { ListBusinessHoursUseCaseRequest } from './types';

export class ListBusinessHoursUseCase {
  constructor(
    private businessHoursRepository: IBusinessHoursRepository,
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  async execute({ professionalId }: ListBusinessHoursUseCaseRequest) {
    const professional = await this.professionalsRepository.findById(professionalId);
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    const horarios = await this.businessHoursRepository.listByProfessional(professionalId);

    if (horarios.length === 0) {
      return [];
    }

    return horarios;
  }
}
