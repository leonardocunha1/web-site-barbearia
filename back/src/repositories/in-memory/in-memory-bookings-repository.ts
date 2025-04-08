import { Booking, Status } from '@prisma/client';
import { BookingsRepository } from '../bookings-repository';

type InMemoryBookingCreateInput = {
  usuarioId: string;
  profissionalId: string;
  dataHoraInicio: Date;
  dataHoraFim: Date;
  status: Status;
  observacoes?: string | null;
  valorFinal?: number | null;
  serviceId?: string | null;
};

export class InMemoryBookingsRepository implements BookingsRepository {
  public items: Booking[] = [];

  async create(data: InMemoryBookingCreateInput): Promise<Booking> {
    const booking: Booking = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      canceledAt: null,
      ...data,
      observacoes: data.observacoes ?? null,
      valorFinal: data.valorFinal ?? null,
      serviceId: data.serviceId ?? null,
      confirmedAt: null,
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
