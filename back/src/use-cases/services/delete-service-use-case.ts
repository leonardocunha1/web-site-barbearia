import { IServicesRepository } from '@/repositories/services-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { Service } from '@prisma/client';

export class DeleteServiceUseCase {
  constructor(private servicesRepository: IServicesRepository) {}

  /**
   * Soft delete - deactivates service
   */
  async executeSoft(id: string): Promise<void> {
    // Fail-fast: validate before operation
    await this.validateServiceExists(id);

    // All validations passed - proceed with operation
    await this.servicesRepository.softDelete(id);
  }

  /**
   * Hard delete - permanently removes service
   */
  async executePermanent(id: string): Promise<void> {
    // Fail-fast: validate before operation
    await this.validateServiceExists(id);

    // All validations passed - proceed with operation
    await this.servicesRepository.delete(id);
  }

  /**
   * Validates that service exists
   * @throws {ServiceNotFoundError} If service is not found
   */
  private async validateServiceExists(id: string): Promise<Service> {
    const serviceExists = await this.servicesRepository.findById(id);
    if (!serviceExists) {
      throw new ServiceNotFoundError();
    }
    return serviceExists;
  }
}
