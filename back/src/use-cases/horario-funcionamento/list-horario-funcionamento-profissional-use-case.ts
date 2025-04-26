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
    // Verifica se o profissional existe
    const professional =
      await this.professionalsRepository.findById(professionalId);
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    return this.horariosRepository.listByProfessional(professionalId);
  }
}
