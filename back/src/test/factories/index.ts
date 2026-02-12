import {
  BusinessHours,
  Coupon,
  CouponScope,
  CouponType,
  Holiday,
  Professional,
  Role,
  Service,
  ServiceProfessional,
  Status,
  User,
} from '@prisma/client';

export type TestUser = User;

export type TestProfessional = Professional & {
  especialidade: string;
  ativo: boolean;
  documento: string | null;
};

export type TestService = Service & {
  descricao: string | null;
  categoria: string | null;
  ativo: boolean;
};

export type TestBusinessHours = BusinessHours & {
  ativo: boolean;
};

export type TestServiceProfessional = ServiceProfessional & {
  service: TestService;
  ativo: boolean;
};

export type TestHoliday = Holiday;

export type TestCoupon = Coupon;

type UserOverrides = Partial<User> & {
  role?: Role;
};

type ProfessionalOverrides = Partial<Professional> & {
  especialidade?: string;
  ativo?: boolean;
  documento?: string | null;
};

type ServiceOverrides = Partial<Service> & {
  descricao?: string | null;
  categoria?: string | null;
  ativo?: boolean;
};

type BusinessHoursOverrides = Partial<BusinessHours> & {
  ativo?: boolean;
};

type ServiceProfessionalOverrides = Partial<ServiceProfessional> & {
  service?: TestService;
  ativo?: boolean;
};

export function makeUser(overrides: UserOverrides = {}): TestUser {
  const password = overrides.password ?? 'hashed-password';
  const phone = overrides.phone !== undefined ? overrides.phone : '123456789';

  const base: User = {
    id: overrides.id ?? 'user-1',
    name: overrides.name ?? 'John Doe',
    email: overrides.email ?? 'john@example.com',
    password,
    phone,
    role: overrides.role ?? ('CLIENT' as Role),
    emailVerified: overrides.emailVerified ?? true,
    active: overrides.active ?? true,
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
  };

  return base;
}

export function makeProfessional(overrides: ProfessionalOverrides = {}): TestProfessional {
  const specialty = overrides.specialty ?? overrides.especialidade ?? 'Dentista';
  const active = overrides.active ?? overrides.ativo ?? true;

  const document = overrides.document ?? overrides.documento ?? null;

  const base: Professional = {
    id: overrides.id ?? 'prof-1',
    userId: overrides.userId ?? 'user-1',
    specialty,
    bio: overrides.bio ?? null,
    avatarUrl: overrides.avatarUrl ?? null,
    document,
    active,
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
  };

  return {
    ...base,
    especialidade: specialty,
    ativo: active,
    documento: document,
  };
}

export function makeService(overrides: ServiceOverrides = {}): TestService {
  const description =
    overrides.description !== undefined
      ? overrides.description
      : overrides.descricao !== undefined
        ? overrides.descricao
        : 'Descricao do servico';
  const category =
    overrides.category !== undefined
      ? overrides.category
      : overrides.categoria !== undefined
        ? overrides.categoria
        : 'Categoria';
  const active = overrides.active ?? overrides.ativo ?? true;

  const base: Service = {
    id: overrides.id ?? 'service-1',
    name: overrides.name ?? 'Servico',
    description,
    category,
    active,
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
  };

  return {
    ...base,
    descricao: description,
    categoria: category,
    ativo: active,
  };
}

export function makeServiceProfessional(
  overrides: ServiceProfessionalOverrides = {},
): TestServiceProfessional {
  const service = overrides.service ?? makeService();
  const active = overrides.ativo ?? true;

  const base: ServiceProfessional = {
    id: overrides.id ?? 'sp-1',
    serviceId: overrides.serviceId ?? service.id,
    professionalId: overrides.professionalId ?? 'prof-1',
    price: overrides.price ?? 100,
    duration: overrides.duration ?? 60,
  };

  return {
    ...base,
    service,
    ativo: active,
  };
}

export function makeBusinessHours(overrides: BusinessHoursOverrides = {}): TestBusinessHours {
  const active = overrides.active ?? overrides.ativo ?? true;

  const base: BusinessHours = {
    id: overrides.id ?? 'hours-1',
    professionalId: overrides.professionalId ?? 'prof-1',
    dayOfWeek: overrides.dayOfWeek ?? 1,
    opensAt: overrides.opensAt ?? '08:00',
    closesAt: overrides.closesAt ?? '18:00',
    breakStart: overrides.breakStart !== undefined ? overrides.breakStart : '12:00',
    breakEnd: overrides.breakEnd !== undefined ? overrides.breakEnd : '13:00',
    active,
  };

  return {
    ...base,
    ativo: active,
  };
}

export function makeHoliday(overrides: Partial<Holiday> = {}): TestHoliday {
  return {
    id: overrides.id ?? 'holiday-1',
    professionalId: overrides.professionalId ?? 'prof-1',
    date: overrides.date ?? new Date(),
    reason: overrides.reason ?? 'Feriado',
    createdAt: overrides.createdAt ?? new Date(),
  };
}

export function makeCoupon(overrides: Partial<Coupon> = {}): TestCoupon {
  return {
    id: overrides.id ?? 'coupon-1',
    code: overrides.code ?? 'CODE10',
    type: overrides.type ?? (CouponType.PERCENTAGE as CouponType),
    scope: overrides.scope ?? (CouponScope.GLOBAL as CouponScope),
    value: overrides.value ?? 10,
    uses: overrides.uses ?? 0,
    maxUses: overrides.maxUses ?? null,
    active: overrides.active ?? true,
    startDate: overrides.startDate ?? new Date(),
    endDate: overrides.endDate ?? null,
    userId: overrides.userId ?? null,
    description: overrides.description ?? null,
    minBookingValue: overrides.minBookingValue ?? null,
    professionalId: overrides.professionalId ?? null,
    serviceId: overrides.serviceId ?? null,
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: overrides.updatedAt ?? new Date(),
  };
}

export function makeBookingDates(start: Date = new Date()) {
  const startDateTime = start;
  const endDateTime = new Date(start.getTime() + 60 * 60000);

  return { startDateTime, endDateTime };
}

export const defaultStatus: Status = Status.PENDING;
