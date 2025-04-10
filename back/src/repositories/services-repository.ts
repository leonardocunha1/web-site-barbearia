import { Prisma, Service } from '@prisma/client';

export interface ServicesRepository {
  create(data: Prisma.ServiceCreateInput): Promise<Service>;
  findById(id: string): Promise<Service | null>;
  findByName(name: string): Promise<Service | null>;
  update(id: string, data: Prisma.ServiceUpdateInput): Promise<Service>;
  delete(id: string): Promise<void>;
  list(params: {
    page: number;
    limit: number;
    nome?: string;
    categoria?: string;
    ativo?: boolean;
    professionalId?: string;
  }): Promise<{ services: Service[]; total: number }>;
}
