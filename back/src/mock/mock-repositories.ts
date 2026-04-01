import { vi } from 'vitest';
import type { Mocked } from 'vitest';
import type { IBookingsRepository } from '@/repositories/bookings-repository';
import type { IProfessionalsRepository } from '@/repositories/professionals-repository';
import type { IUsersRepository } from '@/repositories/users-repository';
import type { IServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import type { IHolidaysRepository } from '@/repositories/holidays-repository';
import type { IBusinessHoursRepository } from '@/repositories/business-hours-repository';
import type { IServicesRepository } from '@/repositories/services-repository';
import type { IBonusRedemptionRepository } from '@/repositories/bonus-redemption-repository';
import type { IUserBonusRepository } from '@/repositories/user-bonus-repository';
import type { ICouponRepository } from '@/repositories/coupon-repository';
import type { IBonusTransactionRepository } from '@/repositories/bonus-transaction-repository';
import type { IVerificationTokensRepository } from '@/repositories/verification-tokens-repository';
import type { IPasswordResetTokensRepository } from '@/repositories/password-reset-tokens-repository';

/**
 * Cria um mock automático a partir das keys de uma interface.
 *
 * Uso:
 *   const repo = createMock<IUsersRepository>(usersRepositoryKeys);
 *   repo.findById.mockResolvedValue(user);
 *
 * Se adicionar um método na interface e esquecer de colocar aqui,
 * o TypeScript vai dar erro de tipo — forçando a atualização.
 */
function createMock<T>(keys: Array<keyof T>): Mocked<T> {
  const mock = {} as Record<string, unknown>;
  for (const key of keys) {
    mock[key as string] = vi.fn();
  }
  return mock as Mocked<T>;
}

// As keys são tipadas: se a interface mudar, o TS acusa erro aqui.
const bookingsKeys: Array<keyof IBookingsRepository> = [
  'create',
  'createWithRedemptions',
  'findById',
  'findOverlappingBooking',
  'findManyByProfessionalId',
  'findManyByUserId',
  'update',
  'delete',
  'countActiveByServiceAndProfessional',
  'countByUserId',
  'countByProfessionalAndDate',
  'getEarningsByProfessionalAndDate',
  'countByProfessionalAndStatus',
  'findNextAppointments',
  'findByProfessionalAndDate',
  'countByProfessionalId',
  'countByUserIdAndStatus',
  'countByStatus',
  'countTodayBookings',
  'countCanceledLast24h',
  'getRevenueByDateRange',
  'getCompletedBookingsCountByDateRange',
  'getTopProfessionalsByCompletedBookings',
  'findExpiredPendingBookings',
  'cancelExpiredBookings',
  'getServiceBreakdownByProfessional',
  'countByProfessionalAndStatusRange',
];

const usersKeys: Array<keyof IUsersRepository> = [
  'findById',
  'findByPhone',
  'findByEmail',
  'create',
  'update',
  'updatePassword',
  'listUsers',
  'countUsers',
  'anonymize',
];

const professionalsKeys: Array<keyof IProfessionalsRepository> = [
  'findById',
  'findByUserId',
  'findByProfessionalId',
  'findByUserIdWithUser',
  'create',
  'update',
  'delete',
  'list',
  'count',
  'search',
  'countSearch',
  'countActiveOnly',
  'countNewByDateRange',
  'findTopWithInclude',
];

const serviceProfessionalKeys: Array<keyof IServiceProfessionalRepository> = [
  'create',
  'delete',
  'deleteByServiceAndProfessional',
  'findByServiceAndProfessional',
  'findByProfessional',
  'updateByServiceAndProfessional',
  'findAllActiveWithProfessionalData',
  'findAllWithProfessionalData',
];

const holidaysKeys: Array<keyof IHolidaysRepository> = [
  'findByProfessionalAndDate',
  'addHoliday',
  'isProfessionalHoliday',
  'findById',
  'delete',
  'findManyByProfessionalId',
  'countByProfessionalId',
];

const businessHoursKeys: Array<keyof IBusinessHoursRepository> = [
  'findByProfessionalAndDay',
  'create',
  'findById',
  'delete',
  'update',
  'listByProfessional',
];

const servicesKeys: Array<keyof IServicesRepository> = [
  'findById',
  'create',
  'findByName',
  'update',
  'delete',
  'softDelete',
  'toggleStatus',
  'list',
  'existsProfessional',
];

const bonusRedemptionKeys: Array<keyof IBonusRedemptionRepository> = ['create'];

const userBonusKeys: Array<keyof IUserBonusRepository> = [
  'upsert',
  'findByUserIdAndType',
  'getPointsByType',
  'getValidPointsByType',
  'getValidPointsWithExpiration',
  'consumePoints',
];

const couponKeys: Array<keyof ICouponRepository> = [
  'findByCode',
  'registerRedemption',
  'incrementUses',
  'findById',
  'create',
  'update',
  'listValidCoupons',
  'delete',
  'findMany',
  'count',
];

const bonusTransactionKeys: Array<keyof IBonusTransactionRepository> = [
  'create',
  'findByBookingId',
];

const verificationTokensKeys: Array<keyof IVerificationTokensRepository> = [
  'create',
  'findByToken',
  'delete',
];

const passwordResetTokensKeys: Array<keyof IPasswordResetTokensRepository> = [
  'create',
  'findByToken',
  'delete',
];

// Factory functions
export const createMockBookingsRepository = () => createMock<IBookingsRepository>(bookingsKeys);
export const createMockUsersRepository = () => createMock<IUsersRepository>(usersKeys);
export const createMockProfessionalsRepository = () =>
  createMock<IProfessionalsRepository>(professionalsKeys);
export const createMockServiceProfessionalRepository = () =>
  createMock<IServiceProfessionalRepository>(serviceProfessionalKeys);
export const createMockHolidaysRepository = () => createMock<IHolidaysRepository>(holidaysKeys);
export const createMockBusinessHoursRepository = () =>
  createMock<IBusinessHoursRepository>(businessHoursKeys);
export const createMockServicesRepository = () => createMock<IServicesRepository>(servicesKeys);
export const createMockBonusRedemptionRepository = () =>
  createMock<IBonusRedemptionRepository>(bonusRedemptionKeys);
export const createMockUserBonusRepository = () => createMock<IUserBonusRepository>(userBonusKeys);
export const createMockCouponsRepository = () => createMock<ICouponRepository>(couponKeys);
export const createMockBonusTransactionRepository = () =>
  createMock<IBonusTransactionRepository>(bonusTransactionKeys);
export const createMockVerificationTokensRepository = () =>
  createMock<IVerificationTokensRepository>(verificationTokensKeys);
export const createMockPasswordResetTokensRepository = () =>
  createMock<IPasswordResetTokensRepository>(passwordResetTokensKeys);
