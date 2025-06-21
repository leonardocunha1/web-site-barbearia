import {
  z as zod
} from 'zod';



/**
 * Criação de um novo feriado.
 */
export const zodundefinedBodyNotesMaxOne = 500;
export const zodundefinedBodyUseBonusPointsDefaultOne = false;export const zodundefinedBodyCouponCodeMaxOne = 50;


export const zodundefinedBody = zod.object({
  "professionalId": zod.string().uuid(),
  "services": zod.array(zod.object({
  "serviceId": zod.string().uuid()
})),
  "startDateTime": zod.string().datetime({}),
  "notes": zod.string().max(zodundefinedBodyNotesMaxOne).optional(),
  "useBonusPoints": zod.boolean().optional(),
  "couponCode": zod.string().max(zodundefinedBodyCouponCodeMaxOne).optional()
})

