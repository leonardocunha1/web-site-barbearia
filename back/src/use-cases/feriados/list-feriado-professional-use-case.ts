import { FeriadosRepository } from '@/repositories/feriados-repository';

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
    // Calcula o número total de feriados para o profissional
    const [holidays, total] = await Promise.all([
      this.feriadosRepository.findManyByProfessionalId(professionalId, {
        page,
        limit,
      }),
      this.feriadosRepository.countByProfessionalId(professionalId),
    ]);

    // Calcula o número total de páginas
    const totalPages = Math.ceil(total / limit);

    return {
      holidays,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
