import { IBusinessHoursRepository } from '@/repositories/business-hours-repository';
import { BusinessHoursNotFoundError } from '../errors/business-hours-not-found-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';
import { DeleteBusinessHoursUseCaseRequest } from './types';

export class DeleteBusinessHoursUseCase {
  constructor(private businessHoursRepository: IBusinessHoursRepository) {}

  async execute({
    businessHoursId,
    professionalId,
  }: DeleteBusinessHoursUseCaseRequest): Promise<void> {
    const horario = await this.businessHoursRepository.findById(businessHoursId);

    if (!horario) {
      throw new BusinessHoursNotFoundError();
    }

    if (horario.professionalId !== professionalId) {
      throw new ProfissionalTentandoPegarInformacoesDeOutro();
    }

    await this.businessHoursRepository.delete(businessHoursId);
  }
}




