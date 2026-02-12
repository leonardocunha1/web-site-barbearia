import {
  IBusinessHoursRepository,
  BusinessHours,
} from '@/repositories/business-hours-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidTimeFormatError } from '../errors/invalid-time-format-error';
import { InvalidBusinessHoursError } from '../errors/invalid-business-hours-error';
import { isAfter, isBefore, parse } from 'date-fns';
import { UpdateBusinessHoursUseCaseRequest } from './types';

export class UpdateBusinessHoursUseCase {
  constructor(
    private businessHoursRepository: IBusinessHoursRepository,
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  async execute( date: UpdateBusinessHoursUseCaseRequest,
  ): Promise<BusinessHours> {
    // Fail-fast: validate all business rules
    await this.validateProfessionalExists(data.professionalId);
    this.validateDayOfWeek(data.dayOfWeek);
    const existingHours = await this.validateBusinessHoursExists(
      data.professionalId,
      data.dayOfWeek,
    );
    this.validateBreakTimesProvided(data.breakStart, data.breakEnd);

    const updatedData = this.mergeWithExistingData(data, existingHours);
    this.validateUpdatedTimes(updatedData);
    this.validateBusinessHoursLogic(
      updatedData.opensAt,
      updatedData.closesAt,
      updatedData.breakStart,
      updatedData.breakEnd,
    );

    return this.businessHoursRepository.update(existingHours.id, updatedData);
  }

  /**
   * Validates that professional exists
   * @throws {ProfessionalNotFoundError} If professional not found
   */
  private async validateProfessionalExists(
    professionalId: string,
  ): Promise<void> {
    const professional =
      await this.professionalsRepository.findById(professionalId);
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }
  }

  /**
   * Validates day of week is valid (0-6)
   * @throws {InvalidBusinessHoursError} If day is invalid
   */
  private validateDayOfWeek(dayOfWeek: number): void {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new InvalidBusinessHoursError('Dia da semana inválido (0-6)');
    }
  }

  /**
   * Validates that business hours exist for update
   * @throws {InvalidBusinessHoursError} If business hours not found
   */
  private async validateBusinessHoursExists(
    professionalId: string,
    dayOfWeek: number,
  ): Promise<BusinessHours> {
    const existingHours =
      await this.businessHoursRepository.findByProfessionalAndDay(
        professionalId,
        dayOfWeek,
      );

    if (!existingHours) {
      throw new InvalidBusinessHoursError(
        'Horário de funcionamento não encontrado para atualização',
      );
    }

    return existingHours;
  }

  /**
   * Validates that break times are both provided or both omitted
   * @throws {InvalidBusinessHoursError} If only one break time is provided
   */
  private validateBreakTimesProvided(
    breakStart?: string | null,
    breakEnd?: string | null,
  ): void {
    if (
      (breakStart !== undefined && breakEnd === undefined) ||
      (breakStart === undefined && breakEnd !== undefined)
    ) {
      throw new InvalidBusinessHoursError(
        'Informar breakStart e breakEnd juntos.',
      );
    }
  }

  /**
   * Merges update data with existing data
   */
  private mergeWithExistingData( date: UpdateBusinessHoursUseCaseRequest,
    existingHours: BusinessHours,
  ) {
    return {
      opensAt: data.opensAt ?? existingHours.opensAt,
      closesAt: data.closesAt ?? existingHours.closesAt,
      breakStart:
        data.breakStart !== undefined
          ? data.breakStart
          : existingHours.breakStart,
      breakEnd:
        data.breakEnd !== undefined ? data.breakEnd : existingHours.breakEnd,
    };
  }

  /**
   * Validates all time formats in updated data
   * @throws {InvalidTimeFormatError} If any time format is invalid
   */
  private validateUpdatedTimes(updatedData: {
    opensAt: string;
    closesAt: string;
    breakStart: string | null;
    breakEnd: string | null;
  }): void {
    this.validateTimeFormat(updatedData.opensAt);
    this.validateTimeFormat(updatedData.closesAt);
    if (updatedData.breakStart)
      this.validateTimeFormat(updatedData.breakStart);
    if (updatedData.breakEnd) this.validateTimeFormat(updatedData.breakEnd);
  }

  private validateTimeFormat(time: string): void {
    if (!time || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      throw new InvalidTimeFormatError();
    }
  }

  private validateBusinessHoursLogic(
    opensAt: string,
    closesAt: string,
    breakStart?: string | null,
    breakEnd?: string | null,
  ): void {
    const opens = parse(opensAt, 'HH:mm', new Date());
    const closes = parse(closesAt, 'HH:mm', new Date());

    if (!isBefore(opens, closes)) {
      throw new InvalidBusinessHoursError(
        'Horário de abertura deve ser antes do fechamento',
      );
    }

    // Validação de pausa
    if (breakStart || breakEnd) {
      if (!breakStart || !breakEnd) {
        throw new InvalidBusinessHoursError(
          'Pausa deve ter início e fim definidos',
        );
      }

      const start = parse(breakStart, 'HH:mm', new Date());
      const end = parse(breakEnd, 'HH:mm', new Date());

      if (!isBefore(start, end)) {
        throw new InvalidBusinessHoursError(
          'Início da pausa deve ser antes do fim',
        );
      }

      if (isBefore(start, opens) || isAfter(end, closes)) {
        throw new InvalidBusinessHoursError(
          'Pausa deve estar dentro do horário de funcionamento',
        );
      }
    }
  }
}



