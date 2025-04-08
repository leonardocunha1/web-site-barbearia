import { Booking, Prisma } from '@prisma/client';

export interface BookingsRepository {
  create(data: Prisma.BookingCreateInput): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findOverlappingBooking(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<Booking | null>;
  findManyByProfessionalId(professionalId: string): Promise<Booking[]>;
  findManyByUserId(userId: string): Promise<Booking[]>;
  update(id: string, data: Prisma.BookingUpdateInput): Promise<Booking | null>;
  delete(id: string): Promise<void>;
}
