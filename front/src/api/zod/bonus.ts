import {
  z as zod
} from 'zod';



/**
 * Atribuir bônus a um usuário.
 */
export const zodassignBonusToUserBodyDescriptionMax = 255;


export const zodassignBonusToUserBody = zod.object({
  "userId": zod.string().uuid(),
  "bookingId": zod.string().uuid().optional(),
  "type": zod.enum(['BOOKING_POINTS', 'LOYALTY']).describe('Tipo de bônus que pode ser atribuído'),
  "description": zod.string().max(zodassignBonusToUserBodyDescriptionMax).optional()
}).describe('Dados necessários para atribuição de bônus a um usuário')

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

