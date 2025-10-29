import { Prisma, ServiceProfessional } from '@prisma/client';

export interface ServiceProfessionalRepository {
  create(
    data: Prisma.ServiceProfessionalCreateInput,
  ): Promise<ServiceProfessional>;

  delete(id: string): Promise<void>;

  deleteByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
  ): Promise<void>;

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

  /**
   * Retorna todos os serviços ATIVOS com os dados do profissional (se houver vínculo)
   */
  findAllActiveWithProfessionalData(
    professionalId: string,
    options?: {
      page?: number;
      limit?: number;
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
      preco: number | null;
      duracao: number | null;
    }>;
    total: number;
  }>;

  /**
   * Retorna TODOS os serviços (ativos e inativos)
   * com os dados do profissional (se houver vínculo)
   */
  findAllWithProfessionalData(
    professionalId: string,
    options?: {
      page?: number;
      limit?: number;
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
      preco: number | null;
      duracao: number | null;
    }>;
    total: number;
  }>;
}
