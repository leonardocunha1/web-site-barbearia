import { FeriadosRepository } from '@/repositories/feriados-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { isBefore, startOfToday } from 'date-fns';
import { HolidayNotFoundError } from '../errors/holiday-not-found-error';
import { PastHolidayDeletionError } from '../errors/past-holiday-deletion-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';

interface DeleteHolidayUseCaseRequest {
  holidayId: string;
  professionalId: string;
}

export class DeleteHolidayUseCase {
  constructor(
    private feriadosRepository: FeriadosRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute({
    holidayId,
    professionalId,
  }: DeleteHolidayUseCaseRequest): Promise<void> {
    // Validação 1: Profissional existe
    const professional =
      await this.professionalsRepository.findById(professionalId);
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    // Validação 2: Feriado existe e pertence ao profissional
    const holiday = await this.feriadosRepository.findById(holidayId);
    if (!holiday) {
      throw new HolidayNotFoundError();
    }

    if (holiday.profissionalId !== professionalId) {
      throw new ProfissionalTentandoPegarInformacoesDeOutro();
    }

    // Validação 3: Não permitir deletar feriados passados
    const today = startOfToday();
    if (isBefore(holiday.data, today)) {
      throw new PastHolidayDeletionError();
    }

    // Todas as validações passaram, deletar o feriado
    await this.feriadosRepository.delete(holidayId);
  }
}
