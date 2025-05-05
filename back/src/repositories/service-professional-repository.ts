import { Prisma, ServiceProfessional } from '@prisma/client';

export interface ServiceProfessionalRepository {
  create(
    data: Prisma.ServiceProfessionalCreateInput,
  ): Promise<ServiceProfessional>;
  delete(id: string): Promise<void>;
  findByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
  ): Promise<{
    id: string;
    professionalId: string;
    service: {
      id: string;
      nome: string;
      descricao: string | null;
      categoria: string | null;
      ativo: boolean;
    };
    preco: number;
    duracao: number;
  } | null>;
  findByProfessional(
    professionalId: string,
    options?: {
      page?: number;
      limit?: number;
      activeOnly?: boolean;
    },
  ): Promise<{
    services: Array<{
      service: {
        id: string;
        nome: string;
        descricao: string | null;
        categoria: string | null;
        ativo: boolean;
      };
      preco: number;
      duracao: number;
    }>;
    total: number;
  }>;
  updateByServiceAndProfessional(data: {
    serviceId: string;
    professionalId: string;
    preco: number;
    duracao: number;
  }): Promise<void>;
}
