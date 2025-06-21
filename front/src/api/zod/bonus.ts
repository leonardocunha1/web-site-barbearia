import {
  z as zod
} from 'zod';



/**
 * Atribuir bônus a um usuário.
 */
export const zodundefinedBody = zod.object({
  "userId": zod.string(),
  "bookingId": zod.string().optional(),
  "type": zod.enum(['BOOKING_POINTS', 'LOYALTY']),
  "description": zod.string().optional()
})

