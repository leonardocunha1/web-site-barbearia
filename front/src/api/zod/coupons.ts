import {
  z as zod
} from 'zod';



/**
 * Criação de um novo cupom.
 */
export const zodcreateCouponBodyCodeMin = 3;

export const zodcreateCouponBodyCodeMax = 50;
export const zodcreateCouponBodyValueMin = 0;
export const zodcreateCouponBodyDescriptionMax = 255;
export const zodcreateCouponBodyMaxUsesMin = 0;
export const zodcreateCouponBodyMinBookingValueMin = 0;


export const zodcreateCouponBody = zod.object({
  "code": zod.string().min(zodcreateCouponBodyCodeMin).max(zodcreateCouponBodyCodeMax),
  "type": zod.enum(['PERCENTAGE', 'FIXED', 'FREE']),
  "value": zod.number().min(zodcreateCouponBodyValueMin),
  "scope": zod.enum(['GLOBAL', 'SERVICE', 'PROFESSIONAL']),
  "description": zod.string().max(zodcreateCouponBodyDescriptionMax).optional(),
  "maxUses": zod.number().min(zodcreateCouponBodyMaxUsesMin).optional(),
  "startDate": zod.string().datetime({}).optional(),
  "endDate": zod.string().datetime({}).optional(),
  "minBookingValue": zod.number().min(zodcreateCouponBodyMinBookingValueMin).optional(),
  "serviceId": zod.string().uuid().optional(),
  "professionalId": zod.string().uuid().optional()
}).describe('Dados para criação de cupom')

/**
 * Lista todos os cupons com paginação.
 */
export const zodlistCouponsQueryPageDefault = 1;
export const zodlistCouponsQueryPageMin = 0;
export const zodlistCouponsQueryLimitDefault = 10;
export const zodlistCouponsQueryLimitMin = 0;

export const zodlistCouponsQueryLimitMax = 100;
export const zodlistCouponsQuerySortOrderDefault = "asc";

export const zodlistCouponsQueryParams = zod.object({
  "page": zod.number().min(zodlistCouponsQueryPageMin).default(zodlistCouponsQueryPageDefault).describe('Número da página atual (começa em 1)'),
  "limit": zod.number().min(zodlistCouponsQueryLimitMin).max(zodlistCouponsQueryLimitMax).default(zodlistCouponsQueryLimitDefault).describe('Quantidade de itens por página (máximo 100)'),
  "sortBy": zod.string().optional().describe('Campo para ordenação (opcional)'),
  "sortOrder": zod.enum(['asc', 'desc']).default(zodlistCouponsQuerySortOrderDefault).describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  "code": zod.string().optional(),
  "type": zod.enum(['PERCENTAGE', 'FIXED', 'FREE']).optional(),
  "scope": zod.enum(['GLOBAL', 'SERVICE', 'PROFESSIONAL']).optional(),
  "active": zod.boolean().optional(),
  "startDate": zod.string().datetime({}).optional(),
  "endDate": zod.string().datetime({}).optional(),
  "sort": zod.array(zod.object({
  "field": zod.enum(['code', 'type', 'scope', 'createdAt', 'startDate', 'endDate', 'active', 'uses']).describe('Campo para ordenação de cupons'),
  "order": zod.enum(['asc', 'desc']).describe('Ordem de ordenação')
}).describe('Configuração de ordenação para cupons')).optional(),
  "professionalId": zod.string().uuid().optional(),
  "serviceId": zod.string().uuid().optional()
})

export const zodlistCouponsResponseCouponsItemCodeMin = 3;
export const zodlistCouponsResponseCouponsItemValueMin = 0;
export const zodlistCouponsResponseCouponsItemUsesMin = 0;
export const zodlistCouponsResponseCouponsItemMinBookingValueMin = 0;


export const zodlistCouponsResponse = zod.object({
  "coupons": zod.array(zod.object({
  "id": zod.string().uuid(),
  "code": zod.string().min(zodlistCouponsResponseCouponsItemCodeMin),
  "description": zod.string().nullable(),
  "type": zod.enum(['PERCENTAGE', 'FIXED', 'FREE']),
  "value": zod.number().min(zodlistCouponsResponseCouponsItemValueMin),
  "scope": zod.enum(['GLOBAL', 'SERVICE', 'PROFESSIONAL']),
  "maxUses": zod.number().nullable(),
  "uses": zod.number().min(zodlistCouponsResponseCouponsItemUsesMin),
  "startDate": zod.string().datetime({}),
  "endDate": zod.string().datetime({}).nullable(),
  "minBookingValue": zod.number().min(zodlistCouponsResponseCouponsItemMinBookingValueMin).nullable(),
  "active": zod.boolean(),
  "createdAt": zod.string().datetime({}),
  "updatedAt": zod.string().datetime({}),
  "service": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string()
}).nullish(),
  "professional": zod.object({
  "id": zod.string().uuid(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string()
})
}).nullish(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string()
}).nullish()
}).describe('Modelo completo de cupom')),
  "total": zod.number(),
  "page": zod.number(),
  "limit": zod.number(),
  "totalPages": zod.number()
})

/**
 * Retorna os detalhes de um cupom pelo ID.
 */
export const zodgetCouponByIdParams = zod.object({
  "couponId": zod.string().uuid()
})

export const zodgetCouponByIdResponseCouponCodeMin = 3;
export const zodgetCouponByIdResponseCouponValueMin = 0;
export const zodgetCouponByIdResponseCouponUsesMin = 0;
export const zodgetCouponByIdResponseCouponMinBookingValueMin = 0;


export const zodgetCouponByIdResponse = zod.object({
  "coupon": zod.object({
  "id": zod.string().uuid(),
  "code": zod.string().min(zodgetCouponByIdResponseCouponCodeMin),
  "description": zod.string().nullable(),
  "type": zod.enum(['PERCENTAGE', 'FIXED', 'FREE']),
  "value": zod.number().min(zodgetCouponByIdResponseCouponValueMin),
  "scope": zod.enum(['GLOBAL', 'SERVICE', 'PROFESSIONAL']),
  "maxUses": zod.number().nullable(),
  "uses": zod.number().min(zodgetCouponByIdResponseCouponUsesMin),
  "startDate": zod.string().datetime({}),
  "endDate": zod.string().datetime({}).nullable(),
  "minBookingValue": zod.number().min(zodgetCouponByIdResponseCouponMinBookingValueMin).nullable(),
  "active": zod.boolean(),
  "createdAt": zod.string().datetime({}),
  "updatedAt": zod.string().datetime({}),
  "service": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string()
}).nullish(),
  "professional": zod.object({
  "id": zod.string().uuid(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string()
})
}).nullish(),
  "user": zod.object({
  "id": zod.string().uuid(),
  "nome": zod.string()
}).nullish()
}).describe('Modelo completo de cupom')
})

/**
 * Atualiza um cupom existente.
 */
export const zodupdateCouponParams = zod.object({
  "couponId": zod.string().uuid()
})

export const zodupdateCouponBodyCodeMin = 3;

export const zodupdateCouponBodyCodeMax = 20;
export const zodupdateCouponBodyValueMin = 0;
export const zodupdateCouponBodyMinBookingValueMin = 0;


export const zodupdateCouponBody = zod.object({
  "code": zod.string().min(zodupdateCouponBodyCodeMin).max(zodupdateCouponBodyCodeMax).optional(),
  "type": zod.enum(['PERCENTAGE', 'FIXED', 'FREE']).optional(),
  "value": zod.number().min(zodupdateCouponBodyValueMin).optional(),
  "scope": zod.enum(['GLOBAL', 'SERVICE', 'PROFESSIONAL']).optional(),
  "description": zod.string().optional(),
  "maxUses": zod.number().min(1).optional(),
  "startDate": zod.string().datetime({}).optional(),
  "endDate": zod.string().datetime({}).nullish(),
  "minBookingValue": zod.number().min(zodupdateCouponBodyMinBookingValueMin).nullish(),
  "serviceId": zod.string().uuid().nullish(),
  "professionalId": zod.string().uuid().nullish(),
  "active": zod.boolean().optional()
}).describe('Dados para atualização de cupom')

export const zodupdateCouponResponse = zod.object({
  "message": zod.string()
})

/**
 * Deleta um cupom pelo ID.
 */
export const zoddeleteCouponParams = zod.object({
  "couponId": zod.string().uuid()
})

/**
 * Ativa ou desativa o status de um cupom.
 */
export const zodtoggleCouponStatusParams = zod.object({
  "couponId": zod.string().uuid()
})

export const zodtoggleCouponStatusResponse = zod.object({
  "message": zod.string()
})

