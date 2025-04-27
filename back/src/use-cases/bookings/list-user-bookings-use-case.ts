import { BookingsRepository } from '@/repositories/bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';

interface ListBookingsUseCaseRequest {
  userId: string;
  page?: number;
  limit?: number;
}

export class ListBookingsUseCase {
  constructor(private bookingsRepository: BookingsRepository) {}

  async execute({ userId, page = 1, limit = 10 }: ListBookingsUseCaseRequest) {
    // Calcula o número total de reservas para o usuário
    const [bookings, total] = await Promise.all([
      this.bookingsRepository.findManyByUserId(userId, { page, limit }),
      this.bookingsRepository.countByUserId(userId),
    ]);

    if (bookings.length === 0) {
      throw new BookingNotFoundError();
    }

    // Calcula o número total de páginas
    const totalPages = Math.ceil(total / limit);

    return {
      bookings,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
