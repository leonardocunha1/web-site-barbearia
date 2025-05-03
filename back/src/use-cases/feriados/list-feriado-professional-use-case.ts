import { FeriadosRepository } from '@/repositories/feriados-repository';
import { InvalidPageError } from '../errors/invalid-page-error';
import { InvalidLimitError } from '../errors/invalid-limit-error';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';
import { HolidayNotFoundError } from '../errors/holiday-not-found-error';

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
    if (typeof page !== 'number' || page < 1) {
      throw new InvalidPageError();
    }

    if (typeof limit !== 'number' || limit < 1 || limit > 100) {
      throw new InvalidLimitError();
    }

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
