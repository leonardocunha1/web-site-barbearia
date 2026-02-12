import { IProfessionalsRepository } from "@/repositories/professionals-repository";
import { toProfessionalDTO } from "@/dtos/professional-dto";
import { validatePagination } from "@/utils/validate-pagination";
import { InvalidPageError } from "../errors/invalid-page-error";
import { InvalidLimitError } from "../errors/invalid-limit-error";
import {
  ListOrSearchProfessionalsUseCaseRequest,
  ListOrSearchProfessionalsUseCaseResponse,
} from "./types";

export class ListOrSearchProfessionalsUseCase {
  constructor(private professionalsRepository: IProfessionalsRepository) {}

  async execute({
    query,
    page = 1,
    limit = 10,
    especialidade,
    ativo,
    sortBy,
    sortDirection,
  }: ListOrSearchProfessionalsUseCaseRequest): Promise<ListOrSearchProfessionalsUseCaseResponse> {
    // Validação de página e limite
    if (page < 1) throw new InvalidPageError();
    if (limit < 1 || limit > 100) throw new InvalidLimitError();

    // CORREÇÃO: Passe os parâmetros de ordenação diretamente, sem usar o objeto "order"
    const repositoryParams = {
      page,
      limit,
      ...(especialidade && { especialidade }),
      ...(ativo !== undefined && { ativo }),
      sortBy, // ← passe diretamente
      sortDirection, // ← passe diretamente
    };

    if (query && query.trim() !== "") {
      const [professionals, total] = await Promise.all([
        this.professionalsRepository.search({
          ...repositoryParams,
          query,
        }),
        this.professionalsRepository.countSearch({
          query,
          ...(ativo !== undefined && { ativo }),
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
        ...(especialidade && { especialidade }),
        ...(ativo !== undefined && { ativo }),
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
