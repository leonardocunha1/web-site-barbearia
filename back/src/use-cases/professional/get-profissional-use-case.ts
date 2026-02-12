import {
  DashboardRequestDTO,
  DashboardResponseDTO,
  TimeRange,
} from '@/dtos/dashboard-dto';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { IBookingsRepository } from '@/repositories/bookings-repository';
import { startOfDay, endOfDay, subDays, isAfter, isValid } from 'date-fns';
import { InvalidDataError } from '../errors/invalid-data-error';

export class GetProfessionalDashboardUseCase {
  constructor(
    private professionalsRepository: IProfessionalsRepository,
    private bookingsRepository: IBookingsRepository,
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
          'COMPLETED',
        ),
        this.bookingsRepository.countByProfessionalAndStatus(
          professionalId,
          'CANCELED',
          dateRange.start,
          dateRange.end,
        ),
        this.bookingsRepository.countByProfessionalAndStatus(
          professionalId,
          'COMPLETED',
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
        name: professional.user.name,
        specialty: professional.specialty,
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
        date: appointment.dateHoraInicio,
        clientName: appointment.user.name,
        service:
          appointment.items.length > 1
            ? 'Vários serviços'
            : appointment.items[0]?.serviceProfessional.service.name ||
              'Serviço não especificado',
        status: appointment.status as 'PENDING' | 'CONFIRMED',
      })),
    };
  }
}

