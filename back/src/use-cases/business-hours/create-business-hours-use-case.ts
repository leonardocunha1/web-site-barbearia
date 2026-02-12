import { BusinessHours, IBusinessHoursRepository } from '@/repositories/business-hours-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidTimeFormatError } from '../errors/invalid-time-format-error';
import { InvalidBusinessHoursError } from '../errors/invalid-business-hours-error';
import { DuplicateBusinessHoursError } from '../errors/duplicate-business-hours-error';
import { isAfter, isBefore, parse } from 'date-fns';
import { CreateBusinessHoursUseCaseRequest } from './types';

export class CreateBusinessHoursUseCase {
  constructor(
    private businessHoursRepository: IBusinessHoursRepository,
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  async execute(data: CreateBusinessHoursUseCaseRequest): Promise<BusinessHours> {
    // Validação 1: Profissional existe
    const professional = await this.professionalsRepository.findById(data.professionalId);
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    // Validação 2: Formato de horário válido
    this.validateTimeFormat(data.opensAt);
    this.validateTimeFormat(data.closesAt);
    if (data.breakStart) this.validateTimeFormat(data.breakStart);
    if (data.breakEnd) this.validateTimeFormat(data.breakEnd);

    // Validação 3: Lógica de horários
    this.validateBusinessHoursLogic(data.opensAt, data.closesAt, data.breakStart, data.breakEnd);

    // Validação 4: Dia da semana válido
    if (data.dayOfWeek < 0 || data.dayOfWeek > 6) {
      throw new InvalidBusinessHoursError('Dia da semana inválido (0-6)');
    }

    // Validação 5: Não existe horário duplicado para este dia
    const existingHours = await this.businessHoursRepository.findByProfessionalAndDay(
      data.professionalId,
      data.dayOfWeek,
    );

    if (existingHours) {
      throw new DuplicateBusinessHoursError();
    }

    // Todas as validações passaram, criar o horário
    return this.businessHoursRepository.create({
      professional: { connect: { id: data.professionalId } },
      dayOfWeek: data.dayOfWeek,
      opensAt: data.opensAt,
      closesAt: data.closesAt,
      breakStart: data.breakStart || null,
      breakEnd: data.breakEnd || null,
      active: true,
    });
  }

  private validateTimeFormat(time: string): void {
    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      throw new InvalidTimeFormatError();
    }
  }

  private validateBusinessHoursLogic(
    opensAt: string,
    closesAt: string,
    breakStart?: string | null,
    breakEnd?: string | null,
  ): void {
    // Converte para objetos Date usando o parse
    const opens = parse(opensAt, 'HH:mm', new Date());
    const closes = parse(closesAt, 'HH:mm', new Date());

    // Validação: Horário de abertura deve ser antes do fechamento
    if (!isBefore(opens, closes)) {
      throw new InvalidBusinessHoursError('Horário de abertura deve ser antes do fechamento');
    }

    // Validação de pausa
    if (breakStart && breakEnd) {
      const breakStartDate = parse(breakStart, 'HH:mm', new Date());
      const breakEndDate = parse(breakEnd, 'HH:mm', new Date());

      if (!isBefore(breakStartDate, breakEndDate)) {
        throw new InvalidBusinessHoursError('Início da pausa deve ser antes do fim');
      }

      if (isBefore(breakStartDate, opens) || isAfter(breakEndDate, closes)) {
        throw new InvalidBusinessHoursError('Pausa deve estar dentro do horário de funcionamento');
      }
    } else if (breakStart || breakEnd) {
      throw new InvalidBusinessHoursError('Pausa deve ter início e fim definidos');
    }
  }
}
