import {
  z as zod
} from 'zod';



/**
 * Atribuir bônus a um usuário.
 */
export const zodassignBonusToUserBody = zod.object({
  "userId": zod.string(),
  "bookingId": zod.string().optional(),
  "type": zod.enum(['BOOKING_POINTS', 'LOYALTY']).describe('BonusType'),
  "description": zod.string().optional()
}).describe('AssignBonusBody')

/**
 * Obter o saldo de bônus (pontos e valor em R$) do usuário autenticado.
 */
export const zodgetBonusBalanceResponse = zod.object({
  "points": zod.object({
  "bookingPoints": zod.number(),
  "loyaltyPoints": zod.number(),
  "totalPoints": zod.number()
}),
  "monetaryValue": zod.object({
  "bookingValue": zod.number(),
  "loyaltyValue": zod.number(),
  "totalValue": zod.number()
})
})

