import { BookingsRepository } from '@/repositories/bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { Status } from '@prisma/client';
import { BookingDTO, toBookingDTO } from '@/dtos/booking-dto';

interface ListProfessionalBookingsUseCaseRequest {
  professionalId: string;
  page?: number;
  limit?: number;
  sort?: SortBookingSchema[];
  filters?: {
    status?: Status;
    startDate?: Date;
    endDate?: Date;
  };
}

interface ListProfessionalBookingsUseCaseResponse {
  bookings: BookingDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListProfessionalBookingsUseCase {
  constructor(private bookingsRepository: BookingsRepository) {}

  async execute({
    professionalId,
    page = 1,
    limit = 10,
    sort = [{ field: 'dataHoraInicio', order: 'asc' }],
    filters = {},
  }: ListProfessionalBookingsUseCaseRequest): Promise<ListProfessionalBookingsUseCaseResponse> {
    const [bookings, total] = await Promise.all([
      this.bookingsRepository.findManyByProfessionalId(professionalId, {
        page,
        limit,
        sort,
        filters,
      }),
      this.bookingsRepository.countByProfessionalId(professionalId, filters),
    ]);

    if (bookings.length === 0) {
      throw new BookingNotFoundError();
    }

    const totalPages = Math.ceil(total / limit);

    return {
      bookings: bookings.map(toBookingDTO),
      total,
      page,
      limit,
      totalPages,
    };
  }
}
