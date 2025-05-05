import {
  DashboardRequestDTO,
  DashboardResponseDTO,
  TimeRange,
} from '@/dtos/dashboard-dto';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { BookingsRepository } from '@/repositories/bookings-repository';
import { startOfDay, endOfDay, subDays, isAfter, isValid } from 'date-fns';
import { InvalidDataError } from '../errors/invalid-data-error';

export class GetProfessionalDashboardUseCase {
  constructor(
    private professionalsRepository: ProfessionalsRepository,
    private bookingsRepository: BookingsRepository,
  ) {}

  private getDateRange(range: TimeRange, startDate?: Date, endDate?: Date) {
    const now = new Date();

    switch (range) {
      case 'today':
        return {
          start: startOfDay(now),
          end: endOfDay(now),
        };

      case 'week':
        return {
          start: startOfDay(subDays(now, 6)), // últimos 7 dias, incluindo hoje
          end: endOfDay(now),
        };

      case 'month':
        return {
          start: startOfDay(subDays(now, 30)), // últimos 30 dias
          end: endOfDay(now),
        };

      case 'custom':
        if (!startDate || !endDate) {
          throw new InvalidDataError(
            'Data inicial e final são obrigatórias para o intervalo personalizado',
          );
        }
        if (!isValid(startDate) || !isValid(endDate)) {
          throw new InvalidDataError('Data inicial ou final inválida');
        }
        if (isAfter(startDate, endDate)) {
          throw new InvalidDataError(
            'A data inicial não pode ser maior que a data final',
          );
        }
        return {
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        };

      default:
        throw new InvalidDataError('Intervalo de data inválido');
    }
  }

  async execute(
    professionalId: string,
    { range, startDate, endDate }: DashboardRequestDTO,
  ): Promise<DashboardResponseDTO> {
    const professional =
      await this.professionalsRepository.findByProfessionalId(professionalId);
    if (!professional) throw new ProfessionalNotFoundError();

    const dateRange = this.getDateRange(range, startDate, endDate);

    const [appointments, earnings, canceled, completed, nextAppointments] =
      await Promise.all([
        this.bookingsRepository.countByProfessionalAndDate(
          professionalId,
          dateRange.start,
          dateRange.end,
        ),
        this.bookingsRepository.getEarningsByProfessionalAndDate(
          professionalId,
          dateRange.start,
          dateRange.end,
          'CONCLUIDO',
        ),
        this.bookingsRepository.countByProfessionalAndStatus(
          professionalId,
          'CANCELADO',
          dateRange.start,
          dateRange.end,
        ),
        this.bookingsRepository.countByProfessionalAndStatus(
          professionalId,
          'CONCLUIDO',
          dateRange.start,
          dateRange.end,
        ),
        this.bookingsRepository.findNextAppointments(professionalId, 3, {
          startDate: dateRange.start,
          endDate: dateRange.end,
        }),
      ]);

    return {
      professional: {
        name: professional.user.nome,
        specialty: professional.especialidade,
        avatarUrl: professional.avatarUrl,
      },
      metrics: {
        appointments,
        earnings,
        canceled,
        completed,
      },
      nextAppointments: nextAppointments.map((appointment) => ({
        id: appointment.id,
        date: appointment.dataHoraInicio,
        clientName: appointment.user.nome,
        service:
          appointment.items[0]?.serviceProfessional.service.nome ||
          'Vários serviços',
        status: appointment.status as 'PENDENTE' | 'CONFIRMADO',
      })),
    };
  }
}
