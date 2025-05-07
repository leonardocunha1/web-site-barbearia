import { BookingDTO } from '@/dtos/booking-dto';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { Booking, Prisma, Status } from '@prisma/client';

export interface FindManyByUserIdParams {
  page: number;
  limit: number;
  sort?: SortBookingSchema[];
  filters?: {
    status?: Status;
    startDate?: Date;
    endDate?: Date;
  };
}

export interface FindManyByProfessionalIdParams {
  page: number;
  limit: number;
  sort?: SortBookingSchema[];
  filters?: {
    status?: Status;
    startDate?: Date;
    endDate?: Date;
  };
}

export interface BookingsRepository {
  create(data: Prisma.BookingCreateInput): Promise<Booking>;
  findById(id: string): Promise<BookingDTO | null>;
  findOverlappingBooking(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<BookingDTO | null>;

  findManyByProfessionalId(
    professionalId: string,
    params: FindManyByProfessionalIdParams,
  ): Promise<BookingDTO[]>;

  findManyByUserId(
    userId: string,
    params: FindManyByUserIdParams,
  ): Promise<BookingDTO[]>;

  update(id: string, data: Prisma.BookingUpdateInput): Promise<BookingDTO>;

  delete(id: string): Promise<void>;

  countActiveByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
  ): Promise<number>;

  countByUserId(
    userId: string,
    filters?: {
      status?: Status;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<number>;

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

  findNextAppointments(
    professionalId: string,
    limit: number,
    filters?: {
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<BookingDTO[]>;

  findByProfessionalAndDate(
    professionalId: string,
    date: Date,
  ): Promise<BookingDTO[]>;

  countByProfessionalId(
    professionalId: string,
    filters?: {
      status?: Status;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<number>;

  countByUserIdAndStatus(userId: string, status: Status): Promise<number>;
}
