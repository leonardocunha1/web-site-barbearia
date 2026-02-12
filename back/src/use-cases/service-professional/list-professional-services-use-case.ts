import { IServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';

interface ListProfessionalServicesRequest {
  professionalId: string;
  page: number;
  limit: number;
  activeOnly?: boolean; 
}

interface ListProfessionalServicesResponse {
  services: Array<{
    id: string; name: string; description: string | null; price: number | null; duration: number | null;
    categoria: string | null;
    ativo: boolean;
  }>;
  total: number;
}

export class ListProfessionalServicesUseCase {
  constructor(
    private serviceProfessionalRepository: IServiceProfessionalRepository,
    private professionalsRepository: IProfessionalsRepository,
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
        id: s.service.id, name: s.service.name, description: s.service.description,
        categoria: s.service.category,
        ativo: s.service.active, price: s.price ?? null, // se não tiver vínculo duration: s.duration ?? null, // se não tiver vínculo
      })),
      total,
    };
  }
}

