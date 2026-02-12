import { IBookingsRepository } from '@/repositories/bookings-repository';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';
import { validatePagination } from '@/utils/validate-pagination';
import {
  ListProfessionalBookingsUseCaseRequest,
  ListProfessionalBookingsUseCaseResponse,
} from './types';

export class ListProfessionalBookingsUseCase {
  constructor(private bookingsRepository: IBookingsRepository) {}

  async execute({
    professionalId,
    page = 1,
    limit = 10,
    sort = [{ field: 'startDateTime', order: 'asc' }],
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

    const totalPages = Math.ceil(total / limit);
    if (totalPages > 0 && page > totalPages) {
      throw new InvalidPageRangeError();
    }

    return {
      bookings,
      total,
      page,
      limit,
      totalPages: totalPages > 0 ? totalPages : 0,
    };
  }
}

