import { BookingsRepository } from '@/repositories/bookings-repository';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { Status } from '@prisma/client';
import { BookingDTO } from '@/dtos/booking-dto';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { UsuarioTentandoPegarInformacoesDeOutro } from '../errors/usuario-pegando-informacao-de-outro-usuario-error';
import { InvalidPageError } from '../errors/invalid-page-error';
import { InvalidLimitError } from '../errors/invalid-limit-error';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';

interface ListBookingsUseCaseRequest {
  userId: string;
  page?: number;
  limit?: number;
  sort?: SortBookingSchema[];
  filters?: {
    status?: Status;
    startDate?: Date;
    endDate?: Date;
  };
}

interface ListBookingsUseCaseResponse {
  bookings: BookingDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListBookingsUseCase {
  constructor(private bookingsRepository: BookingsRepository) {}

  async execute({
    userId,
    page = 1,
    limit = 10,
    sort = [{ field: 'dataHoraInicio', order: 'asc' }],
    filters = {},
  }: ListBookingsUseCaseRequest): Promise<ListBookingsUseCaseResponse> {
    if (typeof page !== 'number' || page < 1) {
      throw new InvalidPageError();
    }

    if (typeof limit !== 'number' || limit < 1 || limit > 100) {
      throw new InvalidLimitError();
    }

    const [bookings, total] = await Promise.all([
      this.bookingsRepository.findManyByUserId(userId, {
        page,
        limit,
        sort,
        filters,
      }),
      this.bookingsRepository.countByUserId(userId, filters),
    ]);

    if (page > total) {
      throw new InvalidPageRangeError();
    }

    if (bookings.length === 0) {
      throw new BookingNotFoundError();
    }

    if (userId !== bookings[0].usuarioId) {
      throw new UsuarioTentandoPegarInformacoesDeOutro();
    }

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
