import { DashboardRequestDTO, TimeRange } from '@/dtos/dashboard-dto';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { IBookingsRepository } from '@/repositories/bookings-repository';
import { startOfDay, endOfDay, subDays, isAfter, isValid } from 'date-fns';
import { InvalidDataError } from '../errors/invalid-data-error';
import type { Dashboard } from '@/schemas/dashboard-schema';

export class GetProfessionalDashboardUseCase {
  constructor(
    private professionalsRepository: IProfessionalsRepository,
    private bookingsRepository: IBookingsRepository,
  ) {}

  private getDateRange(range: TimeRange, startDate?: Date, endDate?: Date) {
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

  async execute(
    userId: string,
    { range, startDate, endDate }: DashboardRequestDTO,
  ): Promise<Dashboard> {
    const professional = await this.professionalsRepository.findByUserIdWithUser(userId);
    if (!professional) throw new ProfessionalNotFoundError();

    const dateRange = this.getDateRange(range, startDate, endDate);

    const [
      appointments,
      earnings,
      canceled,
      completed,
      pending,
      serviceBreakdown,
      nextAppointments,
    ] = await Promise.all([
      this.bookingsRepository.countByProfessionalAndDate(
        professional.id,
        dateRange.start,
        dateRange.end,
      ),
      this.bookingsRepository.getEarningsByProfessionalAndDate(
        professional.id,
        dateRange.start,
        dateRange.end,
        'COMPLETED',
      ),
      this.bookingsRepository.countByProfessionalAndStatus(
        professional.id,
        'CANCELED',
        dateRange.start,
        dateRange.end,
      ),
      this.bookingsRepository.countByProfessionalAndStatus(
        professional.id,
        'COMPLETED',
        dateRange.start,
        dateRange.end,
      ),
      this.bookingsRepository.countByProfessionalAndStatusRange(
        professional.id,
        'PENDING',
        dateRange.start,
        dateRange.end,
      ),
      this.bookingsRepository.getServiceBreakdownByProfessional(
        professional.id,
        dateRange.start,
        dateRange.end,
        5,
      ),
      this.bookingsRepository.findNextAppointments(professional.id, 3, {
        startDate: dateRange.start,
        endDate: dateRange.end,
      }),
    ]);

    // Cálculo de métricas derivadas
    const cancellationRate = appointments > 0 ? (canceled / appointments) * 100 : 0;
    const completionRate = appointments > 0 ? (completed / appointments) * 100 : 0;
    const averageTicket = appointments > 0 ? earnings / appointments : 0;

    // Adicionar percentuais aos serviços
    const topServices = serviceBreakdown.map((service) => ({
      service: service.serviceName,
      count: service.count,
      percentage: appointments > 0 ? (service.count / appointments) * 100 : 0,
    }));

    return {
      professional: {
        id: professional.id,
        name: professional.user.name,
        email: professional.user.email,
        phone: professional.user.phone,
        specialty: professional.specialty,
        bio: professional.bio,
        avatarUrl: professional.avatarUrl,
        document: professional.document,
        active: professional.active,
      },
      metrics: {
        appointments,
        earnings,
        canceled,
        completed,
        pendingCount: pending,
        cancellationRate: Math.round(cancellationRate * 100) / 100,
        completionRate: Math.round(completionRate * 100) / 100,
        averageTicket: Math.round(averageTicket * 100) / 100,
        topServices,
      },
      nextAppointments: nextAppointments.map((appointment) => ({
        id: appointment.id,
        date: appointment.startDateTime.toISOString(),
        clientName: appointment.user.name,
        service:
          appointment.items.length > 1
            ? 'Vários serviços'
            : appointment.items[0]?.serviceProfessional.service.name || 'Serviço não especificado',
        status: appointment.status as 'PENDING' | 'CONFIRMED',
        totalAmount: appointment.totalAmount,
      })),
    };
  }
}
