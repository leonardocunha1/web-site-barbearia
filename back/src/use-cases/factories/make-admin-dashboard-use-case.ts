import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { GetAdminDashboardUseCase } from '../admin/get-admin-dashboard-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeAdminDashboardUseCase() {
  const bookingsRepository = new PrismaBookingsRepository();
  const professionalsRepository = new PrismaProfessionalsRepository();
  const servicesRepository = new PrismaServicesRepository();

  const useCase = new GetAdminDashboardUseCase(
    bookingsRepository,
    professionalsRepository,
    servicesRepository,
  );

  return traceUseCase('admin.dashboard', useCase);
}
