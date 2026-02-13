import { ServiceDTO } from '@/dtos/service-dto';
import { Prisma, Service } from '@prisma/client';

export interface IServicesRepository {
  create(data: Prisma.ServiceCreateInput): Promise<Service>;
  findById(id: string): Promise<ServiceDTO | null>;
  findByName(name: string): Promise<ServiceDTO | null>;
  update(id: string, date: Prisma.ServiceUpdateInput): Promise<Service>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  toggleStatus(id: string, newStatus: boolean): Promise<Service>;
  list(params: {
    page: number;
    limit: number;
    name?: string;
    category?: string;
    active?: boolean;
    professionalId?: string;
  }): Promise<{ services: ServiceDTO[]; total: number }>;
  existsProfessional(professionalId: string): Promise<boolean>;

  getTopServicesByBookingCount(
    startDate: Date,
    endDate: Date,
    limit: number,
  ): Promise<
    Array<{
      id: string;
      name: string;
      totalBookings: number;
    }>
  >;
}
