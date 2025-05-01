import { Booking, Prisma, Status } from '@prisma/client';
import { BookingsRepository } from '../bookings-repository';
import { randomUUID } from 'node:crypto';

interface CompleteBooking extends Booking {
  user: { nome: string; id: string };
  items: Array<{
    service: {
      id: string;
      nome: string;
    };
  }>;
}
export class InMemoryBookingsRepository implements BookingsRepository {
  public items: CompleteBooking[] = [];

  async create(data: Prisma.BookingCreateInput): Promise<void> {
    const booking: CompleteBooking = {
      id: randomUUID(),
      usuarioId: data.user.connect?.id || '',
      profissionalId: data.profissional.connect?.id || '',
      dataHoraInicio: new Date(data.dataHoraInicio),
      dataHoraFim: new Date(data.dataHoraFim),
      status: data.status || 'PENDENTE',
      observacoes: data.observacoes || null,
      valorFinal: data.valorFinal || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      canceledAt: null,
      confirmedAt: null,
      user: { nome: 'Cliente não especificado', id: 'teste' }, // Valor padrão para user
      items: [], // Array vazio inicial para items
    };

    this.items.push(booking);
  }

  async findById(id: string): Promise<Booking | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findOverlappingBooking(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<Booking | null> {
    return (
      this.items.find((booking) => {
        return (
          booking.profissionalId === professionalId &&
          booking.canceledAt === null &&
          booking.dataHoraInicio < end &&
          booking.dataHoraFim > start
        );
      }) ?? null
    );
  }

  async findManyByProfessionalId(professionalId: string): Promise<Booking[]> {
    return this.items
      .filter((item) => item.profissionalId === professionalId)
      .sort((a, b) => a.dataHoraInicio.getTime() - b.dataHoraInicio.getTime());
  }

  async findManyByUserId(
    userId: string,
    { page, limit }: { page: number; limit: number },
  ): Promise<Booking[]> {
    const offset = (page - 1) * limit;
    return this.items
      .filter((item) => item.usuarioId === userId)
      .slice(offset, offset + limit)
      .sort((a, b) => a.dataHoraInicio.getTime() - b.dataHoraInicio.getTime());
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((item) => item.usuarioId === userId).length;
  }

  async update(id: string, data: Prisma.BookingUpdateInput): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const existing = this.items[index];

    const updated: CompleteBooking = {
      ...existing,
      status: (data.status as Status) || existing.status,
      observacoes: (data.observacoes as string | null) ?? existing.observacoes,
      valorFinal: (data.valorFinal as number | null) ?? existing.valorFinal,
      canceledAt: data.canceledAt
        ? new Date(data.canceledAt as Date)
        : existing.canceledAt,
      confirmedAt: data.confirmedAt
        ? new Date(data.confirmedAt as Date)
        : existing.confirmedAt,
      updatedAt: new Date(),
    };

    this.items[index] = updated;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }

  async countActiveByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
  ): Promise<number> {
    return this.items.filter((booking) => {
      // Verifica se é do profissional correto
      const isSameProfessional = booking.profissionalId === professionalId;

      // Verifica se tem algum item com o serviço correto
      const hasServiceItem = booking.items.some(
        (item) => item.service.id === serviceId,
      );

      // Verifica se está ativo (não cancelado e data futura)
      const isActive =
        booking.status !== 'CANCELADO' && booking.dataHoraFim > new Date();

      return isSameProfessional && hasServiceItem && isActive;
    }).length;
  }

  async countByProfessionalAndDate(
    professionalId: string,
    start: Date,
    end: Date,
    status?: Status,
  ): Promise<number> {
    return this.items.filter((booking) => {
      return (
        booking.profissionalId === professionalId &&
        booking.dataHoraInicio >= start &&
        booking.dataHoraInicio <= end &&
        (status ? booking.status === status : true)
      );
    }).length;
  }

  async getEarningsByProfessionalAndDate(
    professionalId: string,
    start: Date,
    end: Date,
    status?: Status,
  ): Promise<number> {
    return this.items
      .filter((booking) => {
        return (
          booking.profissionalId === professionalId &&
          booking.dataHoraInicio >= start &&
          booking.dataHoraInicio <= end &&
          (status ? booking.status === status : true) &&
          booking.valorFinal !== null
        );
      })
      .reduce((sum, booking) => sum + (booking.valorFinal || 0), 0);
  }

  async countByProfessionalAndStatus(
    professionalId: string,
    status: Status,
    start?: Date,
    end?: Date,
  ): Promise<number> {
    return this.items.filter((booking) => {
      return (
        booking.profissionalId === professionalId &&
        booking.status === status &&
        (start && end
          ? booking.dataHoraInicio >= start && booking.dataHoraInicio <= end
          : true)
      );
    }).length;
  }

  async getMonthlyEarnings(
    professionalId: string,
    month?: number,
    year?: number,
  ): Promise<number> {
    const date = new Date();
    const targetMonth = month ?? date.getMonth();
    const targetYear = year ?? date.getFullYear();

    const start = new Date(targetYear, targetMonth, 1);
    const end = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

    return this.getEarningsByProfessionalAndDate(
      professionalId,
      start,
      end,
      'CONCLUIDO',
    );
  }

  async findNextAppointments(
    professionalId: string,
    limit: number,
    filters?: { startDate?: Date; endDate?: Date },
  ): Promise<
    {
      id: string;
      dataHoraInicio: Date;
      status: Status;
      user: { nome: string };
      items: { service: { nome: string } }[];
    }[]
  > {
    const filtered = this.items
      .filter((booking) => {
        return (
          booking.profissionalId === professionalId &&
          booking.dataHoraInicio >= (filters?.startDate || new Date()) &&
          (filters?.endDate
            ? booking.dataHoraInicio <= filters.endDate
            : true) &&
          ['PENDENTE', 'CONFIRMADO'].includes(booking.status)
        );
      })
      .sort((a, b) => a.dataHoraInicio.getTime() - b.dataHoraInicio.getTime())
      .slice(0, limit);

    return filtered.map((booking) => ({
      id: booking.id,
      dataHoraInicio: booking.dataHoraInicio,
      status: booking.status as Status,
      user: booking.user,
      items: booking.items,
    }));
  }

  async findByProfessionalAndDate(
    professionalId: string,
    date: Date,
  ): Promise<
    {
      id: string;
      dataHoraInicio: Date;
      dataHoraFim: Date;
      status: string;
      user: { nome: string };
      items: { service: { nome: string } }[];
    }[]
  > {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const filtered = this.items
      .filter((booking) => {
        return (
          booking.profissionalId === professionalId &&
          booking.dataHoraInicio >= startOfDay &&
          booking.dataHoraInicio <= endOfDay &&
          booking.status !== 'CANCELADO'
        );
      })
      .sort((a, b) => a.dataHoraInicio.getTime() - b.dataHoraInicio.getTime());

    return filtered.map((booking) => ({
      id: booking.id,
      dataHoraInicio: booking.dataHoraInicio,
      dataHoraFim: booking.dataHoraFim,
      status: booking.status,
      user: booking.user,
      items: booking.items,
    }));
  }
}
