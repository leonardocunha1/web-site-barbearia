import { Prisma, Status } from '@prisma/client';
import {
  BookingsRepository,
  FindManyByProfessionalIdParams,
  FindManyByUserIdParams,
} from '../bookings-repository';
import { randomUUID } from 'node:crypto';
import { BookingDTO } from '@/dtos/booking-dto';

export class InMemoryBookingsRepository implements BookingsRepository {
  public items: BookingDTO[] = [];

  async create(data: Prisma.BookingCreateInput): Promise<void> {
    const booking: BookingDTO = {
      id: randomUUID(),
      dataHoraInicio: new Date(data.dataHoraInicio),
      dataHoraFim: new Date(data.dataHoraFim),
      status: data.status || 'PENDENTE',
      observacoes: data.observacoes || null,
      valorFinal: data.valorFinal || 0,
      createdAt: new Date(),
      canceledAt: null,
      confirmedAt: null,
      profissionalId: data.profissional.connect?.id || randomUUID(),
      usuarioId: data.user.connect?.id || randomUUID(),
      updatedAt: new Date(),
      user: {
        id: data.user.connect?.id || randomUUID(),
        nome: 'Test User',
      },
      profissional: {
        id: data.profissional.connect?.id || randomUUID(),
        user: {
          id: randomUUID(),
          nome: 'Test Professional',
        },
      },
      items: [],
    };

    this.items.push(booking);
  }

  async findById(id: string): Promise<BookingDTO | null> {
    const booking = this.items.find((item) => item.id === id);
    if (!booking) return null;

    return this.mapToDTO(booking);
  }

  async findOverlappingBooking(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<BookingDTO | null> {
    const booking = this.items.find((item) => {
      return (
        item.profissional.id === professionalId &&
        item.dataHoraInicio < end &&
        item.dataHoraFim > start &&
        item.status !== 'CANCELADO'
      );
    });

    return booking ? this.mapToDTO(booking) : null;
  }

  async findManyByProfessionalId(
    professionalId: string,
    { page, limit, sort = [], filters = {} }: FindManyByProfessionalIdParams,
  ): Promise<BookingDTO[]> {
    let filtered = this.items.filter((item) => {
      const matchesProfessional = item.profissional.id === professionalId;
      const matchesStatus = filters.status
        ? item.status === filters.status
        : true;
      const matchesStartDate = filters.startDate
        ? item.dataHoraInicio >= filters.startDate
        : true;
      const matchesEndDate = filters.endDate
        ? item.dataHoraFim <= filters.endDate
        : true;

      return (
        matchesProfessional &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    });

    // Simple sorting implementation (would need to be enhanced for complex sorts)
    if (sort.length > 0) {
      filtered = filtered.sort((a, b) => {
        for (const sortItem of sort) {
          if (sortItem.field === 'dataHoraInicio') {
            return sortItem.order === 'asc'
              ? a.dataHoraInicio.getTime() - b.dataHoraInicio.getTime()
              : b.dataHoraInicio.getTime() - a.dataHoraInicio.getTime();
          }
          // Add other sort fields as needed
        }
        return 0;
      });
    }

    const offset = (page - 1) * limit;
    return filtered.slice(offset, offset + limit).map(this.mapToDTO);
  }

  async countByProfessionalId(
    professionalId: string,
    filters?: {
      status?: Status;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<number> {
    return this.items.filter((item) => {
      const matchesProfessional = item.profissional.id === professionalId;
      const matchesStatus = filters?.status
        ? item.status === filters.status
        : true;
      const matchesStartDate = filters?.startDate
        ? item.dataHoraInicio >= filters.startDate
        : true;
      const matchesEndDate = filters?.endDate
        ? item.dataHoraFim <= filters.endDate
        : true;

      return (
        matchesProfessional &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate
      );
    }).length;
  }

  async findManyByUserId(
    userId: string,
    { page, limit, sort = [], filters = {} }: FindManyByUserIdParams,
  ): Promise<BookingDTO[]> {
    let filtered = this.items.filter((item) => {
      const matchesUser = item.user.id === userId;
      const matchesStatus = filters?.status
        ? item.status === filters.status
        : true;
      const matchesStartDate = filters?.startDate
        ? item.dataHoraInicio >= filters.startDate
        : true;
      const matchesEndDate = filters?.endDate
        ? item.dataHoraFim <= filters.endDate
        : true;

      return matchesUser && matchesStatus && matchesStartDate && matchesEndDate;
    });

    // Simple sorting implementation
    if (sort.length > 0) {
      filtered = filtered.sort((a, b) => {
        for (const sortItem of sort) {
          if (sortItem.field === 'dataHoraInicio') {
            return sortItem.order === 'asc'
              ? a.dataHoraInicio.getTime() - b.dataHoraInicio.getTime()
              : b.dataHoraInicio.getTime() - a.dataHoraInicio.getTime();
          }
        }
        return 0;
      });
    }

    const offset = (page - 1) * limit;
    return filtered.slice(offset, offset + limit).map(this.mapToDTO);
  }

  async countByUserId(
    userId: string,
    filters?: {
      status?: Status;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<number> {
    return this.items.filter((item) => {
      const matchesUser = item.user.id === userId;
      const matchesStatus = filters?.status
        ? item.status === filters.status
        : true;
      const matchesStartDate = filters?.startDate
        ? item.dataHoraInicio >= filters.startDate
        : true;
      const matchesEndDate = filters?.endDate
        ? item.dataHoraFim <= filters.endDate
        : true;

      return matchesUser && matchesStatus && matchesStartDate && matchesEndDate;
    }).length;
  }

  async update(
    id: string,
    data: Prisma.BookingUpdateInput,
  ): Promise<BookingDTO> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Booking not found');
    }

    const existing = this.items[index];
    const updated: BookingDTO = {
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
    return this.mapToDTO(updated);
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }

  async countActiveByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
  ): Promise<number> {
    return this.items.filter((item) => {
      return (
        item.profissional.id === professionalId &&
        item.items.some(
          (i) => i.serviceProfessional.service.id === serviceId,
        ) &&
        item.status !== 'CANCELADO' &&
        item.dataHoraFim > new Date()
      );
    }).length;
  }

  async countByProfessionalAndDate(
    professionalId: string,
    start: Date,
    end: Date,
    status?: Status,
  ): Promise<number> {
    return this.items.filter((item) => {
      return (
        item.profissional.id === professionalId &&
        item.dataHoraInicio >= start &&
        item.dataHoraInicio <= end &&
        (status ? item.status === status : true)
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
      .filter((item) => {
        return (
          item.profissional.id === professionalId &&
          item.dataHoraInicio >= start &&
          item.dataHoraInicio <= end &&
          (status ? item.status === status : true)
        );
      })
      .reduce((sum, item) => sum + (item.valorFinal || 0), 0);
  }

  async countByProfessionalAndStatus(
    professionalId: string,
    status: Status,
    start?: Date,
    end?: Date,
  ): Promise<number> {
    return this.items.filter((item) => {
      return (
        item.profissional.id === professionalId &&
        item.status === status &&
        (start && end
          ? item.dataHoraInicio >= start && item.dataHoraInicio <= end
          : true)
      );
    }).length;
  }

  async findNextAppointments(
    professionalId: string,
    limit: number,
    filters?: { startDate?: Date; endDate?: Date },
  ): Promise<BookingDTO[]> {
    const filtered = this.items
      .filter((item) => {
        return (
          item.profissional.id === professionalId &&
          item.dataHoraInicio >= (filters?.startDate || new Date()) &&
          (filters?.endDate ? item.dataHoraInicio <= filters.endDate : true) &&
          ['PENDENTE', 'CONFIRMADO'].includes(item.status) &&
          item.canceledAt === null
        );
      })
      .sort((a, b) => a.dataHoraInicio.getTime() - b.dataHoraInicio.getTime())
      .slice(0, limit);

    return filtered.map(this.mapToDTO);
  }

  async findByProfessionalAndDate(
    professionalId: string,
    date: Date,
  ): Promise<BookingDTO[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const filtered = this.items
      .filter((item) => {
        return (
          item.profissionalId === professionalId &&
          item.dataHoraInicio >= startOfDay &&
          item.dataHoraInicio <= endOfDay &&
          item.status !== 'CANCELADO' &&
          item.canceledAt === null
        );
      })
      .sort((a, b) => a.dataHoraInicio.getTime() - b.dataHoraInicio.getTime());

    return filtered.map(this.mapToDTO);
  }

  private mapToDTO(booking: BookingDTO): BookingDTO {
    return {
      id: booking.id,
      dataHoraInicio: booking.dataHoraInicio,
      dataHoraFim: booking.dataHoraFim,
      status: booking.status,
      observacoes: booking.observacoes,
      valorFinal: booking.valorFinal,
      createdAt: booking.createdAt,
      canceledAt: booking.canceledAt,
      confirmedAt: booking.confirmedAt,
      profissionalId: booking.profissionalId,
      updatedAt: booking.updatedAt,
      usuarioId: booking.usuarioId,
      items: booking.items.map((item) => ({
        id: item.id,
        duracao: item.duracao,
        preco: item.preco,
        serviceProfessional: {
          id: item.serviceProfessional.id,
          service: {
            id: item.serviceProfessional.service.id,
            nome: item.serviceProfessional.service.nome,
          },
        },
      })),
      profissional: {
        id: booking.profissional.id,
        user: {
          id: booking.profissional.user.id,
          nome: booking.profissional.user.nome,
        },
      },
      user: {
        id: booking.user.id,
        nome: booking.user.nome,
      },
    };
  }
}
