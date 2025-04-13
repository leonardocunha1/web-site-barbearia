import { Prisma, ServiceProfessional } from '@prisma/client';

export interface ServiceProfessionalRepository {
  create(
    data: Prisma.ServiceProfessionalCreateInput,
  ): Promise<ServiceProfessional>;
  delete(id: string): Promise<void>;
  findByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
  ): Promise<ServiceProfessional | null>;
}
