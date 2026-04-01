import { bookingsRepository, professionalsRepository, servicesRepository } from '@/repositories/prisma/instances';
import { GetAdminDashboardUseCase } from '../admin/get-admin-dashboard-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeAdminDashboardUseCase() {
  const useCase = new GetAdminDashboardUseCase(
    bookingsRepository,
    professionalsRepository,
    servicesRepository,
  );

  return traceUseCase('admin.dashboard', useCase);
}
