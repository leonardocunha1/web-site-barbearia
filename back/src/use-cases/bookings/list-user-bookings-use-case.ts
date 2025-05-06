import { BookingsRepository } from '@/repositories/bookings-repository';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { Status } from '@prisma/client';
import { BookingDTO } from '@/dtos/booking-dto';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { UsuarioTentandoPegarInformacoesDeOutro } from '../errors/usuario-pegando-informacao-de-outro-usuario-error';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';
import { validatePagination } from '@/utils/validate-pagination';

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
    validatePagination(page, limit);

    const [bookings, total] = await Promise.all([
      this.bookingsRepository.findManyByUserId(userId, {
        page,
        limit,
        sort,
        filters,
      }),
      this.bookingsRepository.countByUserId(userId, filters),
    ]);

    // 1. Primeiro verifica se há bookings
    if (bookings.length === 0) {
      throw new BookingNotFoundError();
    }

    // 2. Depois verifica se o usuário é o dono
    if (userId !== bookings[0].usuarioId) {
      throw new UsuarioTentandoPegarInformacoesDeOutro();
    }

    // 3. Por último verifica a paginação
    const totalPages = Math.ceil(total / limit);
    if (page > totalPages) {
      throw new InvalidPageRangeError();
    }

    return {
      bookings,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
