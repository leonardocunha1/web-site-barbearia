import {
  BusinessHours,
  HorariosFuncionamentoRepository,
} from '@/repositories/horarios-funcionamento-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidTimeFormatError } from '../errors/invalid-time-format-error';
import { InvalidBusinessHoursError } from '../errors/invalid-business-hours-error';
import { DuplicateBusinessHoursError } from '../errors/duplicate-business-hours-error';
import { isAfter, isBefore, parse } from 'date-fns';

interface CreateBusinessHoursUseCaseRequest {
  professionalId: string;
  diaSemana: number; // 0-6 (Domingo-Sábado)
  abreAs: string; // Formato "HH:MM"
  fechaAs: string; // Formato "HH:MM"
  pausaInicio?: string | null; // Formato "HH:MM"
  pausaFim?: string | null; // Formato "HH:MM"
}

export class CreateBusinessHoursUseCase {
  constructor(
    private horariosRepository: HorariosFuncionamentoRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute(
    data: CreateBusinessHoursUseCaseRequest,
  ): Promise<BusinessHours> {
    // Validação 1: Profissional existe
    const professional = await this.professionalsRepository.findById(
      data.professionalId,
    );
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    // Validação 2: Formato de horário válido
    this.validateTimeFormat(data.abreAs);
    this.validateTimeFormat(data.fechaAs);
    if (data.pausaInicio) this.validateTimeFormat(data.pausaInicio);
    if (data.pausaFim) this.validateTimeFormat(data.pausaFim);

    // Validação 3: Lógica de horários
    this.validateBusinessHoursLogic(
      data.abreAs,
      data.fechaAs,
      data.pausaInicio,
      data.pausaFim,
    );

    // Validação 4: Dia da semana válido
    if (data.diaSemana < 0 || data.diaSemana > 6) {
      throw new InvalidBusinessHoursError('Dia da semana inválido (0-6)');
    }

    // Validação 5: Não existe horário duplicado para este dia
    const existingHours =
      await this.horariosRepository.findByProfessionalAndDay(
        data.professionalId,
        data.diaSemana,
      );

    if (existingHours) {
      throw new DuplicateBusinessHoursError();
    }

    // Todas as validações passaram, criar o horário
    return this.horariosRepository.create({
      profissional: { connect: { id: data.professionalId } },
      diaSemana: data.diaSemana,
      abreAs: data.abreAs,
      fechaAs: data.fechaAs,
      pausaInicio: data.pausaInicio || null,
      pausaFim: data.pausaFim || null,
      ativo: true,
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
      throw new InvalidBusinessHoursError(
        'Horário de abertura deve ser antes do fechamento',
      );
    }

    // Validação de pausa
    if (breakStart && breakEnd) {
      const breakStartDate = parse(breakStart, 'HH:mm', new Date());
      const breakEndDate = parse(breakEnd, 'HH:mm', new Date());

      if (!isBefore(breakStartDate, breakEndDate)) {
        throw new InvalidBusinessHoursError(
          'Início da pausa deve ser antes do fim',
        );
      }

      if (isBefore(breakStartDate, opens) || isAfter(breakEndDate, closes)) {
        throw new InvalidBusinessHoursError(
          'Pausa deve estar dentro do horário de funcionamento',
        );
      }
    } else if (breakStart || breakEnd) {
      throw new InvalidBusinessHoursError(
        'Pausa deve ter início e fim definidos',
      );
    }
  }
}
