import {
  z as zod
} from 'zod';



/**
 * Criação de um novo cupom.
 */
export const zodundefinedBodyCodeMin = 3;

export const zodundefinedBodyCodeMax = 50;
export const zodundefinedBodyValueMin = 0;
export const zodundefinedBodyDescriptionMaxOne = 255;
export const zodundefinedBodyMaxUsesMin = 0;
export const zodundefinedBodyMinBookingValueMin = 0;


export const zodundefinedBody = zod.object({
  "code": zod.string().min(zodundefinedBodyCodeMin).max(zodundefinedBodyCodeMax),
  "type": zod.enum(['PERCENTAGE', 'FIXED', 'FREE']),
  "value": zod.number().min(zodundefinedBodyValueMin),
  "scope": zod.enum(['GLOBAL', 'SERVICE', 'PROFESSIONAL']),
  "description": zod.string().max(zodundefinedBodyDescriptionMaxOne).optional(),
  "maxUses": zod.number().min(zodundefinedBodyMaxUsesMin).optional(),
  "startDate": zod.string().datetime({}).optional(),
  "endDate": zod.string().datetime({}).optional(),
  "minBookingValue": zod.number().min(zodundefinedBodyMinBookingValueMin).optional(),
  "serviceId": zod.string().uuid().optional(),
  "professionalId": zod.string().uuid().optional()
})

/**
 * Atualiza um cupom existente.
 */
export const zodundefinedBodyCodeMinOne = 3;

export const zodundefinedBodyCodeMaxOne = 20;
export const zodundefinedBodyValueMinOne = 0;
export const zodundefinedBodyMinBookingValueMinOne = 0;


export const zodundefinedBody = zod.object({
  "code": zod.string().min(zodundefinedBodyCodeMinOne).max(zodundefinedBodyCodeMaxOne).optional(),
  "type": zod.enum(['PERCENTAGE', 'FIXED', 'FREE']).optional(),
  "value": zod.number().min(zodundefinedBodyValueMinOne).optional(),
  "scope": zod.enum(['GLOBAL', 'SERVICE', 'PROFESSIONAL']).optional(),
  "description": zod.string().optional(),
  "maxUses": zod.number().min(1).optional(),
  "startDate": zod.string().datetime({}).optional(),
  "endDate": zod.string().datetime({}).nullish(),
  "minBookingValue": zod.number().min(zodundefinedBodyMinBookingValueMinOne).nullish(),
  "serviceId": zod.string().uuid().nullish(),
  "professionalId": zod.string().uuid().nullish(),
  "active": zod.boolean().optional()
})

