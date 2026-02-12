import { IHolidaysRepository } from '@/repositories/holidays-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { PastDateError } from '../errors/past-date-error';
import { InvalidHolidayDescriptionError } from '../errors/invalid-holiday-description-error';
import { DuplicateHolidayError } from '../errors/duplicate-holiday-error';
import { isBefore, startOfToday } from 'date-fns';
import { CreateHolidayUseCaseRequest } from './types';

export class CreateHolidayUseCase {
  constructor(
    private holidaysRepository: IHolidaysRepository,
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  async execute({ professionalId, date, motivo }: CreateHolidayUseCaseRequest): Promise<void> {
    // Fail-fast: validate all business rules before any database operation
    await this.validateProfessionalExists(professionalId);
    this.validateDateNotInPast(date);
    this.validateMotivo(motivo);
    await this.validateNoDuplicateHoliday(professionalId, date);

    await this.holidaysRepository.addHoliday(professionalId, date, motivo);
  }

  /**
   * Validates if professional exists
   * @throws {ProfessionalNotFoundError} If professional not found
   */
  private async validateProfessionalExists(professionalId: string): Promise<void> {
    const professional = await this.professionalsRepository.findById(professionalId);
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }
  }

  /**
   * Validates that date is not in the past
   * @throws {PastDateError} If date is before today
   */
  private validateDateNotInPast(date: Date): void {
    const today = startOfToday();
    if (isBefore(date, today)) {
      throw new PastDateError();
    }
  }

  /**
   * Validates holiday description/reason
   * @throws {InvalidHolidayDescriptionError} If motivo is invalid
   */
  private validateMotivo(motivo: string): void {
    if (!motivo || motivo.trim().length < 3 || motivo.length > 100) {
      throw new InvalidHolidayDescriptionError();
    }
  }

  /**
   * Validates no duplicate holiday exists for the same professional and date
   * @throws {DuplicateHolidayError} If holiday already exists
   */
  private async validateNoDuplicateHoliday(professionalId: string, date: Date): Promise<void> {
    const existingHoliday = await this.holidaysRepository.findByProfessionalAndDate(
      professionalId,
      date,
    );

    if (existingHoliday) {
      throw new DuplicateHolidayError();
    }
  }
}
