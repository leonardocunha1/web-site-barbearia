import { Booking, Prisma, Status } from '@prisma/client';

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
  countActiveByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
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
    status?: Status, // Novo parâmetro opcional
  ): Promise<number>;

  countByProfessionalAndStatus(
    professionalId: string,
    status: Status,
    start?: Date,
    end?: Date,
  ): Promise<number>;

  getMonthlyEarnings(
    professionalId: string,
    month?: number, // Novo parâmetro opcional
    year?: number, // Novo parâmetro opcional
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
      status: Status; // Campo adicionado
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
