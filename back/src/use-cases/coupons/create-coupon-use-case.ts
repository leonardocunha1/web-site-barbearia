import { ICouponRepository } from '@/repositories/coupon-repository';
import { IServicesRepository } from '@/repositories/services-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { DuplicateCouponError } from '../errors/duplicate-coupon-error';
import { InvalidCouponValueError } from '../errors/invalid-coupon-value-error';
import { InvalidCouponScopeError } from '../errors/invalid-coupon-scope-error';
import { InvalidCouponDatesError } from '../errors/invalid-coupon-dates-error';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { CreateCouponRequest, CreateCouponResponse } from './types';

export class CreateCouponUseCase {
  constructor(
    private couponRepository: ICouponRepository,
    private servicesRepository: IServicesRepository,
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  async execute(request: CreateCouponRequest): Promise<CreateCouponResponse> {
    // Normalize coupon code to uppercase for consistency
    const normalizedRequest = {
      ...request,
      code: request.code.toUpperCase(),
    };

    // Fail-fast: validate all business rules before creation
    await this.validateCouponCodeUnique(normalizedRequest.code);
    this.validateCouponValue(normalizedRequest.type, normalizedRequest.value);
    this.validateMinBookingValue(normalizedRequest.minBookingValue);
    this.validateMaxUses(normalizedRequest.maxUses);
    this.validateExpirationRules(
      normalizedRequest.expirationType,
      normalizedRequest.maxUses,
      normalizedRequest.endDate,
    );
    this.validateCouponScope(
      normalizedRequest.scope,
      normalizedRequest.serviceId,
      normalizedRequest.professionalId,
    );
    this.validateCouponDates(normalizedRequest.startDate, normalizedRequest.endDate);
    await this.validateScopeEntitiesExist(normalizedRequest);

    const coupon = await this.couponRepository.create({
      ...normalizedRequest,
      active: true,
      uses: 0,
    });

    return { coupon };
  }

  /**
   * Validates that coupon code is unique
   * @throws {DuplicateCouponError} If code already exists
   */
  private async validateCouponCodeUnique(code: string): Promise<void> {
    const existingCoupon = await this.couponRepository.findByCode(code);
    if (existingCoupon) {
      throw new DuplicateCouponError();
    }
  }

  /**
   * Validates minimum booking value
   * @throws {InvalidCouponValueError} If value is invalid
   */
  private validateMinBookingValue(minBookingValue?: number | null): void {
    if (minBookingValue && minBookingValue <= 0) {
      throw new InvalidCouponValueError('O valor mínimo de agendamento deve ser maior que zero');
    }
  }

  /**
   * Validates maximum uses
   * @throws {InvalidCouponValueError} If max uses is invalid
   */
  private validateMaxUses(maxUses?: number): void {
    if (maxUses && maxUses <= 0) {
      throw new InvalidCouponValueError('O número máximo de usos deve ser maior que zero');
    }
  }

  private validateExpirationRules(
    expirationType: 'DATE' | 'QUANTITY' | 'BOTH',
    maxUses?: number,
    endDate?: Date | null,
  ): void {
    if (expirationType === 'DATE') {
      if (!endDate) {
        throw new InvalidCouponValueError(
          'A data de término é obrigatória para expiração por data',
        );
      }
      if (maxUses !== undefined) {
        throw new InvalidCouponValueError(
          'O número máximo de usos não deve ser informado para expiração por data',
        );
      }
      return;
    }

    if (expirationType === 'QUANTITY') {
      if (!maxUses) {
        throw new InvalidCouponValueError(
          'O número máximo de usos é obrigatório para expiração por quantidade',
        );
      }
      if (endDate !== undefined && endDate !== null) {
        throw new InvalidCouponValueError(
          'A data de término não deve ser informada para expiração por quantidade',
        );
      }
      return;
    }

    if (!maxUses || !endDate) {
      throw new InvalidCouponValueError(
        'Data de término e número máximo de usos são obrigatórios para expiração combinada',
      );
    }
  }

  /**
   * Validates that service/professional entities exist when required
   * @throws {ServiceNotFoundError} If service not found
   * @throws {ProfessionalNotFoundError} If professional not found
   */
  private async validateScopeEntitiesExist(request: CreateCouponRequest): Promise<void> {
    if (request.scope === 'SERVICE' && request.serviceId) {
      const service = await this.servicesRepository.findById(request.serviceId);
      if (!service) {
        throw new ServiceNotFoundError();
      }
    }

    if (request.scope === 'PROFESSIONAL' && request.professionalId) {
      const professional = await this.professionalsRepository.findById(request.professionalId);
      if (!professional) {
        throw new ProfessionalNotFoundError();
      }
    }
  }

  private validateCouponValue(type: string, value: number): void {
    if (type !== 'FREE' && value <= 0) {
      throw new InvalidCouponValueError('O valor do cupom deve ser maior que zero');
    }

    if (type === 'PERCENTAGE' && value > 100) {
      throw new InvalidCouponValueError('O valor percentual não pode ser maior que 100');
    }

    if (type === 'FREE' && value !== 0) {
      throw new InvalidCouponValueError('Cupons do tipo "FREE" devem ter valor 0');
    }
  }

  private validateCouponScope(
    scope: string,
    serviceId?: string | null,
    professionalId?: string | null,
    userId?: string | null,
  ): void {
    if (scope === 'GLOBAL') {
      if (serviceId || professionalId || userId) {
        throw new InvalidCouponScopeError('Cupons globais não devem ter IDs de escopo');
      }
      return;
    }

    const hasValidId = {
      SERVICE: !!serviceId,
      PROFESSIONAL: !!professionalId,
      USER: !!userId,
    }[scope];

    if (!hasValidId) {
      throw new InvalidCouponScopeError(
        `${scope.charAt(0) + scope.slice(1).toLowerCase()} ID é obrigatório`,
      );
    }

    const hasExtraIds = {
      SERVICE: !!professionalId || !!userId,
      PROFESSIONAL: !!serviceId || !!userId,
      USER: !!serviceId || !!professionalId,
    }[scope];

    if (hasExtraIds) {
      throw new InvalidCouponScopeError(`${scope} não deve ter IDs de escopo adicionais`);
    }
  }

  private validateCouponDates(startDate?: Date, endDate?: Date | null): void {
    const now = new Date();

    if (startDate && startDate < now) {
      throw new InvalidCouponDatesError('A data de início não pode ser no passado');
    }

    if (endDate && endDate < now) {
      throw new InvalidCouponDatesError('A data de término não pode ser no passado');
    }

    if (startDate && endDate && endDate < startDate) {
      throw new InvalidCouponDatesError('A data de término não pode ser anterior à data de início');
    }
  }
}
