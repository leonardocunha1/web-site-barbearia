import {
  HorariosFuncionamentoRepository,
  BusinessHours,
} from '@/repositories/horarios-funcionamento-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidTimeFormatError } from '../errors/invalid-time-format-error';
import { InvalidBusinessHoursError } from '../errors/invalid-business-hours-error';
import { isAfter, isBefore, parse } from 'date-fns';

interface UpdateBusinessHoursUseCaseRequest {
  professionalId: string;
  diaSemana: number;
  abreAs?: string;
  fechaAs?: string;
  pausaInicio?: string | null;
  pausaFim?: string | null;
}

export class UpdateBusinessHoursUseCase {
  constructor(
    private horariosRepository: HorariosFuncionamentoRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute(
    data: UpdateBusinessHoursUseCaseRequest,
  ): Promise<BusinessHours> {
    const professional = await this.professionalsRepository.findById(
      data.professionalId,
    );
    if (!professional) {
      throw new ProfessionalNotFoundError();
    }

    if (data.diaSemana < 0 || data.diaSemana > 6) {
      throw new InvalidBusinessHoursError('Dia da semana inválido (0-6)');
    }

    const existingHours =
      await this.horariosRepository.findByProfessionalAndDay(
        data.professionalId,
        data.diaSemana,
      );

    if (!existingHours) {
      throw new InvalidBusinessHoursError(
        'Horário de funcionamento não encontrado para atualização',
      );
    }

    if (
      (data.pausaInicio !== undefined && data.pausaFim === undefined) ||
      (data.pausaInicio === undefined && data.pausaFim !== undefined)
    ) {
      throw new InvalidBusinessHoursError(
        'Informar pausaInicio e pausaFim juntos.',
      );
    }

    const updatedData = {
      abreAs: data.abreAs ?? existingHours.abreAs,
      fechaAs: data.fechaAs ?? existingHours.fechaAs,
      pausaInicio:
        data.pausaInicio !== undefined
          ? data.pausaInicio
          : existingHours.pausaInicio,
      pausaFim:
        data.pausaFim !== undefined ? data.pausaFim : existingHours.pausaFim,
    };

    this.validateTimeFormat(updatedData.abreAs);
    this.validateTimeFormat(updatedData.fechaAs);
    if (updatedData.pausaInicio)
      this.validateTimeFormat(updatedData.pausaInicio);
    if (updatedData.pausaFim) this.validateTimeFormat(updatedData.pausaFim);

    this.validateBusinessHoursLogic(
      updatedData.abreAs,
      updatedData.fechaAs,
      updatedData.pausaInicio,
      updatedData.pausaFim,
    );

    return this.horariosRepository.update(existingHours.id, {
      abreAs: updatedData.abreAs,
      fechaAs: updatedData.fechaAs,
      pausaInicio: updatedData.pausaInicio,
      pausaFim: updatedData.pausaFim,
    });
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
