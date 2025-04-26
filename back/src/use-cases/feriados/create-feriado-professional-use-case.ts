import { FeriadosRepository } from '@/repositories/feriados-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { PastDateError } from '../errors/past-date-error';
import { InvalidHolidayDescriptionError } from '../errors/invalid-holiday-description-error';
import { DuplicateHolidayError } from '../errors/duplicate-holiday-error';
import { isBefore, startOfToday } from 'date-fns';

interface CreateHolidayUseCaseRequest {
  professionalId: string;
  date: Date;
  motivo: string;
}

export class CreateHolidayUseCase {
  constructor(
    private feriadosRepository: FeriadosRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute({
    professionalId,
    date,
    motivo,
  }: CreateHolidayUseCaseRequest): Promise<void> {
    // Validação 1: Profissional existe
    const professional =
      await this.professionalsRepository.findById(professionalId);
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    // Validação 2: Data não é no passado
    const today = startOfToday();
    if (isBefore(date, today)) {
      throw new PastDateError();
    }

    // Validação 3: Motivo não está vazio e tem tamanho adequado
    if (!motivo || motivo.trim().length < 3 || motivo.length > 100) {
      throw new InvalidHolidayDescriptionError();
    }

    // Validação 4: Não existe feriado duplicado para este profissional na mesma data
    const existingHoliday =
      await this.feriadosRepository.findByProfessionalAndDate(
        professionalId,
        date,
      );

    if (existingHoliday) {
      throw new DuplicateHolidayError();
    }

    // Todas as validações passaram, criar o feriado
    await this.feriadosRepository.addHoliday(professionalId, date, motivo);
  }
}
