import { BookingsRepository } from '@/repositories/bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { SortBookingSchema } from '@/schemas/booking-sort-schema';
import { Status } from '@prisma/client';
import { BookingDTO } from '@/dtos/booking-dto';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';
import { InvalidPageError } from '../errors/invalid-page-error';
import { InvalidLimitError } from '../errors/invalid-limit-error';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';

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
    if (typeof page !== 'number' || page < 1) {
      throw new InvalidPageError();
    }

    if (typeof limit !== 'number' || limit < 1 || limit > 100) {
      throw new InvalidLimitError();
    }

    const [bookings, total] = await Promise.all([
      this.bookingsRepository.findManyByProfessionalId(professionalId, {
        page,
        limit,
        sort,
        filters,
      }),
      this.bookingsRepository.countByProfessionalId(professionalId, filters),
    ]);

    if (page > total) {
      throw new InvalidPageRangeError();
    }

    if (bookings.length === 0) {
      throw new BookingNotFoundError();
    }

    if (professionalId !== bookings[0].profissionalId) {
      throw new ProfissionalTentandoPegarInformacoesDeOutro();
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
