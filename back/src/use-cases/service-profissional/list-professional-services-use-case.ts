import { ServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';

interface ListProfessionalServicesRequest {
  professionalId: string;
  page: number;
  limit: number;
  activeOnly?: boolean;
}

interface ListProfessionalServicesResponse {
  services: Array<{
    id: string;
    nome: string;
    descricao: string | null;
    preco: number;
    duracao: number;
    categoria: string | null;
    ativo: boolean;
    precoPersonalizado: number;
    duracaoPersonalizada: number;
  }>;
  total: number;
}

export class ListProfessionalServicesUseCase {
  constructor(
    private serviceProfessionalRepository: ServiceProfessionalRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute({
    professionalId,
    page,
    limit,
    activeOnly = true,
  }: ListProfessionalServicesRequest): Promise<ListProfessionalServicesResponse> {
    const professionalExists =
      await this.professionalsRepository.findById(professionalId);
    if (!professionalExists) {
      throw new ProfessionalNotFoundError();
    }

    const { services, total } =
      await this.serviceProfessionalRepository.findByProfessional(
        professionalId,
        {
          page,
          limit,
          activeOnly,
        },
      );

    return {
      services: services.map((sp) => ({
        id: sp.service.id,
        nome: sp.service.nome,
        descricao: sp.service.descricao,
        preco: sp.service.precoPadrao,
        duracao: sp.service.duracao,
        categoria: sp.service.categoria,
        ativo: sp.service.ativo,
        precoPersonalizado: sp.preco,
        duracaoPersonalizada: sp.duracao,
      })),
      total,
    };
  }
}
