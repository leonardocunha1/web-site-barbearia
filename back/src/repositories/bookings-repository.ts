import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import {
  Booking,
  BookingItem,
  Prisma,
  Professional,
  Status,
  User,
} from '@prisma/client';

export type BookingWithRelations = Booking & {
  items: BookingItem[];
  profissional: Professional & {
    user: User;
  };
};

export interface FindManyByUserIdParams {
  page: number;
  limit: number;
  sort?: SortBookingSchema[];
}

export interface BookingsRepository {
  create(data: Prisma.BookingCreateInput): Promise<void>;
  findById(id: string): Promise<Booking | null>;
  findOverlappingBooking(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<Booking | null>;

  findManyByProfessionalId(
    professionalId: string,
  ): Promise<BookingWithRelations[]>;

  findManyByUserId(
    userId: string,
    params: FindManyByUserIdParams,
  ): Promise<BookingWithRelations[]>;

  update(
    id: string,
    data: Prisma.BookingUpdateInput,
  ): Promise<BookingWithRelations | null>;

  delete(id: string): Promise<void>;

  countActiveByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
  ): Promise<number>;

  countByUserId(userId: string): Promise<number>;

  countByProfessionalAndDate(
    professionalId: string,
    start: Date,
    end: Date,
    status?: Status,
  ): Promise<number>;

  getEarningsByProfessionalAndDate(
    professionalId: string,
    start: Date,
    end: Date,
    status?: Status,
  ): Promise<number>;

  countByProfessionalAndStatus(
    professionalId: string,
    status: Status,
    start?: Date,
    end?: Date,
  ): Promise<number>;

  getMonthlyEarnings(
    professionalId: string,
    month?: number,
    year?: number,
  ): Promise<number>;

  findNextAppointments(
    professionalId: string,
    limit: number,
    filters?: {
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<
    Array<{
      id: string;
      dataHoraInicio: Date;
      status: Status;
      user: { nome: string };
      items: Array<{ service: { nome: string } }>;
    }>
  >;

  findByProfessionalAndDate(
    professionalId: string,
    date: Date,
  ): Promise<
    Array<{
      id: string;
      dataHoraInicio: Date;
      dataHoraFim: Date;
      status: string;
      user: { nome: string };
      items: Array<{ service: { nome: string } }>;
    }>
  >;
}
