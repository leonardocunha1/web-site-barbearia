import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import {
  Booking,
  BookingItem,
  Prisma,
  Professional,
  Service,
  ServiceProfessional,
  Status,
  User,
} from '@prisma/client';

export type BookingWithRelations = Booking & {
  items: (BookingItem & {
    serviceProfessional: ServiceProfessional & {
      service: Service;
    };
  })[];
  profissional: Professional & {
    user: User;
  };
  user: User;
};

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
  create(data: Prisma.BookingCreateInput): Promise<void>;
  findById(id: string): Promise<BookingWithRelations | null>;
  findOverlappingBooking(
    professionalId: string,
    start: Date,
    end: Date,
  ): Promise<BookingWithRelations | null>;

  findManyByProfessionalId(
    professionalId: string,
    params: FindManyByProfessionalIdParams,
  ): Promise<BookingWithRelations[]>;

  findManyByUserId(
    userId: string,
    params: FindManyByUserIdParams,
  ): Promise<BookingWithRelations[]>;

  update(
    id: string,
    data: Prisma.BookingUpdateInput,
  ): Promise<BookingWithRelations>;

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

  findNextAppointments(
    professionalId: string,
    limit: number,
    filters?: {
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<BookingWithRelations[]>;

  findByProfessionalAndDate(
    professionalId: string,
    date: Date,
  ): Promise<BookingWithRelations[]>;

  countByProfessionalId(
    professionalId: string,
    filters?: {
      status?: Status;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<number>;
}
