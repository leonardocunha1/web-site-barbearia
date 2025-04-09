import { Booking, Prisma } from '@prisma/client';
import { BookingsRepository } from '../bookings-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryBookingsRepository implements BookingsRepository {
  public items: Booking[] = [];

  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    const booking: Booking = {
      id: randomUUID(),
      usuarioId: data.user.connect?.id || '',
      profissionalId: data.profissional.connect?.id || '',
      dataHoraInicio: new Date(data.dataHoraInicio),
      dataHoraFim: new Date(data.dataHoraFim),
      status: 'PENDENTE',
      observacoes: data.observacoes || null,
      valorFinal: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      canceledAt: null,
      confirmedAt: null,
      serviceId: data.Service?.connect?.id || null,
    };

    this.items.push(booking);
    return booking;
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
    return this.items.filter((item) => item.profissionalId === professionalId);
  }

  async findManyByUserId(userId: string): Promise<Booking[]> {
    return this.items.filter((item) => item.usuarioId === userId);
  }

  async update(
    id: string,
    data: Partial<Omit<Booking, 'id' | 'createdAt'>>,
  ): Promise<Booking | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const existing = this.items[index];

    const updated: Booking = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };

    this.items[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
