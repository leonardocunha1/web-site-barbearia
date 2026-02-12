import { IBookingsRepository } from '@/repositories/bookings-repository';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';
import { validatePagination } from '@/utils/validate-pagination';
import { ListBookingsUseCaseRequest, ListBookingsUseCaseResponse } from './types';

export class ListBookingsUseCase {
  constructor(private bookingsRepository: IBookingsRepository) {}

  async execute({
    userId,
    page = 1,
    limit = 10,
    sort = [{ field: 'startDateTime', order: 'asc' }],
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

