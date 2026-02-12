import { IHolidaysRepository } from '@/repositories/holidays-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { isBefore, startOfToday } from 'date-fns';
import { HolidayNotFoundError } from '../errors/holiday-not-found-error';
import { PastHolidayDeletionError } from '../errors/past-holiday-deletion-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';
import { DeleteHolidayUseCaseRequest } from './types';
import { Holiday, Professional } from '@prisma/client';

export class DeleteHolidayUseCase {
  constructor(
    private holidaysRepository: IHolidaysRepository,
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  async execute({ holidayId, professionalId }: DeleteHolidayUseCaseRequest): Promise<void> {
    // Fail-fast: validate all conditions before operations
    await this.validateProfessionalExists(professionalId);
    const holiday = await this.validateHolidayExists(holidayId);
    this.validateHolidayBelongsToProfessional(holiday, professionalId);
    this.validateHolidayNotInPast(holiday.date);

    // All validations passed - proceed with operation
    await this.holidaysRepository.delete(holidayId);
  }

  /**
   * Validates that professional exists
   * @throws {ProfessionalNotFoundError} If professional is not found
   */
  private async validateProfessionalExists(professionalId: string): Promise<Professional> {
    const professional = await this.professionalsRepository.findById(professionalId);
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }
    return professional;
  }

  /**
   * Validates that holiday exists
   * @throws {HolidayNotFoundError} If holiday is not found
   */
  private async validateHolidayExists(holidayId: string): Promise<Holiday> {
    const holiday = await this.holidaysRepository.findById(holidayId);
    if (!holiday) {
      throw new HolidayNotFoundError();
    }
    return holiday;
  }

  /**
   * Validates that holiday belongs to the specified professional
   * @throws {ProfissionalTentandoPegarInformacoesDeOutro} If holiday belongs to different professional
   */
  private validateHolidayBelongsToProfessional(holiday: Holiday, professionalId: string): void {
    if (holiday.professionalId !== professionalId) {
      throw new ProfissionalTentandoPegarInformacoesDeOutro();
    }
  }

  /**
   * Validates that holiday is not in the past
   * @throws {PastHolidayDeletionError} If holiday date is before today
   */
  private validateHolidayNotInPast(holidayDate: Date): void {
    const today = startOfToday();
    if (isBefore(holidayDate, today)) {
      throw new PastHolidayDeletionError();
    }
  }
}
