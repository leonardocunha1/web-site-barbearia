import { PrismaServicesRepository } from '@/repositories/prisma/prisma-services-repository';
import { DeleteServiceUseCase } from '../services/delete-service-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeDeleteServiceUseCase() {
  const servicesRepository = new PrismaServicesRepository();
  const useCase = new DeleteServiceUseCase(servicesRepository);

  const softDelete = traceUseCase('service.delete.soft', {
    execute: (id: string) => useCase.executeSoft(id),
  });

  const permanentDelete = traceUseCase('service.delete.permanent', {
    execute: (id: string) => useCase.executePermanent(id),
  });

  return {
    executeSoft: (id: string) => softDelete.execute(id),
    executePermanent: (id: string) => permanentDelete.execute(id),
  };
}
