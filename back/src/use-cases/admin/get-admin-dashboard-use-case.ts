import { startOfMonth, startOfDay, endOfDay, subDays, isAfter, isValid } from 'date-fns';
import { IBookingsRepository } from '@/repositories/bookings-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { IServicesRepository } from '@/repositories/services-repository';
import {
  AdminDashboardResponseDTO,
  AdminDashboardRequestDTO,
  AdminDashboardTimeRange,
} from '@/dtos/admin-dashboard-dto';
import { InvalidDataError } from '../errors/invalid-data-error';

export class GetAdminDashboardUseCase {
  constructor(
    private bookingsRepository: IBookingsRepository,
    private professionalsRepository: IProfessionalsRepository,
    private servicesRepository: IServicesRepository,
  ) {}

  private getDateRange(range: AdminDashboardTimeRange, startDate?: Date, endDate?: Date) {
    const now = new Date();

    switch (range) {
      case 'all':
        return {
          start: new Date('1900-01-01'), // Retorna todos os registros desde uma data bem antiga
          end: endOfDay(now),
        };

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
          start: startOfMonth(now),
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
          throw new InvalidDataError('A data inicial não pode ser maior que a data final');
        }
        return {
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        };

      default:
        throw new InvalidDataError('Intervalo de data inválido');
    }
  }

  async execute(params?: AdminDashboardRequestDTO): Promise<AdminDashboardResponseDTO> {
    const range = params?.range ?? 'month';
    const startDate = params?.startDate;
    const endDate = params?.endDate;

    const now = new Date();
    const dateRange = this.getDateRange(range, startDate, endDate);

    // Aggregate metrics in parallel
    const [
      professionalsActive,
      newProfessionals,
      bookingsToday,
      cancellationsLast24h,
      completedBookings,
      revenueTotal,
      topProfessionalIds,
      topServices,
    ] = await Promise.all([
      this.professionalsRepository.countActiveOnly(),
      this.professionalsRepository.countNewByDateRange(dateRange.start, dateRange.end),
      this.bookingsRepository.countTodayBookings(),
      this.bookingsRepository.countCanceledLast24h(),
      this.bookingsRepository.getCompletedBookingsCountByDateRange(dateRange.start, dateRange.end),
      this.bookingsRepository.getRevenueByDateRange(dateRange.start, dateRange.end, 'COMPLETED'),
      this.bookingsRepository.getTopProfessionalsByCompletedBookings(
        dateRange.start,
        dateRange.end,
        3,
      ),
      this.servicesRepository.getTopServicesByBookingCount(dateRange.start, dateRange.end, 3),
    ]);

    // Get professional details for top professionals
    const professionalsDetails = await this.professionalsRepository.findTopWithInclude(3);
    const professionalsMap = new Map(professionalsDetails.map((p) => [p.id, p.user.name]));

    const topProfessionals = topProfessionalIds.map((item) => ({
      id: item.professionalId,
      name: professionalsMap.get(item.professionalId) ?? 'Profissional',
      totalBookings: item.totalBookings,
    }));

    const averageTicket = completedBookings > 0 ? revenueTotal / completedBookings : 0;

    return {
      metrics: {
        professionalsActive,
        newProfessionals,
        bookingsToday,
        cancellationsLast24h,
      },
      topProfessionals,
      topServices,
      financial: {
        revenueTotal,
        completedBookings,
        averageTicket,
      },
    };
  }
}
