import { Prisma, ServiceProfessional } from '@prisma/client';

export interface IServiceProfessionalRepository {
  create( date: Prisma.ServiceProfessionalCreateInput,
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
      id: string; name: string; description: string | null;
      categoria: string | null;
      ativo: boolean;
    }; price: number; duration: number;
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
        id: string; name: string; description: string | null;
        categoria: string | null;
        ativo: boolean;
      }; price: number; duration: number;
    }>;
    total: number;
  }>;

  updateByServiceAndProfessional(data: {
    serviceId: string;
    professionalId: string; price: number; duration: number;
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
        id: string; name: string; description: string | null;
        categoria: string | null;
        ativo: boolean;
      }; price: number | null; duration: number | null;
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
        id: string; name: string; description: string | null;
        categoria: string | null;
        ativo: boolean;
      }; price: number | null; duration: number | null;
    }>;
    total: number;
  }>;
}

