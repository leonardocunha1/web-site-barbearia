import { z } from 'zod';

export const BonusTypeSchema = z.enum(['BOOKING_POINTS', 'LOYALTY']);

export const assignBonusBodySchema = z.object({
  userId: z.string(),
  bookingId: z.string().optional(),
  type: z.enum(['BOOKING_POINTS', 'LOYALTY']),
  description: z.string().optional(),
});

export const getBalanceParamsSchema = z.object({
  userId: z.string().uuid(),
});
