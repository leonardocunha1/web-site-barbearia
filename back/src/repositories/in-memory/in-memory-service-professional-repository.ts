import { ServiceProfessionalRepository } from '../service-professional-repository';
import { Prisma, ServiceProfessional } from '@prisma/client';
import { randomUUID } from 'crypto';

type FakeService = {
  id: string;
  nome: string;
  descricao: string | null;
  precoPadrao: number;
  duracao: number;
  categoria: string | null;
  ativo: boolean;
};

export class InMemoryServiceProfessionalRepository
  implements ServiceProfessionalRepository
{
  private serviceProfessionals: ServiceProfessional[] = [];
  private services: FakeService[] = [];

  async create(
    data: Prisma.ServiceProfessionalCreateInput & { serviceAtivo?: boolean },
  ): Promise<ServiceProfessional> {
    const newServiceProfessional: ServiceProfessional = {
      id: randomUUID(),
      serviceId: data.service.connect?.id || '',
      professionalId: data.professional.connect?.id || '',
      preco: data.preco,
      duracao: data.duracao,
    };

    this.serviceProfessionals.push(newServiceProfessional);

    this.services.push({
      id: newServiceProfessional.serviceId,
      nome: 'Fake Service Name',
      descricao: 'Fake description',
      precoPadrao: 100,
      duracao: 60,
      categoria: 'Fake Category',
      ativo: data.serviceAtivo ?? true,
    });

    return newServiceProfessional;
  }

  async delete(id: string): Promise<void> {
    this.serviceProfessionals = this.serviceProfessionals.filter(
      (sp) => sp.id !== id,
    );
  }

  async findByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
  ): Promise<ServiceProfessional | null> {
    const result = this.serviceProfessionals.find(
      (sp) =>
        sp.serviceId === serviceId && sp.professionalId === professionalId,
    );
    return result || null;
  }

  async findByProfessional(
    professionalId: string,
    options: {
      page?: number;
      limit?: number;
      activeOnly?: boolean;
    } = {},
  ): Promise<{
    services: Array<{
      service: {
        id: string;
        nome: string;
        descricao: string | null;
        precoPadrao: number;
        duracao: number;
        categoria: string | null;
        ativo: boolean;
      };
      preco: number;
      duracao: number;
    }>;
    total: number;
  }> {
    const { page = 1, limit = 10, activeOnly = true } = options;

    const filtered = this.serviceProfessionals.filter(
      (sp) => sp.professionalId === professionalId,
    );

    const servicesWithDetails = filtered
      .map((sp) => {
        const service = this.services.find((s) => s.id === sp.serviceId);
        if (!service) return null;
        return {
          service,
          preco: sp.preco,
          duracao: sp.duracao,
        };
      })
      .filter((item) => item !== null)
      .filter((item) => (activeOnly ? item!.service.ativo : true)) as Array<{
      service: FakeService;
      preco: number;
      duracao: number;
    }>;

    const paginated = servicesWithDetails.slice(
      (page - 1) * limit,
      page * limit,
    );

    return {
      services: paginated,
      total: servicesWithDetails.length,
    };
  }
}
