import { CouponRepository } from '@/repositories/coupon-repository';
import { ServicesRepository } from '@/repositories/services-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { Coupon } from '@prisma/client';
import { CouponNotFoundError } from '../errors/coupon-not-found-error';
import { DuplicateCouponError } from '../errors/duplicate-coupon-error';
import { InvalidCouponValueError } from '../errors/invalid-coupon-value-error';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidCouponScopeError } from '../errors/invalid-coupon-scope-error';
import { InvalidCouponDatesError } from '../errors/invalid-coupon-dates-error';

interface UpdateCouponRequest {
  couponId: string;
  data: {
    code?: string;
    type?: 'PERCENTAGE' | 'FIXED' | 'FREE';
    value?: number;
    scope?: 'GLOBAL' | 'SERVICE' | 'PROFESSIONAL';
    description?: string;
    maxUses?: number;
    startDate?: Date;
    endDate?: Date | null;
    minBookingValue?: number | null;
    serviceId?: string | null;
    professionalId?: string | null;
    active?: boolean;
  };
}

interface UpdateCouponResponse {
  coupon: Coupon;
}

export class UpdateCouponUseCase {
  constructor(
    private couponRepository: CouponRepository,
    private servicesRepository: ServicesRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute({
    couponId,
    data,
  }: UpdateCouponRequest): Promise<UpdateCouponResponse> {
    // Verifica se o cupom existe
    const existingCoupon = await this.couponRepository.findById(couponId);
    if (!existingCoupon) {
      throw new CouponNotFoundError();
    }

    // Verifica se o novo código já existe (se estiver sendo alterado)
    if (data.code && data.code !== existingCoupon.code) {
      const couponWithSameCode = await this.couponRepository.findByCode(
        data.code,
      );
      if (couponWithSameCode) {
        throw new DuplicateCouponError();
      }
    }

    // Validações
    if (data.type || data.value) {
      this.validateCouponValue(
        data.type || existingCoupon.type,
        data.value || existingCoupon.value,
      );
    }

    if (data.scope || data.serviceId || data.professionalId) {
      this.validateCouponScope(
        data.scope || existingCoupon.scope,
        data.serviceId !== undefined
          ? data.serviceId
          : existingCoupon.serviceId,
        data.professionalId !== undefined
          ? data.professionalId
          : existingCoupon.professionalId,
      );
    }

    if (data.startDate || data.endDate) {
      this.validateCouponDates(
        data.startDate ? new Date(data.startDate) : existingCoupon.startDate,
        data.endDate
          ? data.endDate
            ? new Date(data.endDate)
            : null
          : existingCoupon.endDate,
      );
    }

    // Validações adicionais
    if (
      data.minBookingValue !== undefined &&
      data.minBookingValue !== null &&
      data.minBookingValue <= 0
    ) {
      throw new InvalidCouponValueError(
        'O valor mínimo de agendamento deve ser maior que zero',
      );
    }

    if (data.maxUses !== undefined && data.maxUses <= 0) {
      throw new InvalidCouponValueError(
        'O número máximo de usos deve ser maior que zero',
      );
    }

    // Verificação de existência de serviço ou profissional
    const scope = data.scope || existingCoupon.scope;
    const serviceId =
      data.serviceId !== undefined ? data.serviceId : existingCoupon.serviceId;
    const professionalId =
      data.professionalId !== undefined
        ? data.professionalId
        : existingCoupon.professionalId;

    if (scope === 'SERVICE' && serviceId) {
      const service = await this.servicesRepository.findById(serviceId);
      if (!service) {
        throw new ServiceNotFoundError();
      }
    }

    if (scope === 'PROFESSIONAL' && professionalId) {
      const professional =
        await this.professionalsRepository.findById(professionalId);
      if (!professional) {
        throw new ProfessionalNotFoundError();
      }
    }

    // Atualiza o cupom
    const coupon = await this.couponRepository.update(couponId, {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate:
        data.endDate !== undefined
          ? data.endDate
            ? new Date(data.endDate)
            : null
          : undefined,
    });

    return { coupon };
  }

  // Métodos de validação (iguais aos do CreateCouponUseCase)
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
  ): void {
    if (scope === 'GLOBAL') {
      if (serviceId || professionalId) {
        throw new InvalidCouponScopeError(
          'Cupons globais não devem ter IDs de escopo',
        );
      }
      return;
    }

    const hasValidId = {
      SERVICE: !!serviceId,
      PROFESSIONAL: !!professionalId,
    }[scope];

    if (!hasValidId) {
      throw new InvalidCouponScopeError(
        `${scope.charAt(0) + scope.slice(1).toLowerCase()} ID é obrigatório`,
      );
    }

    const hasExtraIds = {
      SERVICE: !!professionalId,
      PROFESSIONAL: !!serviceId,
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
