import { BookingsRepository } from '@/repositories/bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';

interface SortParams {
  field: 'dataHoraInicio' | 'profissional' | 'status' | 'valorFinal';
  order: 'asc' | 'desc';
}

interface ListBookingsUseCaseRequest {
  userId: string;
  page?: number;
  limit?: number;
  sort?: SortParams[];
}

export class ListBookingsUseCase {
  constructor(private bookingsRepository: BookingsRepository) {}

  async execute({
    userId,
    page = 1,
    limit = 10,
    sort = [{ field: 'dataHoraInicio', order: 'asc' }],
  }: ListBookingsUseCaseRequest) {
    const [bookings, total] = await Promise.all([
      this.bookingsRepository.findManyByUserId(userId, {
        page,
        limit,
        sort,
      }),
      this.bookingsRepository.countByUserId(userId),
    ]);

    if (bookings.length === 0) {
      throw new BookingNotFoundError();
    }

    const totalPages = Math.ceil(total / limit);

    return {
      bookings,
      total,
      page,
      limit,
      totalPages,
      sort,
    };
  }
}
