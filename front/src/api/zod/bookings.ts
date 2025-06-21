import {
  z as zod
} from 'zod';



/**
 * Criação de um novo agendamento.
 */
export const zodundefinedBodyNotesMax = 500;
export const zodundefinedBodyUseBonusPointsDefault = false;export const zodundefinedBodyCouponCodeMax = 50;


export const zodundefinedBody = zod.object({
  "professionalId": zod.string().uuid(),
  "services": zod.array(zod.object({
  "serviceId": zod.string().uuid()
})),
  "startDateTime": zod.string().datetime({}),
  "notes": zod.string().max(zodundefinedBodyNotesMax).optional(),
  "useBonusPoints": zod.boolean().optional(),
  "couponCode": zod.string().max(zodundefinedBodyCouponCodeMax).optional()
})

/**
 * Atualiza o status de um agendamento (apenas para profissionais)
 */
export const zodundefinedBodyReasonMax = 255;


export const zodundefinedBody = zod.object({
  "status": zod.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']),
  "reason": zod.string().max(zodundefinedBodyReasonMax).optional()
})

