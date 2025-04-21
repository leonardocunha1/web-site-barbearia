import {
  DashboardRequestDTO,
  DashboardResponseDTO,
  TimeRange,
} from '@/dtos/dashboard-dto';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { BookingsRepository } from '@/repositories/bookings-repository';

export class GetProfessionalDashboardUseCase {
  constructor(
    private professionalsRepository: ProfessionalsRepository,
    private bookingsRepository: BookingsRepository,
  ) {}

  private getDateRange(range: TimeRange, startDate?: Date, endDate?: Date) {
    const now = new Date();
    const start = new Date(now); // Cria uma cópia
    const end = new Date(now); // Cria outra cópia

    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return { start, end };

      case 'week':
        start.setDate(now.getDate() - 6); // 7 dias (incluindo hoje)
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return { start, end };

      case 'month':
        start.setDate(now.getDate() - 30); // 30 dias (nao inclui hoje)
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return { start, end };

      case 'custom':
        if (!startDate || !endDate) {
          throw new Error('Custom range requires start and end dates');
        }
        if (startDate > endDate) {
          throw new Error('Start date must be before end date');
        }
        return { start: startDate, end: endDate };

      default:
        throw new Error('Invalid time range');
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
        this.bookingsRepository.findNextAppointments(professionalId, 3),
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
        service: appointment.items[0]?.service.nome || 'Vários serviços',
        status: appointment.status as 'PENDENTE' | 'CONFIRMADO',
      })),
    };
  }
}
