import { HorariosFuncionamentoRepository } from '@/repositories/horarios-funcionamento-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { BusinessHoursNotFoundError } from '../errors/businnes-hours-not-found-error';

interface ListBusinessHoursUseCaseRequest {
  professionalId: string;
}

export class ListBusinessHoursUseCase {
  constructor(
    private horariosRepository: HorariosFuncionamentoRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute({ professionalId }: ListBusinessHoursUseCaseRequest) {
    const professional =
      await this.professionalsRepository.findById(professionalId);
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    const horarios = this.horariosRepository.listByProfessional(professionalId);

    if (!horarios) {
      throw new BusinessHoursNotFoundError();
    }

    return horarios;
  }
}
