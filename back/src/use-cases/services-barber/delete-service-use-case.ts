import { ServicesRepository } from '@/repositories/services-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';

export class DeleteServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  // Desativação (soft delete)
  async executeSoft(id: string): Promise<void> {
    const serviceExists = await this.servicesRepository.findById(id);

    if (!serviceExists) {
      throw new ServiceNotFoundError();
    }

    await this.servicesRepository.softDelete(id);
  }

  // Exclusão permanente (hard delete)
  async executePermanent(id: string): Promise<void> {
    const serviceExists = await this.servicesRepository.findById(id);

    if (!serviceExists) {
      throw new ServiceNotFoundError();
    }

    await this.servicesRepository.delete(id);
  }
}
