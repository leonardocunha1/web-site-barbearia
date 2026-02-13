import { IServicesRepository } from '@/repositories/services-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { IServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { ServiceAlreadyAddedError } from '../errors/service-already-added-error';
import { InvalidServicePriceDurationError } from '../errors/invalid-service-price-duration';
import { Professional, Service } from '@prisma/client';
import { SCHEDULE_SLOT_MINUTES } from '@/consts/const';

interface AddServiceToProfessionalRequest {
  serviceId: string;
  professionalId: string;
  price: number;
  duration: number;
}

export class AddServiceToProfessionalUseCase {
  constructor(
    private servicesRepository: IServicesRepository,
    private professionalsRepository: IProfessionalsRepository,
    private serviceProfessionalRepository: IServiceProfessionalRepository,
  ) {}

  async execute({
    serviceId,
    professionalId,
    price,
    duration,
  }: AddServiceToProfessionalRequest): Promise<void> {
    // Fail-fast: validate all conditions before operations
    await this.validateServiceExists(serviceId);
    await this.validateProfessionalExists(professionalId);
    await this.validateServiceNotAlreadyAdded(serviceId, professionalId);
    this.validatePricePositive(price);
    this.validateDurationPositive(duration);
    this.validateDurationMultipleOfSlot(duration);

    // All validations passed - proceed with operation
    await this.serviceProfessionalRepository.create({
      service: { connect: { id: serviceId } },
      professional: { connect: { id: professionalId } },
      price,
      duration,
    });
  }

  /**
   * Validates that service exists
   * @throws {ServiceNotFoundError} If service is not found
   */
  private async validateServiceExists(serviceId: string): Promise<Service> {
    const serviceExists = await this.servicesRepository.findById(serviceId);
    if (!serviceExists) {
      throw new ServiceNotFoundError();
    }
    return serviceExists;
  }

  /**
   * Validates that professional exists
   * @throws {ProfessionalNotFoundError} If professional is not found
   */
  private async validateProfessionalExists(professionalId: string): Promise<Professional> {
    const professionalExists = await this.professionalsRepository.findById(professionalId);
    if (!professionalExists) {
      throw new ProfessionalNotFoundError();
    }
    return professionalExists;
  }

  /**
   * Validates that service is not already added to professional
   * @throws {ServiceAlreadyAddedError} If service is already linked
   */
  private async validateServiceNotAlreadyAdded(
    serviceId: string,
    professionalId: string,
  ): Promise<void> {
    const alreadyAdded = await this.serviceProfessionalRepository.findByServiceAndProfessional(
      serviceId,
      professionalId,
    );
    if (alreadyAdded) {
      throw new ServiceAlreadyAddedError();
    }
  }

  /**
   * Validates that price is positive
   * @throws {InvalidServicePriceDurationError} If price <= 0
   */
  private validatePricePositive(price: number): void {
    if (price <= 0) {
      throw new InvalidServicePriceDurationError();
    }
  }

  /**
   * Validates that duration is positive
   * @throws {InvalidServicePriceDurationError} If duration <= 0
   */
  private validateDurationPositive(duration: number): void {
    if (duration <= 0) {
      throw new InvalidServicePriceDurationError();
    }
  }

  /**
   * Validates that duration is a multiple of the schedule slot size
   * @throws {InvalidServicePriceDurationError} If duration is not a multiple of slot size
   */
  private validateDurationMultipleOfSlot(duration: number): void {
    if (duration % SCHEDULE_SLOT_MINUTES !== 0) {
      throw new InvalidServicePriceDurationError();
    }
  }
}
