import { BookingsRepository } from '@/repositories/bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { UsuaruioTentandoPegarInformacoesDeOutro } from '../errors/usuario-pegando-informacao-de-outro-usuario-error';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';

interface ListBookingsUseCaseRequest {
  userId: string;
  page?: number;
  limit?: number;
  sort?: SortBookingSchema[];
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

    if (userId !== bookings[0].usuarioId) {
      throw new UsuaruioTentandoPegarInformacoesDeOutro();
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
