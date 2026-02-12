import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { toProfessionalDTO } from '@/dtos/professional-dto';
import { InvalidPageError } from '../errors/invalid-page-error';
import { InvalidLimitError } from '../errors/invalid-limit-error';
import {
  ListOrSearchProfessionalsUseCaseRequest,
  ListOrSearchProfessionalsUseCaseResponse,
} from './types';

export class ListOrSearchProfessionalsUseCase {
  constructor(private professionalsRepository: IProfessionalsRepository) {}

  async execute({
    query,
    page = 1,
    limit = 10,
    specialty,
    active = true,
    sortBy,
    sortDirection,
  }: ListOrSearchProfessionalsUseCaseRequest): Promise<ListOrSearchProfessionalsUseCaseResponse> {
    // Validação de página e limite
    if (page < 1) throw new InvalidPageError();
    if (limit < 1 || limit > 100) throw new InvalidLimitError();

    // Passe os parâmetros de ordenação diretamente
    const repositoryParams = {
      page,
      limit,
      ...(specialty && { specialty }),
      active,
      ...(sortBy && { sortBy }),
      ...(sortDirection && { sortDirection }),
    };

    if (query && query.trim() !== '') {
      const [professionals, total] = await Promise.all([
        this.professionalsRepository.search({
          query,
          page,
          limit,
          active,
        }),
        this.professionalsRepository.countSearch({
          query,
          active,
        }),
      ]);

      return {
        professionals: professionals.map(toProfessionalDTO),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    const [professionals, total] = await Promise.all([
      this.professionalsRepository.list(repositoryParams),
      this.professionalsRepository.count({
        ...(specialty && { specialty }),
        active,
      }),
    ]);

    return {
      professionals: professionals.map(toProfessionalDTO),
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
  }
}
