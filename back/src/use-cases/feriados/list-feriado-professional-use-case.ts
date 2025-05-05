import { FeriadosRepository } from '@/repositories/feriados-repository';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';
import { HolidayNotFoundError } from '../errors/holiday-not-found-error';
import { validatePagination } from '@/utils/validate-pagination';

interface ListHolidaysUseCaseRequest {
  professionalId: string;
  page?: number;
  limit?: number;
}

export class ListHolidaysUseCase {
  constructor(private feriadosRepository: FeriadosRepository) {}

  async execute({
    professionalId,
    page = 1,
    limit = 10,
  }: ListHolidaysUseCaseRequest) {
    validatePagination(page, limit);

    const total =
      await this.feriadosRepository.countByProfessionalId(professionalId);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    if (page > totalPages) {
      throw new InvalidPageRangeError();
    }

    const holidays = await this.feriadosRepository.findManyByProfessionalId(
      professionalId,
      {
        page,
        limit,
      },
    );

    if (holidays.length === 0) {
      throw new HolidayNotFoundError();
    }

    if (holidays[0].profissionalId !== professionalId) {
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
