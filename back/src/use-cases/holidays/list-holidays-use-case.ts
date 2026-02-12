import { IHolidaysRepository } from '@/repositories/holidays-repository';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';
import { HolidayNotFoundError } from '../errors/holiday-not-found-error';
import { validatePagination } from '@/utils/validate-pagination';
import { ListHolidaysUseCaseRequest, ListHolidaysUseCaseResponse } from './types';

export class ListHolidaysUseCase {
  constructor(private holidaysRepository: IHolidaysRepository) {}

  async execute({
    professionalId,
    page = 1,
    limit = 10,
  }: ListHolidaysUseCaseRequest): ListHolidaysUseCaseResponse {
    validatePagination(page, limit);

    const total = await this.holidaysRepository.countByProfessionalId(professionalId);
    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

    if (totalPages > 0 && page > totalPages) {
      throw new InvalidPageRangeError();
    }

    const holidays = await this.holidaysRepository.findManyByProfessionalId(professionalId, {
      page,
      limit,
    });

    // Verificar se não há feriados
    if (holidays.length === 0 && total === 0) {
      throw new HolidayNotFoundError();
    }

    if (holidays.length > 0 && holidays[0].professionalId !== professionalId) {
      throw new ProfissionalTentandoPegarInformacoesDeOutro();
    }

    return {
      holidays,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
