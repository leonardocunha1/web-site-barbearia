import { HorariosFuncionamentoRepository } from '@/repositories/horarios-funcionamento-repository';
import { BusinessHoursNotFoundError } from '../errors/businnes-hours-not-found-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';

interface DeleteBusinessHoursUseCaseRequest {
  businessHoursId: string;
  professionalId: string;
}

export class DeleteBusinessHoursUseCase {
  constructor(private horariosRepository: HorariosFuncionamentoRepository) {}

  async execute({
    businessHoursId,
    professionalId,
  }: DeleteBusinessHoursUseCaseRequest): Promise<void> {
    const horario = await this.horariosRepository.findById(businessHoursId);

    if (!horario) {
      throw new BusinessHoursNotFoundError();
    }

    if (horario.profissionalId !== professionalId) {
      throw new ProfissionalTentandoPegarInformacoesDeOutro();
    }

    await this.horariosRepository.delete(businessHoursId);
  }
}
