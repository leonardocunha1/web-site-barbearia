import { CouponRepository } from '@/repositories/coupon-repository';
import { ServicesRepository } from '@/repositories/services-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { Coupon } from '@prisma/client';
import { DuplicateCouponError } from '../errors/duplicate-coupon-error';
import { InvalidCouponValueError } from '../errors/invalid-coupon-value-error';
import { InvalidCouponScopeError } from '../errors/invalid-coupon-scope-error';
import { InvalidCouponDatesError } from '../errors/invalid-coupon-dates-error';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';

interface CreateCouponRequest {
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE';
  value: number;
  scope: 'GLOBAL' | 'SERVICE' | 'PROFESSIONAL';
  description?: string;
  maxUses?: number;
  startDate?: Date;
  endDate?: Date | null;
  minBookingValue?: number | null;
  serviceId?: string | null;
  professionalId?: string | null;
}

interface CreateCouponResponse {
  coupon: Coupon;
}

export class CreateCouponUseCase {
  constructor(
    private couponRepository: CouponRepository,
    private servicesRepository: ServicesRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute(request: CreateCouponRequest): Promise<CreateCouponResponse> {
    const existingCoupon = await this.couponRepository.findByCode(request.code);
    if (existingCoupon) {
      throw new DuplicateCouponError();
    }

    this.validateCouponValue(request.type, request.value);
    this.validateCouponScope(
      request.scope,
      request.serviceId,
      request.professionalId,
    );
    this.validateCouponDates(request.startDate, request.endDate);

    if (request.minBookingValue && request.minBookingValue <= 0) {
      throw new InvalidCouponValueError(
        'O valor mínimo de agendamento deve ser maior que zero',
      );
    }

    if (request.maxUses && request.maxUses <= 0) {
      throw new InvalidCouponValueError(
        'O número máximo de usos deve ser maior que zero',
      );
    }

    // Verificação de existência de serviço ou profissional
    if (request.scope === 'SERVICE' && request.serviceId) {
      const service = await this.servicesRepository.findById(request.serviceId);
      if (!service) {
        throw new ServiceNotFoundError();
      }
    }

    if (request.scope === 'PROFESSIONAL' && request.professionalId) {
      const professional = await this.professionalsRepository.findById(
        request.professionalId,
      );
      if (!professional) {
        throw new ProfessionalNotFoundError();
      }
    }

    const coupon = await this.couponRepository.create({
      ...request,
      active: true,
      uses: 0,
    });

    return { coupon };
  }

  private validateCouponValue(type: string, value: number): void {
    if (value <= 0) {
      throw new InvalidCouponValueError(
        'O valor do cupom deve ser maior que zero',
      );
    }

    if (type === 'PERCENTAGE' && value > 100) {
      throw new InvalidCouponValueError(
        'O valor percentual não pode ser maior que 100',
      );
    }

    if (type === 'FREE' && value !== 0) {
      throw new InvalidCouponValueError(
        'Cupons do tipo "FREE" devem ter valor 0',
      );
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
        throw new InvalidCouponScopeError(
          'Cupons globais não devem ter IDs de escopo',
        );
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
      throw new InvalidCouponScopeError(
        `${scope} não deve ter IDs de escopo adicionais`,
      );
    }
  }

  private validateCouponDates(startDate?: Date, endDate?: Date | null): void {
    const now = new Date();

    if (startDate && startDate < now) {
      throw new InvalidCouponDatesError(
        'A data de início não pode ser no passado',
      );
    }

    if (endDate && endDate < now) {
      throw new InvalidCouponDatesError(
        'A data de término não pode ser no passado',
      );
    }

    if (startDate && endDate && endDate < startDate) {
      throw new InvalidCouponDatesError(
        'A data de término não pode ser anterior à data de início',
      );
    }
  }
}
