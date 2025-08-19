import { vi } from 'vitest';

export const createMockBookingsRepository = () => ({
  create: vi.fn(),
  findOverlappingBooking: vi.fn(),
  findById: vi.fn(),
  findManyByProfessionalId: vi.fn(),
  findManyByUserId: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  countActiveByServiceAndProfessional: vi.fn(),
  countByUserId: vi.fn(),
  countByProfessionalAndDate: vi.fn(),
  getEarningsByProfessionalAndDate: vi.fn(),
  countByProfessionalAndStatus: vi.fn(),
  findNextAppointments: vi.fn(),
  findByProfessionalAndDate: vi.fn(),
  countByProfessionalId: vi.fn(),
  countByUserIdAndStatus: vi.fn(),
});

export const createMockUsersRepository = () => ({
  findById: vi.fn(),
  findByPhone: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  updatePassword: vi.fn(),
  listUsers: vi.fn(),
  countUsers: vi.fn(),
  anonymize: vi.fn(),
});

export const createMockProfessionalsRepository = () => ({
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findByProfessionalId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  list: vi.fn(),
  count: vi.fn(),
  search: vi.fn(),
  countSearch: vi.fn(),
});

export const createMockServiceProfessionalRepository = () => ({
  create: vi.fn(),
  delete: vi.fn(),
  findByServiceAndProfessional: vi.fn(),
  findByProfessional: vi.fn(),
  updateByServiceAndProfessional: vi.fn(),
});

export const createMockFeriadosRepository = () => ({
  findByProfessionalAndDate: vi.fn(),
  addHoliday: vi.fn(),
  isProfessionalHoliday: vi.fn(),
  findById: vi.fn(),
  delete: vi.fn(),
  findManyByProfessionalId: vi.fn(),
  countByProfessionalId: vi.fn(),
});

export const createMockHorariosRepository = () => ({
  findByProfessionalAndDay: vi.fn(),
  create: vi.fn(),
  findById: vi.fn(),
  delete: vi.fn(),
  update: vi.fn(),
  listByProfessional: vi.fn(),
});

export const createMockServicesRepository = () => ({
  findById: vi.fn(),
  create: vi.fn(),
  findByName: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  softDelete: vi.fn(),
  toggleStatus: vi.fn(),
  list: vi.fn(),
  existsProfessional: vi.fn(),
});

export const createMockBonusRedemptionRepository = () => ({
  create: vi.fn(),
});

export const createMockUserBonusRepository = () => ({
  upsert: vi.fn(),
  findByUserIdAndType: vi.fn(),
  getPointsByType: vi.fn(),
  getValidPointsByType: vi.fn(),
  getValidPointsWithExpiration: vi.fn(),
  consumePoints: vi.fn(),
});

export const createMockCouponsRepository = () => ({
  findByCode: vi.fn(),
  registerRedemption: vi.fn(),
  incrementUses: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  listValidCoupons: vi.fn(),
  delete: vi.fn(),
  findMany: vi.fn(),
  count: vi.fn(),
});
