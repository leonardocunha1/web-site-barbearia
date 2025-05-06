import { HorariosFuncionamentoRepository } from '@/repositories/horarios-funcionamento-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';

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

    const horarios =
      await this.horariosRepository.listByProfessional(professionalId);

    if (horarios.length === 0) {
      return [];
    }

    return horarios;
  }
}
