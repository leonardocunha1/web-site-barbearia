import { z } from 'zod';

export const BonusTypeSchema = z
  .enum(['BOOKING_POINTS', 'LOYALTY'], {
    errorMap: () => ({
      message:
        'Tipo de bônus inválido. Valores válidos: BOOKING_POINTS (pontos por agendamento) ou LOYALTY (fidelidade)',
    }),
  })
  .describe('Tipo de bônus que pode ser atribuído');

/**
 * Schema para atribuição de bônus a um usuário.
 */
export const assignBonusBodySchema = z
  .object({
    userId: z.string().uuid({ message: 'ID do usuário deve ser um UUID válido' }),
    bookingId: z.string().uuid({ message: 'ID do agendamento deve ser um UUID válido' }).optional(),
    type: BonusTypeSchema,
    description: z
      .string()
      .max(255, { message: 'Descrição não pode exceder 255 caracteres' })
      .optional(),
  })
  .describe('Dados necessários para atribuição de bônus a um usuário');

/**
 * Schema dos parâmetros para consulta de saldo de bônus.
 */
export const getBalanceParamsSchema = z
  .object({
    userId: z.string().uuid({ message: 'ID do usuário deve ser um UUID válido' }),
  })
  .describe('Parâmetros para consulta do saldo de bônus de um usuário');

// Tipos TypeScript inferidos
export type BonusType = z.infer<typeof BonusTypeSchema>;
export type AssignBonusBody = z.infer<typeof assignBonusBodySchema>;
export type GetBalanceParams = z.infer<typeof getBalanceParamsSchema>;
