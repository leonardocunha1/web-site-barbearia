import { startOfDay, endOfDay, subDays, startOfMonth } from 'date-fns';
import { IBookingsRepository } from '@/repositories/bookings-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { IServicesRepository } from '@/repositories/services-repository';
import { AdminDashboardResponseDTO } from '@/dtos/admin-dashboard-dto';

export class GetAdminDashboardUseCase {
  constructor(
    private bookingsRepository: IBookingsRepository,
    private professionalsRepository: IProfessionalsRepository,
    private servicesRepository: IServicesRepository,
  ) {}

  async execute(): Promise<AdminDashboardResponseDTO> {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const monthStart = startOfMonth(now);

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
      this.professionalsRepository.countNewByDateRange(monthStart, now),
      this.bookingsRepository.countTodayBookings(),
      this.bookingsRepository.countCanceledLast24h(),
      this.bookingsRepository.getCompletedBookingsCountByDateRange(monthStart, now),
      this.bookingsRepository.getRevenueByDateRange(monthStart, now, 'COMPLETED'),
      this.bookingsRepository.getTopProfessionalsByCompletedBookings(monthStart, now, 3),
      this.servicesRepository.getTopServicesByBookingCount(monthStart, now, 3),
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
