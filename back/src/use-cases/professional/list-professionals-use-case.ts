import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import {
  toProfessionalDTO,
  ListProfessionalsResponse,
} from '@/dtos/professional-dto';
import { validatePagination } from '@/utils/validate-pagination';
import { InvalidPageError } from '../errors/invalid-page-error';
import { InvalidLimitError } from '../errors/invalid-limit-error';

interface ListOrSearchProfessionalsUseCaseRequest {
  query?: string;
  page?: number;
  limit?: number;
  especialidade?: string;
  ativo?: boolean;
}

export class ListOrSearchProfessionalsUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute({
    query,
    page = 1,
    limit = 10,
    especialidade,
    ativo = true,
  }: ListOrSearchProfessionalsUseCaseRequest): Promise<ListProfessionalsResponse> {
    // Validação de página e limite
    if (page < 1) {
      throw new InvalidPageError();
    }

    if (limit < 1 || limit > 100) {
      throw new InvalidLimitError();
    }

    // Se houver o parâmetro de busca
    if (query && query.trim() !== '') {
      // Lógica para busca
      const [professionals, total] = await Promise.all([
        this.professionalsRepository.search({
          query,
          page,
          limit,
          ativo,
        }),
        this.professionalsRepository.countSearch({ query, ativo }),
      ]);

      return {
        professionals: professionals.map(toProfessionalDTO),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    // Se não houver o parâmetro de busca, faz a listagem
    validatePagination(page, limit);

    const [professionals, total] = await Promise.all([
      this.professionalsRepository.list({ page, limit, especialidade, ativo }),
      this.professionalsRepository.count({ especialidade, ativo }),
    ]);

    if (total === 0) {
      return {
        professionals: [],
        total,
        page,
        limit,
        totalPages: 0,
      };
    }

    return {
      professionals: professionals.map(toProfessionalDTO),
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
  }
}
