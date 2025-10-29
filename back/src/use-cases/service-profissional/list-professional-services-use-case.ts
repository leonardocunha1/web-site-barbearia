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
    preco: number | null;
    duracao: number | null;
    categoria: string | null;
    ativo: boolean;
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

    // 🔽 Novo trecho
    let data;

    if (activeOnly) {
      // Pega todos os serviços ativos (vinculados ou não)
      data =
        await this.serviceProfessionalRepository.findAllActiveWithProfessionalData(
          professionalId,
          { page, limit },
        );
    } else {
      //  listar todos (ativos + inativos)
      data = await this.serviceProfessionalRepository.findAllWithProfessionalData(
        professionalId,
        { page, limit },
      );
    }

    const { services, total } = data;

    return {
      services: services.map((s) => ({
        id: s.service.id,
        nome: s.service.nome,
        descricao: s.service.descricao,
        categoria: s.service.categoria,
        ativo: s.service.ativo,
        preco: s.preco ?? null, // se não tiver vínculo
        duracao: s.duracao ?? null, // se não tiver vínculo
      })),
      total,
    };
  }
}
