import { BookingsRepository } from '@/repositories/bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { Status } from '@prisma/client';
import { BookingDTO } from '@/dtos/booking-dto';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';
import { validatePagination } from '@/utils/validate-pagination';

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
    validatePagination(page, limit);

    const [bookings, total] = await Promise.all([
      this.bookingsRepository.findManyByProfessionalId(professionalId, {
        page,
        limit,
        sort,
        filters,
      }),
      this.bookingsRepository.countByProfessionalId(professionalId, filters),
    ]);

    // Primeiro verifica se há bookings
    if (bookings.length === 0) {
      throw new BookingNotFoundError();
    }

    // Depois verifica se o profissional é o dono
    if (professionalId !== bookings[0].profissionalId) {
      throw new ProfissionalTentandoPegarInformacoesDeOutro();
    }

    // Por último verifica a paginação
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
