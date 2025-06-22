import { z } from 'zod';

export const BonusTypeSchema = z
  .enum(['BOOKING_POINTS', 'LOYALTY'])
  .describe('BonusType');

/**
 * Schema para atribuição de bônus a um usuário.
 */
export const assignBonusBodySchema = z
  .object({
    userId: z.string(),
    bookingId: z.string().optional(),
    type: BonusTypeSchema,
    description: z.string().optional(),
  })
  .describe('AssignBonusBody');

/**
 * Schema dos parâmetros para consulta de saldo de bônus.
 */
export const getBalanceParamsSchema = z
  .object({
    userId: z.string().uuid(),
  })
  .describe('GetBalanceParams');
