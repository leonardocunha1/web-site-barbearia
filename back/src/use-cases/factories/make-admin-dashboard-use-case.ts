import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { GetAdminDashboardUseCase } from '../admin/get-admin-dashboard-use-case';

export function makeAdminDashboardUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const servicesRepository = new PrismaServicesRepository();

  return new GetAdminDashboardUseCase(
    bookingsRepository,
    professionalsRepository,
    servicesRepository,
  );
}
